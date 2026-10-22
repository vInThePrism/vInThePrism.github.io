---
title: "CUDA Kernel Handbook #1: Elementwise Ops and float4 Vectorization"
published: 2026-10-22
description: "Add, sigmoid and ReLU from one-thread-per-element to float4 vectorized loads, plus how to size the grid without hurting occupancy."
category: Learning
tags: [CUDA, Interview, Elementwise]
series: "CUDA Kernel Handbook"
seriesOrder: 1
---

> [!NOTE]
> This series is adapted and translated from [Tongkaio/CUDA_Kernel_Samples](https://github.com/Tongkaio/CUDA_Kernel_Samples) (MIT License, © Tongkaio). Typos in the original code are fixed and marked with a **Fix** comment.

## What interviewers actually expect

You won't get a CUDA environment in an interview, and nobody expects fully runnable code. You usually only need to write:

- the **kernel body** (most of the time, this is all), and
- the `block_size`, `grid_size` and the launch line.

| Topic | Kernels | How often it's asked |
|---|---|---|
| Elementwise | add, sigmoid, ReLU | Low |
| Reduce | sum, max, softmax, row-wise softmax | **High** |
| Transpose | naive, coalesced + bank-conflict-free | Medium |
| SGEMM | naive, block tile, thread tile | Medium |
| GEMV | sgemv | Low (but it's the base for row-wise reductions) |

Two macros used throughout the series:

```cpp
// 1. Ceiling division
#define CEIL(a, b) ((a + b - 1) / (b))

// 2. FLOAT4 for vectorized memory access — either form works
// C style
#define FLOAT4(value) *(float4*)(&(value))
// C++ style
#define FLOAT4(value) (reinterpret_cast<float4*>(&(value))[0])
```

## The idea

Elementwise kernels apply the same operation to every element independently — adding two arrays of the same length, or any activation function. There are two standard ways to write them:

- **Naive**: one thread handles one element.
- **float4 vectorized**: one thread handles four elements with a single 128-bit load and store. This only pays off on large inputs. It cuts the number of memory instructions, so each instruction moves more data and achieved bandwidth goes up.

> [!IMPORTANT]
> Divide the **grid** by 4, not the block. Shrinking the block can lower SM occupancy (active threads ÷ the SM's maximum threads). Pick a `block_size` that is at least *max threads per SM ÷ max resident blocks per SM* and divides the SM's max thread count evenly — only then can you reach 100% occupancy.

## add — naive

```cpp
// block_size, grid_size and the launch
int block_size = 1024;
int grid_size = CEIL(N, block_size);
elementwise_add<<<grid_size, block_size>>>(a, b, c, N);

// Kernel
__global__ void elementwise_add(float* a, float* b, float* c, int N) {
    int idx = blockDim.x * blockIdx.x + threadIdx.x;
    if (idx < N) {
        c[idx] = a[idx] + b[idx];
    }
}
```

## add — float4

```cpp
int block_size = 1024;
int grid_size  = CEIL(CEIL(N, 4), block_size);  // divide by 4 on the grid dimension
elementwise_add_float4<<<grid_size, block_size>>>(a, b, c, N);  // Fix: the original launched elementwise_add

__global__ void elementwise_add_float4(float* a, float* b, float* c, int N) {
    int idx = (blockDim.x * blockIdx.x + threadIdx.x) * 4;
    if (idx < N) {
        float4 tmp_a = FLOAT4(a[idx]);
        float4 tmp_b = FLOAT4(b[idx]);
        float4 tmp_c;
        tmp_c.x = tmp_a.x + tmp_b.x;
        tmp_c.y = tmp_a.y + tmp_b.y;
        tmp_c.z = tmp_a.z + tmp_b.z;
        tmp_c.w = tmp_a.w + tmp_b.w;
        FLOAT4(c[idx]) = tmp_c;
    }
}
```

> [!WARNING]
> This version assumes `N % 4 == 0` and 16-byte-aligned pointers. Otherwise `idx < N` does **not** stop the read of `idx+1 .. idx+3` from going out of bounds, and the tail needs a scalar fallback. Bringing this up yourself in an interview earns points.

From here on, `block_size`, `grid_size` and the launch are the same as for `add`.

## sigmoid

$$\sigma(x) = \frac{1}{1 + e^{-x}}$$

```cpp
__global__ void sigmoid(float* x, float* y, int N) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < N) y[idx] = 1.0f / (1.0f + expf(-x[idx]));
}

// float4
__global__ void sigmoid_float4(float* x, float* y, int N) {
    int idx = (blockDim.x * blockIdx.x + threadIdx.x) * 4;
    if (idx < N) {
        float4 tmp_x = FLOAT4(x[idx]);
        float4 tmp_y;
        tmp_y.x = 1.0f / (1.0f + expf(-tmp_x.x));
        tmp_y.y = 1.0f / (1.0f + expf(-tmp_x.y));
        tmp_y.z = 1.0f / (1.0f + expf(-tmp_x.z));
        tmp_y.w = 1.0f / (1.0f + expf(-tmp_x.w));
        FLOAT4(y[idx]) = tmp_y;
    }
}
```

## ReLU

$$\mathrm{ReLU}(x) = \max(0, x)$$

```cpp
__global__ void relu(float* x, float* y, int N) {
    int idx = blockDim.x * blockIdx.x + threadIdx.x;
    if (idx < N) y[idx] = fmaxf(0.0f, x[idx]);
}

// float4
__global__ void relu_float4(float* x, float* y, int N) {
    int idx = (blockDim.x * blockIdx.x + threadIdx.x) * 4;
    if (idx < N) {
        float4 tmp_x = FLOAT4(x[idx]);
        float4 tmp_y;
        tmp_y.x = fmaxf(0.0f, tmp_x.x);
        tmp_y.y = fmaxf(0.0f, tmp_x.y);
        tmp_y.z = fmaxf(0.0f, tmp_x.z);
        tmp_y.w = fmaxf(0.0f, tmp_x.w);
        FLOAT4(y[idx]) = tmp_y;
    }
}
```

## Follow-up questions to expect

- Why the `if (idx < N)` guard, and what would a grid-stride loop change?
- Why not use shared memory here? *(No data reuse — every element is read once.)*
- How does fusing two elementwise ops (e.g. GeLU + bias) save memory traffic?
- What's the arithmetic intensity of `add`, and where does it sit on the roofline? *(Far on the memory-bound side.)*

**Next:** [#2 Reduce: from atomics to warp shuffles](/posts/learning/cuda-kernel-handbook/02-reduce/)
