# Introduction

[Math.js](http://mathjs.org) is an extensive math library.
It features a flexible expression parser and offers an integrated solution
to work with numbers, big numbers, complex numbers, units, and matrices.

Math.js can be used in node.js and in the browser. Installation and download instructions are available on the [Download page](http://mathjs.org/download.html) of the website. A [Getting Started](getting_started.md) tutorial describes how to start using math.js. Code examples are available [here](http://mathjs.org/examples/index.html).


## Usage

Math.js can be used in three different ways:

-   Make **function calls** like `math.sqrt(4)` and constants like `math.pi`. This works similar to JavaScript's built-in `Math` object. Examples:

    ```js
    math.sqrt(25);                          // Number  5
    math.add(3, 4);                         // Number  7
    math.add(3, math.multiply(2, 3));       // Number  9
    math.log(10000, 10);                    // Number  4
    math.sin(math.pi / 4);                  // Number 0.70711
    math.multiply(math.i, math.i);          // Number -1
    ```

-   Evaluate **expressions** using [`math.eval`](reference/functions/eval.md). See section [Expressions](expressions/index.md). Some examples:

    ```js
    math.eval('12 / (2.3 + 0.7)');          // 4
    math.eval('sqrt(3^2 + 4^2)');           // Number  5
    math.eval('sqrt(-4)');                  // Complex 2i
    math.eval('2 inch to cm');              // Unit    5.08 cm
    math.eval('cos(45 deg)');               // Number  0.7071067811865476
    math.eval('det([-1, 2; 3, 1])');        // Number -7
    math.eval('a ^ b', {a: 2, b: 3});       // Number  8
    ```

-   Write **chains** using [`math.chain`](reference/functions/chain.md), described in section [Chaining](chaining.md). Examples:

    ```js
    math.chain(3)
        .add(4)
        .subtract(2)
        .done(); // 5
    ```

A listing with all available functions, units, and constants can be found in the [reference section](reference/index.md).


## Data types

The functions available in math.js support multiple data types: Number, BigNumber, Complex, Unit, String, Matrix, and Array. Different data types can be mixed together in calculations.

```js
math.add([2, 1, 5], 3);           // Array  [5, 4, 8]
var a1 = math.complex(2, 3);      // Complex 2 + 3i
var a2 = math.complex(-1, 4);     // Complex -1 + 4i
math.multiply(a, b);              // Complex -14 + 5i
math.sin(math.unit(45, 'deg'));   // Number 0.70711
math.add('hello ', 'world!');     // String 'hello world!'
```

The available data types are described in detail in section [Data types](datatypes/index.md).
