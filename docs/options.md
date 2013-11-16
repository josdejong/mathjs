# Options

Math.js contains a number of configuration options. Options can be set when
creating a math.js instance.

- `matrix.defaultType`. The default type of matrix output for functions.
  Available values are: `"array"` or `"matrix"` (default).
  Where possible, the type of matrix output from functions is determined from
  the function input: An array as input will return an Array, a Matrix as input
  will return a Matrix. In case of no matrix as input, the type of output is
  determined by the option `math.matrix.defaultType`. In case of mixed matrix
  inputs, a matrix will be returned always.
- `number.defaultType`. The default type of numbers. Available values are:
  `"number"` (default) or `"bignumber"`. Big numbers have higher precision
  than the default numbers of JavaScript.

Example usage:

```js
// load the library
var mathjs = require('mathjs');

// create an instance of math.js with default configuration
var math1 = mathjs();

// range will output a matrix
math1.range(0, 4); // Matrix [0, 1, 2, 3]

// create an instance of math.js with configuration options
var options = {
  matrix: {
    defaultType: 'array'
  }
};
var math2 = mathjs(options);

// range will output an Array
math2.range(0, 4); // Array [0, 1, 2, 3]
```
