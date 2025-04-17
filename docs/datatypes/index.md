# Data Types

The functions of math.js support multiple data types, both native JavaScript
types as well as more advanced types implemented in math.js. The data types can
be mixed together in calculations, for example by adding a Number to a
Complex number or Array.

The supported data types are:

- Boolean
- [Number](numbers.md)
- [BigInt](bigints.md)
- [BigNumber](bignumbers.md)
- [Complex](complex_numbers.md)
- [Fraction](fractions.md)
- [Array](matrices.md)
- [Matrix](matrices.md)
- [Unit](units.md)
- String

Function [`math.typeOf(x)`](../reference/functions/typeOf.md) can be used to get
the type of a variable.

## Type conversions

### Implicit

For convenience, mathjs will automatically attempt certain type conversions
on the actual arguments to its functions, in order to match the declared
parameter types of the function. For example, there is such an implicit
conversion of boolean values to number values, that takes `false` to 0 and
`true` to 1. Therefore, the invocation `math.add(3, true)` matches the mathjs
add function with two parameters of type `number`, and returns the value 4.

Note that booleans will implicitly convert to any other scalar type,
and strings will implicitly convert to any other scalar type except boolean,
by interpreting the string as the printed representation of a numerical value.
And here is an ASCII art diagram of all other implicit conversions in effect
as of mathjs 14:

```
        /------------> Fraction
       /           /           \
 BigInt----------\/             \
       \         /-> BigNumber  /
        -> Number        |     /
       /         \       v    L
Boolean           \--> Complex

     Array <--> Matrix
```

(Note that the diagram is not "transitive", or in other words, even though
there is an implicit conversion from Boolean to Number and Number to Complex,
there is _not_ any implicit conversion from Boolean to Complex.)

All of these implicit conversions are "safe" in that they will throw an
error if performing them would cause either a loss of precision (e.g.,
losing significant digits when converting a 20-digit bigint to a number),
or an illusory gain in precision (e.g., converting a number with 16 decimal
places, the last one or two of which are likely numerically approximate,
into a bignumber that purports to have 64 digits of precision).

### Explicit

In addition, for each type, there is an explicit function that serves as
a way to "construct" instances of that type, or equivalently, request
explicit conversion of any other type into that type. The name of this
constructor/converter is always the name of the type with all letters
changed to lower case.

Note that such an explicit conversion will throw an error if it would
discard some portion of the content of the value to be converted. So for
example, converting `'6.2831853'` to `number` will succeed, but
`'6.2831853 ~= tau'` to `number` will fail because the non-numeric
characters would be discarded. Similarly, `bigint(complex(-12, 0))` will
succeed and return `-12n` because there is no imaginary part to "-12 + 0i",
but `bigint(complex(-12, 3))` will throw an error because the imaginary
part "3i" would be discarded.

Otherwise, the explicit conversions are by default "unsafe", in that they
will produce the value of the requested type that most closely approximates
the numeric value of the supplied argument, even if rounding must occur or
(apparent) precision is lost or gained. Thus, `bigint(6.283)` will return
`6n`. However, you may supply an options object as a final argument to the
conversion, and if it includes the key "safe" with a true value, a safe
conversion, equivalent to that used in implicit conversion, will be
performed instead. See the documentation pages for the individual
constructor functions for details on any other options available in
specific cases.

## Examples of using types with mathjs functions:

```js
// use numbers
math.subtract(7.1, 2.3)          // 4.8
math.round(math.pi, 3)           // 3.142
math.sqrt(4.41e2)                // 21

// use BigNumbers
math.add(math.bignumber(0.1), math.bignumber(0.2)) // BigNumber, 0.3

// use bigint
math.add(300000000000000000n, 1n) // 300000000000000001n

// use Fractions
math.divide(math.fraction(1), math.fraction(3)) // Fraction, 0.(3)

// use strings
math.concat('hello ', 'world')            // 'hello world'
math.sort(['A', 'D', 'C'], 'natural')[2]  // 'D'

// use complex numbers
const a = math.complex(2, 3)     // 2 + 3i
a.re                             // 2
a.im                             // 3
const b = math.complex('4 - 2i') // 4 - 2i
math.add(a, b)                   // 6 + i
math.sqrt(-4)                    // 2i

// use arrays
const array = [1, 2, 3, 4, 5]
math.factorial(array)            // Array,  [1, 2, 6, 24, 120]
math.add(array, 3)               // Array,  [4, 5, 6, 7, 8]

// use matrices
const matrix = math.matrix([1, 4, 9, 16, 25]) // Matrix, [1, 4, 9, 16, 25]
math.map(matrix, math.sqrt)                   // Matrix, [1, 2, 3, 4, 5]

// use units
const a = math.unit(55, 'cm')    // 550 mm
const b = math.unit('0.1m')      // 100 mm
math.add(a, b)                   // 0.65 m

// check the type of a variable
math.typeOf(2)                   // 'number'
math.typeOf(math.unit('2 inch')) // 'Unit'
math.typeOf(math.sqrt(-4))       // 'Complex'

// bigints implicitly convert to numbers (for example):
math.add(6.283, 3n)              // 9.283
math.sqrt(20000n)                // 141.42135623731
// But they guard against accidentally losing precision:
math.sqrt(12345678901234567890n) // throws "value exceeds the max safe integer"

// You can request explicit conversion
math.add(math.bigint(6.283), 3n) // 9n
// And such explicit requests are unsafe by default:
math.sqrt(math.number(12345678901234567890n))  // 3.5136418288201e+9
// But you can turn safety back on:
math.sqrt(math.number(12345678901234567890n, {safe: true}))
                                 // throws "value exceed the max safe integer"
```
