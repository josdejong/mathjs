# Configuration

Math.js contains a number of configuration settings. Configuration can be set
when creating a math.js instance, or later on using the function `config`.
Available configuration settings are:

- `matrix`. The default type of matrix output for functions.
  Available values are: `'matrix'` (default) or `'array'`.
  Where possible, the type of matrix output from functions is determined from
  the function input: An array as input will return an Array, a Matrix as input
  will return a Matrix. In case of no matrix as input, the type of output is
  determined by the option `matrix`. In case of mixed matrix
  inputs, a matrix will be returned always.

- `number`. The default type of numbers. This setting is used by functions
  like `eval `which cannot determine the correct type of output from the
  functions input. For most functions though, the type of output is determined
  from the the input: a number as input will return a number as output,
  a bignumber as input returns a bignumber as output.
  Available values are: `'number'` (default) or `'bignumber'`.
  Big numbers have higher precision than the default numbers of JavaScript.

- `decimals`. The maximum number of decimal places behind the decimal
  point (not the number of significant digits). Only applies to big numbers,
  not to numbers. Default value is 20.

  *Important: This setting is applied application wide to all BigNumbers.
  Behind the scenes, this setting is applied as the global `DECIMAL_PLACES`
  setting of the [bignumber.js](https://github.com/MikeMcl/bignumber.js)
  library used by math.js.*


## Examples

This section shows a number of configuration examples.


### Default settings

```js
// load the library
var mathjs = require('mathjs');

// create an instance of math.js with default configuration
var math1 = mathjs();

// range will output a matrix
math1.range(0, 4); // Matrix [0, 1, 2, 3]
```

### Configuration for matrices

```js
// load the library
var mathjs = require('mathjs');

// create an instance of math.js with configuration settings
var settings = {
  matrix: 'array'
};
var math2 = mathjs(settings);

// range will output an Array
math2.range(0, 4); // Array [0, 1, 2, 3]

// change configuration
math2.config({
  matrix: 'matrix'
});

// range will output a Matrix
math2.range(0, 4); // Matrix [0, 1, 2, 3]
```

### Configuration for big numbers

```js
// load the library
var mathjs = require('mathjs');

// use big numbers by default
var math3 = mathjs({
  number: 'bignumber',
  decimals: 32
});

// parser will parse numbers as BigNumber now:
math3.eval('1 / 3'); // BigNumber, 0.33333333333333333333333333333333
```
