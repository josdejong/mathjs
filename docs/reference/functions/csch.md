---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-csch">Function csch <a href="#function-csch" title="Permalink">#</a></h1>

Calculate the hyperbolic cosecant of a value,
defined as `csch(x) = 1 / sinh(x)`.

To avoid confusion with the matrix hyperbolic cosecant, this function
does not apply to matrices.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.csch(x)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`x` | number &#124; BigNumber &#124; Complex | Function input

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; BigNumber &#124; Complex | Hyperbolic cosecant of x


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
// csch(x) = 1/ sinh(x)
math.csch(0.5)       // returns 1.9190347513349437
1 / math.sinh(0.5)   // returns 1.9190347513349437
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[sinh](sinh.html),
[sech](sech.html),
[coth](coth.html)