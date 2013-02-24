![math.js](https://raw.github.com/josdejong/mathjs/master/img/mathjs.png)

[http://mathjs.org](http://mathjs.org)

Math.js is an extensive math library for JavaScript and Node.js,
compatible with JavaScript's built-in Math library.


## Features

- A flexible expression parser.
- Supports numbers, complex numbers, units, strings, arrays**\***, and
  matrices**\***.
- A large set of built-in functions and constants.
- Easily extensible with new functions and constants.
- Powerful and easy to use.

**\*** Note: arrays, and matrices are to be implemented.


## Install

Math.js can be installed via [npm](https://npmjs.org/).

    npm install mathjs

Alternatively, the library can be downloaded from github:
[math.js](https://raw.github.com/josdejong/mathjs/master/math.js), or minified:
[math.min.js](https://raw.github.com/josdejong/mathjs/master/math.min.js).


## Use

### Node.js

Math.js can be loaded in node.js via require, and similarly in the browser
using [require.js](http://requirejs.org/).

    var math = require('mathjs'),
        Complex = math.type.Complex,
        Unit = math.type.Unit;

    // use methods and types available in the math object
    var a = math.sin(math.pi / 4);
    var b = math.pow(a, 2);
    console.log('sin(pi / 4) ^ 2 = ' + math.round(b, 3)); // 'sin(pi / 4) ^ 2 = 0.5'

    var c = new Complex(3, -4);
    var d = math.sqrt(c);
    console.log('sqrt(3 - 4i) = ' + d); // 'sqrt(3 - 4i) = 2 - i'

    var e = math.sqrt(-4);
    console.log('sqrt(-4) = ' +  e); // 'sqrt(-4) = 2i'

    var f = new Unit(60, 'deg');
    var g = math.cos(f);
    console.log('cos(60 deg) = ' + math.round(g, 3)); // 'cos(60 deg) = 0.5'


### Browser

Math.js can be loaded as a regular javascript file in the browser:

    <!DOCTYPE HTML>
    <html>
    <head>
        <script src="math.js" type="text/javascript"></script>
    </head>
    <body>
        <script type="text/javascript">
            // the math object is available here

            var a = math.sqrt(-4);
            console.log('sqrt(-4) = ' +  a);     // 'sqrt(-4) = 2i'

            // ...
        </script>
    </body>
    </html>


## Parser

Math.js contains a flexible and easy to use expression parser.
The parser supports all data types, methods and constants available in math.js.
It has a method `eval` to evaluate expressions,
and `parse` to parse expressions and build a node tree from it.
The parser supports variable and function definitions.
Variables and functions can be manipulated using the methods `get` and `put`.

The following example code shows how to create and use a parser.

    var math = require('mathjs');

    // create a new parser
    var parser = new math.parser.Parser();

    // evaluate expressions
    var a = parser.eval('sqrt(3^2 + 4^2)'); // 5
    var d = parser.eval('sqrt(-4)');        // 2i
    var b = parser.eval('2 inch in cm');    // 5.08 cm
    var c = parser.eval('cos(45 deg)');     // 0.7071067811865476

    // define variables and functions
    parser.eval('x = 7 / 2');               // 3.5
    parser.eval('x + 3');                   // 6.5
    parser.eval('function f(x, y) = x^y');  // f(x, y)
    parser.eval('f(2, 3)');                 // 8

    // get and put variables and functions
    var x = parser.get('x');                // 7
    var f = parser.get('f');                // function
    var g = f(3, 2);                        // 9
    parser.put('h', 500);
    var i = parser.eval('h / 2');           // 250
    parser.put('hello', function (name) {
        return 'hello, ' + name + '!';
    });
    parser.eval('hello("user")');           // "hello, user!"

    // clear defined functions and variables
    parser.clear();


## Data types

Math.js supports both native data types like Number, String, and Array,
as well as advanced data types like Complex and Unit.

### Number

The built-in type Number can be used in all methods.

    var math = require('mathjs');

    var a = math.subtract(7.1, 2.3);        // 4.8
    var b = math.round(math.pi, 3);         // 3.142
    var c = math.sqrt(new Number(4.41e2));  // 21

### String

The built-in type String can be used in applicable methods.

    var math = require('math.js');
    
    var a = math.add('hello ', 'world');    // 'hello world'
    var b = math.max('A', 'D', 'C');        // 'D'

### Complex

Math.js supports complex numbers.

    var math = require('math.js'),
        Complex = math.type.Complex;

    var a = new Complex(2, 3);              // 2 + 3i
    var b = new Complex('4 - 2i');          // 4 - 2i
    var c = math.add(a, b);                 // 6 + i
    var d = math.sqrt(-4);                  // 2i

### Unit

Math.js supports units.

    var math = require('math.js'),
        Unit = math.type.Unit;

    var a = new Unit(55, 'cm');             // 550 mm
    var b = new Unit(0.1, 'm');             // 100 mm
    var c = math.add(a, b);                 // 650 mm

    var parser = new math.parser.Parser();
    var d = parser.eval('2 inch in cm');    // 5.08 cm


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
types (Number, String, Complex, and Unit) where applicable.

### Arithmetic

- math.abs(x)
- math.add(x, y)
- math.ceil(x)
- math.divide(x, y)
- math.exp(x)
- math.fix(x)
- math.floor(x)
- math.larger(x, y)
- math.log(x)
- math.multiply(x, y)
- math.pow(x, y)
- math.round(x [, n])
- math.smaller(x, y)
- math.subtract(x, y)
- math.sqrt(x)
- math.unaryminus(x)

### Probability

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
- math.sin(x)
- math.tan(x)

### Units

- math.in(x, unit)

### Utils

- math.help(fn)
- math.import(filename | object, override)
- math.typeof(x)


## Extend

The library can easily be extended with functions and variables using the
`import` method. The method `import` accepts a filename or an object with
functions and variables.

    var math = require('mathjs');

    // define new functions and variables
    math.import({
        myvalue: 42,
        hello: function (name) {
            return 'hello, ' + name + '!';
        });
    });

    // defined methods can be used in JavaScript and in the parser
    var a = math.myvalue * 2;               // 84
    var b = math.hello('user');             // 'hello, user!'

    var parser = new math.parser.Parser();
    parser.eval('myvalue + 10');            // 52
    parser.eval('hello("user")');           // 'hello, user!'

To import functions from a math library like
[numbers.js](https://github.com/sjkaliski/numbers.js),
the library must be installed using npm:

    npm install numbers

And next, the library can be imported into math.js:

    var math = require('mathjs'),
        parser = new math.parser.Parser();

    // import the numbers.js library into math.js
    math.import('numbers');

    // use functions from numbers.js
    math.fibonacci(7);                      // 7
    parser.eval('fibonacci(7)');            // 7


## Build

First clone the project from github:

    git clone git://github.com/josdejong/mathjs.git

The project uses [jake](https://github.com/mde/jake) as build tool,
which must be installed globally. After jake is installed, the project
dependencies can be downloaded using npm. Then the project can be build by
executing jake in the root of the project.

    cd mathjs
    sudo npm install -g jake
    npm install
    jake

When jake is executed, it will generate the library math.js and math.min.js
from the source files, and will test the library.


## Roadmap

- Version 0.1.0:
    - Implement all methods and constants available in the built-in Math library
    - Implement data types Complex and Unit
- Version 0.2.0: Implement Parser and Scope
- Version 0.3.0: Implement Workspace
- Version 0.4.0: Implement a larger set of methods
- Version 0.5.0: Implement Matrices
- ...


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
