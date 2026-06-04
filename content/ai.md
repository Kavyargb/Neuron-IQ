---
name: Artificial Intelligence
parent: Computer Science
category: Computer Science
distance: 2
---
@Beginner
**Artificial Intelligence (AI)** is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions), and self-correction.

At its core, AI seeks to answer the fundamental question: *Can a machine think?* 

There are generally two broad categories of AI:
* **Narrow AI (Weak AI):** AI systems designed and trained for a specific task. Virtual assistants like Apple's Siri and Amazon's Alexa, as well as image recognition systems, fall into this category. They are exceptional at their single task but possess no general intelligence.
* **General AI (Strong AI):** Systems with generalized human cognitive abilities. When presented with an unfamiliar task, a strong AI system can find a solution without human intervention. This remains largely theoretical today.

@Intermediate
To achieve artificial intelligence, researchers use various sub-disciplines, the most prominent being **Machine Learning (ML)** and **Deep Learning**.

#### Machine Learning
Instead of explicitly programming a computer with rules to solve a problem, Machine Learning involves feeding large amounts of data to an algorithm and allowing it to "learn" the rules itself. 
For example, instead of writing an algorithm to identify a cat by looking for "pointy ears" and "whiskers", we provide the algorithm with millions of labeled images of cats and not-cats. The algorithm statistically determines the identifying features on its own.

#### Neural Networks
Inspired by the human brain, Artificial Neural Networks (ANNs) are the backbone of Deep Learning. They consist of layers of interconnected nodes (artificial neurons). 
* **Input Layer:** Receives the initial data.
* **Hidden Layers:** Performs computations and extracts features. The more hidden layers, the "deeper" the network.
* **Output Layer:** Delivers the final prediction or classification.

The simplest form of an artificial neuron is the [Perceptrons](./perceptrons.html), which forms the basis for understanding these complex networks.

@Advanced
The mathematical foundation of deep neural networks relies heavily on **Linear Algebra** and **Calculus** (specifically, the chain rule).

#### The Mathematics of Learning
During the training process, the neural network adjusts the *weights* and *biases* of its connections to minimize a **Loss Function** (or Cost Function), $\mathcal{L}$, which measures the difference between the network's predicted output and the actual target value.

This optimization is typically achieved using **Gradient Descent**. The algorithm computes the gradient of the loss function with respect to the network's weights, $\nabla \mathcal{L}(\mathbf{W})$, and updates the weights in the opposite direction of the gradient:

$$
\mathbf{W}_{new} = \mathbf{W}_{old} - \eta \nabla \mathcal{L}(\mathbf{W}_{old})
$$

Where $\eta$ is the **learning rate**, a hyperparameter that controls the step size during optimization.

#### Backpropagation
To compute the gradient $\nabla \mathcal{L}(\mathbf{W})$ efficiently in deep networks, we use the **Backpropagation** algorithm. It applies the chain rule from calculus to compute the partial derivative of the loss function with respect to each weight, starting from the output layer and propagating backward to the input layer.

$$
\frac{\partial \mathcal{L}}{\partial w_{ij}} = \frac{\partial \mathcal{L}}{\partial a_j} \cdot \frac{\partial a_j}{\partial z_j} \cdot \frac{\partial z_j}{\partial w_{ij}}
$$

This recursive application of the chain rule allows the network to learn intricate, high-dimensional, non-linear relationships in massive datasets.