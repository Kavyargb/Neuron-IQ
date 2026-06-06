---
name: Perceptrons
parent: Computer Science (CS)
category: Computer Science
distance: 3
aliases: [perceptron]
---
@Beginner
A **Perceptron** is the simplest form of an artificial neural network. Think of it as a tiny digital brain cell. It takes in multiple pieces of information, weighs their importance, and makes a simple "yes or no" decision.

Imagine you are deciding whether to go outside. You take in inputs:
1. Is it raining?
2. Is it cold?
3. Do you have an umbrella?

You assign a "weight" (importance) to each of these factors. The perceptron calculates a total score based on these inputs and weights. If the score crosses a certain threshold, the perceptron outputs a "Yes" (go outside). Otherwise, it outputs a "No".

@Intermediate
In machine learning, the perceptron is a linear algorithm for binary classification. Invented in 1958 by Frank Rosenblatt, it represents a mathematical model of a biological neuron.

A perceptron consists of:
* **Inputs ($x_1, x_2, \dots, x_n$):** The features of the data.
* **Weights ($w_1, w_2, \dots, w_n$):** Parameters learned by the algorithm that signify the importance of each input.
* **Bias ($b$):** A constant shift applied to the sum, allowing the activation threshold to be adjusted.
* **Activation Function:** A step function that squashes the output into a binary result (0 or 1, or -1 and 1).

The perceptron computes the dot product of the inputs and weights, adds the bias, and applies the step function $f$:

$$
y = f\left(\sum_{i=1}^{n} w_i x_i + b\right)
$$

If the sum is greater than 0, $y=1$; otherwise $y=0$.

@Advanced
The perceptron is a **linear classifier**. Geometrically, it draws a straight line (or a hyperplane in higher dimensions) to separate two classes of data. 

#### The Perceptron Learning Rule
The perceptron updates its weight vector $\mathbf{w}$ via gradient descent. For a given training example $(\mathbf{x}_i, y_i)$, where $y_i \in \{0, 1\}$ is the true label and $\hat{y}_i$ is the predicted label, the weights are updated as follows:

$$
\mathbf{w} \leftarrow \mathbf{w} + \alpha (y_i - \hat{y}_i) \mathbf{x}_i
$$
where $\alpha$ is the learning rate. 

#### The XOR Problem
The perceptron is guaranteed to converge *only if* the dataset is **linearly separable**. If you cannot draw a single straight line to separate the classes, the perceptron learning algorithm will never stop oscillating.

This limitation was famously highlighted by Minsky and Papert in 1969 when they proved a single perceptron could not learn the logical XOR (Exclusive OR) function, leading to the "AI Winter". This limitation is overcome by stacking multiple perceptrons into a **Multi-Layer Perceptron (MLP)**, which can approximate any continuous mathematical function using non-linear activation functions and backpropagation.