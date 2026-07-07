---
name: Computer Science
parent: Root
category: CS
distance: 1
alias: [cs]
---

**Computer Science** is the systematic study of algorithmic processes, computational machines, and information processing. It is a vast discipline that spans from the abstract mathematical limits of what can be computed, to the practical engineering of massive, distributed software systems.

The foundation aims to transform students from basic programmers into system architects and thought-leaders. The curriculum is built upon several core pillars:
*   **Algorithms & Data Structures**
*   **Computer Systems & Architecture**
*   **Theory of Computation**
*   **Artificial Intelligence & Data Science**

@Algorithms and Data Structures
At the heart of computer science is the algorithm—a finite sequence of rigorous instructions used to solve a specific problem. Before a computer can execute a program, a computer scientist must design a data structure to organize the information efficiently.

Students study both linear (arrays, linked lists, stacks) and non-linear (trees, graphs, hash tables) data structures. A crucial aspect of this field is **Asymptotic Complexity**, which measures how the runtime or memory requirements of an algorithm scale with input size ($n$). 

For example, the classical *Merge Sort* algorithm divides a list into halves, sorts them, and merges them back together. Its time complexity is governed by the following recurrence relation, which solves to $O(n \log n)$:

$$
T(n) = 2T\left(\frac{n}{2}\right) + O(n)
$$

@Computer Systems and Architecture
Software cannot exist without the hardware that executes it. This domain explores the transition from high-level code down to microscopic electrical signals, covering the Von Neumann architecture, instruction set architectures (ISAs), and pipelining.

It also encompasses **Operating Systems and Networks**, where students learn how computers manage resources. Key topics include:
*   **Process Management & Scheduling:** How CPUs juggle thousands of tasks simultaneously.
*   **Virtual Memory:** Abstracting physical RAM to isolate and protect active programs.
*   **Network Protocols:** The layered communication models (like TCP/IP) that allow machines to reliably exchange data across the globe.

@Theory of Computation
Theoretical computer science explores the absolute mathematical boundaries of computation. It asks fundamental questions: *What can a computer actually do? Are there problems that can never be solved?*

This is formalized through **Automata Theory**, which categorizes languages and machines. It progresses from simple Finite State Machines to Context-Free Grammars, and ultimately to **Turing Machines**—the abstract mathematical model of any general-purpose computer.

Mathematically, a Deterministic Finite Automaton (DFA) is defined as a 5-tuple:

$$
M = (Q, \Sigma, \delta, q_0, F)
$$

Where $Q$ is a finite set of states, $\Sigma$ is the input alphabet, $\delta$ is the transition function, $q_0$ is the start state, and $F$ is the set of accept states.

@Artificial Intelligence and Data Science
Modern computer science is heavily driven by data. The curriculum integrates databases, data analytics, and machine learning to build systems capable of pattern recognition and predictive logic. 

Students explore supervised and unsupervised learning, decision trees, neural networks, and Bayesian inference. In decision tree learning, for example, algorithms must decide the best feature to split data. This is often calculated using **Shannon Entropy**, which measures the impurity or unpredictability of a dataset $S$:

$$
H(S) = - \sum_{i=1}^{c} p_i \log_2 p_i
$$

By combining data-driven algorithms with massive distributed computing power, computer science is rapidly evolving to simulate, augment, and enhance human intelligence.