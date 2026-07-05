# 🧠 Neuron-IQ: Content Writer's Guidebook

Welcome to the Neuron-IQ Knowledge Database. This system uses a **"Docs-as-Code"** architecture. You do not need to use a database interface to add knowledge to the graph; you simply create a `.md` (Markdown) text file.

This guide explains the exact anatomy required for a file to be successfully parsed by the Plausibility Engine and rendered into the Neural Tree.

---

## 1. File Placement & Naming
*   **Location:** Every new concept must be saved inside the `/content` folder.
*   **Extension:** The file must end in `.md`.
*   **Naming:** Use lowercase letters and hyphens (e.g., `quantum-mechanics.md`, `linear-algebra.md`). 

---

## 2. The Anatomy of a Node

Every file is strictly divided into **two parts**:
1. The **Frontmatter** (The invisible metadata that plots it on the graph)
2. The **Tiered Content** (The actual text the user reads)

### Part 1: The Frontmatter
At the very top of your file, you must include a YAML metadata block enclosed by `---`. 

```yaml
---
name: Calculus
parent: Mathematics
category: Math
distance: 2
---
```

**Frontmatter Rules:**
*   **`name`**: The exact title of the concept. This is what displays on the graph dots and page headers.
*   **`parent`**: The `name` of the node that comes exactly before this one. **This must match the parent's spelling exactly.** If this is a top-level pillar (like Physics or Math), write `parent: Root`.
*   **`category`**: Used to color-code the graph. To trigger the built-in colors, use one of the following: `CS` (Yellow), `Math` (Red), `Physics` (Blue), or `Science` (Green).
*   **`distance`**: An integer representing how many steps away from the center this concept is. 
    *   Distance 1 = Core Pillars (Physics, Math)
    *   Distance 2 = Sub-fields (Calculus, Quantum Mechanics)
    *   Distance 3 = Specific Concepts (Derivatives, Superposition)

### Part 2: The Content Sections
Directly below the frontmatter, you will write your content. You can divide your content into any custom sections you like using `@Section Title` (e.g., `@Introduction`, `@Deep Dive`, `@Mathematical Proof`). 

**Section Rules:**
*   The `@` tags must be at the very start of a line.
*   The text following the `@` will automatically become both a section header and a link in the Table of Contents.

---

## 3. Formatting & Rich Text (Markdown)

Because Neuron-IQ uses a Markdown compiler, you can style your text beautifully without writing HTML code.

**Text Styles:**
*   `**bold text**` becomes **bold text**
*   `*italic text*` becomes *italic text*
*   `[Google](https://google.com)` creates a clickable link.

**Lists:**
```markdown
* First item
* Second item
  * Sub-item
```

**Blockquotes:**
```markdown
> "Imagination is more important than knowledge." - Albert Einstein
```

---

## 4. Writing Mathematics (KaTeX)

Neuron-IQ is equipped with a high-performance math rendering engine. You do not need images to display equations. 

**Inline Math:**
To put math inside a sentence, wrap it in single `$` signs.
*   *You type:* The Pythagorean theorem is `$a^2 + b^2 = c^2$`.
*   *Result:* The Pythagorean theorem is $a^2 + b^2 = c^2$.

**Block Equations:**
To center a large, complex equation on its own line, wrap it in double `$$` signs.
*   *You type:*
```latex
$$
i\hbar \frac{\partial}{\partial t} \Psi = \hat{H} \Psi
$$
```

---

## 5. The Perfect Template

Here is a complete, perfect example of a Neuron-IQ content file. Copy and paste this whenever you want to create a new concept:

```markdown
---
name: Quantum Entanglement
parent: Quantum Mechanics
category: Physics
distance: 3
---
@Introduction
Quantum entanglement is like a pair of magic dice. If you roll them, no matter how far apart they are—even on opposite sides of the universe—they will always land on the exact same number at the exact same time. It shows that particles can be invisibly connected.

Quantum entanglement is a physical phenomenon that occurs when a group of particles is generated, interact, or share spatial proximity in a way such that the quantum state of each particle cannot be described independently of the state of the others. 

Einstein famously referred to this as *"spooky action at a distance"*, because it appears to violate the speed of light limit for information transfer.

@Mathematical Proof
Mathematically, an entangled state is one that cannot be factored as a tensor product of the states of its local constituents. For a bipartite system consisting of subsystems $A$ and $B$, a state $|\psi\rangle$ is entangled if it cannot be written as:

$$
|\psi\rangle = |\phi\rangle_A \otimes |\chi\rangle_B
$$

Instead, it exists as a superposition, such as the Bell state:

$$
|\Phi^+\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)
$$
```

---
