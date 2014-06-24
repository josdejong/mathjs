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
    <div class="highlight">
<pre><code class="language-js" data-lang="js"><span class="c1">// load math.js and create an instance</span>
<span class="kd">var</span> <span class="nx">mathjs</span> <span class="o">=</span> <span class="nx">require</span><span class="p">(</span><span class="s1">'mathjs'</span><span class="p">),</span>
    <span class="nx">math</span> <span class="o">=</span> <span class="nx">mathjs</span><span class="p">();</span>

<span class="c1">// functions and constants</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">round</span><span class="p">(</span><span class="nx">math</span><span class="p">.</span><span class="nx">e</span><span class="p">,</span> <span class="mi">3</span><span class="p">);</span>            <span class="c1">// 2.718</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">atan2</span><span class="p">(</span><span class="mi">3</span><span class="p">,</span> <span class="o">-</span><span class="mi">3</span><span class="p">)</span> <span class="o">/</span> <span class="nx">math</span><span class="p">.</span><span class="nx">pi</span><span class="p">;</span>      <span class="c1">// 0.75</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="mi">10000</span><span class="p">,</span> <span class="mi">10</span><span class="p">);</span>              <span class="c1">// 4</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">sqrt</span><span class="p">(</span><span class="o">-</span><span class="mi">4</span><span class="p">);</span>                    <span class="c1">// 2i</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">pow</span><span class="p">([[</span><span class="o">-</span><span class="mi">1</span><span class="p">,</span> <span class="mi">2</span><span class="p">],</span> <span class="p">[</span><span class="mi">3</span><span class="p">,</span> <span class="mi">1</span><span class="p">]],</span> <span class="mi">2</span><span class="p">);</span>
     <span class="c1">// [[7, 0], [0, 7]]</span>

<span class="c1">// expressions</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">eval</span><span class="p">(</span><span class="s1">'1.2 * (2 + 4.5)'</span><span class="p">);</span>     <span class="c1">// 7.8</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">eval</span><span class="p">(</span><span class="s1">'5.08 cm to inch'</span><span class="p">);</span>     <span class="c1">// 2 inch</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">eval</span><span class="p">(</span><span class="s1">'sin(45 deg) ^ 2'</span><span class="p">);</span>     <span class="c1">// 0.5</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">eval</span><span class="p">(</span><span class="s1">'9 / 3 + 2i'</span><span class="p">);</span>          <span class="c1">// 3 + 2i</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">eval</span><span class="p">(</span><span class="s1">'det([-1, 2; 3, 1])'</span><span class="p">);</span>  <span class="c1">// -7</span>

<span class="c1">// chained operations</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">select</span><span class="p">(</span><span class="mi">3</span><span class="p">)</span>
    <span class="p">.</span><span class="nx">add</span><span class="p">(</span><span class="mi">4</span><span class="p">)</span>
    <span class="p">.</span><span class="nx">multiply</span><span class="p">(</span><span class="mi">2</span><span class="p">)</span>
    <span class="p">.</span><span class="nx">done</span><span class="p">();</span> <span class="c1">// 14</span></code></pre>
  </div>
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

<table class="download">
  <tr>
    <td>
      <a href="http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.23.0/math.js">
        Development (version 0.23.0)
      </a>
    </td>
    <td>
      <span id="development-size">697 kB</span>, uncompressed with comments
    </td>
  </tr>
  <tr>
    <td>
      <a href="http://cdnjs.cloudflare.com/ajax/libs/mathjs/0.23.0/math.min.js">
        Production (version 0.23.0)
      </a>
    </td>
    <td>
      <span id="production-size">50 kB</span>, minified and gzipped
    </td>
  </tr>
</table>

*Note: The API of math.js is not fully stabilized. Please read [what is changed](history.html) before upgrading to the newest version.*


# License

Math.js is open source and licensed under the
[Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0)


<div id="likes">
  <!-- github -->
  <!-- https://github.com/mdo/github-buttons -->
  <div class="like github">
    <iframe src="http://ghbtns.com/github-btn.html?user=josdejong&repo=mathjs&type=watch&count=true"
            allowtransparency="true" frameborder="0" scrolling="0" width="110" height="20"></iframe>
  </div>

  <!-- twitter -->
  <div class="like twitter">
    <a href="https://twitter.com/share" class="twitter-share-button">Tweet</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
  </div>

  <!-- facebook -->
  <div class="like facebook">
    <div id="fb-root" style="display: none;"></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=537047263003274";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>
    <div class="fb-like" data-href="http://mathjs.org" data-send="false" data-layout="button_count" data-width="450" data-show-faces="true" data-font="verdana"></div>
  </div>

  <!-- linkedin -->
  <div class="like linkedin">
    <script src="//platform.linkedin.com/in.js" type="text/javascript"></script>
    <script type="IN/Share" data-url="http://mathjs.org" data-counter="right"></script>
  </div>

  <!-- google+ -->
  <div class="like googleplus">
    <!-- Place this tag where you want the +1 button to render. -->
    <div class="g-plusone" data-size="medium"></div>

    <!-- Place this tag after the last +1 button tag. -->
    <script type="text/javascript">
      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    </script>
  </div>

  <div style="clear: both;"></div>
</div>