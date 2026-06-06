---
name: Real Numbers and their Operations
parent: Elementary Algebra
category: Mathematics
distance: 4
alias: [Real Numbers]
---
@REAL NUMBERS

A **set** is a collection of objects, typically grouped within braces $\{ \}$, where each object is called an **element**. For example, $\{\text{red}, \text{green}, \text{blue}\}$ is a set of colors. A **subset** is a set consisting of elements that belong to a given set. For example, $\{\text{green}, \text{blue}\}$ is a subset of the color set above. A set with no elements is called the **empty set** and has its own special notation, $\{ \}$ or $\varnothing$.

When studying mathematics, we focus on special sets of numbers. The set of **natural (or counting) numbers**, denoted $\mathbf{N}$, is

$$ \{1, 2, 3, 4, 5, \dots\} \quad \text{\color{blue}Natural Numbers} $$

The three periods ($\dots$) is called an ellipsis and indicates that the numbers continue without bound. The set of **whole numbers**, denoted $\mathbf{W}$, is the set of natural numbers combined with zero.

$$ \{0, 1, 2, 3, 4, 5, \dots\} \quad \text{\color{blue}Whole Numbers} $$

The set of **integers**, denoted $\mathbb{Z}$, consists of both positive and negative whole numbers, as well as zero.

$$ \{\dots, -3, -2, -1, 0, 1, 2, 3, \dots\} \quad \text{\color{blue}Integers} $$

Notice that the sets of natural and whole numbers are both subsets of the set of integers.

**Rational numbers**, denoted $\mathbb{Q}$, are defined as any number of the form $\frac{a}{b}$, where $a$ and $b$ are integers and $b$ is nonzero. Decimals that repeat or terminate are rational. For example,

$$ 0.7 = \frac{7}{10} \quad \text{and} \quad 0.\overline{3} = 0.3333\dots = \frac{1}{3} $$

The set of integers is a subset of the set of rational numbers because every integer can be expressed as a ratio of the integer and $1$. In other words, any integer can be written over $1$ and can be considered a rational number. For example,

$$ 5 = \frac{5}{1} $$

**Irrational numbers** are defined as any number that cannot be written as a ratio of two integers. Nonterminating decimals that do not repeat are irrational. For example,

$$ \pi = 3.14159\dots \quad \text{and} \quad \sqrt{2} = 1.41421\dots $$

The set of **real numbers**, denoted $\mathbb{R}$, is defined as the set of all rational numbers combined with the set of all irrational numbers. Therefore, all the numbers defined so far are subsets of the set of real numbers. In summary,

**Real Numbers**
*   **Rational**: $\frac{5}{3}$, $0.63$, $0.0\overline{12}$
    *   **Integers**: $\{\dots, -2, -1, 0, 1, 2, \dots\}$
        *   **Whole**: $\{0, 1, 2, 3, \dots\}$
            *   **Natural**: $\{1, 2, 3, \dots\}$
*   **Irrational**: $\sqrt{3}$, $\pi$, $0.10010001\dots$

@Ordering Real Numbers

When comparing real numbers on a number line, the larger number will always lie to the right of the smaller one. It is clear that $15$ is greater than $5$, but it may not be so clear to see that $-1$ is greater than $-5$ until we graph each number on a number line.

We use symbols to help us efficiently communicate relationships between numbers on the number line. The symbols used to describe an **equality relationship** between numbers follow:

$=$ *is equal to*
$\neq$ *is not equal to*
$\approx$ *is approximately equal to*

These symbols are used and interpreted in the following manner:

$5 = 5$ \quad *5 is equal to 5*
$0 \neq 5$ \quad *0 is not equal to 5*
$\pi \approx 3.14$ \quad *pi is approximately equal to 3.14*

We next define symbols that denote an **order relationship** between real numbers.

$<$ *Less than*
$>$ *Greater than*
$\leq$ *Less than or equal to*
$\geq$ *Greater than or equal to*

These symbols allow us to compare two numbers. For example,

Since the graph of $-120$ is to the left of the graph of $-10$ on the number line, that number is less than $-10$. We could write an equivalent statement as follows:

$$ -120 < -10 $$

Similarly, since the graph of zero is to the right of the graph of any negative number on the number line, zero is greater than any negative number.

