---
layout: default
title: Home
---

# An extensive math library for JavaScript and Node.js

Math.js is an extensive math library for JavaScript and Node.js.
It features a flexible expression parser and offers an integrated solution
to work with numbers, big numbers, complex numbers, units, and matrices.
Powerful and easy to use.


# Features

- Supports numbers, big numbers, complex numbers, units, strings, arrays, and matrices.
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
      <a href="https://github.com/josdejong/mathjs/tree/master/examples/">here</a>.
    </p>
    <pre id="example">
<span class="comment">// load math.js and create an instance</span>
<span class="keyword">var</span> mathjs = require(<span class="string">'mathjs'</span>),
    math = mathjs();

<span class="comment">// functions and constants</span>
math.round(math.e, <span class="number">3</span>);            <span class="comment">// 2.718</span>
math.atan2(<span class="number">3</span>, <span class="number">-3</span>) / math.pi;      <span class="comment">// 0.75</span>
math.log(<span class="number">10000</span>, <span class="number">10</span>);              <span class="comment">// 4</span>
math.sqrt(<span class="number">-4</span>);                    <span class="comment">// 2i</span>
math.pow([[-1, 2], [3, 1]], 2);
     <span class="comment">// [[7, 0], [0, 7]]</span>

<span class="comment">// expressions</span>
math.eval(<span class="string">'1.2 * (2 + 4.5)'</span>);     <span class="comment">// 7.8</span>
math.eval(<span class="string">'5.08 cm to inch'</span>);     <span class="comment">// 2 inch</span>
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
        Try the expression parser below.<br>
        See <a href="http://mathnotepad.com/">Math Notepad</a> for a full application.
      </p>
      <div id="commandline">loading...</div>
      <script type="text/javascript">
        // create an instance of math.js
        var math = mathjs();

        var editor = new CommandLineEditor({
            container: document.getElementById('commandline'),
            math: math
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

Math.js can be downloaded or linked from [cdnjs](http://cdnjs.com/):

<table>
  <tr>
    <td>
      <a href="http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.18.1/math.js">
        Development (version 0.18.1)
      </a>
    </td>
    <td>
      <span id="development-size">484 kB</span>, uncompressed with comments
    </td>
  </tr>
  <tr>
    <td>
      <a href="http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.18.1/math.min.js">
        Production (version 0.18.1)
      </a>
    </td>
    <td>
      <span id="production-size">38 kB</span>, minified and gzipped
    </td>
  </tr>
</table>

*Note: The API of math.js is not fully stabilized. Please read [what is changed](https://github.com/josdejong/mathjs/blob/master/HISTORY.md) before upgrading to a newer version.


# Documentation

- [Getting Started](https://github.com/josdejong/mathjs/blob/master/docs/getting_started.md)
- [Overview](https://github.com/josdejong/mathjs/blob/master/docs/index.md)
- [Examples](https://github.com/josdejong/mathjs/tree/master/examples/)
- [History](https://github.com/josdejong/mathjs/blob/master/HISTORY.md)


# License

Math.js is open source and licensed under the
[Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0)
