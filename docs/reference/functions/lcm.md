---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-lcm">Function lcm <a href="#function-lcm" title="Permalink">#</a></h1>

Calculate the least common multiple for two or more values or arrays.

lcm is defined as:

    lcm(a, b) = abs(a * b) / gcd(a, b)

For matrices, the function is evaluated element wise.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.lcm(a, b)
math.lcm(a, b, c, ...)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`args` | ... number &#124; BigNumber &#124; Array &#124; Matrix | Two or more integer numbers

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; BigNumber &#124; Array &#124; Matrix | The least common multiple


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.lcm(4, 6)               // returns 12
math.lcm(6, 21)              // returns 42
math.lcm(6, 21, 5)           // returns 210

math.lcm([4, 6], [6, 21])    // returns [12, 42]
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[gcd](gcd.html),
[xgcd](xgcd.html)