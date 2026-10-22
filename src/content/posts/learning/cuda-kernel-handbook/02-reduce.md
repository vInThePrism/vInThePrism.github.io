---
title: "CUDA Kernel Handbook #2: Reduce, from Atomics to Warp Shuffles"
published: 2026-10-22
description: "Four versions of a sum reduction — global atomics, shared-memory tree, warp shuffle, warp shuffle + float4 — and what each one fixes."
category: Learning
tags: [CUDA, Interview, Reduce]
series: "CUDA Kernel Handbook"
seriesOrder: 2
---

> [!NOTE]
> Adapted and translated from [Tongkaio/CUDA_Kernel_Samples](https://github.com/Tongkaio/CUDA_Kernel_Samples) (MIT License, © Tongkaio). Typos in the original code are fixed and marked with a **Fix** comment.

A reduction collapses an array (or tensor) into something smaller — usually a single value — by sum, mean, max, or as part of softmax. **Sum and softmax are the most frequently asked hand-written kernels**, so this is the one to be able to write with your eyes closed.

The four versions below form a ladder. Each step removes the bottleneck of the previous one.

## v1 — naive, global atomics

Every thread `atomicAdd`s into the same global address. Atomics on one address serialize, which throws away the parallelism. Fine as a correctness baseline, terrible as a solution.

```cpp
dim3 block_size(BLOCK_SIZE);  // BLOCK_SIZE is a compile-time constant
dim3 grid_size(CEIL(N, BLOCK_SIZE));
reduce_v1<<<grid_size, block_size>>>(d_x, d_y, N);

__global__ void reduce_v1(const float* input, float* output, int N) {
    int idx = blockDim.x * blockIdx.x + threadIdx.x;
    if (idx < N) atomicAdd(output, input[idx]);
}
```

## v2 — shared-memory tree reduction

Each block copies its slice into shared memory and halves it repeatedly until the result sits in element 0. Now only **one atomic per block** reaches global memory.

Two drawbacks:

- `BLOCK_SIZE` must be a power of two, or the halving gives wrong results.
- Every halving step needs `__syncthreads()`, forcing the whole block to wait.

```cpp
dim3 block_size(BLOCK_SIZE);
dim3 grid_size(CEIL(N, BLOCK_SIZE));
reduce_v2<<<grid_size, block_size>>>(d_x, d_y, N);

__global__ void reduce_v2(const float* input, float* output, int N) {
    int tid = threadIdx.x;
    int idx = blockDim.x * blockIdx.x + threadIdx.x;
    __shared__ float input_s[BLOCK_SIZE];

    // 1. Load blockDim.x elements into this block's shared memory
    input_s[tid] = (idx < N) ? input[idx] : 0.0f;
    __syncthreads();

    // 2. Tree reduction with 1/2, 1/4, 1/8 ... of the threads
    for (int offset = blockDim.x >> 1; offset > 0; offset >>= 1) {
        if (tid < offset) {
            input_s[tid] += input_s[tid + offset];
        }
        __syncthreads();
    }

    // 3. Thread 0 of each block adds the partial sum to the output
    if (tid == 0) atomicAdd(output, input_s[0]);
}
```

## v3 — warp shuffle (the one to memorize)

Do the halving **inside a warp** with register-to-register shuffles. Threads in a warp execute in lockstep, so no `__syncthreads()` is needed between steps. `BLOCK_SIZE` must be a multiple of 32; otherwise you get a partial warp that may read garbage.

| Intrinsic | What it reads |
|---|---|
| `__shfl_sync()` | the value from any lane (0–31) |
| `__shfl_xor_sync()` | the value from lane `laneId ^ mask` — **common** |
| `__shfl_up_sync()` | the value from a lane a fixed offset *below* |
| `__shfl_down_sync()` | the value from a lane a fixed offset *above* — **common** |

> [!CAUTION]
> **Fix:** the original spelled these `__shf_xor_sync` and `__sync_down_sync`. The correct names are in the table.

```cpp
dim3 block_size(BLOCK_SIZE);
dim3 grid_size(CEIL(N, BLOCK_SIZE));
reduce_v3<<<grid_size, block_size>>>(d_x, d_y, N);  // Fix: missing semicolon in the original

__global__ void reduce_v3(float* d_x, float* d_y, const int N) {
    __shared__ float s_y[32];  // a block has at most 1024 threads = 32 warps

    int idx    = blockDim.x * blockIdx.x + threadIdx.x;
    int warpId = threadIdx.x / warpSize;  // which warp this thread belongs to
    int laneId = threadIdx.x % warpSize;  // which lane within the warp

    float val = (idx < N) ? d_x[idx] : 0.0f;  // load into a register
    #pragma unroll
    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        val += __shfl_down_sync(0xFFFFFFFF, val, offset);  // in-warp tree reduction
    }

    if (laneId == 0) s_y[warpId] = val;  // lane 0 of each warp writes its partial sum
    __syncthreads();

    if (warpId == 0) {  // the first warp reduces the per-warp partials
        int warpNum = blockDim.x / warpSize;
        val = (laneId < warpNum) ? s_y[laneId] : 0.0f;
        for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
            val += __shfl_down_sync(0xFFFFFFFF, val, offset);
        }
        if (laneId == 0) atomicAdd(d_y, val);
    }
}
```

The shape to remember is **warp shuffle → shared memory → warp shuffle**: a two-level reduction where shared memory only holds one value per warp.

## v4 — warp shuffle + float4

Same structure, but each thread first sums four elements loaded with one 128-bit instruction.

```cpp
#define FLOAT4(value) (reinterpret_cast<float4*>(&(value))[0])  // Fix: the original macro lacked parentheses (precedence bug)
dim3 block_size(BLOCK_SIZE);
dim3 grid_size(CEIL(CEIL(N, BLOCK_SIZE), 4));  // divide by 4 here
reduce_v4<<<grid_size, block_size>>>(d_x, d_y, N);  // Fix: the original launched reduce_v3 and lacked a semicolon

__global__ void reduce_v4(float* d_x, float* d_y, const int N) {
    __shared__ float s_y[32];
    int idx    = (blockDim.x * blockIdx.x + threadIdx.x) * 4;  // multiply by 4 here
    int warpId = threadIdx.x / warpSize;
    int laneId = threadIdx.x % warpSize;

    float val = 0.0f;
    if (idx < N) {
        float4 tmp_x = FLOAT4(d_x[idx]);
        val += tmp_x.x;
        val += tmp_x.y;
        val += tmp_x.z;
        val += tmp_x.w;
    }
    #pragma unroll
    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        val += __shfl_down_sync(0xFFFFFFFF, val, offset);
    }

    if (laneId == 0) s_y[warpId] = val;
    __syncthreads();

    if (warpId == 0) {
        int warpNum = blockDim.x / warpSize;
        val = (laneId < warpNum) ? s_y[laneId] : 0.0f;
        for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
            val += __shfl_down_sync(0xFFFFFFFF, val, offset);
        }
        if (laneId == 0) atomicAdd(d_y, val);  // Fix: the original wrote landId
    }
}
```

> [!WARNING]
> Like the float4 elementwise kernel, this assumes `N % 4 == 0` and aligned input; handle the tail separately otherwise.

## Max works the same way

Swap `+` for `fmaxf` and the identity `0.0f` for `-FLT_MAX`. A float `atomicMax` doesn't exist natively — the next post builds one from `atomicCAS`.

## Follow-up questions to expect

- What is the bottleneck of each version?
- Why don't warp-level steps need `__syncthreads()`? Why do the shuffle intrinsics take a mask (think Volta's independent thread scheduling)?
- For the final step across blocks: one atomic per block, or a second kernel launch? *(Atomics are non-deterministic in float; a second pass is deterministic.)*
- How would you rewrite v3 with `cub::BlockReduce`?
- Variants that reuse the same skeleton: find the one element that differs (XOR-reduce), variance with Welford merging.

**Previous:** [#1 Elementwise](/posts/learning/cuda-kernel-handbook/01-elementwise/) · **Next:** [#3 Softmax](/posts/learning/cuda-kernel-handbook/03-softmax/)
