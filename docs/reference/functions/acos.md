---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-acos">Function acos <a href="#function-acos" title="Permalink">#</a></h1>

Calculate the inverse cosine of a value.

For matrices, the function is evaluated element wise.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.acos(x)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`x` | number &#124; BigNumber &#124; Complex &#124; Array &#124; Matrix | Function input

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; BigNumber &#124; Complex &#124; Array &#124; Matrix | The arc cosine of x


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.acos(0.5)           // returns number 1.0471975511965979
math.acos(math.cos(1.5)) // returns number 1.5

math.acos(2)             // returns Complex 0 + 1.3169578969248166 i
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[cos](cos.html),
[atan](atan.html),
[asin](asin.html)