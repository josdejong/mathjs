![math.js](https://raw.github.com/josdejong/mathjs/master/img/mathjs.png)

Math.js is an extensive math library for Javascript and Node.js,
compatible with the built-in Math library.

Features:

- A flexible expression parser.
- Supports numbers, complex values, units, strings, arrays, and matrices.
- A large set of built-in functions and constants.
- Easily extensible with new functions and constants.
- Powerful and easy to use.

Website: http://mathjs.org


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

The expression parser is not yet implemented. Coming soon...


## API

The math.js library contains the following data types, methods and constants.

### Data types

- Number
- String
- math.type.Complex
- math.type.Unit

### Constants

- math.E, math.e
- math.I, math.i
- math.LN2
- math.LN10
- math.LOG2E
- math.LOG10E
- math.PI, math.pi
- math.SQRT1_2
- math.SQRT2

### Methods

#### Arithmetic

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

#### Probability

- math.random()

#### Statistics

- math.max(a, b, c, ...)
- math.min(a, b, c, ...)

#### Trigonometry

- math.acos(x)
- math.asin(x)
- math.atan(x)
- math.atan2(y, x)
- math.cos(x)
- math.sin(x)
- math.tan(x)

#### Units

- math.in(x, unit)


## Build

To clone the project from github:

    git clone git://github.com/josdejong/mathjs.git

The project uses [jake](https://github.com/mde/jake) as build tool,
and must be installed globally.
After jake is installed, the project dependencies can be downloaded using npm.
Then the project can be build by executing jake in the projects root.

    cd mathjs
    sudo npm install -g jake
    npm install
    jake

When jake is executed, it will generate the library math.js and math.min.js
from the source files, and will test the library.


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
