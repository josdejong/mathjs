# math.js changelog
https://github.com/josdejong/mathjs


## (not yet released), version 0.5.0

*Note: version 0.5 is incompatible with previous versions.*

- Implemented data types Matrix and Range.
- Implemented methods clone, diag, size, squeeze, identity.
- Changed: moved all type constructors in the namespace under math.type,
  created construction methods for easy object creation. For example, a complex
  value is now created with "math.complex(2, 3)" instead of
  "new math.Complex(2, 3)".
- Changed: moved the Parser, Workspace, etc to the namespace math.expr, and
  created construction methods for easy object creation. For example a parser
  is now created by "math.parser()" instead of "new math.parser.Parser()".
- Changed: changed operator precedence of the power operator:
  - it is now right associative instead of left associative like most scripting
    languages. So 2^3^4 is now calculated as 2^(3^4).
  - it has now higher precedence than unary minus most languages, thus -3^2 is
    now calculated as -(3^2).
- Changed: renamed the parsers method 'put' into 'set'.
- Fixed: method 'in' did not check for units to have the same base.


## 2013-03-16, version 0.4.0

- Implemented Array support for all methods.
- Implemented Array support in the Parser.
- Implemented method format.
- Implemented parser for units, math.Unit.parse(str).
- Improved parser for complex values math.Complex.parse(str);
- Improved method help: it now evaluates the examples.
- Fixed: a scoping issue with the Parser when defining functions.
- Fixed: method 'typeof' was not working well with minified and mangled code.
- Fixed: errors in determining the best prefix for a unit.


## 2013-03-09, version 0.3.0

- Implemented Workspace
- Implemented methods cot, csc, sec.
- Implemented Array support for methods with one parameter.


## 2013-02-25, version 0.2.0

- Parser, Scope, and Node tree implemented.
- Implemented method import which makes it easy to extend math.js.
- Implemented methods arg, conj, cube, equal, factorial, im, largereq,
  log(x, base), log10, mod, re, sign, smallereq, square, unequal.


## 2013-02-18, version 0.1.0

- Reached full compatibility with Javascripts built-in Math library.
- More functions implemented.
- Some bugfixes.


## 2013-02-16, version 0.0.2

- All constants of Math implemented, plus the imaginary unit i.
- Data types Complex and Unit implemented.
- First set of functions implemented.


## 2013-02-15, version 0.0.1

- First publish of the mathjs package. (package is still empty)
