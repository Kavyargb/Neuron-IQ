---
name: International System of Units
parent: Problem Solving and Estimations
category: Physics
distance: 4
alias: [SI, Système International, metric system, MKS]
---
The system of units most commonly used throughout science and technology today is the Système International (SI). It consists of seven base quantities and their corresponding base units, shown in Table

| Base Quantity       | Base Unit       |
| ------------------- | --------------- |
| Length              | meter ($m$)     |
| Mass                | kilogram ($kg$) |
| Time                | second ($s$)    |
| Electric Current    | ampere ($A$)    |
| Temperature         | kelvin ($K$)    |
| Amount of Substance | mole ($mol$)    |
| Luminous Intensity  | candela ($cd$)  |

We shall refer to the *dimension* of the base quantity by the quantity itself, for example

$$ \text{dim length } \equiv \text{ length } \equiv \text{L}, \text{ dim mass } \equiv \text{ mass } \equiv \text{M}, \text{ dim time } \equiv \text{ time } \equiv \text{T}. $$

Mechanics is based on just the first three of these quantities, the MKS or meter- kilogram-second system. An alternative metric system, still widely used, is the CGS system (centimeter-gram-second).

@Standard Mass

The unit of mass, the kilogram (kg), remains the only base unit in the International System of Units (SI) that is still defined in terms of a physical artifact, known as the “International Prototype of the Standard Kilogram.” George Matthey (of Johnson Matthey) made the prototype in $1879$ in the form of a cylinder, $39 \text{ mm}$ high and $39 \text{ mm}$ in diameter, consisting of an alloy of $90 \text{ \%}$ platinum and $10 \text{ \%}$ iridium. The international prototype is kept in the Bureau International des Poids et Mèsures (BIPM) at Sevres, France, under conditions specified by the 1st Conférence Générale des Poids et Mèsures (CGPM) in $1889$ when it sanctioned the prototype and declared “This prototype shall henceforth be considered to be the unit of mass.” It is stored at atmospheric pressure in a specially designed triple bell-jar. The prototype is kept in a vault with six official copies.

The 3rd Conférence Générale des Poids et Mèsures CGPM ($1901$), in a declaration intended to end the ambiguity in popular usage concerning the word “weight” confirmed that:

> *The kilogram is the unit of mass; it is equal to the mass of the international prototype of the kilogram.*

There is a stainless steel one-kilogram standard that is used for comparisons with standard masses in other laboratories. In practice it is more common to quote a conventional mass value (or weight-in-air, as measured with the effect of buoyancy), than the standard mass. Standard mass is normally only used in specialized measurements wherever suitable copies of the prototype are stored.

> **Example 2.2.1: The International Prototype Kilogram**
> 
> In order to minimize the effects of corrosion, the platinum-iridium prototype kilogram is a right cylinder with dimensions chosen to minimize the surface area for a given fixed volume. The standard kilogram is an alloy of $90 \text{ \%}$ platinum and $10 \text{ \%}$ iridium. The density of the alloy is $\rho = 21.56 \text{g} \cdot \text{cm}^{-3}$. Based on this information,
> 
> i. determine the radius of the prototype kilogram, and
> ii. the ratio of the radius to the height.
> 
> **Solution**
> 
> The volume for a cylinder of radius r and height h is given by
> 
> $$ V = \pi r^2h \nonumber $$
> 
> The surface area can be expressed as a function of the radius $\text{r}$ and the constant volume $\text{V}$ according to
> 
> $$ A = 2\pi r^2 + 2\pi rh = 2\pi r^2 + \frac{2V}{r} \nonumber $$
> 
> To find the smallest surface area for a fixed volume, minimize the surface area with respect to the radius by setting
> 
> $$ 0 = \frac{dA}{dr} = 4\pi r - \frac{2V}{r^2} \nonumber $$
> 
> which we can solve for the radius
> 
> $$ r = \left( \frac{V}{2\pi} \right)^{1/3} \nonumber $$
> 
> Because we also know that $V = \pi r^2h$, we can rewrite Equation (2.2.5) as
> 
> $$ r^3 = \frac{\pi r^2h}{2\pi} \nonumber $$
> 
> which implies that ratio of the radius to the height is
> 
> $$ \frac{r}{h} = \frac{1}{2} \nonumber $$
> 
> The standard kilogram is an alloy of $90\text{\%}$ platinum and $10\text{\%}$ iridium. The density of platinum is $21.45 \text{g} \cdot \text{cm}^{-3}$ and the density of iridium is $22.55 \text{g} \cdot \text{cm}^{-3}$. Thus the density of the standard kilogram is
> 
> $$ \rho = (0.90) \left(21.45 \text{g} \cdot \text{cm}^{-3}\right) + (0.10) \left(22.55 \text{g} \cdot \text{cm}^{-3}\right) = 21.56 \text{g} \cdot \text{cm}^{-3} \nonumber $$
> 
> and its volume is
> 
> $$ V = m/\rho = (1000 \text{g}) / \left(21.56 \text{g} \cdot \text{cm}^{-3}\right) = 46.38 \text{cm}^3 \nonumber $$
> 
> For the standard mass, the radius is
> 
> $$ r = \left( \frac{V}{2\pi} \right)^{1/3} = \left( \frac{46.38 \text{cm}^3}{2\pi} \right)^{1/3} \cong 1.95 \text{cm} \nonumber $$

