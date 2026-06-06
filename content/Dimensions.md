---
name: Dimensions
parent: Problem Solving and Estimations
category: Physics
distance: 4
alias: [dimensions, dimensionality, dimensional analysis, dimensional formulas]
---
Many physical quantities are derived from the base quantities by a set of algebraic relations defining the physical relation between these quantities. The dimension of the derived quantity is written as a power of the dimensions of the base quantities. For example velocity is a derived quantity and the dimension is given by the relationship

$$ \text{dim velocity } = (\text{ length })/(\text{ time }) = L \cdot T^{-1} $$

where $L \equiv \text{ length }, T \equiv \text{ time }$. Force is also a derived quantity and has dimension

$$ \text{dim force} = \frac{(\text{ mass })(\text{ dim velocity })}{(\text{ time })} $$

where $M \equiv mass$. We can also express force in terms of mass, length, and time by the relationship

$$ \text{dim force } = \frac{(\text{ mass })(\text{ length })}{(\text{ time })^{2}} = M \cdot L \cdot T^{-2} $$

The derived dimension of kinetic energy is

$$ \text{dim kinetic energy} = (\text{ mass })(\text{dim velocity })^{2}, $$

which in terms of mass, length, and time is

$$ \text{dim kinetic energy } = \frac{(\text{ mass })(\text{ length })^{2}}{(\text{ time })^{2}} = M \cdot L^{2} \cdot T^{-2} $$

The derived dimension of work is

$$ \text{dim work} = (\text{ dim force })(\text{ length }), $$

which in terms of our fundamental dimensions is

$$ \text{dim work} = \frac{(\text{ mass })(\text{ length })^{2}}{(\text{ time })^{2}} = M \cdot L^{2} \cdot T^{-2} $$

So work and kinetic energy have the same dimensions. Power is defined to be the rate of change in time of work so the dimensions are

$$ \text{dim power } = \frac{\text{ dim work }}{\text{ time }} = \frac{\text{ (dim force) (length) }}{\text{ time }} = \frac{(\text{ mass })(\text{ length })^{2}}{(\text{ time })^{3}} = M \cdot L^{2} \cdot \mathrm{T}^{-3} $$

In Table 2.3 we include the derived dimensions of some common mechanical quantities in terms of mass, length, and time.

@Dimensional Analysis

There are many phenomena in nature that can be explained by simple relationships between the observed phenomena.

Table 2.3 Dimensions of Some Common Mechanical Quantities $M \equiv \text{ mass }, L \equiv \text{ length}, \mathrm{T} \equiv \text{ time}$

| Quantity | Dimension | MKS unit |
| :--- | :--- | :--- |
| Angle | dimensionless | Dimensionless = radian |
| Solid Angle | dimensionless | Dimensionless = sterradian |
| Area | $L^{2}$ | $m^{2}$ |
| Volume | $L^{3}$ | $m^{3}$ |
| Frequency | $T^{-1}$ | $\mathrm{s}^{-1} = \text{hertz} = \mathrm{Hz}$ |
| Velocity | $L \cdot T^{-1}$ | $\mathrm{m} \cdot \mathrm{s}^{-1}$ |
| Acceleration | $L \cdot T^{-2}$ | $\mathrm{m} \cdot \mathrm{s}^{-2}$ |
| Angular Velocity | $T^{-1}$ | $\mathrm{rad} \cdot \mathrm{s}^{-1}$ |
| Angular Acceleration | $T^{-2}$ | $\mathrm{rad} \cdot \mathrm{s}^{-2}$ |
| Density | $M \cdot L^{-3}$ | $\mathrm{kg} \cdot \mathrm{m}^{-3}$ |
| Momentum | $M \cdot L \cdot T^{-1}$ | $\mathrm{kg} \cdot \mathrm{m} \cdot \mathrm{s}^{-1}$ |
| Angular Momentum | $M \cdot L^{2} \cdot T^{-1}$ | $\mathrm{kg} \cdot \mathrm{m}^{2} \cdot \mathrm{s}^{-1}$ |
| Force | $M \cdot L \cdot T^{-2}$ | $\mathrm{kg} \cdot \mathrm{m} \cdot \mathrm{s}^{-2} = \text{newton } = \mathrm{N}$ |
| Work, Energy | $M \cdot L^{2} \cdot T^{-2}$ | $\mathrm{kg} \cdot \mathrm{m}^{2} \cdot \mathrm{s}^{-2} = \text{joule} = \mathrm{J}$ |
| Torque | $M \cdot L^{2} \cdot T^{-2}$ | $\mathrm{kg} \cdot \mathrm{m}^{2} \cdot \mathrm{s}^{-2}$ |
| Power | $M \cdot L^{2} \cdot T^{-3}$ | $\mathrm{kg} \cdot \mathrm{m}^{2} \cdot \mathrm{s}^{-3} = \text{watt} = \mathrm{W}$ |
| Pressure | $M \cdot L^{-1} \cdot T^{-2}$ | $\mathrm{kg} \cdot \mathrm{m}^{-1} \cdot \mathrm{s}^{-2} = \text{pascal} = \mathrm{Pa}$ |

