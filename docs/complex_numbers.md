# Complex

Math.js supports complex numbers. Most functions support complex numbers.

## API

A complex number is created using the function `math.complex`. This function
accepts two numbers representing the real and imaginary part of the value,
or a single string containing a complex value in the form `a + bi` where `a`
and `b` respectively represent the real and imaginary part of the complex number.
The function returns a `Complex` object.

Syntax:

```js
math.complex(re: number) : Complex
math.complex(re: number, im: number) : Complex
math.complex(complex: Complex) : Complex
math.complex(str: string) : Complex

Examples:

```js
var a = math.complex(2, 3);     // Complex 2 + 3i
a.re;                           // Complex 2
a.im;                           // Complex 3

var b = math.complex('4 - 2i'); // Complex 4 - 2i
b.re = 5;                       // Number 5
b;                              // Complex 5 - 2i
```

A `Complex` object has the following properties:

- `re`. A number containing the real part of the complex number.
- `im`. A number containing the imaginary part of the complex number.

The properties `re` and `im` of a complex number can be read and replaced.

A `Complex` object has the following functions:

- `clone()`. Create a clone of the complex number.
- `toString()`. Returns a string representation of the complex number, formatted
  as `a + bi` where `a` is the real part and `b` the imaginary part. The
  values are rounded to a fixed precision. The precision is defined in the
  option `math.option.precision`.


## Calculations

Most functions of math.js support complex numbers. Complex and real numbers
can be used together.

```js
var a = math.complex(2, 3);     // Complex 2 + 3i
var b = math.complex('4 - 2i'); // Complex 4 - 2i

math.add(a, b);                 // Complex 6 + i
math.multiply(a, 2);            // Complex 4 + 6i
math.sqrt(-4);                  // Complex 2i
```
