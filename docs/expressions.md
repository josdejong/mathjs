# Expressions

Math.js contains a flexible and easy to use expression parser.
The parser supports all data types, functions and constants available in math.js.
Expressions can be evaluated in various ways:

- Using the function [`math.eval(expr [,scope])`](#eval).
- Using the function [`math.parse(expr [,scope])`](#parse).
- By creating a [parser](#parser), `math.parser()`, which contains functions
  `eval`, `parse`, and keeps a scope with assigned variables in memory.


## Eval

Math.js comes with a function `math.eval` to evaluate expressions. Syntax:

```js
math.eval(expr)
math.eval(expr, scope)
math.eval([expr1, expr2, expr3, ...])
math.eval([expr1, expr2, expr3, ...], scope)
```

Function `eval` accepts a single expression or an array with
expressions as first argument, and has an optional second argument
containing a scope with variables and functions. The scope is a regular
JavaScript Object. The scope will be used to resolve symbols, and to write
assigned variables or function.

The following code demonstrates how to evaluate expressions.

```js
// load math.js
var math = require('mathjs');

// evaluate expressions
math.eval('sqrt(3^2 + 4^2)');           // 5
math.eval('sqrt(-4)');                  // 2i
math.eval('2 inch in cm');              // 5.08 cm
math.eval('cos(45 deg)');               // 0.7071067811865476

// provide a scope
var scope = {
    a: 3,
    b: 4
};
math.eval('a * b', scope);              // 12
math.eval('c = 2.3 + 4.5', scope);      // 6.8
scope.c;                                // 6.8
```

## Parse

Math.js contains a function `math.parse` to parse expressions into a node
tree. The syntax is similar to [`math.eval`](#eval):

```js
math.parse(expr)
math.parse(expr, scope)
math.parse([expr1, expr2, expr3, ...])
math.parse([expr1, expr2, expr3, ...], scope)
```

Function `parse` accepts a single expression or an array with
expressions as first argument, and has an optional second argument
containing a scope with variables and functions. The scope is a regular
JavaScript Object. The scope will be used to resolve symbols, and to write
assigned variables or function. Variables are linked dynamically to the
provided scope.

Example usage:

```js
// load math.js
var math = require('mathjs');

// parse an expression into a node, and evaluate the node
var node1 = math.parse('sqrt(3^2 + 4^2)');
node1.eval(); // 5

// provide a scope
var scope = {
    x: 3,
    a: 2
};
var node2 = math.parse('x^a', scope);
node2.eval(); // 9

// change a value in the scope and re-evaluate the node
scope.a = 3;
node2.eval(); // 27
```


## Parser

In addition to the static functions [`math.eval`](#eval) and
[`math.parse`](#parse), math.js contains a parser with functions `eval` and
`parse`, which automatically keeps a scope with assigned variables in memory.
The parser also contains some convenience functions to get, set, and remove
variables from memory.

A parser can be created by:

```js
var parser = math.parser();
```

The parser contains the following functions:

- `clear()`
  Completely clear the parsers scope.
- `eval(expr)`
  Evaluate an expression.
- `get(name)`
  Retrieve a variable or function from the parsers scope.
- `parse(expr)`
  Parse an expression into a node tree.
- `remove(name)`
  Remove a variable or function from the parsers scope.
- `set(name, value)`
  Set a variable or function in the parsers scope.
  A node can be evaluated as `node.eval()`.

The following code shows how to create and use a parser.

```js
// load math.js
var math = require('mathjs');

// create a parser
var parser = math.parser();

// evaluate expressions
parser.eval('sqrt(3^2 + 4^2)');         // 5
parser.eval('sqrt(-4)');                // 2i
parser.eval('2 inch in cm');            // 5.08 cm
parser.eval('cos(45 deg)');             // 0.7071067811865476

// define variables and functions
parser.eval('x = 7 / 2');               // 3.5
parser.eval('x + 3');                   // 6.5
parser.eval('function f(x, y) = x^y');  // f(x, y)
parser.eval('f(2, 3)');                 // 8

// get and set variables and functions
var x = parser.get('x');                // x = 7
var f = parser.get('f');                // f = function
var g = f(3, 3);                        // g = 27
parser.set('h', 500);
parser.eval('h / 2');                   // 250
parser.set('hello', function (name) {
    return 'hello, ' + name + '!';
});
parser.eval('hello("user")');           // "hello, user!"

// clear defined functions and variables
parser.clear();
```

## Operators

The following operators are available in the expression parser.

- x + y (add)
- x - y (subtract)
- x * y (multiply)
- x .* y (element-wise multiply)
- x / y (divide)
- x ./ y (element-wise divide)
- x % y (mod)
- x ^ y (power)
- x ^ y (element-wise power)
- -y (unary minus)
- y' (transpose)
- y! (factorial)
- x = y (assignment)
- x : y (range)
- x in y (unit conversion)
- x == y (equal)
- x != y (unequal)
- x < y (smaller)
- x > y (larger)
- x <= y (smallereq)
- x >= y (largereq)
