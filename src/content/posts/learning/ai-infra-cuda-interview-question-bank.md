---
title: "AI Infra / CUDA Interview Question Bank"
published: 2026-10-22
description: "180 questions and 27 hand-coding problems for GPU kernel and AI infra interviews, collected from NVIDIA and other interview reports and grouped by skill area."
category: Learning
tags: [CUDA, Interview, AI Infra]
pinned: false
---

A question bank for GPU kernel / AI infrastructure interviews. Questions are grouped into twelve topic areas plus a table of hand-coding problems at the end. Starred (★) questions show up repeatedly across many interview reports.

The answers are deliberately left blank. The way I use it: write the key points for a question myself, then say the answer out loud without notes. A question only counts as done once I can do that.

**Source tags**

- **[NV]** first-hand NVIDIA interview reports (Nowcoder, 1point3acres, Glassdoor)
- **[ByteDance] [Kuaishou] [Baidu] [Meituan] [Alibaba] [Tencent] [Ant] [Xiaohongshu] [Tongyi]** AI-infra interview reports from those companies
- **[CN]** AI-infra interview reports from Chinese companies where the post didn't name the company
- **[HPC]** HPC / chip-company interview reports (SenseTime, Biren, Cambricon, …)
- **[Bank]** curated question collections rather than single interviews
- **[Overseas]** interview reports or job descriptions from Anthropic, xAI, Meta, …
- **[Added]** not in any report; added from NVIDIA job descriptions

---

## 1. GPU architecture and the CUDA execution model

The opening questions for every role. Nearly every NVIDIA DevTech report asks about the thread hierarchy and SM scheduling.

1. What is SIMT, and how does it differ from SIMD on a CPU? [HPC]
2. ★ How do grid / block / warp / thread relate? How does an SM schedule threads? [NV]
    - Follow-up: how many warp schedulers does an SM have, and how many instructions can each issue per cycle?
    - Follow-up: when a warp stalls on memory, how does the scheduler switch — and why is the switch nearly free?
3. ★ How do you pick grid and block sizes? How does block = 256 relate to warps? Why are block sizes usually multiples of 32? [NV] [Baidu]
4. Can one block be scheduled across multiple SMs? How many blocks can be resident on one SM, and which resources limit that? [HPC]
5. ★ What is warp divergence? How does an if-else execute in hardware, and what does it cost? [NV] [HPC]
    - Follow-up: what did Volta's independent thread scheduling change? Why do warp-level intrinsics take a mask?
    - Follow-up: odd columns of a matrix take `log`, even columns take `cos` — when divergence and coalescing conflict, how do you trade them off? [NV]
6. ★ What synchronization tools does CUDA have? What is the scope of `__syncthreads`, `__syncwarp`, cooperative groups, atomics and memory fences? [NV]
    - Follow-up: what happens if `__syncthreads` is inside a branch?
7. ★ CUDA cores vs Tensor Cores: what's the difference, and when do you use which? [Kuaishou] [Bank]
8. Why does a kernel need `if (idx < n)`? What problem does a grid-stride loop solve? [Baidu]
9. How do CPU and GPU design goals differ? Why does a GPU hide latency with massive numbers of threads? [Added]
10. A GPU has no push instruction — who passes kernel arguments, at the software level? [Alibaba]
11. What are UVA and Unified Memory? Where does on-demand migration cost you? [Alibaba]
12. Roughly how many SMs, how much memory, how much bandwidth and how many BF16 FLOPS do A100, H100 and B200 have? [HPC] [CN]
13. At which level of the hardware do global atomics execute? Why do threads contending for one address serialize? [Added]
14. What does a grid-wide sync with cooperative groups require? [Added]
15. What is predication? When does the compiler turn a branch into predicated instructions? [Added]

## 2. Memory hierarchy and access optimization

Bank conflicts and coalescing are the two most frequent terms in CUDA interviews, and the follow-ups go all the way down to profiler metrics and fixes.