$$ 0 > -120 $$

The symbols $<$ and $>$ are used to denote **strict inequalities**, and the symbols $\leq$ and $\geq$ are used to denote **inclusive inequalities**. In some situations, more than one symbol can be correctly applied. For example, the following two statements are both true:

$$ -10 < 0 \quad \text{and} \quad -10 \leq 0 $$

In addition, the “or equal to” component of an inclusive inequality allows us to correctly write the following:

$$ -10 \leq -10 $$

The logical use of the word “or” requires that only one of the conditions need be true: the “less than” or the “equal to.”

> **EXAMPLE 1.1.2**
> 
> Fill in the blank with $<, =, \text{or} >$: $-2$ \_\_\_\_ $-12$.
> 
> **Solution**
> Use $>$ because the graph of $-2$ is to the right of the graph of $-12$ on a number line. Therefore, $-2 > -12$, which reads “negative two is greater than negative twelve.”
> 
> Figure 1.1.8
> 
> **Answer:**
> $-2 > -12$

In this text, we will often point out the equivalent notation used to express mathematical quantities electronically using the standard symbols available on a keyboard. We begin with the equivalent textual notation for inequalities:

$\geq$ `">="`
$\leq$ `"<="`
$\neq$ `"!="`

Many calculators, computer algebra systems, and programming languages use this notation.

@Opposites

The **opposite** of any real number $a$ is $-a$. Opposite real numbers are the same distance from the origin on a number line, but their graphs lie on opposite sides of the origin and the numbers have opposite signs.

For example, we say that the opposite of $10$ is $-10$.

Next, consider the opposite of a negative number. Given the integer $-7$, the integer the same distance from the origin and with the opposite sign is $+7$, or just $7$.

Therefore, we say that the opposite of $-7$ is $-(-7) = 7$. This idea leads to what is often referred to as the **double-negative property**. For any real number $a$,

$$ -(-a) = a $$

> **EXAMPLE 1.1.3**
> 
> What is the opposite of $-\frac{3}{4}$?
> 
> **Solution**
> Here we apply the double-negative property.
> $$ -(-\frac{3}{4}) = \frac{3}{4} $$

> **EXAMPLE 1.1.4**
> 
> Simplify $-(-(-4))$
> 
> **Solution**
> Start with the innermost parentheses by finding the opposite of $+4$.
> $$ -(-(-4)) = -(-(-4)) $$
> $$ \quad \quad = -(-4) $$
> $$ \quad \quad = 4 $$
> 
> **Answer**
> $4$

> **EXAMPLE 1.1.5**
> 
> Simplify: $-(-(-(-2)))$.
> 
> **Solution**
> Apply the double-negative property starting with the innermost parentheses.
> $$ -(-(-(-2))) = -(-(-(-2))) $$
> $$ \quad \quad \quad = -(-(2)) $$
> $$ \quad \quad \quad = -2 $$
> 
> **Answer**
> $-2$

> **TIP**
> If there is an even number of consecutive negative signs, then the result is positive. If there is an odd number of consecutive negative signs, then the result is negative.

**Try this!**

> **EXERCISE 1.1.1**
> 
> Simplify: $-(-(-(-(-5))))$.
> 
> **Answer**
> $-5$
> 
> **Procedure:**
> $$ -(-(-(-(-5)))) = -(-(-(-(-5)))) $$
> $$ \quad \quad \quad \quad = -(-(-(-5))) $$
> $$ \quad \quad \quad \quad = -(-(5)) $$
> $$ \quad \quad \quad \quad = -5 $$

@ABSOLUTE VALUE

The **absolute value** of a real number $a$, denoted $|a|$, is defined as the distance between zero (the origin) and the graph of that real number on the number line. Since it is a distance, it is always positive. For example,

$$ |-4| = 4 \quad \text{and} \quad |4| = 4 $$

Both $4$ and $-4$ are four units from the origin, as illustrated below:

Figure 1.1.11

> **EXAMPLE 1.1.6**
> 
> Simplify:
> a. $|-12|$
> b. $|12|$
> 
> **Solution**
> Both $-12$ and $12$ are twelve units from the origin on a number line. Therefore,
> $$ |-12| = 12 \quad \text{and} \quad |12| = 12 $$
> 
> **Answer**
> a. $12$ b. $12$

