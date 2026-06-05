---
name: Order of Operations (PEMDAS / BODMAS)
parent: Real Numbers and their Operations
category: Mathematics
distance: 5
---
### LEARNING OBJECTIVES

*   Identify and work with grouping symbols.
*   Understand the order of operations.
*   Simplify using the order of operations.

@GROUPING SYMBOLS

In a computation where more than one operation is involved, grouping symbols help tell us which operations to perform first. The grouping symbols commonly used in algebra are

$$ ( \ ) \quad \text{\color{cyan}Parentheses} $$
$$ [ \ ] \quad \text{\color{cyan}Brackets} $$
$$ \{ \ \} \quad \text{\color{cyan}Braces} $$
$$ \frac{\quad}{\quad} \quad \text{\color{cyan}Fraction bar} $$

All of the above grouping symbols, as well as absolute value, have the same order of precedence. Perform operations inside the innermost grouping symbol or absolute value first.

> **EXAMPLE 1.7.1**
> 
> Simplify:
> $$ 5 - (4 - 12). $$
> 
> **Solution:**
> Perform the operations within the parentheses first. In this case, first subtract $12$ from $4$.
> $$ 5 - (4 - 12) = 5 - (-8) $$
> $$ \quad \quad \quad \quad \quad = 5 + 8 $$
> $$ \quad \quad \quad \quad \quad = 13 $$
> 
> **Answer:**
> $13$

> **EXAMPLE 1.7.2**
> 
> Simplify:
> $$ 3\{-2[-( -3 - 1 )]\}. $$
> 
> **Solution:**
> $$ 3\{-2[-( -3 - 1 )]\} = 3\{-2[-(-4)]\} $$
> $$ \quad \quad \quad \quad \quad \quad \quad = 3\{-2[4]\} $$
> $$ \quad \quad \quad \quad \quad \quad \quad = 3\{-8\} $$
> $$ \quad \quad \quad \quad \quad \quad \quad = -24 $$
> 
> **Answer:**
> $-24$

> **EXAMPLE 1.7.3**
> 
> Simplify:
> $$ \frac{5 - |4 - (-3)|}{|-3| - (5 - 7)}. $$
> 
> **Solution:**
> $$ \frac{5 - |4 - (-3)|}{|-3| - (5 - 7)} = \frac{5 - |4 + 3|}{|-3| - (-2)} $$
> $$ \quad \quad \quad \quad \quad \quad = \frac{5 - |7|}{|-3| + 2} $$
> $$ \quad \quad \quad \quad \quad \quad = \frac{5 - 7}{3 + 2} $$
> $$ \quad \quad \quad \quad \quad \quad = \frac{-2}{5} $$
> $$ \quad \quad \quad \quad \quad \quad = -\frac{2}{5} $$
> 
> **Answer:**
> $-\frac{2}{5}$

> **EXERCISE 1.7.1**
> 
> Simplify:
> $$ -[-3(2 + 3)]. $$
> 
> **Answer**
> $15$

@ORDER OF OPERATIONS

When several operations are to be applied within a calculation, we must follow a specific order to ensure a single correct result.

1.  Perform all calculations within the innermost **parentheses** or grouping symbols.
2.  Evaluate all **exponents**.
3.  Perform **multiplication and division** operations from left to right.
4.  Finally, perform all remaining **addition and subtraction** operations from left to right.

> **NOTE**
> ***Caution:** Note that multiplication and division operations **must** be worked from **left to right**.*

> **EXAMPLE 1.7.4**
> 
> Simplify:
> $$ 5^2 - 4 \cdot 3 \div 12. $$
> 
> **Solution:**
> First, evaluate $5^2$ and then perform multiplication and division as they appear from left to right.
> $$ 5^2 - 4 \cdot 3 \div 12 = 25 - \underbrace{4 \cdot 3} \div 12 $$
> $$ \quad \quad \quad \quad \quad \quad = 25 - \underbrace{12 \div 12} $$
> $$ \quad \quad \quad \quad \quad \quad = \underbrace{25 - 1} $$
> $$ \quad \quad \quad \quad \quad \quad = 24 $$

Because multiplication and division operations should be worked from left to right, it is sometimes correct to perform division before multiplication.

