# math.js history
https://github.com/josdejong/mathjs


## 2013-09-03, version 0.13.0

- Implemented support for booleans in all relevant functions.
- Implemented functions `map` and `forEach`. Thanks Sebastien Piquemal (sebpic).
- All construction functions can be used to convert the type of variables,
  also element-wise for all elements in an Array or Matrix.
- Changed matrix indexes of the expression parser to one-based with the
  upper-bound included, similar to most math applications. Note that on a
  JavaScript level, math.js uses zero-based indexes with excluded upper-bound.
- Removed support for scalars in the function `subset`, it now only supports
  Array, Matrix, and String.
- Removed the functions `get` and `set` from a selector, they are a duplicate
  of the function `subset`.
- Replaced functions `get` and `set` of `Matrix` with a single function
  `subset`.
- Some moving around with code and namespaces:
  - Renamed namespace `math.expr` to `math.expression` (contains Scope, Parser,
    node objects).
  - Renamed namespace `math.docs` to `math.expression.docs`.
  - Moved `math.expr.Selector` to `math.chaining.Selector`.
- Fixed some edge cases in functions `lcm` and `xgcd`.


## 2013-08-22, version 0.12.1

- Fixed outdated version of README.md.
- Fixed a broken unit test.


## 2013-08-22, version 0.12.0

*WARNING: version 0.12 is incompatible with previous versions.*

- Implemented functions `random([min, max])`, `randomInt([min, max])`,
  `pickRandom(array)`. Thanks Sebastien Piquemal (sebpic).
- Implemented function `distribution(name)`, generating a distribution object
  with functions `random`, `randomInt`, `pickRandom` for different
  distributions. Currently supporting `uniform` and `normal`.
- Changed the behavior of `range` to exclude the upper bound, so `range(1, 4)`
  now returns `[1, 2, 3]` instead of `[1, 2, 3, 4]`.
- Changed the syntax of `range`, which is now `range(start, end [, step])`
  instead of `range(start, [step, ] end)`.
- Changed the behavior of `ones` and `zeros` to geometric dimensions, for
  example `ones(3)` returns a vector with length 3, filled with ones, and
  `ones(3,3)` returns a 2D array with size [3, 3].
- Changed the return type of `ones` and `zeros`: they now return an Array when
  arguments are Numbers or an Array, and returns a Matrix when the argument
  is a Matrix.
- Change matrix index notation in parser from round brackets to square brackets,
  for example `A[0, 0:3]`.
- Removed the feature introduced in v0.10.0 to automatically convert a complex
  value with an imaginary part equal to zero to a number.
- Fixed zeros being formatted as null. Thanks TimKraft.


## 2013-07-23, version 0.11.1

- Fixed missing development dependency


## 2013-07-23, version 0.11.0

*WARNING: version 0.11 is incompatible with previous versions.*

- Changed math.js from one-based to zero-based indexes.
  - Getting and setting matrix subset is now zero-based.
  - The dimension argument in function `concat` is now zero-based.
- Improvements in the string output of function help.
- Added constants `true` and `false`.
- Added constructor function `boolean`.
- Fixed function `select` not accepting `0` as input.
  Thanks Elijah Manor (elijahmanor).
- Parser now supports multiple unary minus operators after each other.
- Fixed not accepting empty matrices like `[[], []]`.
- Some fixes in the end user documentation.


## 2013-07-08, version 0.10.0

- For complex calculations, all functions now automatically replace results
  having an imaginary part of zero with a Number. (`2i * 2i` now returns a
  Number `-4` instead of a Complex `-4 + 0i`).
- Implemented support for injecting custom node handlers in the parser. Can be
  used for example to implement a node handler for plotting a graph.
- Implemented end user documentation and a new `help` function.
- Functions `size` and `squeeze` now return a Matrix instead of an Array as
  output on Matrix input.
- Added a constant tau (2 * pi). Thanks Zak Zibrat (palimpsests).
- Renamed function `unaryminus` to `unary`.
- Fixed a bug in determining node dependencies in function assignments.


## 2013-06-14, version 0.9.1

- Implemented element-wise functions and operators: `emultiply` (`x .* y`),
  `edivide` (`x ./ y`), `epow` (`x .^ y`).
- Added constants `Infinity` and `NaN`.
- Removed support for Workspace to keep the library focused on its core task.
- Fixed a bug in the Complex constructor, not accepting NaN values.
- Fixed division by zero in case of pure complex values.
- Fixed a bug in function multiply multiplying a pure complex value with
  Infinity.


## 2013-05-29, version 0.9.0

- Implemented function `math.parse(expr [,scope])`. Optional parameter scope can
  be a plain JavaScript Object containing variables.
- Extended function `math.expr(expr [, scope])` with an additional parameter
  `scope`, similar to `parse`. Example: `math.eval('x^a', {x:3, a:2});`.
- Implemented function `subset`, to get or set a subset from a matrix, string,
  or other data types.
- Implemented construction functions number and string (mainly useful inside
  the parser).
- Improved function `det`. Thanks Bryan Cuccioli (bcuccioli).
- Moved the parse code from prototype math.expr.Parser to function math.parse,
  simplified Parser a little bit.
- Strongly simplified the code of Scope and Workspace.
- Fixed function mod for negative numerators, and added error messages in case
  of wrong input.


## 2013-05-18, version 0.8.2

- Extended the import function and some other minor improvements.
- Fixed a bug in merging one dimensional vectors into a matrix.
- Fixed a bug in function subtract, when subtracting a complex number from a
  real number.


## 2013-05-10, version 0.8.1

- Fixed an npm warning when installing mathjs globally.


## 2013-05-10, version 0.8.0

- Implemented a command line interface. When math.js is installed globally via
  npm, the application is available on your system as 'mathjs'.
- Implemented `end` keyword for index operator, and added support for implicit
  start and end (expressions like `a(2,:)` and `b(2:end,3:end-1)` are supported
  now).
- Function math.eval is more flexible now: it supports variables and multi-line
  expressions.
- Removed the read-only option from Parser and Scope.
- Fixed non-working unequal operator != in the parser.
- Fixed a bug in resizing matrices when replacing a subset.
- Fixed a bug in updating a subset of a non-existing variable.
- Minor bug fixes.


## 2013-05-04, version 0.7.2

- Fixed method unequal, which was checking for equality instead of inequality.
  Thanks FJS2.


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
  number with multiple decimal separators like `2.3.4`.
- Fixed a bug in Workspace.insertAfter.
- Fixed: math.js now works on IE 6-8 too.


## 2013-04-20, version 0.7.0

- Implemented method `math.eval`, which uses a readonly parser to evaluate
  expressions.
- Implemented method `xgcd` (extended eucledian algorithm). Thanks Bart Kiers
  (bkiers).
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

*WARNING: version 0.5 is incompatible with previous versions.*

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