Because the prototype kilogram is an artifact, there are some intrinsic problems associated with its use as a standard. It may be damaged, or destroyed. The prototype gains atoms due to environment wear and cleaning, at a rate of change of mass corresponding to approximately $1\mu\text{g/ year}$ , ($1 \mu\text{g} \equiv 1\text{ microgram } \equiv 1 \times 10^{-6} \text{g}$).

Several new approaches to defining the SI unit of mass $\text{kg}$ are currently being explored. One possibility is to define the kilogram as a fixed number of atoms of a particular substance, thus relating the kilogram to an atomic mass. Silicon is a good candidate for this approach because it can be grown as a large single crystal, in a very pure form.

> **Example 2.2.2: Mass of a Silicon Crystal**
> 
> A given standard unit cell of silicon has a volume $V_0$ and contains $N_0$ atoms. The number of molecules in a given mole of substance is given by Avogadro’s constant $N_A = 6.02214129(27) \times 10^{23}\text{mol}^{-1}$. The molar mass of silicon is given by $M_{mol}$. Find the mass $m$ of a volume $V$ in terms of $V_0$, $N_0$, $V$, $M_{mol}$, and $N_A$.
> 
> **Solution**
> 
> The mass $m_0$ of the unit cell is the density $rho$ of the silicon cell multiplied by the volume of the cell $V_0$,
> 
> $$ m_0 = \rho V_0 \nonumber $$
> 
> The number of moles in the unit cell is the total mass, $m_0$, of the cell, divided by the molar mass $M_{mol}$
> 
> $$ n_0 = m_0/M_{mol} = \rho V_0 / M_{mol} \nonumber $$
> 
> The number of atoms in the unit cell is the number of moles times the Avogadro constant, $N_A$,
> 
> $$ N_0 = n_0N_A = \frac{\rho V_0N_A}{M_{mol}} \nonumber $$
> 
> The density of the crystal is related to the mass $m$ of the crystal divided by the volume $V$ of the crystal,
> 
> $$ \rho = \frac{m}{V} \nonumber $$
> 
> The number of atoms in the unit cell can be expressed as
> 
> $$ N_0 = \frac{mV_0N_A}{VM_{mol}} \nonumber $$
> 
> The mass of the crystal is
> 
> $$ m = \frac{M_{mol}}{N_A}\frac{V}{V_0}N_0 \nonumber $$

The molar mass, unit cell volume and volume of the crystal can all be measured directly. Notice that $M_{mol}/N_A$ is the mass of a single atom, and $(V/V_0)N_0$ is the number of atoms in the volume. This accuracy of the approach depends on how accurate the Avogadro constant can be measured. Currently, the measurement of the Avogadro constant has a relative uncertainty of $1$ part in $10^8$, which is equivalent to the uncertainty in the present definition of the kilogram.

@Atomic Clock and the Definition of the Second

Isaac Newton, in the Philosophiae Naturalis Principia Mathematica (“Mathematical Principles of Natural Philosophy”), distinguished between time as duration and an absolute concept of time,

> *“Absolute true and mathematical time, of itself and from its own nature, flows equably without relation to anything external, and by another name is called duration: relative, apparent, and common time, is some sensible and external (whether accurate or unequable) measure of duration by means of motion, which is commonly used instead of true time; such as an hour, a day, a month, a year. ”*

The development of clocks based on atomic oscillations allowed measures of timing with accuracy on the order of $1$ part in $10^{14}$, corresponding to errors of less than one microsecond (one millionth of a second) per year. Given the incredible accuracy of this measurement, and clear evidence that the best available timekeepers were atomic in nature, the second $\text{s}$ was redefined in $1967$ by the International Committee on Weights and Measures as a certain number of cycles of electromagnetic radiation emitted by cesium atoms as they make transitions between two designated quantum states:

