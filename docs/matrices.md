# Matrices

Math.js supports n-dimensional arrays and matrices. Both regular JavaScript
`Array` and the math.js `Matrix` type can be used interchangeably in all math.js
functions.

A `Matrix` is an object wrapped around a regular JavaScript Array, providing
utility functions for easy matrix manipulation such as `subset`, `size`,
`resize`, `clone`, and more.

Matrix indexes in math.js are zero-based, like most programming languages
including JavaScript itself.
The lower-bound of a range is included, the upper-bound is excluded.
Note that mathematical applications like Matlab and Octave work differently,
as they use one-based indexes and include the upper-bound of a range.

```js
var matrix = math.matrix([1, 4, 9, 16, 25]);    // Matrix, [1, 4, 9, 16, 25]
math.sqrt(matrix);                              // Matrix, [1, 2, 3, 4, 5]

var array = [1, 2, 3, 4, 5];
math.factorial(array);                          // Array,  [1, 2, 6, 24, 120]

var a = [[1, 2], [3, 4]];                       // Array,  [[1, 2], [3, 4]]
var b = math.matrix([[5, 6], [1, 1]]);          // Matrix, [[5, 6], [1, 1]]
b.subset(math.index(1, [0, 2]), [[7, 8]]);      // Matrix, [[5, 6], [7, 8]]
var c = math.multiply(a, b);                    // Matrix, [[19, 22], [43, 50]]
var d = c.subset(math.index(1, 0));             // 43
```

The type of matrix output from functions is determined from the input:
An array as input will return an Array, a Matrix as input will return a Matrix.
In case of mixed input or no matrix as input, the type of output is determined
by the option `math.matrix.default`, which can have a string `"array"` or
`"matrix"` (default) as value.


## Expressions

Matrices are supported by the expression parser.

*IMPORTANT:* matrix indexes and ranges work different from the math.js indexes
in JavaScript: They are one-based with an included upper-bound, similar to most
math applications.


```js
parser = math.parser();

parser.eval('a = [1, 2; 3, 4]');                // Matrix, [[1, 2], [3, 4]]
parser.eval('b = zeros(2, 2)');                 // Matrix, [[0, 0], [0, 0]]
parser.eval('b(1, 1:2) = [5, 6]');              // Matrix, [[5, 6], [0, 0]]
parser.eval('b(2, :) = [7, 8]');                // Matrix, [[5, 6], [7, 8]]
parser.eval('c = a * b');                       // Matrix, [[19, 22], [43, 50]]
parser.eval('d = c(2, 1)');                     // 43
parser.eval('e = c(2, 1:end)');                 // Matrix, [[43, 50]]
```
