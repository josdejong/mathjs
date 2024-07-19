---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-setdistinct">Function setDistinct <a href="#function-setdistinct" title="Permalink">#</a></h1>

Collect the distinct elements of a multiset.
A multi-dimension array will be converted to a single-dimension array before the operation.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.setDistinct(set)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`a` | Array &#124; Matrix | A multiset

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
Array &#124; Matrix | A set containing the distinc elements of the multiset


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.setDistinct([1, 1, 1, 2, 2, 3])        // returns [1, 2, 3]
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[setMultiplicity](setMultiplicity.html)