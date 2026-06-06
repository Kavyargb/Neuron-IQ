---
name: Linear Algebra
parent: Mathematics
category: Mathematics
distance: 2
alias: [matrix algebra, LA]
---
@Beginner
**Linear Algebra** is the branch of mathematics concerning linear equations, linear maps, and their representations in vector spaces and through matrices. 

If you've ever solved a system of equations with two variables (like $x + y = 5$ and $x - y = 1$), you were using the foundational concepts of linear algebra. In modern computing, Linear Algebra is the math that powers computer graphics (moving 3D shapes on a screen) and allows data to be structured efficiently.

At its core, it deals with two main mathematical objects:
* **Vectors:** Arrays of numbers that represent a point or direction in space.
* **Matrices:** Grids of numbers that can transform vectors (e.g., rotating or stretching them).

@Intermediate
In applied fields like Computer Science and Physics, Linear Algebra is indispensable. 

#### Vectors and Matrices
A vector $\mathbf{v}$ in a 3-dimensional space can be represented as a column matrix:

$$
\mathbf{v} = \begin{bmatrix} x \\ y \\ z \end{bmatrix}
$$

A matrix $\mathbf{A}$ is a rectangular array of numbers. When a matrix multiplies a vector, it applies a *linear transformation* to it. For example, a matrix can rotate a 2D vector by an angle $\theta$:

$$
\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} x\cos\theta - y\sin\theta \\ x\sin\theta + y\cos\theta \end{bmatrix}
$$

#### Systems of Linear Equations
Any system of linear equations can be elegantly written in the matrix form:
$$ \mathbf{A}\mathbf{x} = \mathbf{b} $$
Where $\mathbf{A}$ is the matrix of coefficients, $\mathbf{x}$ is the vector of unknowns, and $\mathbf{b}$ is the constant vector.

@Advanced
Advanced linear algebra focuses on the properties of vector spaces, eigenvalues, eigenvectors, and spectral theorems.

#### Eigenvalues and Eigenvectors
When a linear transformation (represented by a matrix $\mathbf{A}$) is applied to a vector space, most vectors change their direction. However, certain special vectors only change their scale (they are stretched or squished) but maintain their original span. These are called **Eigenvectors** ($\mathbf{v}$), and the factor by which they are scaled is the **Eigenvalue** ($\lambda$).

The fundamental equation is:
$$ \mathbf{A}\mathbf{v} = \lambda\mathbf{v} $$

To find the eigenvalues of a matrix $\mathbf{A}$, one solves the characteristic equation:
$$ \det(\mathbf{A} - \lambda\mathbf{I}) = 0 $$
where $\mathbf{I}$ is the identity matrix and $\det$ denotes the determinant. 

Eigenvalues and eigenvectors have immense applications, from Google's original PageRank algorithm (which modeled the internet as a giant matrix) to finding the principal axes of stress in mechanical engineering, and solving systems of differential equations in quantum mechanics.