# Configuration

Math.js contains a number of configuration options.
These options can be applied on a created mathjs instance and changed afterwards.

```js
import { create, all } from 'mathjs'

// create a mathjs instance with configuration
const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'number',
  precision: 64,
  predictable: false,
  randomSeed: null
}
const math = create(all, config)

// read the applied configuration
console.log(math.config())

// change the configuration
math.config({
  number: 'BigNumber'
})
```

The following configuration options are available:

- `epsilon`. The minimum relative difference used to test equality between two
  compared values. This value is used by all relational functions.
  Default value is `1e-12`.

- `matrix`. The default type of matrix output for functions.
  Available values are: `'Matrix'` (default) or `'Array'`.
  Where possible, the type of matrix output from functions is determined from
  the function input: An array as input will return an Array, a Matrix as input
  will return a Matrix. In case of no matrix as input, the type of output is
  determined by the option `matrix`. In case of mixed matrix
  inputs, a matrix will be returned always.

- `number`. The type of numeric output for functions which cannot
  determine the numeric type from the inputs. For most functions though,
  the type of output is determined from the the input:
  a number as input will return a number as output,
  a BigNumber as input returns a BigNumber as output.

  For example the functions `math.evaluate('2+3')`, `math.parse('2+3')`,
  `math.range('1:10')`, and `math.unit('5cm')` use the `number` configuration
  setting. But `math.sqrt(4)` will always return the number `2`
  regardless of the `number` configuration, because the input is a number.

  Available values are: `'number'` (default), `'BigNumber'`, or `'Fraction'`.
  [BigNumbers](../datatypes/bignumbers.js) have higher precision than the default
  numbers of JavaScript, and [`Fractions`](../datatypes/fractions.js) store
  values in terms of a numerator and denominator.

- `precision`. The maximum number of significant digits for BigNumbers.
  This setting only applies to BigNumbers, not to numbers.
  Default value is `64`.

- `predictable`. Predictable output type of functions. When true, output type
  depends only on the input types. When false (default), output type can vary
  depending on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
  predictable is false, and returns `NaN` when true.
  Predictable output can be needed when programmatically handling the result of
  a calculation, but can be inconvenient for users when evaluating dynamic
  equations.

- `randomSeed`. Set this option to seed pseudo random number generation, making it deterministic. The pseudo random number generator is reset with the seed provided each time this option is set. For example, setting it to `'a'` will cause `math.random()` to return `0.43449421599986604` upon the first call after setting the option every time. Set to `null` to seed the pseudo random number generator with a random seed. Default value is `null`.


## Examples

This section shows a number of configuration examples.

### node.js

```js
import { create, all } from 'mathjs'

const config = {
  matrix: 'Array' // Choose 'Matrix' (default) or 'Array'
}
const math = create(all, config)

// range will output an Array
math.range(0, 4) // Array [0, 1, 2, 3]

// change the configuration from Arrays to Matrices
math.config({
  matrix: 'Matrix' // Choose 'Matrix' (default) or 'Array'
})

// range will output a Matrix
math.range(0, 4) // Matrix [0, 1, 2, 3]

// create an instance of math.js with BigNumber configuration
const bigmath = create(all, {
  number: 'BigNumber', // Choose 'number' (default), 'BigNumber', or 'Fraction'
  precision: 32        // 64 by default, only applicable for BigNumbers
})

// parser will parse numbers as BigNumber now:
bigmath.evaluate('1 / 3') // BigNumber, 0.33333333333333333333333333333333
```

### browser


```html
<!DOCTYPE HTML>
<html>
<head>
  <script src="math.js" type="text/javascript"></script>
</head>
<body>
  <script type="text/javascript">
    // the default instance of math.js is available as 'math'

    // range will output a Matrix
    math.range(0, 4)          // Matrix [0, 1, 2, 3]

    // change the configuration of math from Matrices to Arrays
    math.config({
      matrix: 'Array'         // Choose 'Matrix' (default) or 'Array'
    })

    // range will output an Array
    math.range(0, 4)          // Array [0, 1, 2, 3]

    // create a new instance of math.js with bignumber configuration
    const bigmath = math.create({
      number: 'BigNumber',    // Choose 'number' (default), 'BigNumber', or 'Fraction'
      precision: 32           // 64 by default, only applicable for BigNumbers
    })

    // parser will parse numbers as BigNumber now:
    bigmath.evaluate('1 / 3') // BigNumber, 0.33333333333333333333333333333333
  </script>
</body>
</html>
```