> Example 2.5 Period of a Pendulum
>
> Consider a simple pendulum consisting of a massive bob suspended from a fixed point by a string. Let $T$ denote the time interval (period of the pendulum) that it takes the bob to complete one cycle of oscillation. How does the period of the simple pendulum depend on the quantities that define the pendulum and the quantities that determine the motion?
>
> **Solution**
>
> What possible quantities are involved? The length of the pendulum $l$, the mass of the pendulum bob $m$, the gravitational acceleration $g$, and the angular amplitude of the bob $\theta_{0}$ are all possible quantities that may enter into a relationship for the period of the swing. Have we included every possible quantity? We can never be sure but let’s first work with this set and if we need more than we will have to think harder! Our problem is then to find a function $f$ such that
>
> $$ T = f\left(l, m, g, \theta_{0}\right) $$
>
> We first make a list of the dimensions of our quantities as this:
>
> | Name of Quantity | Symbol | Dimensional Formula |
> | :--- | :---: | :---: |
> | Time of swing | $t$ | $\mathrm{T}$ |
> | Length of pendulum | $l$ | $\mathrm{L}$ |
> | Mass of pendulum | $m$ | $\mathrm{M}$ |
> | Gravitational acceleration | $g$ | $L \cdot T^{-2}$ |
> | Angular amplitude of swing | $\theta_{0}$ | No dimension |
>
> Our first observation is that the mass of the bob cannot enter into our relationship, as our final quantity has no dimensions of mass and no other quantity has dimensions of mass. Let’s focus on the length of the string and the gravitational acceleration. In order to eliminate length, these quantities must divide each other when appearing in some functional relation for the period $T$ If we choose the combination $l / g$, the dimensions are
>
> $$ \operatorname{dim}[l / g] = \frac{\text{ length }}{\text{ length } /(\text{ time })^{2}} = (\text{ time })^{2} $$
>
> It appears that the time of swing may proportional to the square root of this ratio. Thus we have a candidate formula
>
> $$ T \sim\left(\frac{l}{g}\right)^{1 / 2} $$
>
> in the above expression, the symbol “$\sim$” represents a proportionality, not an approximation). Because the angular amplitude $\theta_{0}$ is dimensionless, it may or may not appear. We can account for this by introducing some function $y\left(\theta_{0}\right)$ into our relationship, which is beyond the limits of this type of analysis. The period is then
>
> $$ T = y\left(\theta_{0}\right)\left(\frac{l}{g}\right)^{1 / 2} $$
>
> We shall discover later on that $y\left(\theta_{0}\right)$ is nearly independent of the angular amplitude $\theta_{0}$ for very small amplitudes and is equal to $y\left(\theta_{0}\right) = 2 \pi$,
>
> $$ T = 2 \pi\left(\frac{l}{g}\right)^{1 / 2} $$