1. ★ Give the capacity, bandwidth and latency scale of registers, shared memory / L1, L2 and HBM. Roughly how much slower is global memory than shared memory? [NV] [Meituan]
2. ★ What is memory coalescing? Which access patterns break it? [Alibaba] [NV]
    - Follow-up: a warp reads 32 consecutive floats — how many sector requests is that? What about a strided read?
3. ★ What is a bank conflict? When does it happen, how do you find it, and how many fixes can you name? [NV] [Alibaba] [CN] [Bank]
    - Follow-up: how wide is a bank, and how many banks are there?
    - Follow-up: several threads in a warp read the same address — is that a conflict?
    - Follow-up: how do you count conflicts for 64-bit or 128-bit accesses?
    - Follow-up: what does padding cost? What does a swizzle cost?
    - Follow-up: which Nsight Compute metric shows bank conflicts?
4. ★ Why is reading global memory with `float4` faster? What alignment does it need? [HPC]
5. What is local memory, when is it used, and where does it physically live? [NV]
6. How do register spills happen, and how do you detect and avoid them? What does `__launch_bounds__` do? [HPC]
7. Why do CPUs need three cache levels while GPUs get by with two? [Alibaba]
8. How big is L2 on common GPUs? What reuse can L2 already give you — and when is manually caching in shared memory over-engineering? [HPC] [Overseas]
9. L1 and shared memory share one SRAM array — how is the split configured? [Added]
10. Which access patterns suit constant memory and the read-only cache? [Added]
11. Why does `cudaMalloc` take a pointer to a pointer? [CN]
12. Give a structured answer: what techniques improve the memory efficiency of a CUDA program? [CN]
13. And what techniques improve its compute efficiency? [CN]
14. How do you transpose a matrix so that both reads and writes are coalesced, without bank conflicts? [ByteDance] [HPC]
15. How do double buffering (ping-pong buffers) work, and how are they implemented? [Bank]

## 3. Performance analysis methodology

Interviewers don't want vocabulary; they want to know how you decide *why* a kernel is slow and how much faster it can get. In NVIDIA Glassdoor reports, any optimization you mention gets drilled to the bottom.

1. ★ What is the roofline model? How do you compute a kernel's arithmetic intensity and decide whether it's memory-bound or compute-bound? [Bank]
    - Follow-up: where do GEMM, softmax, RMSNorm and decode-time attention sit on the roofline?
2. ★ What determines occupancy, and how do you control it? [HPC]
    - Follow-up: is higher occupancy always better? When is low occupancy faster?
    - Follow-up: achieved occupancy is far below theoretical — what could cause that?
3. How does Little's Law apply to GPUs? How many in-flight memory requests do you need to saturate bandwidth? [HPC]
4. Where does instruction-level parallelism show up on NVIDIA GPUs? Why does computing several outputs per thread help? [HPC]
5. ★ How do you prove an operator optimization actually worked? Do you account for different peak FLOPS at different precisions? What metric do you report? [Meituan]
6. ★ Given a slow kernel, what is your profiling workflow — what do you look at first, and then what? [NV] [Added]
7. What question does Nsight Systems answer, and what does Nsight Compute answer? [Added]
8. Which Nsight Compute sections and metrics do you check most? What do common stall reasons (long scoreboard, MIO throttle, …) tell you? [CN]
9. What are wave quantization and the tail effect, and how do you mitigate them? [Added]
10. ★ Why does kernel fusion speed things up? Besides saving memory traffic, what else does it buy you? Give examples. [NV] [Bank]
11. What do you have to watch out for when writing a kernel that measures peak FLOPS? [NV]
    - Follow-up: how do you keep the compiler from optimizing the math away? How many FLOPs is an FMA? How large must the grid and iteration count be? Should you use Tensor Cores?
12. How would you write a microbenchmark for memory bandwidth? [Added]
13. Is there a general methodology for operator optimization? [ByteDance]
14. How do you debug CUDA programs? Which tools (compute-sanitizer, cuda-gdb, …)? [HPC]

