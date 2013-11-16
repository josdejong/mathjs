# Numbers

Math.js supports two types of numbers:

- [Number](#number) for fast floating point arithmetic.
- [BigNumber](#number) for arbitrary precision arithmetic.

The default number type can be configured when instantiating math.js:

```js
var mathjs = require('mathjs'),
    math = mathjs({
      number: {
        defaultType: 'number' // Choose from: 'number' (default), 'bignumber'
      }
    });

// ... use math
```


## Number

Math.js uses the built-in JavaScript Number type. A Number is a floating point
number with a limited precision of 64 bits, about 16 digits. The largest integer
number which can be represented by a JavaScript Number
is `+/- 9007199254740992` (`+/- 2^53`). Because of the limited precision of
floating point numbers, round-off errors can occur during calculations.
This can be easily demonstrated:

```js
// a round-off error
0.1 + 0.2;            // 0.30000000000000004
math.add(0.1, 0.2);   // 0.30000000000000004
```

In most cases, round-off errors don't matter: they have no are significant
impact on the results. However it looks ugly when displaying output to a user.
A solution is to limit the precision just below the actual precision of 16
digits in the displayed output:

```js
// prevent round-off errors showing up in output
var ans = math.add(0.1, 0.2);       //  0.30000000000000004
math.format(ans, {precision: 14});  // '0.3'
```

A Number can store values between `5e-324` and `1.7976931348623157e+308`.
Values smaller than the minimum are stored as `0`, and values larger than the
maximum are stored as `+/- Infinity`.

```js
// exceeding the maximum and minimum number
console.log(1e309);   // Infinity
console.log(1e-324);  // 0
```


## BigNumber

For calculations with an arbitrary precision, math.js supports BigNumber.
BigNumber is powered by the the library
[bignumber.js](https://github.com/MikeMcl/bignumber.js/).

BigNumber is only supported by the arithmetic functions of math.js.

Calculations with BigNumber are much slower than calculations with Number,
but they can be executed with an arbitrary precision. By using a higher
precision, it is less likely that round-off errors occur:

```js
// round-off errors with numbers
math.add(0.1, 0.2);                                     // Number, 0.30000000000000004
math.divide(0.3, 0.2);                                  // Number, 1.4999999999999998

// no round-off errors with big numbers :)
math.add(math.bignumber(0.1), math.bignumber(0.2));     // BigNumber, 0.3
math.divide(math.bignumber(0.3), math.bignumber(0.2));  // BigNumber, 1.5
```

The default precision for BigNumber is 20 digits. This is a global setting
in the [underlying BigNumber library](https://github.com/MikeMcl/bignumber.js/),
which can be changed by configuring BigNumber:

```js
BigNumber.config({DECIMAL_PLACES: 32});
```

Big numbers can be converted to numbers and vice versa using the functions
`number` and `bignumber`. When converting a big number to a number, the high
precision of the will be lost.When a BigNumber is too large to be represented
as Number, it will be initialized as `Infinity`.

```js
// converting numbers and bignumbers
var a = math.number(0.3);                         // Number, 0.3
var b = math.bignumber(a);                        // BigNumber, 0.3
var c = math.number(b);                           // Number, 0.3

// exceeding the maximum of a number
var d = math.bignumber('1.2e500');                // BigNumber, 1.2e+500
var e = math.number(d);                           // Number, Infinity

// loosing precision when converting to number
var f = math.bignumber('0.2222222222222222222');  // BigNumber, 0.2222222222222222222
var g = math.number(f);                           // Number,    0.2222222222222222
```
