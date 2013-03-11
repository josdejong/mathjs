---
layout: default
title: Home
---

# An extensive math library for JavaScript and Node.js

Math.js is an extensive math library for JavaScript and Node.js.
The library features real and complex numbers, units, matrices,
a large set of mathematical functions and constants,
and a flexible expression parser.


# Features

- Supports real and complex numbers, units, strings, arrays\*, and
  matrices\*.
- Contains a large set of built-in functions and constants.
- Contains a flexible expression parser.
- Easily extensible.
- Compatible with JavaScript's built-in Math library.
- Powerful and easy to use.

*\* Note: arrays and matrices are to be implemented.*

<div class="cols">
    <div class="left">
        <h1>Example</h1>
        <p>
            A code example showing how to use the library.
        </p>
        <pre id="example">
// load math.js
var math = require('mathjs');

// methods and constants
math.round(math.e, 3);            // 2.718
math.atan2(3, -3) / math.pi;      // 0.75
math.log(1000, 10);               // 3

// complex numbers
var c = new math.Complex(3, -4);  // 3 - 4i
math.add(c, 2);                   // 5 - 2i
math.sqrt(-4);                    // 2i

// parse expressions
var parser = new math.parser.Parser();
parser.eval('1.2 / (2.3 + 0.7)'); // 0.4
parser.eval('a = 5.08 cm');
parser.eval('a in inch');         // 2 inch
parser.eval('sin(45 deg) ^ 2');   // 0.5
        </pre>

    </div>
    <div class="right">
        <h1>Demo</h1>
        <p>
            Try the expression parser below.
        </p>
        <div id="commandline">loading...</div>
        <script type="text/javascript">
            var editor = new CommandLineEditor({
                container: document.getElementById('commandline')
            });
        </script>
    </div>
    <div class="end">&nbsp;</div>
</div>



# Install or download

Math.js can be installed using [npm](https://npmjs.org/):

    npm install mathjs

The latest stable version of math.js can be downloaded from github:

<p>
    <a href="https://raw.github.com/josdejong/mathjs/master/math.js" target="_blank">math.js</a>
    <br>
    <a href="https://raw.github.com/josdejong/mathjs/master/math.min.js" target="_blank">math.min.js</a> (minified)
</p>

<!-- TODO: create nice download buttons
<button class="download">math.js</button>
-->

# Documentation and source code

Documentation and source code can be found on github:

<p>
    <a href="https://github.com/josdejong/mathjs" target="_blank">https://github.com/josdejong/mathjs</a>
</p>

# License

Math.js is open source and licensend under the
<a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2.0 License</a>.