## 4. Asynchrony, streams and host-side orchestration

This is where NVIDIA reports dig into launch overhead.

1. ★ Is a kernel launch synchronous or asynchronous with respect to the host? Which APIs cause implicit synchronization? [Added]
2. ★ How large is launch overhead? What does "launch-bound" mean, and how do you fix it? [NV]
    - Follow-up: why do CUDA Graphs reduce launch overhead? What restrictions do they place on dynamic shapes and addresses?
3. What ordering is guaranteed within one stream, and across streams? How do you express a cross-stream dependency? [Added]
4. What is the difference between the legacy default stream and the per-thread default stream? [Added]
5. ★ What is pinned memory, and why does DMA need it? What does allocating too much of it cost? [CN]
    - Follow-up: in PyTorch, why must `pin_memory=True` and `non_blocking=True` be used together?
6. What is a copy engine? What is the hardware prerequisite for overlapping compute and copies? [Added]
7. How does `cudaMemcpyAsync` differ from Ampere's `cp.async`? [Added]
8. How do you build an H2D → compute → D2H pipeline with multiple streams? What bounds the speedup? [Added]
9. What can CUDA events do? What are the pitfalls of timing with them? [Added]
10. A timeline shows gaps on the GPU — what could cause them, and how do you rule each cause out? [Added]
11. Several processes share one GPU: how do MPS and MIG differ? [Added]

## 5. GEMM and Tensor Cores

GEMM is the most frequently hand-written operator, and the follow-ups go all the way down to Tensor Cores and Hopper's new instructions.

**From naive to register blocking**

1. ★ Why is naive GEMM slow? Going from naive → shared-memory tiling → register blocking, what bottleneck does each step remove? [NV] [Kuaishou] [Meituan] [Xiaohongshu]
2. ★ What constrains the tile sizes? [HPC]
3. Why have each thread compute 8×8 outputs? Will registers spill? How much compute happens per tile? [HPC]
4. What happens when K is much larger than M and N? What does split-K solve? [HPC] [Added]
5. What does `#pragma unroll` do? [HPC]
6. How do you optimize transposes inside a matmul? Why is A often stored transposed in shared memory? [ByteDance]
7. Where does your GEMM fall short of cuBLAS / CUTLASS? [HPC]

**Tensor Cores**

8. ★ What are the ways to use Tensor Cores? How does WMMA differ from MMA (`mma.sync`)? [Alibaba]
9. What does `ldmatrix` do, and why is it needed? [Added]
10. How does a multi-stage pipeline hide global-to-shared latency? [Added]
11. Have you written a low-bit (int8 / FP8 / FP4) GEMM? Where does dequantization go? [HPC]
12. What are persistent kernels and Stream-K? [Added]

**Hopper / Blackwell**

13. ★ What are the advantages of Hopper's TMA? How do you invoke it? Does the data pass through L1? [CN]
14. ★ How does WGMMA differ from MMA? [CN]
15. ★ What is warp specialization? How do producer and consumer warps split the work? [CN]
16. What is a swizzle? Compared with padding, what are the trade-offs for avoiding bank conflicts? [CN]
17. What are thread block clusters and distributed shared memory? [Added]
18. What do Blackwell's tcgen05 instructions and TMEM change compared with Hopper? [Added]

## 6. Attention and DL operators

Softmax and FlashAttention are the most frequent DL-operator questions in Chinese interview reports, often going from hand-coding straight to the differences between FA versions.

**Softmax and normalization**

1. ★ Why subtract the max in softmax? How many passes does safe softmax take? [Alibaba] [CN]
2. ★ How does online softmax get it down to one pass? How do you merge two partial results? [CN]
3. Softmax over the K dimension of an M×K matrix: how do you avoid overflow and precision loss? How do you tile when K is huge? [Alibaba]
4. How do LayerNorm and RMSNorm differ computationally? Derive the RMSNorm backward pass. [CN] [Added]
5. How do you compute variance in a numerically stable way (Welford)? [Meituan]
6. How do you write fused activation kernels like SwiGLU or GeLU + bias? What does fusion save? [Bank]

