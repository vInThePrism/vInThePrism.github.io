---
title: "CUDA Kernel Handbook #5: SGEMM (Naive → Block Tile → Thread Tile) and SGEMV"
published: 2026-10-22
description: "The GEMM ladder every GPU interview walks through, plus the one-warp-per-row GEMV that generalizes to any row-wise reduction."
category: Learning
tags: [CUDA, Interview, GEMM]
series: "CUDA Kernel Handbook"
seriesOrder: 5
---

> [!NOTE]
> Adapted and translated from [Tongkaio/CUDA_Kernel_Samples](https://github.com/Tongkaio/CUDA_Kernel_Samples) (MIT License, © Tongkaio). Typos in the original code are fixed and marked with a **Fix** comment.

## SGEMM

Matrix multiplication pulls together most of the common CUDA optimization tricks. It's hard to hand-write under pressure, so prioritize **naive** and **block tile**. Once block tile is solid, thread tile is a small addition. Faster versions (vectorized loads, double buffering, Tensor Cores) are worth understanding in principle; you rarely have to write them in an interview.

Convention: $C_{M \times N} = A_{M \times K} \cdot B_{K \times N}$, all row-major.

### Naive

Each thread computes one element of `C`.

```cpp
const int BLOCK_SIZE = 32;
dim3 block(BLOCK_SIZE, BLOCK_SIZE);
dim3 grid(CEIL(N, BLOCK_SIZE), CEIL(M, BLOCK_SIZE));  // tile over the shape of C (M x N)
sgemm<<<grid, block>>>(d_A, d_B, d_C, M, N, K);

__global__ void sgemm(float* A, float* B, float* C, int M, int N, int K) {
    int col = blockDim.x * blockIdx.x + threadIdx.x;
    int row = blockDim.y * blockIdx.y + threadIdx.y;
    if (row >= M || col >= N) return;

    float accum = 0.0f;
    for (int i = 0; i < K; i++) {
        accum += A[row * K + i] * B[i * N + col];
    }
    C[row * N + col] = accum;
}
```

**Why it's slow:** every output element reads a full row of `A` and a full column of `B` from global memory. Each element of `A` is fetched `N` times and each element of `B` `M` times. The arithmetic intensity is about 2 FLOPs per 8 bytes, deep in memory-bound territory.

### Block tile

Still one output element per thread, but the block cooperatively stages `BM×BK` of `A` and `BK×BN` of `B` in shared memory. The number of reads per thread doesn't shrink — but the repeated reads now hit **shared memory instead of global memory**, cutting global traffic by a factor of the tile size.

```cpp
#define BLOCK_SIZE 32

dim3 block(BLOCK_SIZE, BLOCK_SIZE);
dim3 grid(CEIL(N, BLOCK_SIZE), CEIL(M, BLOCK_SIZE));  // tile over the shape of C (M x N)
sgemm<<<grid, block>>>(d_A, d_B, d_C, M, N, K);

// Assumes M, N, K are all multiples of BLOCK_SIZE
__global__ void sgemm(float* A, float* B, float* C, int M, int N, int K) {
    // Fix: the original had `if (idx >= M || idy >= N) return;` here. The rows and columns
    // were swapped, and returning early before __syncthreads() can deadlock — removed.

    int bx = blockIdx.x;
    int by = blockIdx.y;
    int tx = threadIdx.x;
    int ty = threadIdx.y;

    const int BM = BLOCK_SIZE;
    const int BN = BLOCK_SIZE;
    const int BK = BLOCK_SIZE;
    __shared__ float As[BM * BK];
    __shared__ float Bs[BK * BN];

    // Move the pointers to this block's tile
    A = &A[(by * BM) * K];
    B = &B[bx * BN];
    C = &C[(by * BM) * N + bx * BN];

    float accum = 0.0f;
    for (int k = 0; k < K; k += BK) {
        // global -> shared
        As[ty * BK + tx] = A[ty * K + tx];
        Bs[ty * BN + tx] = B[ty * N + tx];
        __syncthreads();
        A = A + BK;
        B = B + BK * N;
        for (int i = 0; i < BK; i++) {
            accum += As[ty * BK + i] * Bs[i * BN + tx];
        }
        __syncthreads();
    }
    C[ty * N + tx] = accum;
}
```

> [!WARNING]
> Never `return` early from some threads before a `__syncthreads()` that other threads in the block still reach — that's undefined behavior and can hang. Guard the *loads and stores* instead (pad out-of-range elements with zero), and keep every thread in the loop.

### Thread tile

Now each thread computes a `TM×TN` patch of `C` (here 8×8). The values it reuses — one column slice of `As` and one row slice of `Bs` per `i` — stay in registers across the inner loops, so **compute per byte loaded** goes up sharply.

```cpp
dim3 block(256);
dim3 grid(CEIL(N, 128), CEIL(M, 128));  // tile over the shape of C (M x N)
sgemm<128, 128, 8, 8, 8><<<grid, block>>>(A, B, C, M, N, K);

template <const int BM, const int BN, const int BK, const int TM, const int TN>
__global__ void sgemm(float* A, float* B, float* C, int M, int N, int K) {
    int bx = blockIdx.x;
    int by = blockIdx.y;  // Fix: the original wrote blockIdy.y

    int block_row_thread = BN / TN;  // threads along one row of the block tile
    int block_col_thread = BM / TM;  // threads along one column of the block tile
    int thread_num = block_row_thread * block_col_thread;  // threads per block

    int tx = (threadIdx.x % block_row_thread) * TN;  // top-left x of this thread's tile
    int ty = (threadIdx.x / block_row_thread) * TM;  // top-left y of this thread's tile

    __shared__ float As[BM * BK];
    __shared__ float Bs[BK * BN];

    A = &A[by * BM * K];
    B = &B[bx * BN];
    C = &C[by * BM * N + bx * BN];

    int a_tile_row    = threadIdx.x / BK;
    int a_tile_col    = threadIdx.x % BK;
    int a_tile_stride = thread_num / BK;

    int b_tile_row    = threadIdx.x / BN;
    int b_tile_col    = threadIdx.x % BN;
    int b_tile_stride = thread_num / BN;

    float accum[TM][TN] = {0.0f};
    for (int k = 0; k < K; k += BK) {
        for (int i = 0; i < BM; i += a_tile_stride) {
            As[(a_tile_row + i) * BK + a_tile_col] = A[(a_tile_row + i) * K + a_tile_col];
        }
        for (int i = 0; i < BK; i += b_tile_stride) {
            Bs[(b_tile_row + i) * BN + b_tile_col] = B[(b_tile_row + i) * N + b_tile_col];
        }
        __syncthreads();

        A += BK;
        B += BK * N;

        for (int row = 0; row < TM; row++) {
            for (int col = 0; col < TN; col++) {
                for (int i = 0; i < BK; i++) {
                    accum[row][col] += As[(ty + row) * BK + i] * Bs[i * BN + (tx + col)];
                }
            }
        }
        __syncthreads();
    }
    for (int row = 0; row < TM; row++) {
        for (int col = 0; col < TN; col++) {
            C[(ty + row) * N + (tx + col)] = accum[row][col];
        }
    }
}
```

**Interview tip:** reorder the inner loops to `i` outermost, load `As[(ty+row)*BK+i]` into a register array `a_frag[TM]` and `Bs[i*BN+tx+col]` into `b_frag[TN]`, then do the `TM×TN` outer product. That makes the register reuse explicit and is the natural next step toward the "register-blocked GEMM".

### What each step fixes

| Version | Main bottleneck removed | What's left |
|---|---|---|
| Naive | — | global-memory bandwidth (no reuse) |
| Block tile | repeated global reads → shared memory | shared-memory bandwidth; one FMA per two shared loads |
| Thread tile | repeated shared reads → registers | latency hiding, global→shared stalls (fix with double buffering / `cp.async`), then Tensor Cores |

## SGEMV — one warp per row

Matrix–vector product: one block per row, one warp per block, and the warp reduces its row. It's asked less often, but it's worth knowing because **"one warp owns one row" generalizes directly to row-wise reductions on 2-D matrices** — interviewers sometimes ask for those instead of a 1-D reduce. Row-wise softmax in [#3](/posts/learning/cuda-kernel-handbook/03-softmax/) is the same skeleton.

```cpp
// M = 1024 rows, K = 32 columns
// one block per row: grid_size = M
// one warp per block: block_size = 32
sgemv<<<grid_size, block_size>>>(A, x, y, M, K);

__global__ void sgemv(float* A, float* x, float* y, int M, int K) {
    int laneId = threadIdx.x % warpSize;
    int row = blockIdx.x;  // 0 .. M-1
    if (row >= M) return;

    float res = 0.0f;
    int kIteration = CEIL(K, warpSize);  // elements per thread

    for (int i = 0; i < kIteration; i++) {
        int col = i * warpSize + laneId;
        res += (col < K) ? A[row * K + col] * x[col] : 0.0f;
    }

    for (int offset = warpSize >> 1; offset > 0; offset >>= 1) {
        res += __shfl_down_sync(0xFFFFFFFF, res, offset);
    }

    if (laneId == 0) y[row] = res;
}
```

## Follow-up questions to expect

- From naive to tiled to register-blocked: what is the physical reason each step is faster?
- What constrains the tile sizes (shared memory per SM, registers per thread, occupancy)?
- Why compute an 8×8 patch per thread — does it spill registers?
- When $K \gg M, N$, what goes wrong, and how does split-K help?
- How far is this from cuBLAS, and what would close the gap (vectorized loads, double buffering, swizzled shared memory, Tensor Cores via `mma.sync`)?

**Previous:** [#4 Transpose](/posts/learning/cuda-kernel-handbook/04-transpose/) · **Start of series:** [#1 Elementwise](/posts/learning/cuda-kernel-handbook/01-elementwise/)

## Appendix — errata fixed relative to the original README

| Where | Original | Fixed |
|---|---|---|
| elementwise · float4 add launch | `elementwise_add<<<…>>>` | `elementwise_add_float4` |
| reduce · shuffle table | `__shf_xor_sync`, `__sync_down_sync` | `__shfl_xor_sync`, `__shfl_down_sync` |
| reduce · v3 launch | missing semicolon | added |
| reduce · v4 macro | `(float4*)(&(value))[0]` | subscript binds tighter than the cast; use `reinterpret_cast` |
| reduce · v4 launch | launched `reduce_v3` | `reduce_v4` |
| reduce · v4 | `landId` | `laneId` |
| softmax · CPU | `int M` | `float M` (int truncates the max) |
| softmax · CUDA launch | `gird_size` | `grid_size`; documented that `max_val` / `sum` must be initialized |
| sgemm · block tile | `if (idx >= M \|\| idy >= N) return;` | removed: rows/cols swapped, and the early return skips `__syncthreads()` |
| sgemm · thread tile | `blockIdy.y` | `blockIdx.y` |
| row-wise softmax · v1 | no sync after lane 0 writes shared memory | added `__syncwarp()` |
