# BigInts

For calculations with large integer numbers, math.js supports the built-in `bigint` data type.

## Usage

A bigint can be created either by adding the suffix `n` to a `number`, using the `BigInt` constructor function, or using the util function `math.bigint`:

```js
42n
BigInt('42')
math.bigint('42')
```

Most functions can determine the type of output from the type of input:
a `number` as input will return a `number` as output, a `bigint` as input returns
a `bigint` as output. Functions which cannot determine the type of output
from the input (for example `math.evaluate`) use the default number type `number`,
which can be configured when instantiating math.js. To configure the use of
`bigint` instead of [numbers](numbers.md) by default, configure math.js like:

```js
math.config({
  number: 'bigint'
})

// use math
math.evaluate('70000000000000000123')  // bigint 70000000000000000123n
```

## Support

All basic arithmetic functions in math.js support `bigint`. Since `bigint` can only hold integer values, it is not applicable to for example trigonometric functions. When using a `bigint` in a function that does not support it, like `sqrt`, it will convert the `bigint` into a regular `number` and then execute the function:

```js
math.sin(2n) // number 0.9092974268256817
```

## Conversion

There are utility functions to convert a `bigint` into a `number` or `BigNumber`:

```js
// convert a number to bigint or BigNumber
math.bigint(42)                    // bigint, 42n
math.bignumber(42)                 // BigNumber, 42

// convert a bigint to a number or BigNumber
math.number(42n)                   // number, 42
math.bignumber(42n)                // BigNumber, 42

// losing digits when converting to number
math.number(70000000000000000123n) // number, 7000000000000000000
```
