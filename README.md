![math.js](https://raw.github.com/josdejong/mathjs/master/img/mathjs.png)

[http://mathjs.org](http://mathjs.org)

Math.js is an extensive math library for JavaScript and Node.js.
It features real and complex numbers, units, matrices, a large set of
mathematical functions, and a flexible expression parser.
Powerful and easy to use.


## Features

- Supports numbers, complex numbers, units, strings, arrays, and matrices.
- Is compatible with JavaScript’s built-in Math library.
- Contains a flexible expression parser.
- Supports chained operations.
- Comes with a large set of built-in functions and constants.
- Has no dependencies. Runs on any JavaScript engine.
- Is easily extensible.


## Install

Math.js can be installed using [npm](https://npmjs.org/):

    npm install mathjs

Or using [bower](http://twitter.github.io/bower/):

    bower install mathjs

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
math.eval('1.2 / (2.3 + 0.7)');   // 0.4
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
Expressions can be evaluated in two ways:

- Using the function [`math.eval`](#eval), which uses a read-only parser.
- Using a more flexible [parser](#parser).


### Eval

Math.js comes with a function `math.eval` to evaluate expressions.
The function `eval` does support all functions, variables, and data types
available in math.js. Internally, the function `eval` uses a read-only parser.
The following code demonstrates how to evaluate expressions.

```js
// load math.js
var math = require('mathjs');

// evaluate expressions
var a = math.eval('sqrt(3^2 + 4^2)');   // a = 5
var b = math.eval('sqrt(-4)');          // b = 2i
var c = math.eval('2 inch in cm');      // c = 5.08 cm
var d = math.eval('cos(45 deg)');       // d = 0.7071067811865476
```


### Parser

The parser of math.js supports all functions, variables, and data types
available in math.js. Additionally, it supports variable and function
assignments. A parser can be created by:

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
var a = parser.eval('sqrt(3^2 + 4^2)'); // a = 5
var b = parser.eval('sqrt(-4)');        // b = 2i
var c = parser.eval('2 inch in cm');    // c = 5.08 cm
var d = parser.eval('cos(45 deg)');     // d = 0.7071067811865476

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
    .set([1, 1], 8)
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
 - `get(index)`
   Get a subselection of the selectors value. Only applicable when
   the value has a function get, for example when value is a Matrix
   or Array.
 - `set(index, replacement)`
   Replace a subselection of the selectors value. Only applicable
   when the value has a function get, for example when value is a
   Matrix or Array.



## Workspace

Math.js features a workspace, which manages a set of expressions.
Expressions can be added, replace, deleted, and inserted in the workspace.
The workspace keeps track on the dependencies between the expressions,
and automatically updates results of depending expressions when variables
or function definitions are changed in the workspace.

```js
// load math.js
var math = require('mathjs');

// create a workspace
var workspace = math.workspace();

// add expressions to the workspace
var id0 = workspace.append('a = 3/4');
var id1 = workspace.append('a + 2');
workspace.getResult(id1); // 2.75

// replace expressions in the workspace
workspace.replace('a=5/2', id0);
workspace.getResult(id1); // 4.5
```

Available methods:

    var id = workspace.append(expr);
    var id = workspace.insertBefore(expr, beforeId);
    var id = workspace.insertAfter(expr, afterId);
    workspace.replace(expr, id);
    workspace.remove(id);
    workspace.clear();
    var expr    = workspace.getExpr(id);
    var result  = workspace.getResult(id);
    var deps    = workspace.getDependencies(id);
    var changes = workspace.getChanges(updateSeq);


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
Units can be converted from one to another using method `in`,
an the value of a unit can be retrieved using `toNumber`.

```js
var a = math.unit(55, 'cm');    // 550 mm
var b = math.unit('0.1m');      // 100 mm
math.add(a, b);                 // 0.65 m
b.in('cm');                     // 10 cm  Alternatively: math.in(b, 'cm')
b.toNumber('cm');               // 10

var parser = math.parser();
parser.eval('2 inch in cm');    // 5.08 cm
parser.eval('cos(45 deg)');     // 0.7071067811865476
```

### Array and Matrix

Math.js supports n-dimensional arrays and matrices. Both regular JavaScript
`Array` and the math.js `Matrix` can be used interchangeably in all math.js
functions.

A `Matrix` is an object wrapped around a regular JavaScript Array, providing
utility methods for easy matrix manipulation such as `get`, `set`, `size`,
`resize`, `clone`, and more.

```js
var matrix = math.matrix([1, 4, 9, 16, 25]);    // Matrix, [1, 4, 9, 16, 25]
math.sqrt(matrix);                              // Matrix, [1, 2, 3, 4, 5]

var array = [1, 2, 3, 4, 5];
math.factorial(array);                          // Array,  [1, 2, 6, 24, 120]

var a = [[1, 2], [3, 4]];                       // Array,  [[1, 2], [3, 4]]
var b = math.matrix([[5, 6], [1, 1]]);          // Matrix, [[5, 6], [1, 1]]
b.set([2, [1, 2]], [[7, 8]]);                   // Matrix, [[5, 6], [7, 8]]
var c = math.multiply(a, b);                    // Matrix, [[19, 22], [43, 50]]
var d = c.get([2, 1]);                          // 43
```

Matrices are supported by the parser:

```js
parser = math.parser();

parser.eval('a = [1, 2; 3, 4]');                // Matrix, [[1, 2], [3, 4]]
parser.eval('b = [5, 6; 7, 8]');                // Matrix, [[5, 6], [1, 1]]
parser.eval('b(2, 1:2) = [7, 8]');              // Matrix, [[5, 6], [7, 8]]
parser.eval('c = a * b');                       // Matrix, [[19, 22], [43, 50]]
parser.eval('d = c(2, 1)');                     // 43
```


### Range

A `Range` creates a range with a start, end, and optionally a step.
A `Range` can be used to create indexes to get or set submatrices.

```js
var math = require('math.js'),
    parser = math.parser();

math.factorial(math.range(1,5));                // Array,  [1, 2, 6, 24, 120]

var a = math.matrix();                          // Matrix, []
a.set([math.range('2:5')], [7, 2, 1, 5]);       // Matrix, [0, 7, 2, 1, 5]

var b = math.range(2, -1, -2);                  // Range, 2:-1:-2
var c = b.valueOf();                            // Array,  [2, 1, 0, -1, -2]

var d = parser.eval('3:7');                     // Range, 3:7
```


## Constants

Math.js has the following built-in constants.

- math.E, math.e
- math.I, math.i
- math.LN2
- math.LN10
- math.LOG2E
- math.LOG10E
- math.PI, math.pi
- math.SQRT1_2
- math.SQRT2


## Methods

Math.js contains the following methods. The methods support all available data
types (Number, Complex, Unit, String, and Array) where applicable.

### Arithmetic

- math.abs(x)
- math.add(x, y)
- math.ceil(x)
- math.cube(x)
- math.divide(x, y)
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
- math.unaryminus(x)
- math.unequal(x)
- math.xgcd(a, b)

### Complex

- math.re(x)
- math.im(x)
- math.arg(x)
- math.conj(x)

### Matrix

- math.concat(a, b, c, ... [, dim])
- math.det(x)
- math.diag(x)
- math.eye(m, n, p, ...)
- math.inv(x)
- math.ones(m, n, p, ...)
- math.size(x)
- math.squeeze(x)
- math.transpose(x)
- math.zeros(m, n, p, ...)

### Probability

- math.factorial(x)
- math.random()

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
- math.eval(expr)
- math.format([template, ] values)
- math.import(filename | object, override)
- math.select([x])
- math.typeof(x)


## Extend

The library can easily be extended with functions and variables using the
`import` method. The method `import` accepts a filename or an object with
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

To import functions from a math library like
[numbers.js](https://github.com/sjkaliski/numbers.js),
the library must be installed using npm:

    npm install numbers

And next, the library can be imported into math.js:

```js
var math = require('mathjs'),
    parser = math.parser();

// import the numbers.js library into math.js
math.import('numbers');

// use functions from numbers.js
math.fibonacci(7);                      // 7
parser.eval('fibonacci(7)');            // 7
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

Alternatively, when jake is not installed on your system, the project can be
build by running `npm install` in the root of the project. npm will then
use a local installation of jake to build the project.


## Test

To execute tests for the library, run:

    npm test


## Roadmap

Before version 1.0:

- More on matrices
- Examples and documentation
- Extensive testing


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
