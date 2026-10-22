---
title: "CUDA Kernel Handbook #3: Softmax, from Three Kernels to One Warp per Row"
published: 2026-10-22
description: "Safe softmax on the CPU, a three-kernel CUDA version, and the row-wise softmax where one warp owns one row — with shfl_down and shfl_xor."
category: Learning
tags: [CUDA, Interview, Softmax, Reduce]
series: "CUDA Kernel Handbook"
seriesOrder: 3
---

> [!NOTE]
> Adapted and translated from [Tongkaio/CUDA_Kernel_Samples](https://github.com/Tongkaio/CUDA_Kernel_Samples) (MIT License, © Tongkaio). Typos in the original code are fixed and marked with a **Fix** comment.

Both the CPU and CUDA versions of softmax are high-frequency interview questions; you may be allowed to pick either. Write the one you can get right.

$$\mathrm{Softmax}(x_i) = \frac{e^{x_i}}{\sum_{j=1}^{N} e^{x_j}}$$

To avoid overflow, subtract the maximum $M$ first. The result is mathematically identical:

$$\mathrm{Softmax}(x_i) = \frac{e^{x_i - M}}{\sum_{j=1}^{N} e^{x_j - M}}, \qquad M = \max(x)$$

## CPU version

```cpp
void softmax(float* input, float* output, int N) {
    float M = *(std::max_element(input, input + N));  // Fix: the original used int M, which truncates
    float div = 0;
    for (int i = 0; i < N; i++) {
        output[i] = std::exp(input[i] - M);
        div += output[i];
    }
    for (int i = 0; i < N; i++) {
        output[i] /= div;
    }
}
```

## CUDA version — three kernels

Split softmax into reductions. Lots of code but simple logic. The downside is efficiency: three launches and three passes over global memory. Learn the row-wise version below instead if you have to pick one.

1. Kernel 1 reduces to `max_val`.
2. Kernel 2 reduces to `sum(exp(x - max_val))`.
3. Kernel 3 computes `exp(x - max_val) / sum` per element.

```cpp
// float atomicMax built from an atomicCAS loop
__device__ static float atomicMax(float* address, float val) {
    int* address_as_i = (int*)address;
    int old = *address_as_i;
    int assumed;
    do {
        assumed = old;
        old = atomicCAS(address_as_i, assumed,
                        __float_as_int(fmaxf(val, __int_as_float(assumed))));
    } while (assumed != old);
    return __int_as_float(old);
}

__global__ void max_kernel(float* input, float* max_val, int N) {
    __shared__ float s_mem[32];
    int idx    = blockDim.x * blockIdx.x + threadIdx.x;
    int warpId = threadIdx.x / warpSize;
    int laneId = threadIdx.x % warpSize;

    float val = (idx < N) ? input[idx] : (-FLT_MAX);
    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        val = fmaxf(val, __shfl_down_sync(0xFFFFFFFF, val, offset));
    }
    if (laneId == 0) s_mem[warpId] = val;
    __syncthreads();

    if (warpId == 0) {
        int warpNum = blockDim.x / warpSize;
        val = (laneId < warpNum) ? s_mem[laneId] : (-FLT_MAX);
        for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
            val = fmaxf(val, __shfl_down_sync(0xFFFFFFFF, val, offset));
        }
        if (laneId == 0) atomicMax(max_val, val);
    }
}

__global__ void sum_kernel(float* input, float* sum, float* max_val, int N) {
    __shared__ float s_mem[32];
    int idx    = blockDim.x * blockIdx.x + threadIdx.x;
    int warpId = threadIdx.x / warpSize;
    int laneId = threadIdx.x % warpSize;

    float val = (idx < N) ? expf(input[idx] - *max_val) : 0.0f;
    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        val += __shfl_down_sync(0xFFFFFFFF, val, offset);
    }
    if (laneId == 0) s_mem[warpId] = val;
    __syncthreads();

    if (warpId == 0) {
        int warpNum = blockDim.x / warpSize;
        val = (laneId < warpNum) ? s_mem[laneId] : 0.0f;
        for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
            val += __shfl_down_sync(0xFFFFFFFF, val, offset);
        }
        if (laneId == 0) atomicAdd(sum, val);
    }
}

__global__ void softmax_kernel(float* input, float* output, float* sum, float* max_val, int N) {
    int idx = blockDim.x * blockIdx.x + threadIdx.x;
    if (idx < N) output[idx] = expf(input[idx] - *max_val) / (*sum);
}

// Before launching: initialize *max_val = -FLT_MAX and *sum = 0
int block_size = 256;
int grid_size = CEIL(N, block_size);
max_kernel<<<grid_size, block_size>>>(input, max_val, N);  // Fix: the original wrote gird_size
sum_kernel<<<grid_size, block_size>>>(input, sum, max_val, N);
softmax_kernel<<<grid_size, block_size>>>(input, output, sum, max_val, N);
```

## Row-wise softmax — one warp per row

The more useful pattern (and the one that matters for attention) is softmax over every row of an $M \times N$ matrix. **Each warp owns one row**: it reduces the row max, then the row sum, then writes the outputs. With $M = 1$ this degenerates into the 1-D case.

This is exactly the same idea as SGEMV in [#5](/posts/learning/cuda-kernel-handbook/05-sgemm-sgemv/): one warp per row, each lane strides over the columns, then a warp-level reduction.

### Version 1 — shfl_down + shared-memory broadcast

After `__shfl_down_sync`, only lane 0 holds the full result, so it has to be broadcast through shared memory.

```cpp
__global__ void softmax_kernel(float* input, float* output, int M, int N) {
    __shared__ float s_max_val;
    __shared__ float s_sum;
    int laneId = threadIdx.x % warpSize;
    int row = blockIdx.x;  // current row
    if (row >= M) return;

    int iteration = CEIL(N, warpSize);  // elements per thread

    // Row max
    float max_val = -FLT_MAX;
    for (int i = 0; i < iteration; i++) {
        int col = i * warpSize + laneId;
        max_val = (col < N) ? fmaxf(max_val, input[row * N + col]) : max_val;
    }
    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        max_val = fmaxf(max_val, __shfl_down_sync(0xFFFFFFFF, max_val, offset));
    }
    if (laneId == 0) s_max_val = max_val;  // lane 0 publishes the max
    __syncwarp();  // Fix: missing in the original — other lanes could read a stale value

    // Row sum of exp(x - max)
    float sum = 0.0f;
    for (int i = 0; i < iteration; i++) {
        int col = i * warpSize + laneId;
        sum += (col < N) ? expf(input[row * N + col] - s_max_val) : 0.0f;
    }
    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        sum += __shfl_down_sync(0xFFFFFFFF, sum, offset);
    }
    if (laneId == 0) s_sum = sum;
    __syncwarp();  // Fix: same as above

    // Write the softmax for this row
    for (int i = 0; i < iteration; i++) {
        int col = i * warpSize + laneId;
        if (col < N) output[row * N + col] = expf(input[row * N + col] - s_max_val) / s_sum;
    }
}
```

### Version 2 — shfl_xor butterfly (recommended)

With `__shfl_xor_sync`, every lane ends up holding the full result in its own register. No shared memory, no broadcast, no extra sync.

```cpp
dim3 block(32);
dim3 grid(M);

__global__ void softmax_kernel(float* input, float* output, int M, int N) {
    int laneId = threadIdx.x % warpSize;
    int row = blockIdx.x;
    if (row >= M) return;

    int iteration = CEIL(N, warpSize);

    // Row max
    float max_val = -FLT_MAX;
    for (int i = 0; i < iteration; i++) {
        int col = i * warpSize + laneId;
        max_val = (col < N) ? fmaxf(max_val, input[row * N + col]) : max_val;
    }
    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        max_val = fmaxf(max_val, __shfl_xor_sync(0xFFFFFFFF, max_val, offset));
    }

    // Row sum of exp(x - max)
    float sum = 0.0f;
    for (int i = 0; i < iteration; i++) {
        int col = i * warpSize + laneId;
        sum += (col < N) ? expf(input[row * N + col] - max_val) : 0.0f;
    }
    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        sum += __shfl_xor_sync(0xFFFFFFFF, sum, offset);
    }

    // Write the softmax for this row
    for (int i = 0; i < iteration; i++) {
        int col = i * warpSize + laneId;
        if (col < N) output[row * N + col] = expf(input[row * N + col] - max_val) / sum;
    }
}
```

## Where this goes next: online softmax

All versions above read each row **three times** (max, sum, write). *Online softmax* fuses the first two passes: keep a running max $m$ and running sum $d$, and when a new element $x$ arrives,

$$m' = \max(m, x), \qquad d' = d \cdot e^{m - m'} + e^{x - m'}$$

Two partial results $(m_1, d_1)$ and $(m_2, d_2)$ merge the same way, so the update also works as a warp-shuffle reduction. This rescaling trick is the heart of FlashAttention.

## Follow-up questions to expect

- Why subtract the max? How many passes does safe softmax need, and how does online softmax get it to fewer?
- When $N$ is very large (say 100k), one warp per row is too little parallelism — how would you split a row across a block, or across blocks?
- `shfl_down` vs `shfl_xor`: what's the difference in where the result lives?
- FP16 inputs: where do you accumulate, and in what precision?

**Previous:** [#2 Reduce](/posts/learning/cuda-kernel-handbook/02-reduce/) · **Next:** [#4 Transpose](/posts/learning/cuda-kernel-handbook/04-transpose/)
