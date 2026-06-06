---
name: Fermi Problems
parent: Problem Solving and Estimations
category: Physics
distance: 4
alias: [estimation problems, estimation, fermi estimations]
---
Counting is the first mathematical skill we learn. We came to use this skill by distinguishing elements into groups of similar objects, but counting becomes problematic when our desired objects are not easily identified, or there are too many to count. Rather than spending a huge amount of effort to attempt an exact count, we can try to estimate the number of objects. For example, we can try to estimate the total number of grains of sand contained in a bucket of sand. Because we can see individual grains of sand, we expect the number to be very large but finite. Sometimes we can try to estimate a number, which we are fairly sure but not certain is finite, such as the number of particles in the universe.

We can also assign numbers to quantities that carry dimensions, such as mass, length, time, or charge, which may be difficult to measure exactly. We may be interested in estimating the mass of the air inside a room, or the length of telephone wire in the United States, or the amount of time that we have slept in our lives. We choose some set of units, such as kilograms, miles, hours, and coulombs, and then we can attempt to estimate the number with respect to our standard quantity.

Often we are interested in estimating quantities such as speed, force, energy, or power. We may want to estimate our natural walking speed, or the force of wind acting against a bicycle rider, or the total energy consumption of a country, or the electrical power necessary to operate a university. All of these quantities have no exact, well-defined value; they instead lie within some range of values.

When we make these types of estimates, we should be satisfied if our estimate is reasonably close to the middle of the range of possible values. But what does “reasonably close” mean? Once again, this depends on what quantities we are estimating. If we are describing a quantity that has a very large number associated with it, then an estimate within an order of magnitude should be satisfactory. The number of molecules in a breath of air is close to $10^{22}$; an estimate anywhere between $10^{21}$ and $10^{23}$ molecules is close enough. If we are trying to win a contest by estimating the number of marbles in a glass container, we cannot be so imprecise; we must hope that our estimate is within $1 \%$ of the real quantity. These types of estimations are called *Fermi problems*. The technique is named after the physicist Enrico Fermi, who was famous for making these sorts of “back of the envelope” calculations.

### Methodology for Estimation Problems

Estimating is a skill that improves with practice. Here are two guiding principles that may help you get started.

1.  You must identify a set of quantities that can be estimated or calculated.
2.  You must establish an approximate or exact relationship between these quantities and the quantity to be estimated in the problem.

Estimations may be characterized by a precise relationship between an estimated quantity and the quantity of interest in the problem. When we estimate, we are drawing upon what we know. But different people are more familiar with certain things than others. If you are basing your estimate on a fact that you already know, the accuracy of your estimate will depend on the accuracy of your previous knowledge. When there is no precise relationship between estimated quantities and the quantity to be estimated in the problem, then the accuracy of the result will depend on the type of relationships you decide upon. There are often many approaches to an estimation problem leading to a reasonably accurate estimate. So use your creativity and imagination!

> Example 2.6: Lining Up Pennies
>
> Suppose you want to line pennies up, diameter to diameter until the total length is 1 kilometer. How many pennies will you need? How accurate is this estimation?
>
> **Solution**
>
> The first step is to consider what type of quantity is being estimated. In this example, we are estimating a dimensionless scalar quantity, the number of pennies. We can now give a precise relationship for the number of pennies needed to mark off 1 kilometer
>
> $$ \# \text{ of pennies } = \frac{\text{ total distance }}{\text{ diameter of penny }} $$
>
> We can estimate a penny to be approximately 2 centimeters wide. Therefore the number of pennies is
>
> $$ \begin{aligned} \# \text{ of pennies } & = \frac{\text{ total distance }}{\text{ length of a penny }} \\ & = \frac{(1 \mathrm{km})}{(2 \mathrm{cm})\left(1 \mathrm{km} / 10^{5} \mathrm{cm}\right)} \\ & = 50,000 \text{ pennies } \\ & = 5 \times 10^{4} \text{ pennies. } \end{aligned} $$
>
> When applying numbers to relationships we must be careful to convert units whenever necessary. How accurate is this estimation? If you measure the size of a penny, you will find out that the width is $1.9 \mathrm{cm}$, so our estimate was accurate to within $5 \%$. This accuracy was fortuitous. Suppose we estimated the length of a penny to be $1 \mathrm{cm}$. Then our estimate for the total number of pennies would be within a factor of 2, a margin of error we can live with for this type of problem.

