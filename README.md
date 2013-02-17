# math.js
https://github.com/josdejong/mathjs

Math.js is an extended Math library for Javascript.
It is a superset of the standard Math library.
Powerful and easy to use.

Math.js supports real values, complex values, units, strings, and matrices.
It contains an extensive set of built-in functions,
and comes with a flexible expression parser.


## Install

Math.js can be installed via [npm](https://npmjs.org/).

    npm install mathjs

Alternatively, the library can be downloaded from github:
[math.js](https://raw.github.com/josdejong/mathjs/master/mathjs.js), or minified:
[math.min.js](https://raw.github.com/josdejong/mathjs/master/mathjs.min.js).


## Use

### Node

Math.js can be loaded via require:

    var math = require('mathjs'),
        Complex = math.type.Complex,
        Unit = math.type.Unit;

    console.log(math.sqrt(25));           // 5

    var c = new Complex(3, -4);
    console.log(math.sqrt(c).toString()); // 2 - i

    var u = new Unit(45, 'deg');
    console.log(math.sin(math.pi / 4));  // 0.7071067811865475
    console.log(math.sin(u));             // 0.7071067811865475

### Browser

Math.js can be loaded as a regular javascript file in the browser:

    <!DOCTYPE html>
    <html>
    <head>
        <script src="math.js" type="text/javascript"></script>
    </head>
    <body>
        <script>
            var Complex = math.type.Complex;
            var Unit = math.type.Unit;

            console.log(math.sqrt(25));           // 5

            var c = new Complex(3, -4);
            console.log(math.sqrt(c).toString()); // 2 - i

            var u = new Unit(45, 'deg');
            console.log(math.sin(math.pi / 4));  // 0.7071067811865475
            console.log(math.sin(u));             // 0.7071067811865475
        </script>
    </body>
    </html>


## Build

To clone the project from github:

    git clone git://github.com/josdejong/mathjs.git

To build the project, [jake](https://github.com/mde/jake) must be installed
globally. Next, install all dependencies using npm. Then build the project
using jake.

    cd mathjs
    sudo npm install -g jake
    npm install
    jake


## License

Math.js is licensed under the Apache 2.0 license.

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
