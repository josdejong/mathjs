---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-composition">Function composition <a href="#function-composition" title="Permalink">#</a></h1>

The composition counts of n into k parts.

composition only takes integer arguments.
The following condition must be enforced: k <= n.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.composition(n, k)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`n` | Number &#124; BigNumber | Total number of objects in the set
`k` | Number &#124; BigNumber | Number of objects in the subset

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
Number &#124; BigNumber | Returns the composition counts of n into k parts.


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.composition(5, 3) // returns 6
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[combinations](combinations.html)