> Example 2.7: Estimation of Mass of Water on Earth
>
> Estimate the mass of the water on the Earth.
>
> **Solution**
>
> In this example we are estimating mass, a quantity that is a fundamental in SI units, and is measured in $\mathrm{kg}$. We start by approximating that the amount of water on Earth is approximately equal to the amount of water in all the oceans. Initially we will try to estimate two quantities: the density of water and the volume of water contained in the oceans. Then the relationship we want is
>
> $$ \text{mass } = (\text{ density })(\text{ volume }) $$
>
> One of the hardest aspects of estimation problems is to decide which relationship applies. One way to check your work is to check dimensions. Density has dimensions of mass/volume, so our relationship is correct dimensionally.
>
> The density of fresh water is $\rho = 1.0 \mathrm{g} \cdot \mathrm{cm}^{-3}$; the density of seawater is slightly higher, but the difference won’t matter for this estimate. You could estimate this density by estimating how much mass is contained in a one-liter bottle of water. (The density of water is a point of reference for all density problems. Suppose we need to estimate the density of iron. If we compare iron to water, we might estimate that iron is 5 to 10 times denser than water. The actual density of iron is $\left.\rho_{\text{iron}} = 7.8 \mathrm{g} \cdot \mathrm{cm}^{-3}\right)$.
>
> Because there is no precise relationship, estimating the volume of water in the oceans is much harder. Let’s model the volume occupied by the oceans as if the water completely covers the earth, forming a spherical shell of radius $R_{E}$ and thickness $d$ (Figure $\PageIndex{1}$, which is decidedly not to scale), where $R_{E}$ is the radius of the earth and $d$ is the average depth of the ocean. The volume of that spherical shell is
>
> $$ \text{volume } \cong 4 \pi R_{\text{earth}}^{2} d $$
> ![](https://phys.libretexts.org/@api/deki/files/21012/Figure_2.4.svg?revision=1&size=bestfit&width=268&height=267)
>
> Figure 1: Volume of a spherical shell with a fixed radius. (CC BY-NC; Ümit Kaya)
>
> We also estimate that the oceans cover about $75 \%$ of the surface of the earth. So we can refine our estimate that the volume of the oceans is
>
> $$ \text{volume } \cong(0.75)\left(4 \pi R_{E}^{2} d\right) $$
>
> We therefore have two more quantities to estimate, the average depth of the ocean, which we can estimate as $d \cong 1 \mathrm{km}$, and the radius of the earth, which is approximately $R \cong 6 \times 10^{3} \mathrm{km}$. (The quantity that you may remember is the circumference of the earth, E about 25,000 miles. Historically the circumference of the earth was defined to be $4 \times 10^{7} \mathrm{m}$). The radius $R_{E}$ and the circumference $s$ are exactly related by
>
> $$ s = 2 \pi R $$
>
> Thus
>
> $$ \begin{aligned} R_{E} & = \frac{s}{2 \pi} \\ & = \frac{\left(2.5 \times 10^{4} \mathrm{mi}\right)\left(1.6 \mathrm{km} \cdot \mathrm{mi}^{-1}\right)}{2 \pi} \\ & = 6.4 \times 10^{3} \mathrm{km} \end{aligned} $$
>
> We will use $R_{E} \cong 6 \times 10^{3} \mathrm{km}$; additional accuracy is not necessary for this problem, since the ocean depth estimate is clearly less accurate. In fact, the factor of $75 \%$ is not needed, but included more or less from habit. Altogether, our estimate for the mass of the oceans is
>
> $$ \begin{aligned} \text{mass } & = (\text{ density })(\text{ volume }) \\ & \cong \rho(0.75)\left(4 \pi R_{E}^{2} d\right) \\ & \cong\left(\frac{1 \mathrm{g}}{\mathrm{cm}^{3}}\right)\left(\frac{1 \mathrm{kg}}{10^{3} \mathrm{g}}\right)\left(\frac{\left(10^{5} \mathrm{cm}\right)^{3}}{(1 \mathrm{km})^{3}}\right)(0.75)(4 \pi)\left(6 \times 10^{3} \mathrm{km}\right)^{2}(1 \mathrm{km}) \\ & \cong 3 \times 10^{20} \mathrm{kg} \cong 10^{20} \mathrm{kg} \end{aligned} $$