**FlashAttention**

7. ★ What is the core idea of FlashAttention? Why does it save memory *and* run faster? [CN]
8. ★ What changed from FA1 to FA2? Why does FA2 put Q in the outer loop? [CN]
9. Which Hopper features does FA3 use? What does FA4 do on Blackwell? [Added]
10. Why does the FA backward pass recompute? Which statistics does the forward pass save? [Added]
11. How does FA save compute under a causal mask? What if the mask is random? [Bank]
12. What problem does Flash Decoding solve? Roughly what share of time does the combine kernel take? [CN]
13. How do MHA, MQA, GQA and MLA differ? How do they affect KV-cache size and tensor-parallel sharding? [Added]
14. How do you estimate the arithmetic intensity of MLA decoding? Does it depend on sequence length or batch size? [CN]
15. How does a PagedAttention kernel handle non-contiguous KV blocks? [Baidu]

**Quantization, MoE and correctness**

16. How do symmetric and asymmetric quantization differ at compute time? How do you choose per-tensor, per-channel or per-group? [Alibaba]
17. How do you trade off performance against accuracy after quantization? [CN]
18. Implement an MoE layer and write down the shape at every step. How do dispatch and combine work? [NV]
19. How do you parallelize top-k and argmax on a GPU? [Added]
20. After writing a forward or backward kernel, how do you verify numerical correctness? How do you set tolerances? [Overseas]

## 7. DL frameworks and core libraries

Few first-hand reports cover this area; most questions come from curated banks and job descriptions. It maps directly to NVIDIA's "Deep Learning Frameworks and Libraries" roles.

**PyTorch internals**

1. What is PyTorch's dispatcher? What are ATen, c10 and `torch.library` each responsible for? [Bank]
2. ★ What are the full steps for implementing a custom CUDA operator and calling it from PyTorch? [Bank]
3. ★ What strategy does PyTorch's CUDA caching allocator use? How do you analyze and reduce memory fragmentation? [Bank]
4. Why does activation checkpointing save memory? Where does the extra compute come from? [Bank]
5. How do `torch.jit.trace` and `torch.jit.script` differ, and when does each fail? [Bank]
6. What are the components of `torch.compile`? What is a graph break? [Added]
7. How does autograd build the graph and run the backward pass? [Added]
8. What's the difference between `torch.repeat` and `torch.expand`? [CN]
9. What are contiguity and strides? How do `view` and `reshape` differ? [Added]
10. What launch arguments does `torchrun` take? How do you kill every `torchrun` process on a Linux box? [CN]
11. Design a GPU memory manager. [Ant]

**Core libraries and compilers**

12. PyTorch is row-major and cuBLAS is column-major — how do you call cuBLAS correctly? [Added]
13. How does cuBLASLt differ from cuBLAS? What is epilogue fusion? [Added]
14. What are cuDNN's graph API and frontend? How does it choose algorithms for convolution or attention? [Added]
15. What is CUTLASS's layered structure? What problem does CuTe's layout abstraction solve? [Overseas] [Added]
16. Triton vs CUDA: what are the pros and cons, and when do you reach for Triton? [Added]
17. In mixed-precision training, what does loss scaling solve? How do BF16 and FP16 differ? How is scaling done for FP8 training? [Added]
18. After a framework-level change, how do you guarantee numerics match the old behavior? How do you guarantee determinism? [Added]
19. A library has to support several GPU architectures — how do you organize build and test? How do fatbins and PTX JIT relate? [Added]

## 8. Distributed training and collective communication

Training-framework interviews live here. NVIDIA DevTech has also asked "how would you compute a matmul too large for one node?"

**Parallelism strategies**

