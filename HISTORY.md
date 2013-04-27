# math.js history
https://github.com/josdejong/mathjs


## 2013-04-27, version 0.7.1

- Improvements in the parser:
  - Added support for chained arguments.
  - Added support for chained variable assignments.
  - Added a function remove(name) to remove a variable from the parsers scope.
  - Renamed nodes for more consistency and to resolve naming conflicts.
  - Improved stringification of a node tree.
  - Some simplifications in the code.
  - Minor bug fixes.
- Fixed a bug in the parser, returning NaN instead of throwing an error for a
  number with multiple decimal separators like '2.3.4'.
- Fixed a bug in Workspace.insertAfter.
- Fixed: math.js now works on IE 6-8 too.


## 2013-04-20, version 0.7.0

- Implemented method `math.eval`, which uses a readonly parser to evaluate
  expressions.
- Implemented method `xgcd` (extended eucledian algorithm). Thanks Bart Kiers.
- Improved math.format, which now rounds values to a maximum number of digits
  instead of decimals (default is 5 digits, for example `math.format(math.pi)`
  returns `3.1416`).
- Added examples.
- Changed methods square and cube to evaluate matrices element wise (consistent
  with all other methods).
- Changed second parameter of method import to an object with options.
- Fixed method math.typeof on IE.
- Minor bug fixes and improvements.


## 2013-04-13, version 0.6.0

- Implemented chained operations via method math.select(). For example
  `math.select(3).add(4).subtract(2).done()` will return `5`.
- Implemented methods gcd and lcm.
- Implemented method `Unit.in(unit)`, which creates a clone of the unit with a
  fixed representation. For example `math.unit('5.08 cm').in('inch')` will
  return a unit which string representation always is in inch, thus `2 inch`.
  `Unit.in(unit)` is the same as method `math.in(x, unit)`.
- Implemented `Unit.toNumber(unit)`, which returns the value of the unit when
  represented with given unit. For example
  `math.unit('5.08 cm').toNumber('inch')` returns the number `2`, as the
  representation of the unit in inches has 2 as value.
- Improved: method `math.in(x, unit)` now supports a string as second parameter,
  for example `math.in(math.unit('5.08 cm'), 'inch')`.
- Split the end user documentation of the parser functions from the source files.
- Removed function help and the built-in documentation from the core library.
- Fixed constant i being defined as -1i instead of 1i.
- Minor bug fixes.


## 2013-04-06, version 0.5.0

*Note: version 0.5 is incompatible with previous versions.*

- Implemented data types Matrix and Range.
- Implemented matrix methods clone, concat, det, diag, eye, inv, ones, size,
  squeeze, transpose, zeros.
- Implemented range operator `:`, and transpose operator `'` in parser.
- Changed: created construction methods for easy object creation for all data
  types and for the parser. For example, a complex value is now created
  with `math.complex(2, 3)` instead of `new math.Complex(2, 3)`, and a parser
  is now created with `math.parser()` instead of `new math.parser.Parser()`.
- Changed: moved all data types under the namespace math.type, and moved the
  Parser, Workspace, etc. under the namespace math.expr.
- Changed: changed operator precedence of the power operator:
  - it is now right associative instead of left associative like most scripting
    languages. So `2^3^4` is now calculated as `2^(3^4)`.
  - it has now higher precedence than unary minus most languages, thus `-3^2` is
    now calculated as `-(3^2)`.
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
