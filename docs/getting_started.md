# Getting Started

This getting started describes how to install, load, and use math.js.


## Install

Math.js can be installed using npm, bower, or by just downloading the library.

*WARNING: math.js is in early stage and the API is not yet stabilized.
Please be careful when upgrading to a newer version.
An overview of the changes is available
[here](https://github.com/josdejong/mathjs/blob/master/HISTORY.md).*

### npm
Math.js can be installed using [npm](https://npmjs.org/):

    npm install mathjs

Note: when installed globally (using the `-g` option), math.js is available as
a command line application `mathjs`, see section
[command line interface](https://github.com/josdejong/mathjs/blob/master/docs/command_line_interface.md).

### bower
Or using [bower](http://twitter.github.io/bower/):

    bower install mathjs

### download
Or by downloading the latest version from
[mathjs.org](http://mathjs.org/#install_or_download):

- [math.js](http://mathjs.org/js/lib/math.js) (Development version)
- [math.min.js](http://mathjs.org/js/lib/math.min.js) (Production version)


## Load

### Node.js

Load math.js in [node.js](http://nodejs.org/):

```js
var math = require('mathjs');

math.sqrt(-4); // 2i
```

### Browser

Math.js can be loaded as a regular javascript file in the browser:

```html
<!DOCTYPE HTML>
<html>
<head>
    <script src="math.js" type="text/javascript"></script>
</head>
<body>
    <script type="text/javascript">
        math.sqrt(-4); // 2i
    </script>
</body>
</html>
```

### Require.js

Load math.js in the browser using [require.js](http://requirejs.org/):

```js
require.config({
    paths: {
        mathjs: 'path/to/mathjs',
    }
});
require(['mathjs'], function (math) {
    math.sqrt(-4); // 2i
});
```


## Use

Math.js can be used similar to JavaScript's built-in Math library. Besides that,
math.js can evaluate expressions (see [Expressions](https://github.com/josdejong/mathjs/blob/master/docs/expressions.md)) and supports
chained operations (see [Chained operations](https://github.com/josdejong/mathjs/blob/master/docs/chained_operations.md)).

The example code below shows how to use math.js. More examples can be found in the
[examples directory](https://github.com/josdejong/mathjs/tree/master/examples/).

```js
// load math.js
var math = require('mathjs');

// functions and constants
math.round(math.e, 3);            // 2.718
math.atan2(3, -3) / math.pi;      // 0.75
math.log(1000, 10);               // 3
math.sqrt(-4);                    // 2i
math.pow([[-1, 2], [3, 1]], 2);   // [[7, 0], [0, 7]]

// expressions
math.eval('12 / (2.3 + 0.7)');    // 4
math.eval('5.08 cm in inch');     // 2 inch
math.eval('sin(45 deg) ^ 2');     // 0.5
math.eval('9 / 3 + 2i');          // 3 + 2i
math.eval('det([-1, 2; 3, 1])');  // -7

// chained operations
math.select(3)
    .add(4)
    .multiply(2)
    .done(); // 14
```