1. ★ How do DP, TP and PP differ? How do you choose the mix? [Kuaishou]
2. How does Megatron's TP shard the MLP and attention? How many all-reduces does one transformer layer need, forward and backward? [Kuaishou] [Baidu]
3. ★ How are gradients computed under pipeline parallelism? GPipe vs 1F1B? How do you compute the bubble fraction? What does interleaved 1F1B improve? [Kuaishou]
4. What do sequence parallelism and context parallelism (ring attention) each solve? [Added]
5. ★ What do ZeRO-1, ZeRO-2 and ZeRO-3 shard? What is the communication volume of each, and why does ZeRO-3 cost an extra share? [Added]
6. How do FSDP and ZeRO-3 relate? [Added]
7. In MoE expert parallelism, what's the problem with all-to-all, and how do you address it? [Meituan]
8. A matmul doesn't fit on one node — how do you split it across nodes, and how do they communicate? [NV]
9. Walk through the end-to-end flow of distributed training. [Kuaishou]

**Collective communication**

10. ★ What does all-reduce do? Derive the number of steps and per-GPU traffic of ring all-reduce. [Baidu]
    - Follow-up: which message sizes suit ring vs tree? How does NCCL choose?
11. Why is reduce-scatter + all-gather equivalent to all-reduce? [Added]
12. How does DDP work? How do buckets and gradient hooks overlap communication with backward? How do NCCL and Horovod differ? [Tongyi]
13. What communication optimizations does Megatron-LM make? [CN] [Kuaishou]
14. How do you tell whether communication is fully hidden behind compute? [Added]
15. Roughly what bandwidth do NVLink, NVSwitch, InfiniBand and PCIe offer? How does topology shape the parallelism strategy? [Added]
16. What is SHARP? How does hierarchical all-reduce route? [Added]

**Reliability and RL**

17. How do you make large-scale training fault tolerant? How does asynchronous checkpointing work? How do you find a slow node? [Added]
18. What are the stages of RL training? Where is the bottleneck in the rollout phase? [CN]

## 9. Memory, compute and training-time estimation

These questions expect you to produce numbers on the spot.

1. ★ A 7B model trained with Adam in mixed precision: how much memory do parameters, gradients and optimizer states take? [Kuaishou] [Tencent]
2. ★ How do you estimate activation memory? How does it scale with sequence length, batch and hidden size? How much does recomputation save? [Added]
3. ★ How much memory does the KV cache take at inference time? How do GQA and MLA change that? [Added]
4. ★ Given a number of training tokens, how do you estimate training time? [CN]
5. ★ What's the difference between MFU and HFU? How is MFU computed, and which peak goes in the denominator? [Added]
6. Where do a transformer's parameters live? Which part has the most parameters, and which the most compute — and why? [CN]
7. How many FLOPs is one GEMM? How does attention compute scale with sequence length? [Added]
8. What is the arithmetic intensity of prefill vs decode? Why is decode memory-bound? [Added]
9. How does batch size affect convergence, generalization and throughput? [NV]
10. What memory capacity and bandwidth do common GPUs have? [CN]

## 10. Inference optimization

Inference questions are the most common in Chinese AI-infra interviews. Lower priority for training-focused roles, but TensorRT-LLM teams ask them too.

1. ★ How does the KV cache work? What are the common optimizations (prefix caching, compression, quantization, offloading)? [Kuaishou] [ByteDance]
2. ★ What is prefill/decode disaggregation? Multi-node PD disaggregation adds KV-cache transfer overhead — why do it anyway? [Meituan] [CN]
3. How is Mooncake's KV-cache-centric architecture designed? [CN]
4. ★ What problem does PagedAttention solve? [Baidu]
5. How do continuous batching and chunked prefill work? [Baidu]
6. How do inference engines use CUDA Graphs? [Baidu]
7. Which optimizations apply to the prefill phase, and which to decode? [CN]
8. What is two-batch overlap, and when does it backfire? [CN]
9. How does speculative decoding work? What affects the acceptance rate? [Added]
10. What communication problems does MoE inference have, and how do you solve them? [Meituan]
11. Which DeepSeek open-source-week projects (FlashMLA, DeepEP, DeepGEMM, …) do you know? [Meituan]
12. What is the core design of the vLLM or SGLang scheduler? [Added]
13. How do you route inference traffic across deployments? [Kuaishou]
14. How do DiT inference frameworks differ from LLM inference frameworks? [CN]
15. How do diffusion language models (dLLMs) differ from autoregressive models? [CN]