> *The second is the duration of 9,192,631,770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the cesium 133 atom.*

@Meter

The meter $\text{m}$ was originally defined as $1/10,000,000$ of the arc from the Equator to the North Pole along the meridian passing through Paris. To aid in calibration and ease of comparison, the meter was redefined in terms of a length scale etched into a platinum bar preserved near Paris. Once laser light was engineered, the meter was redefined by the 17th Conférence Générale des Poids et Mèsures (CGPM) in $1983$ to be a certain number of wavelengths of a particular monochromatic laser beam.

> *The meter is the length of the path traveled by light in vacuum during a time interval of 1/299 792 458 of a second*

> **Example 2.2.1: Light-Year**
> 
> Astronomical distances are sometimes described in terms of light-years $\text{ly}$. A light-year is the distance that light will travel in one year $\text{yr}$. How far in meters does light travel in one year?
> 
> **Solution**
> 
> Using the relationship $(\text{ distance }) = (\text{ speed of light }) \cdot (\text{ time })$, one light year corresponds to a distance. Because the speed of light is given in terms of meters per second, we need to know how many seconds are in a year. We can accomplish this by converting units. We know that
> 
> $$ 1 \text{ year } = 365.25 \text{ days}, 1 \text{ day } = 24 \text{ hours}, 1 \text{ hour } = 60 \text{ minutes}, 1 \text{ minute } = 60 \text{ seconds} \nonumber $$
> 
> Putting this together we find that the number of seconds in a year is
> 
> $$ 1 \text{ year } = (365.25 \text{ day }) \left( \frac{24 \text{ hours }}{1 \text{ day }} \right) \left( \frac{60 \text{ min }}{1 \text{ hour }} \right) \left( \frac{60\text{s}}{1 \text{ min }} \right) = 31,557,600 \text{ s} \nonumber $$
> 
> The distance that light travels in a one year is
> 
> $$ 1\text{ly} = \left( \frac{299,792,458\text{m}}{1\text{s}} \right) \left( \frac{31,557,600\text{s}}{1\text{yr}} \right) (1\text{yr}) = 9.461 \times 10^{15}\text{m} \nonumber $$
> 
> The distance to the nearest star, a faint red dwarf star, Proxima Centauri, is $4.24 \text{ ly}$.

### Radians

