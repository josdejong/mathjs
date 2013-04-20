---
layout: default
title: Home
---

# An extensive math library for JavaScript and Node.js

Math.js is an extensive math library for JavaScript and Node.js.
It features real and complex numbers, units, matrices, a large set of
mathematical functions, and a flexible expression parser.
Powerful and easy to use.


# Features

- Supports numbers, complex numbers, units, strings, arrays, and matrices.
- Is compatible with JavaScript’s built-in Math library.
- Contains a flexible expression parser.
- Supports chained operations.
- Comes with a large set of built-in functions and constants.
- Has no dependencies. Runs on any JavaScript engine.
- Is easily extensible.

<div class="cols">
    <div class="left">
        <h1>Example</h1>
        <p>
            Here some example code demonstrating how to use the library.
            More examples are available
            <a href="https://github.com/josdejong/mathjs/tree/master/examples/"
                target="_blank">here</a>.
        </p>
        <pre id="example">
<span class="comment">// load math.js</span>
<span class="keyword">var</span> math = require(<span class="string">'mathjs'</span>);

<span class="comment">// functions and constants</span>
math.round(math.e, <span class="number">3</span>);            <span class="comment">// 2.718</span>
math.atan2(<span class="number">3</span>, <span class="number">-3</span>) / math.pi;      <span class="comment">// 0.75</span>
math.log(<span class="number">1000</span>, <span class="number">10</span>);               <span class="comment">// 3</span>
math.sqrt(<span class="number">-4</span>);                    <span class="comment">// 2i</span>
math.pow([[-1, 2], [3, 1]], 2);
     <span class="comment">// [[7, 0], [0, 7]]</span>

<span class="comment">// expressions</span>
math.eval(<span class="string">'1.2 / (2.3 + 0.7)'</span>);   <span class="comment">// 0.4</span>
math.eval(<span class="string">'5.08 cm in inch'</span>);     <span class="comment">// 2 inch</span>
math.eval(<span class="string">'sin(45 deg) ^ 2'</span>);     <span class="comment">// 0.5</span>
math.eval(<span class="string">'9 / 3 + 2i'</span>);          <span class="comment">// 3 + 2i</span>
math.eval(<span class="string">'det([-1, 2; 3, 1])'</span>);  <span class="comment">// -7</span>

<span class="comment">// chained operations</span>
math.select(<span class="number">3</span>)
    .add(<span class="number">4</span>)
    .multiply(<span class="number">2</span>)
    .done(); <span class="comment">// 14</span>
</pre>
    </div>
    <div class="right">
        <h1>Demo</h1>
        <p>
            Try the expression parser below.<br><br>
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

The latest version of math.js can be downloaded below:

<table>
    <tr>
        <td>
            <a href="js/lib/math.js" target="_blank">Development
                (version <span class="version">0.7.0</span>)</a>
        </td>
        <td>
            <span id="development-size">271 kB</span>, uncompressed with comments
        </td>
    </tr>
    <tr>
        <td>
            <a href="js/lib/math.min.js" target="_blank">Production
                (version <span class="version">0.7.0</span>)</a>
        </td>
        <td>
            <span id="production-size">19 kB</span>, minified and gzipped
        </td>
    </tr>
</table>


# Documentation and source code

Documentation and source code can be found on github:

<p>
    <a href="https://github.com/josdejong/mathjs" target="_blank">https://github.com/josdejong/mathjs</a>
</p>


# License

Math.js is open source and licensend under the
<a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2.0 License</a>.
