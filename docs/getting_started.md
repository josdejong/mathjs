# Getting Started

This getting started describes how to install, load, and use math.js.


## Install

Math.js can be installed using various package managers like [npm](https://npmjs.org/), or by just downloading the library from the website: [https://mathjs.org/download.html](https://mathjs.org/download.html).

To install via npm, run:

    npm install mathjs

Other ways to install math.js are described on the [website](https://mathjs.org/download.html).


## Load

Math.js can be used in node.js and in the browser. The library must be loaded
and instantiated. When creating an instance, one can optionally provide
configuration options as described in
[Configuration](core/configuration.md).

### ES modules

Load the functions you need and use them:

```js
import { sqrt } from 'mathjs'

console.log(sqrt(-4).toString()) // 2i
```

To use lightweight, number only implementations of all functions:

```js
import { sqrt } from 'mathjs/number'

console.log(sqrt(4).toString()) // 2
console.log(sqrt(-4).toString()) // NaN
```

You can create a mathjs instance allowing [configuration](core/configuration.md) and importing of external functions as follows:

```js
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)

console.log(math.sqrt(-4).toString()) // 2i
```

How to optimize your bundle size using tree-shaking is described on the page
[Custom bundling](custom_bundling.md).


### Node.js

Load math.js in [node.js](https://nodejs.org/) (CommonJS module system):

```js
const { sqrt } = require('mathjs')

console.log(sqrt(-4).toString()) // 2i
```


### Browser

Math.js can be loaded as a regular JavaScript file in the browser, use the global
variable `math` to access the libary once loaded:

```html
<!DOCTYPE HTML>
<html>
<head>
  <script src="math.js" type="text/javascript"></script>
</head>
<body>
  <script type="text/javascript">
    console.log(math.sqrt(-4).toString()) // 2i
  </script>
</body>
</html>
```

## Use

Math.js can be used similar to JavaScript's built-in Math library. Besides that,
math.js can evaluate expressions (see [Expressions](expressions/index.md)) and
supports chaining (see [Chaining](core/chaining.md)).

The example code below shows how to use math.js. More examples can be found in the
section [Examples](https://mathjs.org/examples/index.html).

```js
// functions and constants
math.round(math.e, 3)                // 2.718
math.atan2(3, -3) / math.pi          // 0.75
math.log(10000, 10)                  // 4
math.sqrt(-4)                        // 2i
math.pow([[-1, 2], [3, 1]], 2)       // [[7, 0], [0, 7]]

// expressions
math.evaluate('12 / (2.3 + 0.7)')    // 4
math.evaluate('12.7 cm to inch')     // 5 inch
math.evaluate('sin(45 deg) ^ 2')     // 0.5
math.evaluate('9 / 3 + 2i')          // 3 + 2i
math.evaluate('det([-1, 2; 3, 1])')  // -7

// chained operations
math.chain(3)
    .add(4)
    .multiply(2)
    .done() // 14
```

## Next

To learn more about math.js, check out the available documentation and examples:

- [Documentation](index.md)
- [Examples](https://mathjs.org/examples/index.html)