Consider the triangle drawn in Figure 2.2.1. The basic trigonometric functions of an angle $\theta$ in a right-angled triangle ONB are $\sin(\theta) = y/r$, $\cos(\theta) = x/r$, and $\tan(\theta) = y/x$.
![](https://phys.libretexts.org/@api/deki/files/20894/Figure_2.1.svg?revision=1&size=bestfit&width=450&height=314)
Figure 2.2.1: Trigonometric relations. (CC BY-NC; Ümit Kaya)

It is very important to become familiar with using the measure of the angle $\theta$ itself as expressed in radians $\text{rad}$. Let $\theta$ be the angle between two straight lines $OX$ and $OP$. Draw a circle of radius $r$ centered at $O$. The lines $OP$ and $OX$ cut the circle at the points $A$ and $B$ where $OA = OB = r$. Denote the length of the arc $AB$ by $s$, then the radian measure of $\theta$ is given by

$$ \theta = s/r \nonumber $$

and the ratio is the same for circles of any radii centered at $O$ -- just as the ratios $y/r$ and $y/x$ are the same for all right triangles with the angle $\theta$ at $O$. As $\theta$ approaches $360^{\circ}$, $s$ approaches the complete circumference $2\pi r$ of the circle, so that $360^{\circ} = 2\pi \text{ rad}$.
![](https://phys.libretexts.org/@api/deki/files/20895/Figure_2.2.svg?revision=1&size=bestfit&width=432&height=298)
Figure 2.2: Radians compared to trigonometric functions. (CC BY-NC; Ümit Kaya)

Let’s compare the behavior of $\sin(\theta)$,$\tan(\theta)$ and $\theta$ itself for small angles. One can see from Figure 2.1 that $s/r > y/r$. It is less obvious that $y/x > \theta$. It is very instructive to plot $\sin(\theta)$, $\tan(\theta)$, and $theta$ as functions of $\theta$ [$\text{rad}$] between $0$ and $\pi/2$ on the same graph (see Figure 2.2). For small $\theta$, the values of all three functions are almost equal. But how small is “small”? An acceptable condition is for $\theta << 1$ in radians.

We can show this with a few examples. Recall that $360^{\circ} = 2\pi \text{ rad}$, $57.3^{\circ} = 1 \text{ rad}$ , so an angle $6^{\circ} \cong (6^{\circ})(2\pi \text{ rad} /360^{\circ}) \cong 0.1 \text{ rad}$ when expressed in radians. In Table 2.2.2 we compare the value of $\theta$ (measured in radians) with $\sin(\theta)$,$\tan(\theta)$, $(\theta - \sin\theta)/\theta$, and $(\theta - \tan\theta)/\theta$, for $\theta = 0.1 \text{ rad}$, $0.2 \text{ rad}$, $0.5 \text{ rad}$ , and $1.0 \text{ rad}$.

| $\theta \text{ [rad]}$ | $\theta \text{ [deg]}$ | $\sin(\theta)$ | $\tan(\theta)$ | $(\theta - \sin\theta)/\theta$ | $(\theta - \tan\theta)/\theta$ |
| ---------------------- | ---------------------- | -------------- | -------------- | ------------------------------ | ------------------------------ |
| $0.1$                  | $5.72958$              | $0.09983$      | $0.10033$      | $0.00167$                      | $-0.00335$                     |
| $0.2$                  | $11.45916$             | $0.19867$      | $0.20271$      | $0.00665$                      | $-0.01355$                     |
| $0.5$                  | $28.64789$             | $0.47943$      | $0.54630$      | $0.54630$                      | $-0.09260$                     |
| $1.0$                  | $57.29578$             | $0.84147$      | $1.55741$      | $0.15853$                      | $-0.55741$                     |

The values for $(\theta - \sin\theta)/\theta$, and $(\theta - \tan\theta)/\theta$, for $\theta = 0.2 \text{ rad}$ are less than $\pm 1.4\text{\%}$. Provided that $\theta$ is not too large, the approximation that

$$ \sin(\theta) \simeq \tan(\theta) \simeq \theta \nonumber $$

called the *small angle approximation*, can be used almost interchangeably, within some small percentage error. This is the basis of many useful approximations in physics calculations.

> **Example 2.4: Parsec**
> 
> A standard astronomical unit is the **parsec**. Consider two objects that are separated by a distance of one astronomical unit, $1\text{AU} = 1.50 \times 10^{11} \text{ m}$, which is the mean distance between the earth and sun. (One astronomical unit is roughly equivalent to eight light minutes, $1\text{AU} = 8.3\text{light-minutes}$ ). One parsec is the distance at which one astronomical unit subtends an angle $\theta = 1 \text{ arcsecond } = (1/3600) \text{ degree}$. Suppose is a spacecraft is located in a space a distance $1 \text{ parsec}$ from the Sun as shown in Figure 2.2.3. How far is the spacecraft in terms of light years and meters?
> ![](https://phys.libretexts.org/@api/deki/files/20896/Figure_2.3.svg?revision=1&size=bestfit&width=820&height=330)
> Figure 2.2.3: Definition of the parsec (CC BY-NC; Ümit Kaya)
> 
> **Solution**
> 
> Because one arc second corresponds to a very small angle, one parsec is therefore equal to distance divided by angle, hence
> 
> $$ 1\text{pc} = \frac{(1\text{AU})}{(1/3600)} = (2.06 \times 10^5\text{AU}) \left( \frac{1.50 \times 10^{11}\text{m}}{1\text{AU}} \right) = 3.09 \times 10^{16}\text{m} \nonumber $$
> 
> $$ = (3.09 \times 10^{16}\text{m}) \left( \frac{1\text{ly}}{9.46 \times 10^{15}\text{m}} \right) = 3.26 \text{ ly} \nonumber $$

### Steradians

The *steradian* $\text{sr}$ is the unit of solid angle that, having its vertex in the center of a sphere, cuts off an area of the surface of the sphere equal to that of a square with sides of length equal to the radius of the sphere. The conventional symbol for steradian measure is $\Omega$, the uppercase Greek letter “Omega.” The total solid angle $\Omega_{\text{sph}}$ of a sphere is then found by dividing the surface area of the sphere by the square of the radius,

$$ \Omega_{\text{sph}} = 4\pi r^2/r^2 = 4\pi \nonumber $$

This result is independent of the radius of the sphere.

### Radiant Intensity

> *“The SI unit, candela, is the luminous intensity of a source that emits monochromatic radiation of frequency $540 \times 10^{12}\text{s}^{-1}$, in a given direction, and that has a radiant intensity in that direction of $1/683 \text{ watts per steradian.}$”*

Note that "in a given direction" cannot be taken too literally. The intensity is measured per steradian of spread, so if the radiation has no spread of directions, the luminous intensity would be infinite.