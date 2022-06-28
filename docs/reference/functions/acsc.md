---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-acsc">Function acsc <a href="#function-acsc" title="Permalink">#</a></h1>

Calculate the inverse cosecant of a value, defined as `acsc(x) = asin(1/x)`.

For matrices, the function is evaluated element wise.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.acsc(x)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`x` | number &#124; Complex &#124; Array &#124; Matrix | Function input

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; Complex &#124; Array &#124; Matrix | The arc cosecant of x


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.acsc(0.5)           // returns number 0.5235987755982989
math.acsc(math.csc(1.5)) // returns number ~1.5

math.acsc(2)             // returns Complex 1.5707963267948966 -1.3169578969248166 i
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[csc](csc.html),
[asin](asin.html),
[asec](asec.html)