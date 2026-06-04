---
name: Vectors and Scalars
parent: Mathematical Tools & Basics
category: Physics
distance: 3
---
@Beginner
In physics, some things can be described with just a single number, while others need a direction to make sense.

* **Scalars** are quantities that only have a size (magnitude). For example, if you say the temperature is $25^\circ\text{C}$ or your mass is $60\text{ kg}$, you have given all the necessary information. Time, speed, and energy are also scalars.
* **Vectors** are quantities that have both a size (magnitude) and a specific direction. If you tell someone to drive at $60\text{ km/h}$, that is a scalar (speed). But if you tell them to drive $60\text{ km/h}$ **North**, that is a vector (velocity). Force, acceleration, and displacement are other common vectors.

We usually draw vectors as arrows. The length of the arrow shows how big the quantity is, and the arrowhead points in its direction.

@Intermediate
To work with vectors mathematically, we often break them down into simpler parts or combine them.

#### Vector Resolution
Resolution is the process of splitting a single vector into two or more perpendicular components. If a vector $\vec{A}$ lies in a 2D plane at an angle $\theta$ relative to the horizontal x-axis, it can be resolved into horizontal ($A_x$) and vertical ($Y$-axis, $A_y$) components using basic trigonometry:

* $A_x = A \cos\theta$
* $A_y = A \sin\theta$

We can write the complete vector using unit vectors ($\hat{i}$ for the x-axis and $\hat{j}$ for the y-axis):

$$
\vec{A} = A_x\hat{i} + A_y\hat{j}
$$

The magnitude of the vector can be found using the Pythagorean theorem:

$$
A = |\vec{A}| = \sqrt{A_x^2 + A_y^2}
$$

#### Vector Addition
When adding vectors, you cannot simply add their magnitudes. Instead, you use the **Parallelogram Law** or the **Triangle Law**. If you place two vectors head-to-tail, the resultant vector $\vec{R} = \vec{A} + \vec{B}$ is the vector drawn from the tail of the first to the head of the second.

@Advanced
When multiplying two vectors, the outcome depends on whether the desired result is a scalar or another vector.

#### 1. The Dot Product (Scalar Product)
The dot product multiplies two vectors to yield a scalar. It measures how much one vector points in the direction of another.

$$
\vec{A} \cdot \vec{B} = AB \cos\theta
$$

Where $\theta$ is the angle between the two vectors. In component form, it is calculated as:

$$
\vec{A} \cdot \vec{B} = A_x B_x + A_y B_y + A_z B_z
$$

*Physical Example:* Work done ($W$) is the dot product of Force ($\vec{F}$) and Displacement ($\vec{d}$): $W = \vec{F} \cdot \vec{d}$.

#### 2. The Cross Product (Vector Product)
The cross product multiplies two vectors to yield a new vector that is perpendicular to both of the original vectors.

$$
\vec{A} \times \vec{B} = (AB \sin\theta) \hat{n}
$$

Where $\hat{n}$ is a unit vector perpendicular to the plane containing $\vec{A}$ and $\vec{B}$, determined by the **Right-Hand Rule**. The magnitude of the cross product equals the area of the parallelogram formed by the two vectors.

In Cartesian components, the cross product is calculated using a matrix determinant:

$$
\vec{A} \times \vec{B} = \det \begin{pmatrix} \hat{i} & \hat{j} & \hat{k} \\ A_x & A_y & A_z \\ B_x & B_y & B_z \end{pmatrix}
$$

Expanding the determinant yields:

$$
\vec{A} \times \vec{B} = (A_y B_z - A_z B_y)\hat{i} - (A_x B_z - A_z B_x)\hat{j} + (A_x B_y - A_y B_x)\hat{k}
$$

*Physical Example:* Torque ($\vec{\tau}$) is the cross product of the position vector ($\vec{r}$) and the applied force ($\vec{F}$): $\vec{\tau} = \vec{r} \times \vec{F}$.