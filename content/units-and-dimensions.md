---
name: Units and Dimensions
parent: Mathematical Tools & Basics
category: Physics
distance: 3
---
@Beginner
Imagine trying to follow a recipe that asks for "some" flour and "a bit" of sugar. Without precise measurements, your cake might not turn out very well. 

In physics, we face the same challenge. To understand the universe, we must measure it. A **unit** is a standard quantity used to express a measurement. For example, if you walk 5 meters, "meter" is the unit of length, and "5" is the numerical value. 

A **dimension** is the physical nature of a quantity. Whether you measure a distance in meters, miles, or inches, the underlying dimension is always the same: **Length**. 

@Intermediate
To keep science consistent worldwide, physicists use the **SI System** (Système International), which relies on seven fundamental base units:

1. **Length** - Meter ($m$)
2. **Mass** - Kilogram ($kg$)
3. **Time** - Second ($s$)
4. **Electric Current** - Ampere ($A$)
5. **Thermodynamic Temperature** - Kelvin ($K$)
6. **Amount of Substance** - Mole ($mol$)
7. **Luminous Intensity** - Candela ($cd$)

All other physical quantities are **derived quantities** created by multiplying or dividing these base units. For example, Speed is calculated as distance divided by time, so its unit is meters per second ($m/s$).

In dimensional analysis, we use square brackets to denote the dimensions of a physical quantity:
* Mass = $[M]$
* Length = $[L]$
* Time = $[T]$

The **Principle of Homogeneity** states that you can only add or subtract physical quantities if they have the same dimensions. You cannot add 5 kilograms to 3 meters; it simply does not make physical sense.

@Advanced
Mathematically, any derived physical quantity $Q$ can be expressed in terms of the fundamental dimensions as:

$$
[Q] = [M]^a [L]^b [T]^c [I]^d [\Theta]^e [N]^f [J]^g
$$

Where $a, b, c, d, e, f, g$ are integers or fractions called the **dimensions** of the quantity.

For example, the dimension of Force ($F = ma$) is derived from mass times acceleration:

$$
[F] = [M] \cdot [LT^{-2}] = [MLT^{-2}]
$$

#### Application: Deriving Formulas
We can use dimensional analysis to deduce relations between physical quantities. Let us find the formula for the time period $T$ of a simple pendulum, assuming it depends on the mass of the bob $m$, the length of the string $l$, and the acceleration due to gravity $g$.

We write the relationship as:

$$
T \propto m^a l^b g^c \implies T = k \cdot m^a l^b g^c
$$

Where $k$ is a dimensionless constant. Substituting the dimensions of each variable:

$$
[T] = [M]^a [L]^b [LT^{-2}]^c
$$

$$
[M^0 L^0 T^1] = [M]^a [L]^{b+c} [T]^{-2c}
$$

By equating the exponents of corresponding dimensions on both sides, we get a system of linear equations:
1. For $M$: $a = 0$
2. For $L$: $b + c = 0$
3. For $T$: $-2c = 1 \implies c = -1/2$

Solving these gives $b = 1/2$. Substituting these values back into the original equation:

$$
T = k \cdot m^0 l^{1/2} g^{-1/2} = k \sqrt{\frac{l}{g}}
$$

*Note: Dimensional analysis cannot determine the value of the constant $k$ (which experiments show is $2\pi$). This represents one of the primary limitations of the method.*