---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-min">Function min <a href="#function-min" title="Permalink">#</a></h1>

Compute the minimum value of a matrix or a  list of values.
In case of a multi dimensional array, the minimum of the flattened array
will be calculated. When `dim` is provided, the minimum over the selected
dimension will be calculated. Parameter `dim` is zero-based.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.min(a, b, c, ...)
math.min(A)
math.min(A, dim)
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`args` | ... * | A single matrix or or multiple scalar values

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
* | The minimum value


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.min(2, 1, 4, 3)                  // returns 1
math.min([2, 1, 4, 3])                // returns 1

// minimum over a specified dimension (zero-based)
math.min([[2, 5], [4, 3], [1, 7]], 0) // returns [1, 3]
math.min([[2, 5], [4, 3], [1, 7]], 1) // returns [2, 3, 1]

math.max(2.7, 7.1, -4.5, 2.0, 4.1)    // returns 7.1
math.min(2.7, 7.1, -4.5, 2.0, 4.1)    // returns -4.5
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[mean](mean.html),
[median](median.html),
[max](max.html),
[prod](prod.html),
[std](std.html),
[sum](sum.html),
[variance](variance.html)