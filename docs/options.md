# Options

Math.js contains a number of global options. The options are defined in
`math.options`.

- `format.precision`. The precision used when formatting numbers,
  numbers are rounded to a limited number of digits. Default value is `5`.
  The precision is used by the function `math.format` and by the `toString`
  functions of units, complex numbers, and matrices.

- `matrix.defaultType`. The default type of matrix output for functions.
  Available values are: `"array"` or `"matrix"` (default).
  Where possible, the type of matrix output from functions is determined from
  the function input: An array as input will return an Array, a Matrix as input
  will return a Matrix. In case of no matrix as input, the type of output is
  determined by the option `math.matrix.defaultType`. In case of mixed matrix
  inputs, a matrix will be returned always.

Example usage:

```js
var math = require('mathjs');

// default precision, 5 digits
math.format(math.pi);               // "3.1416"

// change precision to 8 digits
math.options.format.precision = 8;
math.format(math.pi);               // "3.1415927"
```