Also, it is worth noting that
$$ |0| = 0 $$

The absolute value can be expressed textually using the notation $\text{abs}(a)$. We often encounter negative absolute values, such as $-|3|$ or $-\text{abs}(3)$. Notice that the negative sign is in front of the absolute value symbol. In this case, work the absolute value first and then find the opposite of the result.

Try not to confuse this with the double-negative property, which states that $-(-7) = +7$.

> **EXAMPLE 1.1.7**
> 
> Simplify: $-|-(-7)|$.
> 
> **Solution**
> First, find the opposite of $-7$ inside the absolute value. Then find the opposite of the result.
> $$ -|-(-7)| = -|7| $$
> $$ \quad \quad \quad = -7 $$
> 
> **Answer**
> $-7$

At this point, we can determine what real numbers have a particular absolute value. For example,

$$ |?| = 5 $$

Think of a real number whose distance to the origin is $5$ units. There are two solutions: the distance to the right of the origin and the distance to the left of the origin, namely, $\{\pm 5\}$. The symbol ($\pm$) is read “plus or minus” and indicates that there are two answers, one positive and one negative.

Now consider the following:

$$ |?| = -5 $$

Here we wish to find a value for which the distance to the origin is negative. Since negative distance is not defined, this equation has no solution. If an equation has no solution, we say the solution is the empty set: $\varnothing$.

@KEY TAKEAWAYS

*   Any real number can be associated with a point on a line.
*   Create a number line by first identifying the origin and marking off a scale appropriate for the given problem.
*   Negative numbers lie to the left of the origin and positive numbers lie to the right.
*   Smaller numbers always lie to the left of larger numbers on the number line.
*   The opposite of a positive number is negative and the opposite of a negative number is positive.
*   The absolute value of any real number is always positive because it is defined to be the distance from zero (the origin) on a number line.
*   The absolute value of zero is zero.

> **EXERCISE 1.1.2**
> 
> **Use set notation to list the described elements.**
> 
> 1. The hours on a clock.
> 2. The days of the week.
> 3. The first ten whole numbers.
> 4. The first ten natural numbers.
> 5. The first five positive even integers.
> 6. The first five positive odd integers.
> 
> **Answer**
> 1. $\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\}$
> 2. $\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\}$
> 3. $\{2, 4, 6, 8, 10\}$

> **EXERCISE 1.1.3**
> 
> **Determine whether the following real numbers are integers, rational, or irrational.**
> 
> 4. $12$
> 5. $-3$
> 6. $4.5$
> 7. $-5$
> 8. $0.3\overline{6}$
> 9. $0.\overline{3}$
> 10. $1.001000100001\dots$
> 11. $1.00\overline{1}$
> 12. $e = 2.71828\dots$
> 13. $\sqrt{7} = 2.645751\dots$
> 14. $-7$
> 15. $3.14$
> 16. $227$
> 17. $1.33$
> 18. $0$
> 19. $8,675,309$
> 
> **Answer**
> 1: Integer, Rational
> 3: Rational
> 5: Rational
> 7: Irrational
> 9: Irrational
> 11: Integer, Rational
> 13: Rational
> 15: Integer, Rational

> **EXERCISE 1.1.4**
> 
> **True or false.**
> 
> 20. All integers are rational numbers.
> 21. All integers are whole numbers.
> 22. All rational numbers are whole numbers.
> 23. Some irrational numbers are rational.
> 24. All terminating decimal numbers are rational.
> 25. All irrational numbers are real.
> 
> **Answer**
> 1: True
> 3: False
> 5: True

