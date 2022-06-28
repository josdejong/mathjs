---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-tanh">Function tanh <a href="#function-tanh" title="Permalink">#</a></h1>

Calculate the hyperbolic tangent of a value,
defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.

For matrices, the function is evaluated element wise.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.tanh(x)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`x` | number &#124; BigNumber &#124; Complex &#124; Unit &#124; Array &#124; Matrix | Function input

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; BigNumber &#124; Complex &#124; Array &#124; Matrix | Hyperbolic tangent of x


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
// tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
math.tanh(0.5)                   // returns 0.46211715726000974
math.sinh(0.5) / math.cosh(0.5)  // returns 0.46211715726000974
1 / math.coth(0.5)               // returns 0.46211715726000974
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[sinh](sinh.html),
[cosh](cosh.html),
[coth](coth.html)