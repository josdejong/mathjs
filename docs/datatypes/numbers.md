# Numbers

Math.js supports two types of numbers:

- Number for fast floating point arithmetic, described on this page.
- BigNumber for arbitrary precision arithmetic, describe on the page
  [Big Numbers](bignumbers.md).

Most functions can determine the type of output from the type of input:
a number as input will return a number as output, a bignumber as input returns
a bignumber as output. Functions which cannot determine the type of output
from the input (for example `math.eval`) use the default number type, which
can be configured when instantiating math.js:

```js
var mathjs = require('mathjs'),
    math = mathjs({
      number: 'number' // Default type of number: 'number' (default) or 'bignumber'
    });
```

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