> **EXERCISE 1.1.5**
> 
> **Choose an appropriate scale and graph the following sets of real numbers on a number line.**
> 
> 26. $\{-3, 0, 3\}$
> 27. $\{-2, 2, 4, 6, 8, 10\}$
> 28. $\{-2, -1/3, 2/3, 5/3\}$
> 29. $\{-5/2, -1/2, 0, 1/2, 2\}$
> 30. $\{-5/7, 0, 2/7, 1\}$
> 31. $\{-5, -2, -1, 0\}$
> 32. $\{-3, -2, 0, 2, 5\}$
> 33. $\{-2.5, -1.5, 0, 1, 2.5\}$
> 34. $\{0, 0.3, 0.6, 0.9, 1.2\}$
> 35. $\{-10, 30, 50\}$
> 36. $\{-6, 0, 3, 9, 12\}$
> 37. $\{-15, -9, 0, 9, 15\}$
> 
> **Answer**
> 38. $\{-3, 0, 3\}$
>    Figure 1.1.12
> 39. $\{-2, -1/3, 2/3, 5/3\}$
>    Figure 1.1.13
> 40. $\{-5/7, 0, 2/7, 1\}$
>    Figure 1.1.14
> 41. $\{-3, -2, 0, 2, 5\}$
>    Figure 1.1.15
> 42. $\{0, 0.3, 0.6, 0.9, 1.2\}$
>    Figure 1.1.16
> 43. $\{-6, 0, 3, 9, 12\}$
>    Figure 1.1.17

> **EXERCISE 1.1.6**
> 
> **Fill in the blank with $<, =, \text{or} >$.**
> 
> 44. $-7$ \_\_\_\_ $0$
> 45. $30$ \_\_\_\_ $2$
> 46. $10$ \_\_\_\_ $-10$
> 47. $-150$ \_\_\_\_ $-75$
> 48. $-0.5$ \_\_\_\_ $-1.5$
> 49. $0$ \_\_\_\_ $0$
> 50. $-500$ \_\_\_\_ $200$
> 51. $-1$ \_\_\_\_ $-200$
> 52. $-10$ \_\_\_\_ $-10$
> 53. $-40$ \_\_\_\_ $-41$
> 
> **Answer**
> 54. $<$
> 55. $>$
> 56. $>$
> 57. $<$
> 58. $=$

> **EXERCISE 1.1.7**
> 
> **True or false.**
> 
> 59. $5 \neq 7$
> 60. $4 = 5$
> 61. $1 \neq 1$
> 62. $-5 > -10$
> 63. $4 \leq 4$
> 64. $-12 \geq 0$
> 65. $-10 = -10$
> 66. $3 > 3$
> 67. $-1000 < -20$
> 68. $0 = 0$
> 
> **Answer**
> 69. True
> 70. False
> 71. True
> 72. True
> 73. True

> **EXERCISE 1.1.8**
> 
> **List the numbers.**
> 
> 74. List three integers less than $-5$.
> 75. List three integers greater than $-10$.
> 76. List three rational numbers less than zero.
> 77. List three rational numbers greater than zero.
> 78. List three integers between $-20$ and $-5$.
> 79. List three rational numbers between $0$ and $1$.
> 
> **Answer**
> 80. $-10, -7, -6$ (answers may vary)
> 81. $-1, -2/3, -1/3$ (answers may vary)
> 82. $-15, -10, -7$ (answers may vary)

> **EXERCISE 1.1.9**
> 
> **Translate each statement into an English sentence.**
> 
> 83. $10 < 20$
> 84. $-50 \leq -10$
> 85. $-4 \neq 0$
> 86. $30 \geq -1$
> 87. $0 = 0$
> 88. $e \approx 2.718$
> 
> **Answer**
> 89. Ten is less than twenty.
> 90. Negative four is not equal to zero.
> 91. Zero is equal to zero.

> **EXERCISE 1.1.10**
> 
> **Translate the following into a mathematical statement.**
> 
> 92. Negative seven is less than zero.
> 93. Twenty-four is not equal to ten.
> 94. Zero is greater than or equal to negative one.
> 95. Four is greater than or equal to negative twenty-one.
> 96. Negative two is equal to negative two.
> 97. Negative two thousand is less than negative one thousand.
> 
> **Answer**
> 98. $-7 < 0$
> 99. $0 \geq -1$
> 100. $-2 = -2$

> **EXERCISE 1.1.11**
> 
> **Simplify.**
> 
> 101. $-(-9)$
> 102. $-(-35)$
> 103. $-(10)$
> 104. $-(3)$
> 105. $-(5)$
> 106. $-(34)$
> 107. $-(-1)$
> 108. $-(-(-1))$
> 109. $-(-(1))$
> 110. $-(-(-3))$
> 111. $-(-(-(-11)))$
> 
> **Answer**
> 112. $9$
> 113. $-10$
> 114. $-5$
> 115. $1$
> 116. $1$
> 117. $11$

