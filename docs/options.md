# Options

Math.js contains a number of global options. The options are defined in
`math.options`.

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

// default setting
math.ones(2, 2); // Matrix "[[1, 1], [1, 1]]"

// change default matrix output to array
math.options.matrix.defaultType = 'array'
math.ones(2, 2); // Array "[[1, 1], [1, 1]]"
```
