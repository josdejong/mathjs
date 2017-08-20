---
layout: default
---

<h1 id="install">Install <a href="#install" title="Permalink">#</a></h1>


Math.js can be installed via various package managers:

<table>
  <thead>
    <tr>
      <th>Package Manager</th>
      <th>Installation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="http://npmjs.org/">npm</a> (recommended)</td>
      <td><pre class="highlight">npm install mathjs</pre></td>
    </tr>
    <tr>
      <td><a href="http://bower.io/">bower</a></td>
      <td><pre class="highlight">bower install mathjs</pre></td>
    </tr>
  </tbody>
</table>

When installed globally with [npm](https://npmjs.org/) (using the `-g` option), math.js is available as a command line application `mathjs`, see documentation on [Command Line Interface](docs/command_line_interface.html).


<h1 id="download">Download <a href="#download" title="Permalink">#</a></h1>

Math.js can be downloaded or linked from [cdnjs](http://cdnjs.com/):

<table class="download">
  <tr>
    <td>
      <a href="http://cdnjs.cloudflare.com/ajax/libs/mathjs/3.16.2/math.js">
        Development (version 3.16.2)
      </a>
    </td>
    <td>
      <span id="development-size">1602 kB</span>, uncompressed with comments
    </td>
  </tr>
  <tr>
    <td>
      <a href="http://cdnjs.cloudflare.com/ajax/libs/mathjs/3.16.2/math.min.js">
        Production (version 3.16.2)
      </a>
    </td>
    <td>
      <span id="production-size">127 kB</span>, minified and gzipped
    </td>
  </tr>
</table>

Too large for you? Create your own [custom bundle](docs/custom_bundling.html).


<h1 id="extensions">Extensions <a href="#extensions" title="Permalink">#</a></h1>

-   [mathsteps](https://github.com/socraticorg/mathsteps)

    A step-by-step math solver library that is focused on pedagogy (how best to teach). The math problems it focuses on are pre-algebra and algebra problems involving simplifying expressions.

-   [mathjs-expression-parser](https://github.com/josdejong/mathjs-expression-parser)

    This custom build of mathjs contains just the expression parser and basic arithmetic functions for numbers. About four times as small as the full mathjs library.


<h1 id="webservice">Web Service <a href="#webservice" title="Permalink">#</a></h1>

Math.js is available as a RESTful web service: <a href="http://api.mathjs.org">http://api.mathjs.org</a>


<h1 id="history">History <a href="#history" title="Permalink">#</a></h1>

A changelog describing the changes with each release is available on the page [History](history.html).


<h1 id="browsersupport">Browser support <a href="#browsersupport" title="Permalink">#</a></h1>

Math.js works on any ES5 compatible JavaScript engine: node.js 0.10 and newer and IE9 and newer. If support for old browsers (Internet Explorer 8 and older) is required, the [es5-shim](https://github.com/kriskowal/es5-shim) library has to be loaded.


<h1 id="source-code">Source code <a href="#source-code" title="Permalink">#</a></h1>

The source code of math.js is available on GitHub: [https://github.com/josdejong/mathjs](https://github.com/josdejong/mathjs).


<h1 id="license">License <a href="#license" title="Permalink">#</a></h1>

Math.js is open source and licensed under the
[Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0)
