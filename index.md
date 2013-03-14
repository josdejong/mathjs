---
layout: default
title: Home
---

# An extensive math library for JavaScript and Node.js

Math.js is an extensive math library for JavaScript and Node.js.
It features real and complex numbers, units, matrices, a large set of
mathematical functions, and a flexible expression parser. Math.js is
powerful and easy to use.


# Features

- Supports numbers, complex numbers, units, strings, arrays\*, and matrices\*.
- Contains a large set of built-in functions and constants.
- Contains a flexible expression parser.
- Compatible with JavaScript’s built-in Math library.
- No dependencies. Runs on any JavaScript engine.
- Easily extensible.


*\* Note: arrays and matrices are to be implemented.*

<div class="cols">
    <div class="left">
        <h1>Example</h1>
        <p>
            A code example showing how to use the library.
        </p>
        <pre id="example">
<span class="comment">// load math.js</span>
<span class="keyword">var</span> math = require(<span class="string">'mathjs'</span>);

<span class="comment">// methods and constants</span>
math.round(math.e, <span class="number">3</span>);            <span class="comment">// 2.718</span>
math.atan2(<span class="number">3</span>, <span class="number">-3</span>) / math.pi;      <span class="comment">// 0.75</span>
math.log(<span class="number">1000</span>, <span class="number">10</span>);               <span class="comment">// 3</span>

<span class="comment">// complex numbers</span>
<span class="keyword">var</span> c = <span class="keyword">new</span> math.Complex(<span class="number">3</span>, <span class="number">-4</span>);  <span class="comment">// 3 - 4i</span>
math.add(c, <span class="number">2</span>);                   <span class="comment">// 5 - 2i</span>
math.sqrt(<span class="number">-4</span>);                    <span class="comment">// 2i</span>

<span class="comment">// parse expressions</span>
<span class="keyword">var</span> parser = <span class="keyword">new</span> math.parser.Parser();
parser.eval(<span class="string">'1.2 / (2.3 + 0.7)'</span>); <span class="comment">// 0.4</span>
parser.eval(<span class="string">'a = 5.08 cm'</span>);
parser.eval(<span class="string">'a in inch'</span>);         <span class="comment">// 2 inch</span>
parser.eval(<span class="string">'sin(45 deg) ^ 2'</span>);   <span class="comment">// 0.5</span></pre>

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
        <div class="tips">
            Shortcut keys:
            <ul>
                <li>Press <b>S</b> to set focus to the input field</li>
                <li>Press <b>Ctrl+F11</b> to toggle full screen</li>
                <li>Enter <b>"clear"</b> to clear history</li>
            </ul>
        </div>
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
