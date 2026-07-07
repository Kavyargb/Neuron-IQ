---
name: Mathematics
parent: Root
category: Mathematics
distance: 1
alias:
  - Math
---
**Mathematics** is the abstract science of number, quantity, and space. It provides the fundamental logical frameworks, analytical tools, and theoretical rigor required to design algorithms, model complex systems, and develop artificial intelligence.

Mathematics foundation is structured to build both discrete logic and continuous analysis skills. Rather than just calculating numbers, students learn to construct rigorous proofs and mathematical models. The core mathematical pillars include:
*   **Discrete Structures**
*   **Linear Algebra**
*   **Real Analysis**
*   **Probability and Statistics**

@Discrete Structures
Unlike continuous mathematics, discrete structures deal with distinct, separated values. This is the natural language of computer science, underpinning data structures, cryptography, and algorithm design.

Key areas of study include:
*   **Propositional Logic & Proof Techniques:** Methods like mathematical induction and contradiction.
*   **Combinatorics:** Counting principles, permutations, combinations, and the pigeonhole principle.
*   **Algebraic Structures:** Group theory, rings, and finite fields, which are directly applied in coding theory and modern information security.
*   **Graph Theory:** The study of paths, cycles, and networks. 

A foundational combinatorics concept is the binomial coefficient, which determines the number of ways to choose $k$ items from $n$ items:

$$
\binom{n}{k} = \frac{n!}{k!(n-k)!}
$$

@Linear Algebra
Linear algebra is the study of vector spaces and linear mappings between these spaces. It is computationally vital for machine learning, image compression, optimization, and computer graphics. 

The core concepts span from solving systems of linear equations to abstract transformations:
*   **Vector Spaces & Subspaces:** Understanding dimensions, basis, span, and the Rank-Nullity Theorem.
*   **Eigenvalues and Eigenvectors:** Fundamental for understanding network structures, random walks, and principal component analysis (PCA).
*   **Matrix Decompositions:** Techniques like Spectral Decomposition and Singular Value Decomposition (SVD).

The fundamental eigenvalue equation, where applying a matrix $A$ to a vector $x$ simply scales it by a factor $\lambda$, is written as:

$$
A x = \lambda x
$$

@Real Analysis
Real Analysis provides the rigorous theoretical foundation for calculus and continuous functions. It explains *why* the rules of calculus work by diving deep into the properties of real numbers, sequences, and series.

In advanced engineering, this transitions into Complex Analysis and Vector Calculus. Topics include:
*   **Sequences and Series:** Convergence, limits, supremum, infimum, and Cauchy sequences.
*   **Vector Calculus:** Gradients, curl, divergence, and partial differential equations (PDEs).
*   **Complex Variables:** Analytic functions, poles, and essential singularities.

A beautiful result from complex analysis taught in this curriculum is **Cauchy's Integral Formula**, which shows that the value of an analytic function inside a disk is completely determined by its values on the boundary:

$$
f(a) = \frac{1}{2\pi i} \oint_C \frac{f(z)}{z-a} dz
$$

@Probability and Statistics
In a world driven by data, probability and statistics provide the mathematical rules for uncertainty, machine learning, and algorithmic analysis.

This area systematically defines chance and inference through:
*   **Random Variables:** Discrete (Binomial, Poisson) and Continuous (Normal, Exponential, Cauchy) distributions.
*   **Random Processes:** Markov chains and Poisson processes.
*   **Statistical Inference:** Point and interval estimation, hypothesis testing, and Bayesian inference.

One of the most important concepts in probability is the **Normal Distribution** (Gaussian), governed by its mean $\mu$ and standard deviation $\sigma$. Its probability density function is represented as:

$$
f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$