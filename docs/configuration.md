# Configuration

Math.js contains a number of configuration options. Configuration can be set
when creating a new math.js instance, or later on using the function `config`.
Available configuration options are:

- `epsilon`. The minimum relative difference used to test equality between two
  compared values. This value is used by all comparison functions.
  Default value is `1e-14`.

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
  a BigNumber as input returns a BigNumber as output.
  Available values are: `'number'` (default) or `'bignumber'`.
  BigNumbers have higher precision than the default numbers of JavaScript.

- `precision`. The maximum number of significant digits for bigNumbers.
  This setting only applies to BigNumbers, not to numbers.
  Default value is `64`.


## Examples

This section shows a number of configuration examples.

### node.js

```js
// load the default instance of math.js
var math = require('mathjs');

// range will output a Matrix
math.range(0, 4); // Matrix [0, 1, 2, 3]


// create a new instance configured to use Arrays
var math2 = math({matrix: 'Array'});

// range will output an Array 
math2.range(0, 4); // Array [0, 1, 2, 3]

// change the configuration of math2 from Arrays to Matrices
math2.config({matrix: 'matrix'});

// range will output a Matrix
math2.range(0, 4); // Matrix [0, 1, 2, 3]


// create an instance of math.js with bignumber configuration
var bigmath = math({
  number: 'bignumber',
  precision: 128
});

// parser will parse numbers as BigNumber now:
bigmath.eval('1 / 3'); // BigNumber, 0.33333333333333333333333333333333
```

### browser


```js
<!DOCTYPE HTML>
<html>
<head>
  <script src="math.js" type="text/javascript"></script>
</head>
<body>
  <script type="text/javascript">
    // the default instance of math.js is available as 'math'
  
    // range will output a Matrix
    math.range(0, 4); // Matrix [0, 1, 2, 3]
    
    // change the configuration of math from Arrays to Matrices
    math.config({matrix: 'matrix'});
    
    // range will output an Array 
    math.range(0, 4); // Array [0, 1, 2, 3]
    
    // create a new instance of math.js with bignumber configuration
    var bigmath = math({
      number: 'bignumber',
      precision: 128
    });
    
    // parser will parse numbers as BigNumber now:
    bigmath.eval('1 / 3'); // BigNumber, 0.33333333333333333333333333333333
  </script>
</body>
</html>

```
