# Neuron-IQ Styling & Design System Guide

Welcome to the Neuron-IQ Design System. This document is a comprehensive guide to the **themes, design language, templates, and CSS architecture** that power the application. 

Whether you are a seasoned engineer or someone who just finished a 30-minute "Learn CSS" tutorial on YouTube, this README is built to be deeply educational. It will teach you both *what* the styling themes are, and *how* they are built using Vanilla CSS.

---

## 1. The Core Theme: "The Dark Void"

Neuron-IQ is designed to feel like you are exploring a vast, glowing neural network in deep space. We call this primary aesthetic **The Dark Void**.

### The Color Palette
Instead of stark black (`#000000`), we use a deep, rich midnight blue. This reduces eye strain and provides a premium feel.

```css
:root {
    /* Backgrounds */
    --bg-void: #030712;       /* The deep space background */
    
    /* Text Hierarchy */
    --text-primary: #f8fafc;  /* Bright slate for headers */
    --text-muted: #8b9bb4;    /* Dimmed blue-gray for secondary text */
    
    /* Interactive Accents */
    --accent: #60a5fa;        /* A glowing neon blue for links and active states */
}
```

### The Background Grid Template
If you look closely at the homepage or articles, the background isn't a flat color. It has a subtle, glowing grid. We achieve this without loading any heavy images; it is pure CSS math using multiple gradients layered on top of each other.

```css
body {
    background-image: 
        /* 1. A soft glowing blue orb at the top center */
        radial-gradient(80% 40% at 50% 0%, rgba(96, 165, 250, 0.08) 0%, transparent 100%),
        /* 2. Vertical grid lines */
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        /* 3. Horizontal grid lines */
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    
    /* The grid lines are spaced exactly 40px apart */
    background-size: 100% 100%, 40px 40px, 40px 40px;
}
```

---

## 2. Category Color Psychology

Neuron-IQ groups knowledge into disciplines. To help users instantly recognize what field of study a concept belongs to, we use a strict color-coding system. 

```css
:root {
    --color-cs: #fcd34d;      /* Yellow: Logic, structure, Computer Science */
    --color-math: #fb7185;    /* Rose Pink: Abstract, foundational Mathematics */
    --color-physics: #60a5fa; /* Neon Blue: The physical universe, Physics */
    --color-root: #ffffff;    /* Pure White: The center of the brain */
}
```
**How it is applied:** When the JavaScript draws the D3 graph, or when a search result appears, these CSS variables are injected directly into the SVG borders, text colors, and glowing drop-shadows. If we ever want to change Physics to green, changing `--color-physics` updates the entire app globally.

---

## 3. Typography System

Neuron-IQ uses exactly two fonts, pulled from Google Fonts, to establish a modern, academic, yet cyberpunk feel.

1. **Inter (`sans-serif`)**: Used for 95% of the application. It is highly legible, perfect for long-form reading, and scales beautifully on mobile devices.
2. **JetBrains Mono (`monospace`)**: Used exclusively for `<code>` blocks and technical readouts.

```css
* { 
    font-family: 'Inter', sans-serif; 
}

.content-tier code { 
    font-family: 'JetBrains Mono', monospace; 
}
```

---

## 4. The Glassmorphism Template (Reusable Components)

To make UI elements (like search bars, sidebars, and hover cards) stand out against the Dark Void without blocking the glowing grid behind them, we use a design trend called **Glassmorphism**.

To ensure every card looks perfectly consistent, we created a reusable "template" class called `.glass-panel`.

```css
.glass-panel {
    /* 1. A semi-transparent dark blue base */
    background: rgba(15, 23, 42, 0.65); 
    
    /* 2. The blur effect that frosts the background grid */
    backdrop-filter: blur(24px); 
    
    /* 3. A 1px faint white border to catch the light on the edge of the glass */
    border: 1px solid rgba(255, 255, 255, 0.08); 
    
    /* 4. A shadow to lift the glass off the page */
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); 
}
```
**The Lesson:** Never repeat complex styling. By assigning `<div class="glass-panel">` in the HTML, we apply this complex layered aesthetic instantly to any component in the app.

---

## 5. Animation Themes & Transitions

Motion is a core theme of Neuron-IQ. Elements don't just appear; they fade, slide, and morph. This makes the static site feel like a dynamic application.

### The Search Bar Morph
On the homepage, the search bar starts as a massive 550px wide input field. When you hit Enter, it literally transforms into the center node of the graph.

```css
/* The initial state */
#search-bar {
    width: 550px; 
    border-radius: 60px;
    transition: 0.4s ease; /* Tells the browser to smoothly animate ANY changes */
}

/* The transformed state (applied via JS class swap) */
#search-bar.node-zero {
    width: 14px; 
    height: 14px; 
    border-radius: 50%; /* Makes it a perfect circle */
    background: var(--color-root); 
    box-shadow: 0 0 40px var(--color-root); /* Adds a massive white glow */
}
```
Because of the `transition: 0.4s ease`, the browser automatically calculates the frames to shrink the rectangle into a glowing circle.

### Cinematic Focus (Advanced CSS)
When you hover over a glowing node in the graph, we want to create a "Cinematic Focus"—the node you hover gets bigger, and the rest of the universe dims into the background.

We achieve this using the cutting-edge **`:has()`** CSS selector. It acts like an "If Statement" for styling.

```css
/* Translation: IF the graph container HAS a node being hovered, 
   take all the lines (.path-line) and dim them to 8% opacity. */
#graph-container:has(.node:hover) .path-line { 
    opacity: 0.08 !important; 
}

/* BUT keep the specific node we are hovering fully bright, and scale it up 1.6x */
#graph-container .node:hover { 
    opacity: 1 !important; 
    transform: scale(1.6); 
}
```

### The Native App Feel (View Transitions)
When navigating from the homepage to an article, the page doesn't blink white and reload. The old page shrinks away, and the new page fades in. 

We use the native **View Transitions API** to define these themes:

```css
::view-transition-old(root) {
    /* The screenshot of the old page fading out and shrinking */
    animation: 200ms both fade-out, 200ms both scale-down;
}

::view-transition-new(root) {
    /* The screenshot of the new page fading in and scaling up */
    animation: 300ms both fade-in, 300ms both scale-up;
}
```

---

## 6. Layout Systems: Flexbox

The reading experience (articles) utilizes strict layout systems to ensure readability across all devices. We use **CSS Flexbox** to manage the relationship between the article and the Table of Contents sidebar.

```css
.layout-grid { 
    display: flex; 
    gap: 100px; /* Massive spacing to let the text breathe */
}

.main-content { 
    flex: 1; /* Take up all remaining space */
    min-width: 0; /* CRITICAL FIX: Prevents long math equations from breaking the page width */
} 
```

### Responsive Mobile Stacking
When a user views an article on a phone, a two-column layout is impossible. We use a **Media Query** to change the layout rules instantly based on screen size.

```css
@media (max-width: 900px) {
    .layout-grid { 
        flex-direction: column; /* Stack the sidebar and article vertically */
    }
    
    .sidebar { 
        order: -1; /* Visually moves the sidebar to the VERY TOP of the screen */
    }
}
```
By using `order: -1`, the Table of Contents is presented to the mobile user immediately, without us having to write complex JavaScript to move HTML elements around.

---

## Summary

Neuron-IQ's design system proves that you do not need heavy CSS frameworks to build world-class user interfaces. By mastering **CSS Variables**, **Flexbox layouts**, **Glassmorphism**, and modern selectors like **`:has()`**, we have created an immersive, highly interactive application that is lightweight, incredibly fast, and easy to maintain.
