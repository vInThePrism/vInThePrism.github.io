---
title: "CUDA Kernel Handbook #4: Matrix Transpose, Coalescing and Bank Conflicts"
published: 2026-10-22
description: "Naive transpose, coalesced writes with __ldg, and the shared-memory tile version — fixing bank conflicts with padding or an XOR swizzle."
category: Learning
tags: [CUDA, Interview, Memory, Bank Conflict]
series: "CUDA Kernel Handbook"
seriesOrder: 4
---

> [!NOTE]
> Adapted and translated from [Tongkaio/CUDA_Kernel_Samples](https://github.com/Tongkaio/CUDA_Kernel_Samples) (MIT License, © Tongkaio).

Transpose looks trivial, but it tests two things interviewers care about: **efficient global-memory access** and **shared-memory bank conflicts**.

## Rules for global-memory access

- **Coalesce whenever possible.** Consecutive threads should touch consecutive addresses, and the starting address should be a multiple of 32 bytes (one memory transaction). `cudaMalloc` returns pointers aligned to at least 256 bytes.
- **If reads and writes can't both be coalesced, coalesce the writes.** When the compiler can prove a global array is read-only inside the kernel, it routes loads through the read-only cache (`__ldg()`), which softens the cost of uncoalesced reads. Writes have no such escape hatch. On Kepler and Maxwell you had to call `__ldg()` explicitly.

Throughout this post, the input is $M \times N$ (row-major) and the output is $N \times M$.

## Naive

Reads are coalesced (threads walk along a row of `input`), writes are strided by `M`.

```cpp
__global__ void transpose(float* input, float* output, int M, int N) {
    // row and col of the input
    int row = blockDim.y * blockIdx.y + threadIdx.y;
    int col = blockDim.x * blockIdx.x + threadIdx.x;

    if (row < M && col < N) {
        output[col * M + row] = input[row * N + col];
    }
}
```

## Coalesced writes only

Index by the **output** instead, so writes are coalesced and the strided reads go through the read-only cache.

```cpp
__global__ void transpose(float* input, float* output, int M, int N) {
    // row and col of the output
    int row = blockDim.y * blockIdx.y + threadIdx.y;
    int col = blockDim.x * blockIdx.x + threadIdx.x;

    if (row < N && col < M) {
        output[row * M + col] = __ldg(&input[col * N + row]);  // coalesced write, cached read
    }
}
```

## Recommended: stage through shared memory

Read a 32×32 tile from `input` **row by row** (coalesced) into shared memory, then write it to `output` **row by row** (coalesced). Tile `(by, bx)` of the input lands at tile `(bx, by)` of the output, and the transpose itself happens when reading shared memory *by column*.

That column read is the classic bank-conflict case: a warp reads `s_mem[0][k], s_mem[1][k], …, s_mem[31][k]`. With 32 four-byte banks and a row stride of 32 floats, all 32 addresses map to **the same bank** — a 32-way conflict that serializes the access. Two standard fixes follow.

### Fix 1: padding

Make each row 33 floats wide. Consecutive rows now start in consecutive banks, so a column read hits 32 different banks.

```cpp
// Input is M rows x N cols, output is N rows x M cols
dim3 block(32, 32);
dim3 grid(CEIL(N, 32), CEIL(M, 32));  // tile over the input shape (M x N)
transpose<32><<<grid, block>>>(input, output, M, N);

template <const int BLOCK_SIZE>
__global__ void transpose(float* input, float* output, int M, int N) {
    __shared__ float s_mem[BLOCK_SIZE][BLOCK_SIZE + 1];  // padding
    int bx = blockIdx.x * BLOCK_SIZE;
    int by = blockIdx.y * BLOCK_SIZE;
    int x1 = bx + threadIdx.x;
    int y1 = by + threadIdx.y;

    if (x1 < N && y1 < M) {
        s_mem[threadIdx.y][threadIdx.x] = input[y1 * N + x1];
    }
    __syncthreads();

    int x2 = by + threadIdx.x;
    int y2 = bx + threadIdx.y;
    if (x2 < M && y2 < N) {
        output[y2 * M + x2] = s_mem[threadIdx.x][threadIdx.y];  // no bank conflict thanks to padding
    }
}
```

### Fix 2: XOR swizzle (no padding)

Keep the tile at exactly 32×32 but permute the column: element `(r, c)` is stored at column `c ^ r`. For a fixed logical column, the 32 rows land in 32 distinct physical columns — and therefore 32 distinct banks.

```cpp
dim3 block(32, 32);
dim3 grid(CEIL(N, 32), CEIL(M, 32));
transpose<32><<<grid, block>>>(input, output, M, N);

template <const int BLOCK_SIZE>
__global__ void transpose(float* input, float* output, int M, int N) {
    __shared__ float s_mem[BLOCK_SIZE][BLOCK_SIZE];  // no padding needed
    int bx = blockIdx.x * BLOCK_SIZE;
    int by = blockIdx.y * BLOCK_SIZE;
    int x1 = bx + threadIdx.x;
    int y1 = by + threadIdx.y;

    if (x1 < N && y1 < M) {
        s_mem[threadIdx.y][threadIdx.x ^ threadIdx.y] = input[y1 * N + x1];
    }
    __syncthreads();

    int x2 = by + threadIdx.x;
    int y2 = bx + threadIdx.y;
    if (x2 < M && y2 < N) {
        output[y2 * M + x2] = s_mem[threadIdx.x][threadIdx.x ^ threadIdx.y];  // no bank conflict after swizzling
    }
}
```

## Padding vs swizzle

| | Padding | Swizzle |
|---|---|---|
| Shared memory | wastes one column per tile | no waste |
| Indexing | trivial | one XOR per access |
| Alignment | breaks 16-byte alignment of rows, so vectorized `float4` shared-memory access gets awkward | rows stay aligned — this is why CUTLASS / CuTe and TMA use swizzled layouts |

## Follow-up questions to expect

- How many banks are there, and how wide is each one? Does it count as a conflict if several threads read the **same** address? *(No — that's a broadcast.)*
- How do 64-bit or 128-bit accesses change the conflict math?
- Which Nsight Compute metric shows bank conflicts? *(Shared-memory "bank conflicts" counters in the Memory Workload Analysis section.)*
- Why is a 32×32 block (1024 threads) not always the best launch shape here, and what changes if each thread copies several elements?

**Previous:** [#3 Softmax](/posts/learning/cuda-kernel-handbook/03-softmax/) · **Next:** [#5 SGEMM and SGEMV](/posts/learning/cuda-kernel-handbook/05-sgemm-sgemv/)
