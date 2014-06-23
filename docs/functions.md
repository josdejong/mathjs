---
layout: default
---

# Functions

Math.js contains the following functions. The functions support all available
data types (Number, BigNumber, Complex, Unit, String, Matrix, and Array) where
applicable.

A full reference with all available functions can be found here:

- [Alphabetical function reference](reference/functions/alphabetical.html)
- [Categorical function reference](reference/functions/categorical.html)


Example usage:

```js
math.sqrt(25);                    // Number  5
math.add(3, 4);                   // Number  7
math.add(3, math.multiply(2, 3)); // Number  9
math.log(10000, 10);              // Number  4

math.add([2, 1, 5], 3);           // Matrix  [5, 4, 8]
var a1 = math.complex(2, 3),      // Complex 2 + 3i
    a2 = math.complex(-1, 4);     // Complex -1 + 4i
math.multiply(a, b);              // Complex -14 + 5i
math.sin(math.unit(45, 'deg'));   // Number  0.70711
math.add('hello ', 'world!');     // String  'hello world!'
```
