# Options

Math.js contains a number of options. The options are defined in `math.options`.
Options can be set when creating an instance, and can be adjusted later on in
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
// load the library
var mathjs = require('mathjs');

// create an instance of math.js with default settings
var math1 = mathjs();

// default setting
math1.range(0, 4); // Matrix [0, 1, 2, 3]

// create an instance of math.js with custom settings
var options = {
  matrix: {
    defaultType: 'array'
  }
};
var math2 = mathjs(options);

math2.range(0, 4); // Array [0, 1, 2, 3]

// change settings
math2.options.matrix.defaultType = 'matrix';

math2.range(0, 4); // Matrix [0, 1, 2, 3]
```