## 11. C++ and systems fundamentals

NVIDIA's China DevTech job descriptions explicitly require solid C++. The questions are basic — and that's exactly why missing them hurts.

**C++**

1. ★ How are polymorphism, virtual functions and vtables implemented? [NV]
2. Templates: specialization, SFINAE. Should template definitions go in headers or .cpp files, and why? [NV]
3. ★ RAII and smart pointers: how do you pass a `unique_ptr` to a function? Where is `shared_ptr` mainly used? What does `std::move` actually do? [NV]
4. How do `malloc` and `new` differ? What ways are there to manage memory in C++? [CN]
5. How do `vector` and `list` differ? How do you delete elements from a `vector` efficiently? [NV]
6. How do you compare two floats for equality? [CN]
7. Why isn't floating-point addition associative? What is catastrophic cancellation? What does Kahan summation solve? [NV] [Added]
8. Why do C++ projects need header files? [CN]
9. How are arguments passed in an x86 function call? [Alibaba]

**Systems and concurrency**

10. Which thread synchronization mechanisms do you know? Have you written a thread pool? [NV]
11. On a 16-core processor, every core frequently calls the same handler — how do you keep it from becoming a bottleneck? [NV]
12. What is copy-on-write? How is a computer system layered? [NV]
13. What's the difference between big- and little-endian? How do you implement a ring buffer? [NV]
14. What's the basic usage of OpenMP? [NV]
15. In Docker, how do images, containers and Dockerfiles relate? [NV]

## 12. HPC theory and open-ended design

NVIDIA interviewers often bring four or five prepared questions, many of them open-ended. A lesson from one 1point3acres write-up: **narrow the scope first, then pick a level of abstraction** (algorithm, system, or micro-optimization).

1. ★ What do Amdahl's law and Gustafson's law each say? How do you compute strong vs weak scaling, speedup and parallel efficiency? [NV]
2. How would you parallelize a compression algorithm based on hash-table matching? How do you trade off parameters like table size and match length? [NV]
3. How do you parallelize graph algorithms? How is the graph represented? Do atomics count as "truly parallel"? Can you drop synchronization? Are you optimizing throughput or latency? [NV]
4. You need the pairwise IoU of a large set of bounding boxes — how do you parallelize it, and what algorithmic improvements are possible? [NV]
5. How would you optimize the power method for eigenvalues? How should the mat-vec kernel be written? [Overseas]
6. How do you do parallel sorting (bitonic, radix)? [NV]
7. For a scatter-add by ID (histograms, embedding pooling), how do you trade off atomic contention vs privatization? [CN]
8. Design a distributed training system at the scale of ten thousand GPUs. How do you handle communication bottlenecks? [Tongyi]
9. Given hardware specs and a workload, estimate its runtime (performance modeling). [Overseas]
10. Puzzles: measure an exact amount of water with two containers; find the poisoned bottle with a few mice; river-crossing problems. [NV]

## 13. Hand-coding problems and follow-ups

27 problems. Interviews usually don't provide a runtime: write the kernel body, the grid/block configuration and the launch, then explain how you'd optimize further. Problems 1–12 of my core kernel list are linked to the [CUDA Kernel Handbook](/posts/learning/cuda-kernel-handbook/01-elementwise/) where a write-up exists.

