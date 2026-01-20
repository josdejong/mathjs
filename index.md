---
layout: default
title: Home
---

<h1 id="an-extensive-math-library-for-javascript-and-nodejs">An extensive math library for JavaScript and Node.js <a href="#an-extensive-math-library-for-javascript-and-nodejs" title="Permalink">#</a></h1>

Math.js is an extensive math library for JavaScript and Node.js. It features a flexible expression parser with support for symbolic computation, comes with a large set of built-in functions and constants, and offers an integrated solution to work with different data types like numbers, big numbers, complex numbers, fractions, units, and matrices. Powerful and easy to use.

<h1 id="features">Features <a href="#features" title="Permalink">#</a></h1>

- Supports numbers, big numbers, bigint, complex numbers, fractions, units, strings, arrays, and matrices.
- Is compatible with JavaScript's built-in Math library.
- Contains a flexible expression parser.
- Does symbolic computation.
- Comes with a large set of built-in functions and constants.
- Can be used as a command line application as well.
- Runs on any JavaScript engine.
- Is easily extensible.
- Open source.

<div class="cols">
  <div class="left">
    <h1 id="example">Example <a href="#example" title="Permalink">#</a></h1>
    <p>
      Here some example code demonstrating how to use the library.
      <a href="https://jsbin.com/devacu/edit">Click here</a> to fiddle around.
    </p>
    <div>
<pre class="highlight"><code class="language-js" data-lang="js"><span class="c1">// functions and constants</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">round</span><span class="p">(</span><span class="nx">math</span><span class="p">.</span><span class="nx">e</span><span class="p">,</span> <span class="mi">3</span><span class="p">)</span>                <span class="c1">// 2.718</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">atan2</span><span class="p">(</span><span class="mi">3</span><span class="p">,</span> <span class="o">-</span><span class="mi">3</span><span class="p">)</span> <span class="o">/</span> <span class="nx">math</span><span class="p">.</span><span class="nx">pi</span><span class="p"></span>          <span class="c1">// 0.75</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="mi">10000</span><span class="p">,</span> <span class="mi">10</span><span class="p">)</span>                  <span class="c1">// 4</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">sqrt</span><span class="p">(</span><span class="o">-</span><span class="mi">4</span><span class="p">)</span>                        <span class="c1">// 2i</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">derivative</span><span class="p">(</span><span class="s1">'x^2 + x'</span><span class="p">,</span> <span class="s1">'x'</span><span class="p">)</span>      <span class="c1">// 2*x+1</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">pow</span><span class="p">([[</span><span class="o">-</span><span class="mi">1</span><span class="p">,</span> <span class="mi">2</span><span class="p">],</span> <span class="p">[</span><span class="mi">3</span><span class="p">,</span> <span class="mi">1</span><span class="p">]],</span> <span class="mi">2</span><span class="p">)</span>
     <span class="c1">// [[7, 0], [0, 7]]</span>

<span class="c1">// expressions</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">evaluate</span><span class="p">(</span><span class="s1">'1.2 * (2 + 4.5)'</span><span class="p">)</span>     <span class="c1">// 7.8</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">evaluate</span><span class="p">(</span><span class="s1">'12.7 cm to inch'</span><span class="p">)</span>     <span class="c1">// 5 inch</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">evaluate</span><span class="p">(</span><span class="s1">'sin(45 deg) ^ 2'</span><span class="p">)</span>     <span class="c1">// 0.5</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">evaluate</span><span class="p">(</span><span class="s1">'9 / 3 + 2i'</span><span class="p">)</span>          <span class="c1">// 3 + 2i</span>
<span class="nx">math</span><span class="p">.</span><span class="nb">evaluate</span><span class="p">(</span><span class="s1">'det([-1, 2; 3, 1])'</span><span class="p">)</span>  <span class="c1">// -7</span>

<span class="c1">// chaining</span>
<span class="nx">math</span><span class="p">.</span><span class="nx">chain</span><span class="p">(</span><span class="mi">3</span><span class="p">)</span>
    <span class="p">.</span><span class="nx">add</span><span class="p">(</span><span class="mi">4</span><span class="p">)</span>
    <span class="p">.</span><span class="nx">multiply</span><span class="p">(</span><span class="mi">2</span><span class="p">)</span>
    <span class="p">.</span><span class="nx">done</span><span class="p">()</span> <span class="c1">// 14</span></code></pre>
  </div>
  </div>
  <div class="right">
    <h1 id="demo">Demo <a href="#demo" title="Permalink">#</a></h1>
    <p>
      Try the expression parser below.<br>
      See <a href="https://mathnotepad.com/">Math Notepad</a> for a full application.
    </p>
    <div id="commandline">loading...</div>
    <div class="tips">
      Shortcut keys:
      <ul>
        <li>Press <b>S</b> to set focus to the input field</li>
        <li>Press <b>Ctrl+F11</b> to toggle full screen</li>
        <li>Press <b>Tab</b> to autocomplete (repeat to cycle choices)</li>
        <li>Enter <b>"clear"</b> to clear history</li>
      </ul>
    </div>
  </div>
  <div class="end">&nbsp;</div>
</div>

<div id="likes">
  <!-- github sponsors -->
  <div class="like github-sponsor">
    <a class="github-button" href="https://github.com/sponsors/josdejong" data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-heart" aria-label="Sponsor @josdejong on GitHub">Sponsor</a>
    <script async defer src="https://buttons.github.io/buttons.js"></script>
  </div>

  <!-- github -->
  <!-- https://github.com/mdo/github-buttons -->
  <div class="like github">
    <iframe src="https://ghbtns.com/github-btn.html?user=josdejong&repo=mathjs&type=watch&count=true"
            allowtransparency="true" frameborder="0" scrolling="0" width="110" height="20"></iframe>
  </div>

  <!-- twitter -->
  <div class="like twitter">
    <a href="https://twitter.com/share" class="twitter-share-button">Tweet</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
  </div>

  <!-- linkedin -->
  <div class="like linkedin">
    <script src="//platform.linkedin.com/in.js" type="text/javascript"></script>
    <script type="IN/Share" data-url="https://mathjs.org" data-counter="right"></script>
  </div>

  <!-- facebook -->
  <div class="like facebook">
    <div id="fb-root"></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=537047263003274";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>
    <div class="fb-like" data-href="https://mathjs.org/" data-layout="button_count" data-action="like" data-show-faces="true" data-share="false"></div>
  </div>

  <div class="spacing"></div>

  <div class="sponsor">
    Sponsored by <a href="https://www.testmu.ai" target="_blank">
    <img alt="TestMu AI" src="./css/img/testmu-ai.svg" width="147" height="26" />
    </a>
  </div>

  <div style="clear: both;"></div>
</div>
