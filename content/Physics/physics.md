---
name: Physics
parent: Root
category: Physics
distance: 1
---

**Physics** is the fundamental science that studies matter, energy, and the fundamental forces of nature. Physics bridges the gap between abstract computational logic and the physical reality of the hardware it runs on. 

It is the foundational pillar for understanding modern electronics, semiconductor devices, and the emerging field of quantum computing. The coursework transitions students from classical paradigms into the realms of modern physics and computational science.

The core areas of physics explored in this curriculum include:
*   **Analytical Mechanics**
*   **Special Theory of Relativity**
*   **Quantum Mechanics & Statistical Physics**
*   **Computational Physics**

@Analytical Mechanics
While basic physics relies on Newtonian mechanics, advanced systems are often too complex to model using force vectors alone. The curriculum introduces students to **Lagrangian and Hamiltonian formulations**, which analyze physical systems using energy rather than forces.

In Lagrangian mechanics, the state of a system is described by the Lagrangian $L$ (the difference between kinetic and potential energy). The motion of the system is determined by the Euler-Lagrange equation:

$$
\frac{d}{dt} \left( \frac{\partial L}{\partial \dot{q}_i} \right) - \frac{\partial L}{\partial q_i} = 0
$$

This energy-based approach is deeply connected to optimization algorithms and is fundamentally used in modern robotics, control systems, and molecular dynamics simulations.

@Special Theory of Relativity
Students study Einstein's Special Theory of Relativity, exploring how the concepts of space and time are fundamentally intertwined. The curriculum covers the postulates of relativity, space-time graphs, length contraction, time dilation, and the Doppler effect.

A central mathematical element in relativity is the Lorentz factor, which dictates how time and space scale as an object approaches the speed of light $c$:

$$
\gamma = \frac{1}{\sqrt{1 - \frac{v^2}{c^2}}}
$$

This shows that as velocity $v$ approaches $c$, time slows down and mass effectively increases, culminating in the famous mass-energy equivalence principle.

@Quantum & Statistical Mechanics
To understand the hardware of a computer—specifically transistors, lasers, and semiconductors—one must understand the quantum nature of the universe. 

The curriculum dives into the Schrödinger equation, atomic structures, and molecular orbital hybridization. It couples this with **Statistical Mechanics**, which applies probability theory to massive systems of particles. A key concept here is the **Fermi-Dirac distribution**, which describes the probability that a given available electron energy state will be occupied at a given temperature $T$:

$$
f(E) = \frac{1}{e^{(E-\mu)/kT} + 1}
$$

This equation is the absolute foundation for understanding band-gaps in semiconductors, which dictate how all modern computer chips process binary information. Furthermore, this quantum foundation paves the way for advanced electives like Quantum Information and Computation, where bits are replaced by quantum superpositions (qubits).

@Computational Physics
Because physical equations often cannot be solved perfectly by hand, physics and computer science intersect through **Computational Physics**. 

The curriculum trains students to use algorithms to find numerical solutions to scientific problems. Key techniques include:
*   **Monte Carlo Methods:** Using algorithmic randomness to solve complex, high-dimensional integrals found in statistical and quantum mechanics.
*   **Matrix Algebra in Physics:** Using Singular-Value Decomposition (SVD) and Hessian matrices for normal mode analysis.
*   **Partial Differential Equations (PDEs):** Simulating real-world continuous systems like the Heat equation, which models the diffusion of heat over time:

$$
\frac{\partial u}{\partial t} = \alpha \nabla^2 u
$$

By combining the laws of physics with the algorithmic processing power of computer science, students are equipped to simulate entire universes, design microscopic nano-electronics, and explore deterministic chaos.