# Configuration

Math.js contains a number of configuration options. These options can be
applied on a created mathjs instance and changed afterwards.

```js
import { create, all } from 'mathjs'

// create a mathjs instance with configuration
const config = {
  number: 'number',
  compute: {
    defaultRelTol: 1e-12,
    defaultAbsTol: 1e-15,
    numberApproximate: 'number',
    randomSeed: null,
    uniformType: false,
    Matrix: {
      defaultType: 'Matrix'
    },
    BigNumber: {
      precision: 64,
    },
  },
  parse: {
    numberFallback: 'number',
  },
  compatibility: {
    subset: false
  }
}
const math = create(all, config)

// read the applied configuration
console.log(math.config())

// change the configuration
math.config({ number: 'BigNumber' })
```

The following configuration options and sub-options are available.

- {string} `number`. When the type of a numeric value is not otherwise
    specifically determined, either in parsing or in computation, the type
    given by this option is tried first. For example, when set to `Fraction`,
    `math.evaluate('0.15 + 02')` will return the exact rational number
    `math.fraction(7, 20)` and `math.sum([])` will return `math.fraction(0)`.
    Note there are separate backup options for parsing (`parse.numberFallback`)
    and computation (`compute.numberApproximate`) when this `number` type is
    not appropriate, see below. The currently supported values for this
    option are `number` (the default), `BigNumber` (which can support higher
    precision than the built-in JavaScript number type), `Fraction`, `bigint`
    (which can represent arbitrarily large integer numbers, but not
    fractions or decimals).

- compute:
  - {number} `defaultAbsTol`. The minimum absolute difference used to test
    equality between two compared values of floating-point (inexact) types.
    This value is used by all relational functions. Default value is `1e-15`.

  - {number} `defaultRelTol`. The minimum relative difference used to test
    equality between two compared values of floating-point (inexact) types.
    This value is used by all relational functions. Default value is `1e-12`.

  - {string} `numberApproximate`. The type to use for floating-point
    (approximate real) values as output when the type is not uniquely
    determined by the input types (e.g., the square root of a bigint or the
    value of a mathematical constant). Default value is `number`.

  - {string|null} `randomSeed`. Set this option to seed pseudo-random number
    generation, making it deterministic. The pseudo-random number generator is
    reset with the seed provided each time this option is set to a new value.
    For example, setting it to `'a'` will always cause `math.random()` to
    return `0.43449421599986604` on its next call. Set to `null` to seed the
    pseudo random number generator with a random seed. Default value is `null`.

  - {boolean} `uniformType`. When this option is true, the output type of any
    function depends only on the input types. When false, the output type can
    vary depending on input values within the same type. For example,
    `math.sqrt(-4)` returns `math.complex('2i')` when this option is false,
    and returns `NaN` when true. Predictable output can be needed when
    programmatically handling the result of a calculation, but can be
    inconvenient for users when evaluating dynamic equations. Default
    value is `false`.

  - BigNumber:
    - {number} `precision`. The maximum number of significant digits kept
      for values of BigNumber type. Note that increasing it will not affect
      previously computed BigNumbers, but will retain the larger number
      of digits for future computations. Default value is `64`.

  - Matrix:
    - {string} `defaultType`. The data type used to represent a matrix output
      by any function, when that type is not uniquely determined by the input
      types. Whenever possible, the type of matrix output from functions is
      determined from the function input: An array as input will return an
      Array and a Matrix as input will return a Matrix (which is also returned
      in case of mixed-type matrix inputs). However, some functions, such as
      `math.identity(n)`, have no matrix parameter. In such cases, the type
      of the output is determined by this option, including in the case of
      the `[...]` matrix-creating operator in mathjs expressions. Currently
      supported types are `Array` and `Matrix`, the default.

- parse:
  - {string} `numberFallback`. When the top-level `number` option is
    configured, for example, with value `'bigint'`, and a literal value in
    an expression, such as `'2.3'`, cannot be represented as that type,
    the value will instead be parsed into the type specified by
    `numberFallback`. The currently supported values are `BigNumber`,
    `Fraction`, and `number`, the default.

- compatibility:
  - {boolean} `subset`. When set to `true`, the `subset` function behaves
    as in earlier versions of math.js: retrieving a subset where the index
    size contains only one element, returns the value itself. When set to
    `false`, `subset` eliminates dimensions from the result only if the
    index dimension is a scalar; if the index dimension is a range, matrix,
    or array, the dimensions are preserved. This option is helpful for
    maintaining compatibility with legacy code that depends on the
    previous behavior. It is, however, deprecated and will be removed in some
    future version of mathjs.

## Examples

This section shows a number of configuration examples.

### node.js

```js
import { create, all } from 'mathjs'

const config = {
  compute: {
    Matrix: { defaultType: 'Array' } // Choose 'Matrix' (default) or 'Array'
  }
}
const math = create(all, config)

// range will output an Array
math.range(0, 4) // Array [0, 1, 2, 3]

// change the configuration from Arrays to Matrices
math.config({ compute: { Matrix: { defaultType: 'Matrix' } } })

// range will output a Matrix
math.range(0, 4) // Matrix [0, 1, 2, 3]

// create an instance of math.js with BigNumber configuration
const bigmath = create(all, {
  number: 'BigNumber'
  compute: {
    BigNumber: { precision: 32 } // Would be 64 by default
  }
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
      compute: {
        Matrix: { defaultType: 'Array' }
      }
    })

    // range will output an Array
    math.range(0, 4)          // Array [0, 1, 2, 3]

    // create a new instance of math.js with bignumber configuration
    const bigmath = create(all, {
      number: 'BigNumber'
      compute: {
        BigNumber: { precision: 32 } // Would be 64 by default
      }
    })

    // parser will parse numbers as BigNumber now:
    bigmath.evaluate('1 / 3') // BigNumber, 0.33333333333333333333333333333333
  </script>
</body>
</html>
```
