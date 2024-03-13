---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-multiply">Function multiply <a href="#function-multiply" title="Permalink">#</a></h1>

Multiply two or more values, `x * y`.
For matrices, the matrix product is calculated.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.multiply(x, y)
math.multiply(x, y, z, ...)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`x` | number &#124; BigNumber &#124; Fraction &#124; Complex &#124; Unit &#124; Array &#124; Matrix | First value to multiply
`y` | number &#124; BigNumber &#124; Fraction &#124; Complex &#124; Unit &#124; Array &#124; Matrix | Second value to multiply

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; BigNumber &#124; Fraction &#124; Complex &#124; Unit &#124; Array &#124; Matrix | Multiplication of `x` and `y`


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.multiply(4, 5.2)        // returns number 20.8
math.multiply(2, 3, 4)       // returns number 24

const a = math.complex(2, 3)
const b = math.complex(4, 1)
math.multiply(a, b)          // returns Complex 5 + 14i

const c = [[1, 2], [4, 3]]
const d = [[1, 2, 3], [3, -4, 7]]
math.multiply(c, d)          // returns Array [[7, -6, 17], [13, -4, 33]]

const e = math.unit('2.1 km')
math.multiply(3, e)          // returns Unit 6.3 km
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[divide](divide.html),
[prod](prod.html),
[cross](cross.html),
[dot](dot.html)