---
layout: default
---

<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->

<h1 id="function-random">Function random <a href="#function-random" title="Permalink">#</a></h1>

Return a random number larger or equal to `min` and smaller than `max`
using a uniform distribution.


<h2 id="syntax">Syntax <a href="#syntax" title="Permalink">#</a></h2>

```js
math.random()                // generate a random number between 0 and 1
math.random(max)             // generate a random number between 0 and max
math.random(min, max)        // generate a random number between min and max
math.random(size)            // generate a matrix with random numbers between 0 and 1
math.random(size, max)       // generate a matrix with random numbers between 0 and max
math.random(size, min, max)  // generate a matrix with random numbers between min and max
```

<h3 id="parameters">Parameters <a href="#parameters" title="Permalink">#</a></h3>

Parameter | Type | Description
--------- | ---- | -----------
`size` | Array &#124; Matrix | If provided, an array or matrix with given size and filled with random values is returned
`min` | number | Minimum boundary for the random value, included
`max` | number | Maximum boundary for the random value, excluded

<h3 id="returns">Returns <a href="#returns" title="Permalink">#</a></h3>

Type | Description
---- | -----------
number &#124; Array &#124; Matrix | A random number


<h3 id="throws">Throws <a href="#throws" title="Permalink">#</a></h3>

Type | Description
---- | -----------


<h2 id="examples">Examples <a href="#examples" title="Permalink">#</a></h2>

```js
math.random()       // returns a random number between 0 and 1
math.random(100)    // returns a random number between 0 and 100
math.random(30, 40) // returns a random number between 30 and 40
math.random([2, 3]) // returns a 2x3 matrix with random numbers between 0 and 1
```


<h2 id="see-also">See also <a href="#see-also" title="Permalink">#</a></h2>

[randomInt](randomInt.html),
[pickRandom](pickRandom.html)