---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-ceil">Function ceil <a href="#function-ceil" title="Permalink">#</a></h1>

Round a value towards plus infinity
If `x` is complex, both real and imaginary part are rounded towards plus infinity.
For matrices, the function is evaluated element wise.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.ceil(x)
math.ceil(x, n)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`x` | number &#124; BigNumber &#124; Fraction &#124; Complex &#124; Array &#124; Matrix | Number to be rounded
`n` | number &#124; BigNumber &#124; Array | Number of decimals Default value: 0.

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; BigNumber &#124; Fraction &#124; Complex &#124; Array &#124; Matrix | Rounded value


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.ceil(3.2)               // returns number 4
math.ceil(3.8)               // returns number 4
math.ceil(-4.2)              // returns number -4
math.ceil(-4.7)              // returns number -4

math.ceil(3.212, 2)          // returns number 3.22
math.ceil(3.288, 2)          // returns number 3.29
math.ceil(-4.212, 2)         // returns number -4.21
math.ceil(-4.782, 2)         // returns number -4.78

const c = math.complex(3.24, -2.71)
math.ceil(c)                 // returns Complex 4 - 2i
math.ceil(c, 1)              // returns Complex 3.3 - 2.7i

math.ceil([3.2, 3.8, -4.7])  // returns Array [4, 4, -4]
math.ceil([3.21, 3.82, -4.71], 1)  // returns Array [3.3, 3.9, -4.7]
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[floor](floor.html),
[fix](fix.html),
[round](round.html)