---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-asech">Function asech <a href="#function-asech" title="Permalink">#</a></h1>

Calculate the hyperbolic arcsecant of a value,
defined as `asech(x) = acosh(1/x) = ln(sqrt(1/x^2 - 1) + 1/x)`.

For matrices, the function is evaluated element wise.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.asech(x)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`x` | number &#124; Complex &#124; Array &#124; Matrix | Function input

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; Complex &#124; Array &#124; Matrix | Hyperbolic arcsecant of x


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.asech(0.5)       // returns 1.3169578969248166
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[acsch](acsch.html),
[acoth](acoth.html)