> **EXAMPLE 1.7.5**
> 
> Simplify:
> $$ 2^4 - 12 \div 3 \cdot 2 + 11. $$
> 
> **Solution:**
> Begin by evaluating the exponent, $2^4 = 2 \cdot 2 \cdot 2 \cdot 2 = 16$.
> $$ 2^4 - 12 \div 3 \cdot 2 + 11 = 16 - \underbrace{12 \div 3} \cdot 2 + 11 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 16 - \underbrace{4 \cdot 2} + 11 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = \underbrace{16 - 8} + 11 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = \underbrace{8 + 11} $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 19 $$
> 
> Multiplying first leads to an incorrect result.
> 
> $$ 2^4 - 12 \div 3 \cdot 2 + 11 = 16 - 12 \div \underbrace{3 \cdot 2}_{\text{\color{red}Incorrect}} + 11 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 16 - \underbrace{12 \div 6} + 11 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = \underbrace{16 - 2} + 11 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = \underbrace{14 + 11} $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 25 \quad \text{\color{red}\times} $$
> 
> **Answer:**
> $19$

> **EXAMPLE 1.7.6**
> 
> Simplify:
> $$ -3 - 5^2 + (-7)^2. $$
> 
> **Solution:**
> Take care to correctly identify the base when squaring.
> $$ -3 - 5^2 + (-7)^2 = -3 - 25 + 49 $$
> $$ \quad \quad \quad \quad \quad \quad = -28 + 49 $$
> $$ \quad \quad \quad \quad \quad \quad = 21 $$
> 
> **Answer:**
> $21$

> **EXAMPLE 1.7.7**
> 
> Simplify:
> $$ 5 - 3[2^3 - 5 + 7(-3)]. $$
> 
> **Solution:**
> It is tempting to first subtract $5 - 3$, but this will lead to an incorrect result. The order of operations requires us to simplify within the brackets first.
> $$ 5 - 3[2^3 - 5 + 7(-3)] = 5 - 3[8 - 5 - 21] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 5 - 3[-18] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 5 + 54 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 59 $$
> 
> Subtracting $5 - 3$ first leads to an incorrect result.
> $$ 5 - 3[2^3 - 5 + 7(-3)] = \underbrace{5 - 3}_{\text{\color{red}Incorrect}}[8 - 5 - 21] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 2[-18] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = -36 \quad \text{\color{red}\times} $$
> 
> **Answer:**
> $59$

> **EXAMPLE 1.7.8**
> 
> Simplify:
> $$ -3^2 - [5 - (4^2 - 10)]. $$
> 
> **Solution:**
> Perform the operations within the innermost parentheses first.
> $$ -3^2 - [5 - (4^2 - 10)] = -3^2 - [5 - (16 - 10)] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = -3^2 - [5 - 6] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = -3^2 - [-1] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = -9 + 1 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = -8 $$
> 
> **Answer:**
> $-8$

> **EXAMPLE 1.7.9**
> 
> Simplify:
> $$ \left(-\frac{2}{3}\right)^2 \div \left[ \frac{5}{3} - \left(-\frac{1}{2}\right)^3 \right]. $$
> 
> **Solution:**
> $$ \left(-\frac{2}{3}\right)^2 \div \left[ \frac{5}{3} - \left(-\frac{1}{2}\right)^3 \right] = \left(-\frac{2}{3}\right)^2 \div \left[ \frac{5}{3} - \left(-\frac{1}{8}\right) \right] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad = \left(-\frac{2}{3}\right)^2 \div \left[ \frac{5}{3} + \frac{1}{8} \right] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad = \left(-\frac{2}{3}\right)^2 \div \left[ \frac{40}{24} + \frac{3}{24} \right] $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad = \left(-\frac{2}{3}\right)^2 \div \frac{43}{24} $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad = \frac{4}{9} \cdot \frac{24}{43} $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad = \frac{4}{\cancel{9}_3} \cdot \frac{\cancel{24}^8}{43} $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad = \frac{32}{129} $$
> 
> **Answer:**
> $\frac{32}{129}$

We are less likely to make a mistake if we work one operation at a time. Some problems may involve an absolute value, in which case we assign it the same order of precedence as parentheses.

> **EXAMPLE 1.7.10**
> 
> Simplify:
> $$ 2 - 4|-4 - 3| + (-2)^4. $$
> 
> **Solution:**
> We begin by evaluating the absolute value and then the exponent $(-2)^4 = (-2)(-2)(-2)(-2) = +16$.
> $$ 2 - 4|-4 - 3| + (-2)^4 = 2 - 4|-7| + (-2)^4 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 2 - 4 \cdot 7 + 16 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = 2 - 28 + 16 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = -26 + 16 $$
> $$ \quad \quad \quad \quad \quad \quad \quad \quad = -10 $$
> 
> **Answer:**
> $-10$

> **EXERCISE 1.7.2**
> 
> Simplify:
> $$ 10 \div 5 \cdot 2|(-4) + |-3|| + (-3)^2. $$
> 
> **Answer**
> $13$

@KEY TAKEAWAYS