> **EXERCISE 1.1.12**
> 
> **Answer the following questions.**
> 
> 118. What is the opposite of $-12$
> 119. What is the opposite of $\pi$?
> 120. What is the opposite $-0.01$?
> 121. Is the opposite of $-12$ smaller or larger than $-11$?
> 122. Is the opposite of $7$ smaller or larger than $-6$?
> 
> **Answer**
> 123. $-\pi$
> 124. Larger

> **EXERCISE 1.1.13**
> 
> **Fill in the blank with $<, =, \text{or} >$.**
> 
> 125. $-7$ \_\_\_\_ $-(-8)$
> 126. $6$ \_\_\_\_ $-(6)$
> 127. $13$ \_\_\_\_ $-(-12)$
> 128. $-(-5)$ \_\_\_\_ $-(-2)$
> 129. $-100$ \_\_\_\_ $-(-(-50))$
> 130. $44$ \_\_\_\_ $-(-44)$
> 
> **Answer**
> 131. $<$
> 132. $>$
> 133. $<$

> **EXERCISE 1.1.14**
> 
> **Simplify.**
> 
> 134. $|20|$
> 135. $|-20|$
> 136. $|-33|$
> 137. $|-0.75|$
> 138. $|-\frac{3}{5}|$
> 139. $|38|$
> 140. $|0|$
> 141. $|1|$
> 142. $-|12|$
> 143. $-|-20|$
> 144. $-|20|$
> 145. $-|-8|$
> 146. $-|7|$
> 147. $-|-316|$
> 148. $-(|-\frac{8}{9}|)$
> 149. $|-(-2)|$
> 150. $-|-(-3)|$
> 151. $-(|5|)$
> 152. $-(-|-45|)$
> 153. $-|-(-21)|$
> 154. $\text{abs}(6)$
> 155. $\text{abs}(-7)$
> 156. $-\text{abs}(5)$
> 157. $-\text{abs}(-19)$
> 158. $-(-\text{abs}(9))$
> 159. $-\text{abs}(-(-12))$
> 
> **Answer**
> 160. $20$
> 161. $33$
> 162. $\frac{3}{5}$
> 163. $0$
> 164. $-12$
> 165. $-20$
> 166. $-7$
> 167. $-\frac{8}{9}$
> 168. $-3$
> 169. $45$
> 170. $6$
> 171. $-5$
> 172. $9$

> **EXERCISE 1.1.15**
> 
> **Determine the unknown.**
> 
> 173. $|?| = 9$
> 174. $|?| = 15$
> 175. $|?| = 0$
> 176. $|?| = 1$
> 177. $|?| = -8$
> 178. $|?| = -20$
> 179. $|?| - 10 = -2$
> 180. $|?| + 5 = 14$
> 
> **Answer**
> 181. $\pm 9$
> 182. $0$
> 183. $\varnothing$, No solution
> 184. $\pm 8$

> **EXERCISE 1.1.16**
> 
> **Fill in the blank with $<, =, \text{or} >$.**
> 
> 185. $|-2|$ \_\_\_\_ $0$
> 186. $|-7|$ \_\_\_\_ $|-10|$
> 187. $-10$ \_\_\_\_ $-|-2|$
> 188. $|-6|$ \_\_\_\_ $|-(-6)|$
> 189. $-|3|$ \_\_\_\_ $|-(-5)|$
> 190. $0$ \_\_\_\_ $-|-(-4)|$
> 
> **Answer**
> 191. $>$
> 192. $<$
> 193. $<$

> **EXERCISE 1.1.17**
> 
> **Discussion Board Topics.**
> 
> 194. Research and discuss the history of the number zero.
> 195. Research and discuss the various numbering systems throughout history.
> 196. Research and discuss the definition and history of $\pi$.
> 197. Research the history of irrational numbers. Who is credited with proving that the square root of $2$ is irrational and what happened to him?
> 198. Research and discuss the history of absolute value.
> 199. Discuss the “just make it positive” definition of absolute value