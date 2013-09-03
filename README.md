![math.js](https://raw.github.com/josdejong/mathjs/master/img/mathjs.png)

[http://mathjs.org](http://mathjs.org)

Math.js is an extensive math library for JavaScript and Node.js.
It features a flexible expression parser and offers an integrated solution
to work with real and complex numbers, units, and matrices.
Powerful and easy to use.


## Features

- Supports numbers, complex numbers, units, strings, arrays, and matrices.
- Is compatible with JavaScript's built-in Math library.
- Contains a flexible expression parser.
- Supports chained operations.
- Comes with a large set of built-in functions and constants.
- Has no dependencies. Runs on any JavaScript engine.
- Can be used as a command line application as well.
- Is easily extensible.


## Install

Math.js can be installed using npm, bower, or by just downloading the library.

WARNING: math.js is in early stage and the API is not yet stabilized.
Please be careful when upgrading to a newer version.
An overview of the changes is available
[here](https://github.com/josdejong/mathjs/blob/master/HISTORY.md).

### npm
Math.js can be installed using [npm](https://npmjs.org/):

    npm install mathjs

Note: when installed globally (using the `-g` option), math.js is available as
a command line application `mathjs`, see section
[command line interface](#command-line-interface-cli).

### bower
Or using [bower](http://twitter.github.io/bower/):

    bower install mathjs

### download
Or by downloading the latest version from
[mathjs.org](http://mathjs.org/#install_or_download):

- [math.js](http://mathjs.org/js/lib/math.js) (Development version)
- [math.min.js](http://mathjs.org/js/lib/math.min.js) (Production version)


## Load

### Node.js

Load math.js in [node.js](http://nodejs.org/):

```js
var math = require('mathjs');

math.sqrt(-4); // 2i
```

### Browser

Math.js can be loaded as a regular javascript file in the browser:

```html
<!DOCTYPE HTML>
<html>
<head>
    <script src="math.js" type="text/javascript"></script>
</head>
<body>
    <script type="text/javascript">
        math.sqrt(-4); // 2i
    </script>
</body>
</html>
```

### Require.js

Load math.js in the browser using [require.js](http://requirejs.org/):

```js
require.config({
    paths: {
        mathjs: 'path/to/mathjs',
    }
});
require(['mathjs'], function (math) {
    math.sqrt(-4); // 2i
});
```


## Use

Math.js can be used similar to JavaScript's built-in Math library. Besides that,
math.js can evaluate expressions (see [Expressions](#expressions)) and supports
chained operations (see [Chained operations](#chained-operations)).

The example code below shows how to use math.js. More examples can be found in the
[examples directory](https://github.com/josdejong/mathjs/tree/master/examples/).

```js
// load math.js
var math = require('mathjs');

// functions and constants
math.round(math.e, 3);            // 2.718
math.atan2(3, -3) / math.pi;      // 0.75
math.log(1000, 10);               // 3
math.sqrt(-4);                    // 2i
math.pow([[-1, 2], [3, 1]], 2);   // [[7, 0], [0, 7]]

// expressions
math.eval('12 / (2.3 + 0.7)');    // 4
math.eval('5.08 cm in inch');     // 2 inch
math.eval('sin(45 deg) ^ 2');     // 0.5
math.eval('9 / 3 + 2i');          // 3 + 2i
math.eval('det([-1, 2; 3, 1])');  // -7

// chained operations
math.select(3)
    .add(4)
    .multiply(2)
    .done(); // 14
```


## Expressions

Math.js contains a flexible and easy to use expression parser.
The parser supports all data types, methods and constants available in math.js.
Expressions can be evaluated in various ways:

- Using the function [`math.eval(expr [,scope])`](#eval).
- Using the function [`math.parse(expr [,scope])`](#parse).
- By creating a [parser](#parser), `math.parser()`, which contains functions
  `eval`, `parse`, and keeps a scope with assigned variables in memory.


### Eval

Math.js comes with a function `math.eval` to evaluate expressions. Syntax:

```js
math.eval(expr)
math.eval(expr, scope)
math.eval([expr1, expr2, expr3, ...])
math.eval([expr1, expr2, expr3, ...], scope)
```

Function `eval` accepts a single expression or an array with
expressions as first argument, and has an optional second argument
containing a scope with variables and functions. The scope is a regular
JavaScript Object. The scope will be used to resolve symbols, and to write
assigned variables or function.

The following code demonstrates how to evaluate expressions.

```js
// load math.js
var math = require('mathjs');

// evaluate expressions
math.eval('sqrt(3^2 + 4^2)');           // 5
math.eval('sqrt(-4)');                  // 2i
math.eval('2 inch in cm');              // 5.08 cm
math.eval('cos(45 deg)');               // 0.7071067811865476

// provide a scope
var scope = {
    a: 3,
    b: 4
};
math.eval('a * b', scope);              // 12
math.eval('c = 2.3 + 4.5', scope);      // 6.8
scope.c;                                // 6.8
```

### Parse

Math.js contains a function `math.parse` to parse expressions into a node
tree. The syntax is similar to [`math.eval`](#eval):

```js
math.parse(expr)
math.parse(expr, scope)
math.parse([expr1, expr2, expr3, ...])
math.parse([expr1, expr2, expr3, ...], scope)
```

Function `parse` accepts a single expression or an array with
expressions as first argument, and has an optional second argument
containing a scope with variables and functions. The scope is a regular
JavaScript Object. The scope will be used to resolve symbols, and to write
assigned variables or function. Variables are linked dynamically to the
provided scope.

Example usage:

```js
// load math.js
var math = require('mathjs');

// parse an expression into a node, and evaluate the node
var node1 = math.parse('sqrt(3^2 + 4^2)');
node1.eval(); // 5

// provide a scope
var scope = {
    x: 3,
    a: 2
};
var node2 = math.parse('x^a', scope);
node2.eval(); // 9

// change a value in the scope and re-evaluate the node
scope.a = 3;
node2.eval(); // 27
```


### Parser

In addition to the static functions [`math.eval`](#eval) and
[`math.parse`](#parse), math.js contains a parser with functions `eval` and
`parse`, which automatically keeps a scope with assigned variables in memory.
The parser also contains some convenience methods to get, set, and remove
variables from memory.

A parser can be created by:

```js
var parser = math.parser();
```

The parser contains the following methods:

- `clear()`
  Completely clear the parsers scope.
- `eval(expr)`
  Evaluate an expression.
- `get(name)`
  Retrieve a variable or function from the parsers scope.
- `parse(expr)`
  Parse an expression into a node tree.
- `remove(name)`
  Remove a variable or function from the parsers scope.
- `set(name, value)`
  Set a variable or function in the parsers scope.
  A node can be evaluated as `node.eval()`.

The following code shows how to create and use a parser.

```js
// load math.js
var math = require('mathjs');

// create a parser
var parser = math.parser();

// evaluate expressions
parser.eval('sqrt(3^2 + 4^2)');         // 5
parser.eval('sqrt(-4)');                // 2i
parser.eval('2 inch in cm');            // 5.08 cm
parser.eval('cos(45 deg)');             // 0.7071067811865476

// define variables and functions
parser.eval('x = 7 / 2');               // 3.5
parser.eval('x + 3');                   // 6.5
parser.eval('function f(x, y) = x^y');  // f(x, y)
parser.eval('f(2, 3)');                 // 8

// get and set variables and functions
var x = parser.get('x');                // x = 7
var f = parser.get('f');                // f = function
var g = f(3, 3);                        // g = 27
parser.set('h', 500);
parser.eval('h / 2');                   // 250
parser.set('hello', function (name) {
    return 'hello, ' + name + '!';
});
parser.eval('hello("user")');           // "hello, user!"

// clear defined functions and variables
parser.clear();
```


## Chained operations

Math.js supports chaining operations by wrapping a value into a `Selector`.
A selector can be created with the function `math.select(value)`.
All methods available in the math namespace can be executed via the selector.
The methods will be executed with the selectors value as first argument,
followed by extra arguments provided by the function call itself.

```js
math.select(3)
    .add(4)
    .subtract(2)
    .done(); // 5

math.select( [[1, 2], [3, 4]] )
    .subset(math.index(0, 0), 8)
    .multiply(3)
    .done(); // [[24, 6], [9, 12]]
```

The Selector has a number of special functions:

 - `done()`
   Finalize the chained operation and return the selectors value.
 - `valueOf()`
   The same as `done()`, returns the selectors value.
 - `toString()`
   Executes `math.format(value)` onto the selectors value, returning
   a string representation of the value.


## Data types

Math.js supports both native data types like Number, String, and Array,
as well as advanced data types like Complex and Unit.

### Number

The built-in type Number can be used in all methods.

```js
math.subtract(7.1, 2.3);        // 4.8
math.round(math.pi, 3);         // 3.142
math.sqrt(new Number(4.41e2));  // 21
```

### String

The built-in type String can be used in applicable methods.

```js
math.add('hello ', 'world');    // 'hello world'
math.max('A', 'D', 'C');        // 'D'
```

### Complex

Math.js supports complex numbers. Most methods can be executed with complex
numbers as arguments.

```js
var a = math.complex(2, 3);     // 2 + 3i
a.re;                           // 2
a.im;                           // 3
var b = math.complex('4 - 2i'); // 4 - 2i
math.add(a, b);                 // 6 + i
math.sqrt(-4);                  // 2i
```

### Unit

Math.js supports units. Basic operations `add`, `subtract`, `multiply`,
and `divide` can be performed on units.
Trigonometric methods like `sin` support units with an angle as argument.
Units can be converted from one to another using function `in`,
an the value of a unit can be retrieved using `toNumber`.

```js
var a = math.unit(55, 'cm');    // 550 mm
var b = math.unit('0.1m');      // 100 mm
math.add(a, b);                 // 0.65 m
b.in('cm');                     // 10 cm  Alternatively: math.in(b, 'cm')
b.toNumber('cm');               // 10

math.eval('2 inch in cm');      // 5.08 cm
math.eval('cos(45 deg)');       // 0.7071067811865476
```

### Array and Matrix

Math.js supports n-dimensional arrays and matrices. Both regular JavaScript
`Array` and the math.js `Matrix` can be used interchangeably in all math.js
functions.

A `Matrix` is an object wrapped around a regular JavaScript Array, providing
utility methods for easy matrix manipulation such as `subset`, `size`,
`resize`, `clone`, and more.

Matrix indexes in math.js are zero-based, like most programming languages
including JavaScript itself.
The lower-bound of a range is included, the upper-bound is excluded.
Note that mathematical applications like Matlab and Octave work differently,
as they use one-based indexes and include the upper-bound of a range.

```js
var matrix = math.matrix([1, 4, 9, 16, 25]);    // Matrix, [1, 4, 9, 16, 25]
math.sqrt(matrix);                              // Matrix, [1, 2, 3, 4, 5]

var array = [1, 2, 3, 4, 5];
math.factorial(array);                          // Array,  [1, 2, 6, 24, 120]

var a = [[1, 2], [3, 4]];                       // Array,  [[1, 2], [3, 4]]
var b = math.matrix([[5, 6], [1, 1]]);          // Matrix, [[5, 6], [1, 1]]
b.subset(math.index(1, [0, 2]), [[7, 8]]);      // Matrix, [[5, 6], [7, 8]]
var c = math.multiply(a, b);                    // Matrix, [[19, 22], [43, 50]]
var d = c.subset(math.index(1, 0));             // 43
```

Matrices are supported by the parser. *IMPORTANT:* matrix indexes and ranges work
different from the indexes in JavaScript: They are one-based with an included
upper-bound, similar to most math applications.


```js
parser = math.parser();

parser.eval('a = [1, 2; 3, 4]');                // Matrix, [[1, 2], [3, 4]]
parser.eval('b = zeros(2, 2)');                 // Matrix, [[0, 0], [0, 0]]
parser.eval('b(1, 1:2) = [5, 6]');              // Matrix, [[5, 6], [0, 0]]
parser.eval('b(2, :) = [7, 8]');                // Matrix, [[5, 6], [7, 8]]
parser.eval('c = a * b');                       // Matrix, [[19, 22], [43, 50]]
parser.eval('d = c(2, 1)');                     // 43
parser.eval('e = c(2, 1:end)');                 // Matrix, [[43, 50]]
```


## Constants

Math.js has the following built-in constants.

- math.E, math.e
- math.I, math.i
- math.Infinity
- math.LN2
- math.LN10
- math.LOG2E
- math.LOG10E
- math.NaN
- math.PI, math.pi
- math.SQRT1_2
- math.SQRT2


## Operators

The following operators are available in the expression parser of math.js.

- x + y (add)
- x - y (subtract)
- x * y (multiply)
- x .* y (element-wise multiply)
- x / y (divide)
- x ./ y (element-wise divide)
- x % y (mod)
- x ^ y (power)
- x ^ y (element-wise power)
- -y (unary minus)
- y' (transpose)
- y! (factorial)
- x = y (assignment)
- x : y (range)
- x in y (unit conversion)
- x == y (equal)
- x != y (unequal)
- x < y (smaller)
- x > y (larger)
- x <= y (smallereq)
- x >= y (largereq)


## Methods

Math.js contains the following methods. The methods support all available data
types (Number, Complex, Unit, String, and Array) where applicable.

### Arithmetic

- math.abs(x)
- math.add(x, y)
- math.ceil(x)
- math.cube(x)
- math.divide(x, y)
- math.edivide(x, y)
- math.emultiply(x, y)
- math.epow(x, y)
- math.equal(x)
- math.exp(x)
- math.fix(x)
- math.floor(x)
- math.gcd(a, b, c, ...)
- math.larger(x, y)
- math.largereq(x, y)
- math.lcm(a, b, c, ...)
- math.log(x [, base])
- math.log10(x)
- math.mod(x, y)
- math.multiply(x, y)
- math.pow(x, y)
- math.round(x [, n])
- math.sign()
- math.smaller(x, y)
- math.smallereq(x, y)
- math.subtract(x, y)
- math.sqrt(x)
- math.square(x)
- math.unary(x)
- math.unequal(x)
- math.xgcd(a, b)

### Complex

- math.re(x)
- math.im(x)
- math.arg(x)
- math.conj(x)

### Construction

- math.boolean(x)
- math.complex(re, im)
- math.index(a, b, c, ...)
- math.matrix(x)
- math.number(x)
- math.parser()
- math.string(x)
- math.unit(x)

### Expression

- math.eval(expr [, scope])
- math.help(text)
- math.parse(expr [, scope])

### Matrix

- math.concat(a, b, c, ... [, dim])
- math.det(x)
- math.diag(x)
- math.eye(m, n, p, ...)
- math.inv(x)
- math.ones(m, n, p, ...)
- math.range(start, end [, step])
- math.size(x)
- math.squeeze(x)
- math.subset(x, index [, replacement])
- math.transpose(x)
- math.zeros(m, n, p, ...)

### Probability

- math.factorial(x)
- math.random([min, max])
- math.randomInt([min, max])
- math.pickRandom([min, max])
- math.distribution(name)

### Statistics

- math.max(a, b, c, ...)
- math.min(a, b, c, ...)

### Trigonometry

- math.acos(x)
- math.asin(x)
- math.atan(x)
- math.atan2(y, x)
- math.cos(x)
- math.cot(x)
- math.csc(x)
- math.sec(x)
- math.sin(x)
- math.tan(x)

### Units

- math.in(x, unit)

### Utils

- math.clone(x)
- math.forEach(x, callback)
- math.format([template, ] values)
- math.import(filename | object, override)
- math.map(x, callback)
- math.select([x])
- math.typeof(x)


## Extend

The library can easily be extended with functions and variables using the
`import` function. The function `import` accepts a filename or an object with
functions and variables.

```js
var math = require('mathjs');

// define new functions and variables
math.import({
    myvalue: 42,
    hello: function (name) {
        return 'hello, ' + name + '!';
    }
});

// defined methods can be used in both JavaScript as well as the parser
math.myvalue * 2;               // 84
math.hello('user');             // 'hello, user!'

var parser = math.parser();
parser.eval('myvalue + 10');    // 52
parser.eval('hello("user")');   // 'hello, user!'
```

External libraries like
[numbers.js](https://github.com/sjkaliski/numbers.js) and
[numeric.js](http://numericjs.com/) can be imported as well.
The libraries must be installed using npm:

    npm install numbers
    npm install numeric

The libraries can be easily imported into math.js using `import`. By default,
existing functions will not be overwritten, and math.js will create a wrapper
function around the imported functions which converts data types like `Matrix`
to primitive types like `Array`.

```js
var math = require('mathjs');

// import the numbers.js and numeric.js libraries into math.js
math.import('numbers');
math.import('numeric');

// use functions from numbers.js
math.fibonacci(7);                          // 13
math.eval('fibonacci(7)');                  // 13

// use functions from numeric.js
math.eval('eig([1, 2; 4, 3])').lambda.x;    // [5, -1]
```


## Command Line Interface (CLI)

When math.js is installed globally using npm, its expression parser can be used
from the command line. To install math.js globally:

    npm install -g mathjs

Normally, a global installation must be run with admin rights (precede the
command with `sudo`). After installation, the application `mathjs` is available:

```bash
$ mathjs
> 12 / (2.3 + 0.7)
4
> 5.08 cm in inch
2 inch
> sin(45 deg) ^ 2
0.5
> 9 / 3 + 2i
3 + 2i
> det([-1, 2; 3, 1])
-7
```

The command line interface can be used open a prompt, to execute a script,
or to pipe input and output streams:

```bash
$ mathjs                                 # Open a command prompt
$ mathjs script.txt                      # Run a script file, output to console
$ mathjs script.txt > results.txt        # Run a script file, output to file
$ cat script.txt | mathjs                # Run input stream, output to console
$ cat script.txt | mathjs > results.txt  # Run input stream, output to file
```


## Build

First clone the project from github:

    git clone git://github.com/josdejong/mathjs.git

The project uses [jake](https://github.com/mde/jake) as build tool.
To be able to run jake from the command line, jake must be installed globally:

    sudo npm install -g jake

Then, the project can be build by executing jake in the root of the project:

    cd mathjs
    jake

This will build the library math.js and math.min.js from the source files and
execute tests.


## Test

To execute tests for the library, run:

    npm test


## Contribute

We can't do this alone. Contributions to the math.js library are very welcome!
You can contribute in different ways: spread the word, report bugs, come up with
ideas and suggestions, and contribute to the code.

There are a few preferences regarding code contributions:

- Math.js follows the node.js code style as described
  [here](http://nodeguide.com/style.html).
- Send pull requests to the `develop` branch, not the `master` branch.
- Only commit changes done in the source files under `lib`, not to the builds, which are under `dist`.
  builds `math.js` and `math.min.js`.

Thanks!


## Roadmap

Version 1.0:

- An expression parser.
- A basic set of functions and constants.
- Data types Number, Complex, Matrix, Unit, String.
- Examples and documentation.
- Extensive testing.

Version 2.0:

- A basic set of functions covering all common mathematical areas.
- Functions and data types for numeral systems: Bin, Oct, Hex, Dec.
- Arbitrary precision calculations with a BigNumber data type.
- Support for derived units (like km/h, kg*m/s2, etc).


## License

Copyright (C) 2013 Jos de Jong <wjosdejong@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.