*   Grouping symbols indicate which operations to perform first. We usually group mathematical operations with parentheses, brackets, braces, and the fraction bar. We also group operations within absolute values. All groupings have the same order of precedence: the operations within the innermost grouping are performed first.
*   When applying operations within a calculation, follow the order of operations to ensure a single correct result.
    *   Address innermost parentheses or groupings first.
    *   Simplify all exponents.
    *   Perform multiplication and division operations from left to right.
    *   Finally, perform addition and subtraction operations from left to right.
*   It is important to highlight the fact that multiplication and division operations should be applied as they appear from left to right. It is a common mistake to always perform multiplication before division, which, as we have seen, in some cases produces incorrect results.

> **EXERCISE 1.7.3 ORDER OF OPERATIONS**
> 
> Simplify.
> 
> 1. $-7 - 3 \cdot 5$
> 2. $3 + 2 \cdot 3$
> 3. $-3(2) - 6^2$
> 4. $2(-3)^2 + 5(-4)$
> 5. $\frac{6}{3} * 2$
> 6. $6 / (3 * 2)$
> 7. $-\frac{1}{2} - \frac{3}{5} \cdot \frac{2}{3}$
> 8. $\frac{5}{8} \div \frac{1}{2} - \frac{5}{6}$
> 9. $3.2^2 - 6.9 \div 2.3$
> 10. $8.2 - 3 \div 1.2 \cdot 2.1$
> 11. $2 + 3(-2) - 7$
> 12. $8 + 2 - 3 \cdot 2$
> 13. $3 + 6^2 \div 12$
> 14. $5 - 4^2 \div (-8)$
> 15. $-9 - 3 \cdot 2 + 3(-2)$
> 16. $-2 - 3^2 + (-2)^2$
> 17. $12 \div 6 \cdot 2 - 2^2$
> 18. $4 \cdot 3 \div 12 \cdot 2 - (-2)^2$
> 19. $(-5)^2 - 2(5)^2 \div 10$
> 20. $-3(4 - 7) + 2$
> 21. $(-2 + 7)^2 - 10^2$
> 22. $10 - 7(3 + 2) + 7^2$
> 23. $-7 - 3(4 - 2 \cdot 8)$
> 24. $5 - 3[6 - (2 + 7)]$
> 25. $1 + 2[(-2)^3 - (-3)^2]$
> 26. $-3[2(7 - 5) \div 4 \cdot (-2) + (-3)^3]$
> 27. $-7^2 - [-20 - (-3)^2] - (-10)$
> 28. $4.7 - 3.2(4 - 1.2^3)$
> 29. $-5.4(6.1 - 3.1 \div 0.1) - 8.2^2$
> 30. $-7.3^2 + (-9.3)^2 - 37.8 \div 1.8$
> 31. $2 - 7(3^2 - 3 + 4 \cdot 3)$
> 32. $(\frac{1}{2})^2 - (-\frac{2}{3})^2$
> 33. $(\frac{1}{2})^3 + (-2)^3$
> 34. $(-\frac{1}{3})^2 - (-\frac{2}{3})^3$
> 35. $\frac{1}{3} - \frac{1}{2} \cdot \frac{1}{5}$
> 36. $\frac{5}{8} \div \frac{3}{2} \cdot \frac{14}{15}$
> 37. $5 \cdot \frac{2}{15} - (\frac{1}{2})^3$
> 38. $\frac{5}{17}(\frac{3}{5} - \frac{4}{35})$
> 39. $\frac{3}{16} \div (\frac{5}{12} - \frac{1}{2} + \frac{2}{3}) \cdot 4$
> 40. $(\frac{2}{3})^2 - (\frac{1}{2})^2$
> 41. $\frac{1}{2}[\frac{3}{4} \cdot (-4)^2 - 2]^2$
> 42. $6 \cdot [(\frac{2}{3})^2 - (\frac{1}{2})^2] \div (-2)^2$
> 43. $(-5)^2 + \frac{3}{2} - \frac{4}{5} + 2 \cdot 7$
> 44. $(-3.2 - 3.3)(8.7 - 4.7)(-4.7 + 3.9 + 2.1)$
> 45. $2 - [3 - (5 - 7)^2]3(6 - 32)$
> 46. $\frac{2 + 3 \cdot 6 - 4 \cdot 32}{2 - 3^2}$
> 47. $(2 + 7) \cdot 2 - \frac{2^3}{10} + \frac{9}{2} + 3^3$
> 48. $\frac{(-1 - 3)^2 - 1}{5 - 3 \cdot (-7 + 2^2) - 5}$
> 49. $(7 + 4 * (-2)) / (-3 + (-2)^2)$
> 50. $4 + 3 * ((-3)^3 + 5^2) / 6 - 2^2$
> 
> **Answer**
> 1. $-22$
> 2. $-42$
> 3. $4$
> 4. $-\frac{9}{10}$
> 5. $7.24$
> 6. $-11$
> 7. $6$
> 8. $-5$
> 9. $0$
> 10. $20$
> 11. $-75$
> 12. $29$
> 13. $-33$
> 14. $-10$
> 15. $67.22$
> 16. $-124$
> 17. $-\frac{63}{8}$
> 18. $\frac{7}{30}$
> 19. $\frac{13}{24}$
> 20. $\frac{9}{7}$
> 21. $50$
> 22. $-17$
> 23. $-\frac{1}{3}$
> 24. $\frac{5}{59}$
> 25. $-1$

