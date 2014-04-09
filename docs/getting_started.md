# Getting Started

This getting started describes how to install, load, and use math.js.


## Install

Math.js can be installed using npm, bower, or by just downloading the library.

*Note: The API of math.js is not fully stabilized. Please read [what is changed](https://github.com/josdejong/mathjs/blob/master/HISTORY.md) before upgrading to the newest version.*

### npm
Math.js can be installed using [npm](https://npmjs.org/):

    npm install mathjs

Note: when installed globally (using the `-g` option), math.js is available as
a command line application `mathjs`, see section
[command line interface](https://github.com/josdejong/mathjs/blob/master/docs/command_line_interface.md).

### component(1)
The library can be installed using [component(1)](https://github.com/component/component/):

    component install josdejong/mathjs

### bower
Or using [bower](http://twitter.github.io/bower/):

    bower install mathjs

### download
Or by downloading the latest version from
[mathjs.org](http://mathjs.org/#install_or_download).


## Load

Math.js can be used in node.js and in the browser. The library must be loaded
and instantiated. When creating an instance, one can optionally provide
configuration options as described in
[Configuration](https://github.com/josdejong/mathjs/blob/master/docs/configuration.md).

### Node.js

Load math.js in [node.js](http://nodejs.org/):

```js
// load math.js and create an instance
var mathjs = require('mathjs'),
    math = mathjs();

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
    // create an instance of math.js
    var math = mathjs();

    // use math.js
    math.sqrt(-4); // 2i
  </script>
</body>
</html>
```

If support for old browsers (Internet Explorer 8 and older) is required,
the [es5-shim](https://github.com/kriskowal/es5-shim) library must be loaded
as well.


### Require.js

Load math.js in the browser using [require.js](http://requirejs.org/):

```js
require.config({
  paths: {
    mathjs: 'path/to/mathjs',
  }
});
require(['mathjs'], function (mathjs) {
  // create an instance of math.js
  var math = mathjs();

  // use math.js
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
// create an instance of math.js
var math = require('mathjs')();

// functions and constants
math.round(math.e, 3);            // 2.718
math.atan2(3, -3) / math.pi;      // 0.75
math.log(1000, 10);               // 3
math.sqrt(-4);                    // 2i
math.pow([[-1, 2], [3, 1]], 2);   // [[7, 0], [0, 7]]

// expressions
math.eval('12 / (2.3 + 0.7)');    // 4
math.eval('5.08 cm to inch');     // 2 inch
math.eval('sin(45 deg) ^ 2');     // 0.5
math.eval('9 / 3 + 2i');          // 3 + 2i
math.eval('det([-1, 2; 3, 1])');  // -7

// chained operations
math.select(3)
    .add(4)
    .multiply(2)
    .done(); // 14
```

## Next

To learn more about math.js, check out the available documentation and examples:

- [Documentation](https://github.com/josdejong/mathjs/blob/master/docs/index.md)
- [Examples](https://github.com/josdejong/mathjs/blob/master/examples/)
