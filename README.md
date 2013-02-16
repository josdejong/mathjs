# Math2
https://github.com/josdejong/math2

Math2 is an extended Math library for Javascript.
It is a superset of the standard Math library.
Powerful and easy to use.

Math2 supports real values, complex values, units, strings, and matrices.
It contains an extensive set of built-in functions,
and comes with a flexible expression parser.


## Install

Math2 can be installed via [npm](https://npmjs.org/).

    npm install math2

Alternatively, the library can be downloaded from github:
[math2.js](https://raw.github.com/josdejong/math2/master/math2.js),or minified:
[math2.min.js](https://raw.github.com/josdejong/math2/master/math2.min.js),


## Use

### Node

Math2 can be loaded via require:

    var math2 = require('math2'),
        Complex = math2.type.Complex,
        Unit = math2.type.Unit;

    console.log(math2.sqrt(25));           // 5
    var c = new Complex(3, -4);
    console.log(math2.sqrt(c).toString()); // 2 - i
    console.log(math2.sin(math2.pi / 4));  // 0.7071067811865475
    var u = new Unit(45, 'deg');
    console.log(math2.sin(u));             // 0.7071067811865475

### Browser

Math2 can be loaded as a regular javascript file in the browser:

    <!DOCTYPE html>
    <html>
    <head>
        <script src="math2.js" type="text/javascript"></script>
    </head>
    <body>
        <script>
            var Complex = math2.type.Complex;
            var Unit = math2.type.Unit;

            console.log(math2.sqrt(25));           // 5
            var c = new Complex(3, -4);
            console.log(math2.sqrt(c).toString()); // 2 - i
            console.log(math2.sin(math2.pi / 4));  // 0.7071067811865475
            var u = new Unit(45, 'deg');
            console.log(math2.sin(u));             // 0.7071067811865475
        </script>
    </body>
    </html>


## Build

To clone the project from github:

    git clone git://github.com/josdejong/math2.git
    cd math2

To build the project, [jake](https://github.com/mde/jake) must be installed
globally. Next, install all dependencies using npm. Then build the project
using jake.

    sudo npm install -g jake
    npm install
    jake


## License

Math2 is licensed under the Apache 2.0 license.

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