> **EXERCISE 1.7.4 ORDER OF OPERATIONS**
> 
> 26. Mary purchased $14$ bottles of water at $\$0.75$ per bottle, $4$ pounds of assorted candy at $\$3.50$ per pound, and $16$ packages of microwave popcorn costing $\$0.50$ each for her party. What was her total bill?
> 27. Joe bought four $8$-foot $2$-by-$4$ boards for $\$24.00$. How much did he spend per linear foot?
> 28. Margaret bought two cases of soda at the local discount store for $\$23.52$. If each case contained $24$ bottles, how much did she spend per bottle?
> 29. Billy earns $\$12.00$ per hour and “time and a half” for every hour he works over $40$ hours a week. What is his pay for $47$ hours of work this week?
> 30. Audry bought $4$ bags of marbles each containing $15$ assorted marbles. If she wishes to divide them up evenly between her $3$ children, how many will each child receive?
> 31. Mark and Janet carpooled home from college for the Thanksgiving holiday. They shared the driving, but Mark drove twice as far as Janet. If Janet drove $135$ miles, then how many miles was the entire trip?
> 
> **Answer**
> 32. $\$32.50$
> 33. $\$0.49$
> 34. $20$ marbles

> **EXERCISE 1.7.5 ORDER OF OPERATIONS WITH ABSOLUTE VALUES**
> 
> Simplify.
> 
> 35. $3 + 2|-5|$
> 36. $9 - 4|-3|$
> 37. $-(-|2| + |-10|)$
> 38. $-(|-6| - |-8|)$
> 39. $|-(40 - |-22|)|$
> 40. $||-5| - |10||$
> 41. $-(|-8| - 5)^2$
> 42. $(|-1| - |-2|)^2$
> 43. $-4 + 2|2^2 - 3^2|$
> 44. $-10 - |4 - 5^2|$
> 45. $-|(-5)^2 + 4^2 \div 8|$
> 46. $-(-3 - [6 - |-7|])$
> 47. $-2[7 - (4 + |-7|)]$
> 48. $3 - 7|-2 - 3| + 4^3$
> 49. $7 - 5|6^2 - 5^2| + (-7)^2$
> 50. $(-4)^2 - |-5 + (-2)^3| - 3^2$
> 51. $\frac{2}{3} - |\frac{1}{2} - (-\frac{4}{3})^2|$
> 52. $-30|\frac{10}{3} - \frac{1}{2} \div \frac{1}{5}|$
> 53. $(-4)^3 - (2 - |-4|) \div |-3^2 + 7|$
> 54. $[10 - 3(6 - |-8|)] \div 4 - 5^2$
> 
> **Answer**
> 55. $13$
> 56. $-8$
> 57. $18$
> 58. $-9$
> 59. $6$
> 60. $-27$
> 61. $8$
> 62. $1$
> 63. $-\frac{11}{18}$
> 64. $-63$

> **EXERCISE 1.7.6 ORDER OF OPERATIONS WITH ABSOLUTE VALUES**
> 
> Find the distance between the given numbers on a number line.
> 
> 65. $\frac{1}{2}$ and $-\frac{1}{4}$
> 66. $-\frac{3}{4}$ and $-\frac{2}{3}$
> 67. $-\frac{5}{8}$ and $-\frac{3}{4}$
> 68. $-\frac{7}{8}$ and $\frac{3}{7}$
> 69. $-0.5$ and $8.3$
> 70. $10.7$ and $-2.8$
> 71. $3\frac{1}{5}$ and $-2\frac{1}{2}$
> 72. $5\frac{3}{8}$ and $0$
> 
> **Answer**
> 73. $\frac{3}{4}$ unit
> 74. $\frac{1}{8}$ unit
> 75. $8.8$ units
> 76. $5\frac{7}{10}$ units

> **EXERCISE 1.7.7 DISCUSSION BOARD TOPICS**
> 
> 77. Convert various examples in this section to equivalent expressions using text-based symbols.
> 78. What is PEMDAS and what is it missing?
> 79. Discuss the importance of proper grouping and give some examples.
> 80. Experiment with the order of operations on a calculator and share your results.
> 
> **Answer**
> 81. Answers may vary
> 82. Answers may vary
