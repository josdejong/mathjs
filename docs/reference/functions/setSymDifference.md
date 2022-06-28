---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-setsymdifference">Function setSymDifference <a href="#function-setsymdifference" title="Permalink">#</a></h1>

Create the symmetric difference of two (multi)sets.
Multi-dimension arrays will be converted to single-dimension arrays before the operation.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.setSymDifference(set1, set2)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`a1` | Array &#124; Matrix | A (multi)set
`a2` | Array &#124; Matrix | A (multi)set

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
Array &#124; Matrix | The symmetric difference of two (multi)sets


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.setSymDifference([1, 2, 3, 4], [3, 4, 5, 6])            // returns [1, 2, 5, 6]
math.setSymDifference([[1, 2], [3, 4]], [[3, 4], [5, 6]])    // returns [1, 2, 5, 6]
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[setUnion](setUnion.html),
[setIntersect](setIntersect.html),
[setDifference](setDifference.html)