| Problem | Source | Common follow-ups |
| --- | --- | --- |
| Vector add | [Baidu] | why the bounds check; why no shared memory; block = 256 vs warps |
| GeLU + bias and other fused activations | [Bank] | vectorized loads/stores; how much traffic fusion saves |
| 4-D elementwise multiply with broadcasting | [CN] | stride math under broadcasting; reducing index overhead |
| Reduce sum / max | [NV] [Baidu] | bottleneck of each version; warp shuffle; atomic vs second kernel for the final step |
| Find the single element that differs | [NV] | XOR reduction |
| Variance | [Meituan] | parallel Welford merge |
| All-reduce | [Baidu] [Alibaba] | ring steps and traffic |
| Matrix transpose | [ByteDance] [HPC] | coalescing both reads and writes; padding vs swizzle |
| Prefix sum (scan) | [CN] [HPC] | Hillis–Steele vs Blelloch; stitching across blocks |
| Softmax (row-wise or along K) | [Alibaba] [CN] | safe vs online; tiling when K is large |
| RMSNorm / LayerNorm | [CN] | backward derivation; FP16 overflow |
| Top-k / argmax | [Added] | warp-level top-k |
| int8 per-channel quantization | [Added] | computing and storing the scales |
| (1,256)×(256,128)×(128,256) chained matmul | [CN] | association order; it's really two GEMVs |
| GEMM: naive → tiled → register-blocked | [NV] [Kuaishou] [Meituan] [Xiaohongshu] | see section 5 |
| Tensor Core GEMM | [Alibaba] | WMMA vs MMA; `ldmatrix` layouts |
| FlashAttention forward in CUDA | [Kuaishou] | why Q is the outer loop; skipping blocks under a causal mask |
| Histogram / embedding pooling by ID | [CN] | atomic contention; privatization; sort then segmented reduce |
| GEMV / mat-vec | [Overseas] | does L2 already provide the reuse? fusing with a normalize |
| Vector outer product | [HPC] | write bandwidth is the bottleneck |
| FLOPS microbenchmark | [NV] | avoiding dead-code elimination; grid and iteration count; Tensor Cores |
| Odd columns `log`, even columns `cos` | [NV] | divergence vs coalescing |
| Image rotation | [NV] | 2-D indexing; borders; coalesced access |
| MLP forward + backward + SGD | [Tongyi] [Overseas] | deriving gradients by hand |
| MoE layer with every shape written out | [NV] | dispatch and combine |
| C++ memory pool supporting `new[]` / `delete[]` | [CN] | alignment; where the element count is stored |
| Recursively compute tensor strides in C++ | [NV] | non-contiguous tensors |

## Sources

Questions are paraphrased from the reports and collections below rather than copied. Questions tagged [Added] don't come from these links.

**NVIDIA**

