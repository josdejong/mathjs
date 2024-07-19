---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-bitand">Function bitAnd <a href="#function-bitand" title="Permalink">#</a></h1>

Bitwise AND two values, `x & y`.
For matrices, the function is evaluated element wise.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.bitAnd(x, y)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`x` | number &#124; BigNumber &#124; bigint &#124; Array &#124; Matrix | First value to and
`y` | number &#124; BigNumber &#124; bigint &#124; Array &#124; Matrix | Second value to and

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; BigNumber &#124; bigint &#124; Array &#124; Matrix | AND of `x` and `y`


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.bitAnd(53, 131)               // returns number 1

math.bitAnd([1, 12, 31], 42)       // returns Array [0, 8, 10]
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[bitNot](bitNot.html),
[bitOr](bitOr.html),
[bitXor](bitXor.html),
[leftShift](leftShift.html),
[rightArithShift](rightArithShift.html),
[rightLogShift](rightLogShift.html)