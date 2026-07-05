---
name: Linear Algebra
parent: Mathematics
category: Math
distance: 2
aliases: [Matrix Algebra, Vector Spaces]
---

**Linear Algebra** is the branch of mathematics concerning linear equations, linear maps, and their representations in vector spaces and through matrices. In modern Computer Science, it is arguably the most important mathematical prerequisite, serving as the computational engine behind Machine Learning, Artificial Intelligence, Computer Graphics, and Data Science.

From balancing simple systems of equations to compressing high-resolution images, linear algebra provides the theoretical framework and algorithmic tools to process massive, multi-dimensional datasets efficiently.

@Vector Spaces and Linear Transformations
The core of linear algebra moves beyond simple numbers into abstract spaces where mathematical objects can be added together and scaled. 
*   **Vector Spaces & Subspaces:** Understanding the foundations of linear dependence, span, basis, and finite dimension vector spaces.
*   **Linear Transformations:** Mapping one vector space to another while preserving its linear structure. This includes studying the Matrix Representation of a linear transformation, change of basis, and matrix operations.
*   **Inner Products:** Exploring spaces with inner products, orthogonality, and orthogonal functions (such as $L_2$ space).

A profound concept in this area is the **Rank-Nullity Theorem** (or Sylvester's Law), which relates the dimensions of the kernel (null space) and the image (range) of a linear transformation $T: V \to W$:

$$
\text{Rank}(T) + \text{Nullity}(T) = \dim(V)
$$

@Systems of Linear Equations
Solving multiple equations simultaneously is a fundamental computational problem. This domain focuses on algorithmic approaches to finding solution spaces.
*   **Matrix Reduction:** Using Gauss-Jordan elimination to transform matrices into row-echelon and reduced row-echelon forms.
*   **Matrix Inversion:** Finding the inverse of a matrix using elimination techniques.
*   **Solution Spaces:** Understanding the range space and solution space of a system using the Rank-Nullity Theorem.

The fundamental representation of a system of linear equations is:

$$
Ax = b
$$

Where $A$ is the coefficient matrix, $x$ is the vector of unknowns, and $b$ is the constant vector.

@Eigenvalues and Eigenvectors
When a linear transformation is applied to a vector, it typically changes the vector's direction and magnitude. However, for a given transformation, there are special vectors whose direction remains completely unchanged. 
*   **Eigenvectors and Eigenvalues:** These identify the fundamental axes of a transformation and how much they are stretched or compressed.
*   **Inner Products and Norms:** Measuring distances, lengths, and angles between vectors, enabling the mathematical concept of projections.

Eigen-analysis is heavily utilized in algorithm design, such as analyzing the steady-state probabilities of **Random Walks** or the PageRank algorithm used by search engines. The defining equation is:

$$
Ax = \lambda x
$$

Where $\lambda$ is the scalar eigenvalue corresponding to the eigenvector $x$.

@Advanced Matrix Decompositions
The highest level of applied linear algebra involves breaking complex matrices down into simpler, constituent parts to reveal the hidden structure of data.
*   **Spectral Decomposition:** Factoring a symmetric matrix into a canonical form.
*   **Singular Value Decomposition (SVD):** A generalization of eigen-decomposition applicable to any $m \times n$ matrix. 

SVD is one of the most powerful theorems in applied mathematics, forming the basis for **Principal Component Analysis (PCA)**, image compression, and best-fit subspaces (dimension reduction). It factors a matrix $A$ into three distinct transformations (rotation, scaling, and another rotation):

$$
A = U \Sigma V^T
$$

Where $U$ and $V$ are orthogonal matrices and $\Sigma$ is a diagonal matrix containing the singular values of $A$.