- [1point3acres: GPU Performance Engineer job-search thread (2026-01, includes NVIDIA China/US new-grad roles)](https://www.1point3acres.com/bbs/thread-1161562-1-1.html)
- [1point3acres: NVIDIA China interview report (2025-12)](https://www.1point3acres.com/bbs/thread-1156693-1-1.html)
- [1point3acres: China interview reports tag (includes a 2026-01 Shanghai DevTech report)](https://www.1point3acres.com/bbs/tag/%E4%B8%AD%E5%9B%BD%E9%9D%A2%E7%BB%8F-22-1.html)
- [1point3acres: NVIDIA tag](https://www.1point3acres.com/bbs/tag/nvidia-518-1.html)
- [1point3acres: DevTech intern — three phone screens and two coding rounds (2019)](https://www.1point3acres.com/bbs/thread-592389-1-1.html)
- [1point3acres: NVIDIA DevTech intern interview (2022)](https://www.1point3acres.com/bbs/thread-933431-1-1.html)
- [1point3acres: NVIDIA DevTech AI intern interview (2024)](https://www.1point3acres.com/bbs/thread-1062465-1-1.html)
- [1point3acres: NVIDIA virtualization new-grad interview](https://www.1point3acres.com/bbs/thread-1107112-1-1.html)
- [Nowcoder: NVIDIA DevTech interview (2021)](https://www.nowcoder.com/discuss/521988)
- [Nowcoder: NVIDIA interview collection](https://www.nowcoder.com/enterprise/930/interview?pageSource=5011)
- [Glassdoor: NVIDIA Software Engineer](https://www.glassdoor.com/Interview/NVIDIA-Software-Engineer-Interview-Questions-EI_IE7633.0,6_KO7,24.htm)
- [Glassdoor: NVIDIA Austin](https://www.glassdoor.com/Interview/NVIDIA-Austin-Interview-Questions-EI_IE7633.0,6_IL.7,13_IM60.htm)
- [Glassdoor: NVIDIA Deep Learning Intern](https://www.glassdoor.com/Interview/NVIDIA-Deep-Learning-Intern-Interview-Questions-EI_IE7633.0,6_KO7,27.htm)

**AI infra in China**

- [Nowcoder: AI infra interview notes](https://www.nowcoder.com/feed/main/detail/d695614a06424c148c04586ac3a66e78)
- [Zhihu: AI infra fall-2026 recruiting interviews](https://zhuanlan.zhihu.com/p/2017740483217081305)
- [Zhihu: AI infra internship interviews (part 2)](https://zhuanlan.zhihu.com/p/1907536883430437857)
- [Zhihu: AI infra interview roundup](https://zhuanlan.zhihu.com/p/2023015325172507141)
- [Nowcoder: Baidu AI infra first-round recap](https://www.nowcoder.com/discuss/875003802187792384)
- [Nowcoder: spring 2025 internship interview roundup](https://www.nowcoder.com/discuss/736868736837173248)
- [Nowcoder: AI infra talent-pool interview summary](https://www.nowcoder.com/feed/main/detail/371046883e184a9386d9b44532e1a34f)
- [Nowcoder: CUDA interview notes](https://www.nowcoder.com/feed/main/detail/d8c2f7acc55745ea8caa24257d8da1c9)
- [Nowcoder: common questions for AI inference HPC roles (interviewer's view)](https://www.nowcoder.com/discuss/594197314479099904)
- [Nowcoder: AI inference HPC role interview](https://www.nowcoder.com/discuss/594109075609174016)
- [Nowcoder: HPC intern interview](https://www.nowcoder.com/discuss/353159129478930432)
- [cnblogs: AI infra interview collection (includes Tongyi)](https://www.cnblogs.com/xmwblogs/p/19669357)
- [Zhihu: AI infra interview Q&A — LLM inference](https://zhuanlan.zhihu.com/p/2031444649823449112)

**Overseas**

- [Anthropic: Designing AI-resistant technical evaluations](https://www.anthropic.com/engineering/AI-resistant-technical-evaluations)
- [GitHub: anthropics/original_performance_takehome](https://github.com/anthropics/original_performance_takehome)
- [1point3acres: Anthropic interview (includes a performance-modeling round)](https://www.1point3acres.com/bbs/thread-1141359-1-1.html)
- [1point3acres: Anthropic MLE phone screen (MLP by hand)](https://www.1point3acres.com/bbs/thread-1105916-1-1.html)
- [xAI: Member of Technical Staff, CUDA/GPU Kernel](https://job-boards.greenhouse.io/xai/jobs/4427873007)

**Question collections**

- [Zhihu: "If you were a CUDA interviewer, what would you ask?"](https://www.zhihu.com/question/10951382954/answer/90039867199)
- [Zhihu: AI infra engineer interview questions (305-question edition)](https://zhuanlan.zhihu.com/p/2013418984851129812)
- [GitHub: xiaoba17/ai-infra-interview-305](https://github.com/xiaoba17/ai-infra-interview-305)
- [GitHub: Tongkaio/CUDA_Kernel_Samples](https://github.com/Tongkaio/CUDA_Kernel_Samples)
- [GitHub: xlite-dev/LeetCUDA](https://github.com/xlite-dev/LeetCUDA)
- [GitHub: Imironman123/llm-interview-notes](https://github.com/Imironman123/llm-interview-notes)
