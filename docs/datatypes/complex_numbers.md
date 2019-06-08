---
layout: default
---

<h1 id="complex-numbers">Complex Numbers <a href="#complex-numbers" title="Permalink">#</a></h1>

Math.js supports the creation, manipulation, and calculations with complex numbers.
Support of complex numbers is powered by the library [complex.js](https://github.com/infusion/Complex.js).

In mathematics, a complex number is an expression of the form `a + bi`,
where `a` and `b` are real numbers and `i` represents the imaginary number
defined as `i^2 = -1`. (In other words, `i` is the square root of `-1`.)
The real number `a` is called the real part of the complex number,
and the real number `b` is the imaginary part. For example, `3 + 2i` is a
complex number, having real part `3` and imaginary part `2`.
Complex numbers are often used in applied mathematics, control theory,
signal analysis, fluid dynamics and other fields.

<h2 id="usage">Usage <a href="#usage" title="Permalink">#</a></h2>

A complex number is created using the function `math.complex`. This function
accepts:

- two numbers representing the real and imaginary part of the value,
- a single string containing a complex value in the form `a + bi` where `a`
  and `b` respectively represent the real and imaginary part of the complex number.
- an object with either properties `re` and `im` for the real and imaginary
  part of the value, or two properties `r` and `phi` containing the polar
  coordinates of a complex value.
The function returns a `Complex` object.

Syntax:

```js
math.complex(re: number) : Complex
math.complex(re: number, im: number) : Complex
math.complex(complex: Complex) : Complex
math.complex({re: Number, im: Number}) : Complex
math.complex({r: number, phi: number}) : Complex
math.complex({abs: number, arg: number}) : Complex
math.complex(str: string) : Complex
```

Examples:

```js
const a = math.complex(2, 3)     // Complex 2 + 3i
a.re                             // Number 2
a.im                             // Number 3

const b = math.complex('4 - 2i') // Complex 4 - 2i
b.re = 5                         // Number 5
b                                // Complex 5 - 2i
```

<h2 id="calculations">Calculations <a href="#calculations" title="Permalink">#</a></h2>

Most functions of math.js support complex numbers. Complex and real numbers
can be used together.

```js
const a = math.complex(2, 3)     // Complex 2 + 3i
const b = math.complex('4 - 2i') // Complex 4 - 2i

math.re(a)                       // Number 2
math.im(a)                       // Number 3
math.conj(a)                     // Complex 2 - 3i

math.add(a, b)                   // Complex 6 + i
math.multiply(a, 2)              // Complex 4 + 6i
math.sqrt(-4)                    // Complex 2i
```

<h2 id="api">API <a href="#api" title="Permalink">#</a></h2>
A `Complex` object created by `math.complex` contains the following properties and functions:

<h3 id="complexre">complex.re <a href="#complexre" title="Permalink">#</a></h3>

A number containing the real part of the complex number. Can be read and replaced.

<h3 id="complexim">complex.im <a href="#complexim" title="Permalink">#</a></h3>

A number containing the imaginary part of the complex number. Can be read and replaced.

<h3 id="complexclone">complex.clone() <a href="#complexclone" title="Permalink">#</a></h3>

Create a clone of the complex number.

<h3 id="complexequalsother">complex.equals(other) <a href="#complexequalsother" title="Permalink">#</a></h3>

Test whether a complex number equals another complex value.

  Two complex numbers are equal when both their real and imaginary parts are
  equal.

<h3 id="complexneg">complex.neg() <a href="#complexneg" title="Permalink">#</a></h3>

Returns a complex number with a real part and an imaginary part equal in magnitude but opposite in sign to the current complex number.

<h3 id="complexconjugate">complex.conjugate() <a href="#complexconjugate" title="Permalink">#</a></h3>

Returns a complex number with an equal real part and an imaginary part equal in magnitude but opposite in sign to the current complex number.

<h3 id="complexinverse">complex.inverse() <a href="#complexinverse" title="Permalink">#</a></h3>

Returns a complex number that is inverse of the current complex number.

<h3 id="complextovector">complex.toVector() <a href="#complextovector" title="Permalink">#</a></h3>

Get the vector representation of the current complex number. Returns an array of size 2.

<h3 id="complextojson">complex.toJSON() <a href="#complextojson" title="Permalink">#</a></h3>

Returns a JSON representation of the complex number, with signature
  `{mathjs: 'Complex', re: number, im: number}`.
  Used when serializing a complex number, see [Serialization](../core/serialization.html).

<h3 id="complextopolar">complex.toPolar() <a href="#complextopolar" title="Permalink">#</a></h3>

Get the polar coordinates of the complex number, returns
  an object with properties `r` and `phi`.

<h3 id="complextostring">complex.toString() <a href="#complextostring" title="Permalink">#</a></h3>

Returns a string representation of the complex number, formatted
  as `a + bi` where `a` is the real part and `b` the imaginary part.


<h3 id="complexformatprecision-number">complex.format([precision: number]) <a href="#complexformatprecision-number" title="Permalink">#</a></h3>

Get a string representation of the complex number,
  formatted as `a + bi` where `a` is the real part and `b` the imaginary part.
  If precision is defined, the units value will be rounded to the provided
  number of digits.

<h2 id="static-methods">Static methods <a href="#static-methods" title="Permalink">#</a></h2>
The following static methods can be accessed using `math.Complex`


<h3 id="complexfromjsonjson">Complex.fromJSON(json) <a href="#complexfromjsonjson" title="Permalink">#</a></h3>

Revive a complex number from a JSON object. Accepts
  An object `{mathjs: 'Complex', re: number, im: number}`, where the property
  `mathjs` is optional.
  Used when deserializing a complex number, see [Serialization](../core/serialization.html).

<h3 id="complexfrompolarr-number-phi-number">Complex.fromPolar(r: number, phi: number) <a href="#complexfrompolarr-number-phi-number" title="Permalink">#</a></h3>

Create a complex number from polar coordinates.


<h3 id="complexcomparea-complex-b-complex">Complex.compare(a: Complex, b: Complex) <a href="#complexcomparea-complex-b-complex" title="Permalink">#</a></h3>

Returns the comparision result of two complex number:

- Returns 1 when the real part of `a` is larger than the real part of `b`
- Returns -1 when the real part of `a` is smaller than the real part of `b`
- Returns 1 when the real parts are equal
  and the imaginary part of `a` is larger than the imaginary part of `b`
- Returns -1 when the real parts are equal
  and the imaginary part of `a` is smaller than the imaginary part of `b`
- Returns 0 when both real and imaginary parts are equal.

Example:
```js
const a = math.complex(2, 3)   // Complex 2 + 3i
const b = math.complex(2, 1)   // Complex 2 + 1i
math.Complex.compare(a,b) // returns 1

//create from json 
const c = math.Complex.fromJSON({mathjs: 'Complex', re: 4, im: 3})  // Complex 4 + 3i
```
