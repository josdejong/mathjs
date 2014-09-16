# Expressions

Math.js contains a flexible and easy to use expression parser.
The parser supports all data types, functions and constants available in math.js.

Whilst the math.js library is aimed at JavaScript developers, the expression
parser is aimed at end users: mathematicians, engineers, students, pupils.
The syntax of the expression parser differs from JavaScript and the low level
math.js library.

This page is divided in the following sections:

- [Parsing and evaluation](#parsing-and-evaluation) describes how to parse and
  evaluate expressions with math.js
- [Syntax](#syntax) describes how to write expressions.
- [Customization](#customization) describes how to customize processing and 
  evaluation of expressions.


## Parsing and evaluation

Expressions can be parsed and evaluated in various ways:

- Using the function [`math.eval(expr [,scope])`](#eval).
- Using the function [`math.compile(expr)`](#compile).
- Using the function [`math.parse(expr)`](#parse).
- By creating a [parser](#parser), `math.parser()`, which contains functions
  `parse`, `compile`, and `eval`, and keeps a scope with assigned variables in
  memory.


### Eval

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
// evaluate expressions
math.eval('sqrt(3^2 + 4^2)');           // 5
math.eval('sqrt(-4)');                  // 2i
math.eval('2 inch to cm');              // 5.08 cm
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


### Compile

Math.js contains a function `math.compile` which compiles expressions
into JavaScript code. This is a shortcut for first [parsing](#parse) and then
compiling an expression. The syntax is:

```js
math.compile(expr);
math.compile([expr1, expr2, expr3, ...]);
```

Function `compile` accepts a single expression or an array with
expressions as argument. Function `compile` returns an object with a function
`eval([scope])`, which can be executed to evaluate the expression against an
(optional) scope:

```js
var code = math.compile(expr);    // compile an expression
var result = code.eval([scope]);  // evaluate the code with an optional scope
```

An expression needs to be compiled only once, after which the
expression can be evaluated repeatedly and against different scopes.
The optional scope is used to resolve symbols and to write assigned
variables or functions. Parameter `scope` is a regular Object.

Example usage:

```js
// parse an expression into a node, and evaluate the node
var code1 = math.compile('sqrt(3^2 + 4^2)');
code1.eval(); // 5
```


### Parse

Math.js contains a function `math.parse` to parse expressions into a node
tree. The syntax is:

```js
math.parse(expr)
math.parse([expr1, expr2, expr3, ...])
```

Function `parse` accepts a single expression or an array with
expressions as argument. Function `parse` returns a node tree, which can
be successively compiled and evaluated:

```js
var node = math.parse(expr);      // parse expression into a node tree
var code = node.compile(math);    // compile the node tree
var result = code.eval([scope]);  // evaluate the code with an optional scope
```

An expression needs to be parsed and compiled only once, after which the
expression can be evaluated repeatedly. On evaluation, an optional scope
can be provided, which is used to resolve symbols and to write assigned
variables or functions. Parameter `scope` is a regular Object.

Example usage:

```js
// parse an expression into a node, and evaluate the node
var node1 = math.parse('sqrt(3^2 + 4^2)');
var code1 = node1.compile(math);
code1.eval(); // 5

// provide a scope
var node2 = math.parse('x^a', scope);
var code2 = node2.compile(math);
var scope = {
    x: 3,
    a: 2
};
code2.eval(scope); // 9

// change a value in the scope and re-evaluate the node
scope.a = 3;
code2.eval(scope); // 27
```

Parsed expressions can be exported to text using `node.toString()`, and can
be exported to LaTeX using `node.toTex()`. The LaTeX export can be used to 
pretty print an expression in the browser with a library like 
[MathJax](http://www.mathjax.org/). Example usage:

```js
// parse an expression
var node = math.parse('sqrt(x/x+1)');
node.toString();  // returns 'sqrt((x / x) + 1)'
node.toTex();     // returns '\sqrt{ {\frac{x}{x} }+{1} }'
```


### Parser

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
  Completely clear the parser's scope.
- `eval(expr)`
  Evaluate an expression. Returns the result of the expression.
- `get(name)`
  Retrieve a variable or function from the parser's scope.
- `remove(name)`
  Remove a variable or function from the parser's scope.
- `set(name, value)`
  Set a variable or function in the parser's scope.
  A node can be evaluated as `node.eval()`.

The following code shows how to create and use a parser.

```js
// create a parser
var parser = math.parser();

// evaluate expressions
parser.eval('sqrt(3^2 + 4^2)');         // 5
parser.eval('sqrt(-4)');                // 2i
parser.eval('2 inch to cm');            // 5.08 cm
parser.eval('cos(45 deg)');             // 0.7071067811865476

// define variables and functions
parser.eval('x = 7 / 2');               // 3.5
parser.eval('x + 3');                   // 6.5
parser.eval('f(x, y) = x^y');  // f(x, y)
parser.eval('f(2, 3)');                 // 8

// get and set variables and functions
var x = parser.get('x');                // x = 7
var f = parser.get('f');                // function
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


## Syntax

The expression parser is aimed at a mathematical audience, not a programming
audience. The syntax is similar to most calculators and mathematical
applications. This is close to JavaScript as well, though there are a few
important differences between the syntax of the expression parser and the
lower level syntax of math.js. Differences are:

- No need to prefix functions and constants with the `math.*` namespace,
  you can just enter `"sin(pi / 4)"`.
- Matrix indexes, which are one-based instead of zero-based.
- There are index and range operators which allow more conveniently getting
  and setting matrix indexes.
- Both indexes and ranges and have the upper-bound included.
- There is a differing syntax for defining functions.
- Can use operators like `x + y` instead of `math.add(x, y)`.

This section describes how to work with the available data types, functions,
operators, variables, and more.


### Operators

The expression parser has operators for all common arithmetic operations such
as addition and multiplication. The expression parser uses conventional infix
notation for operators: an operator is placed between its arguments.
Round parentheses can be used to override the default precedence of operators.

```js
// use operators
math.eval('2 + 3'); // 5
math.eval('2 * 3'); // 6

// use parentheses to override the default precedence
math.eval('2 + 3 * 4');   // 14
math.eval('(2 + 3) * 4'); // 20
```

The following operators are available:

Operator    | Name                    | Syntax      | Associativity | Example               | Result
----------- | ----------------------- | ----------  | ------------- | --------------------- | ---------------
`(`, `)`    | Parentheses             | `(x)`       | None          | `2 * (3 + 4)`         | `14`
`[`, `]`    | Matrix, Index           | `[...]`     | None          | `[[1,2],[3,4]]`       | `[[1,2],[3,4]]`
`,`         | Parameter separator     | `x, y`      | None          | `max(2, 1, 5)`        | `5`
`;`         | Statement separator     | `x; y`      | Left to right | `a=2; b=3; a*b`       | `[6]`
`;`         | Row separator           | `[x, y]`    | Left to right | `[1,2;3,4]`           | `[[1,2],[3,4]]`
`\n`        | Statement separator     | `x \n y`    | Left to right | `a=2 \n b=3 \n a*b`   | `[2,3,6]`
`+`         | Add                     | `x + y`     | Left to right | `4 + 5`               | `9`
`+`         | Unary plus              | `+y`        | None          | `+"4"`                | `4`
`-`         | Subtract                | `x - y`     | Left to right | `7 - 3`               | `4`
`-`         | Unary minus             | `-y`        | None          | `-4`                  | `-4`
`*`         | Multiply                | `x * y`     | Left to right | `2 * 3`               | `6`
`.*`        | Element-wise multiply   | `x .* y`    | Left to right | `[1,2,3] .* [1,2,3]`  | `[1,4,9]`
`/`         | Divide                  | `x / y`     | Left to right | `6 / 2`               | `3`
`./`        | Element-wise divide     | `x ./ y`    | Left to right | `[9,6,4] ./ [3,2,2]`  | `[3,3,2]`
`%`, `mod`  | Modulus                 | `x % y`     | Left to right | `8 % 3`               | `2`
`^`         | Power                   | `x ^ y`     | Right to left | `2 ^ 3`               | `8`
`.^`        | Element-wise power      | `x .^ y`    | Right to left | `[2,3] .^ [3,3]`      | `[9,27]`
`'`         | Transpose               | `y'`        | None          | `[[1,2],[3,4]]'`      | `[[1,3],[2,4]]`
`!`         | Factorial               | `y!`        | None          | `5!`                  | `120`
`=`         | Assignment              | `x = y`     | Right to left | `a = 5`               | `5`
`?` `:`     | Conditional expression  | `x ? y : z` | Right to left | `15 > 100 ? 1 : -1`   | `-1`
`:`         | Range                   | `x : y`     | None          | `1:4`                 | `[1,2,3,4]`
`to`, `in`  | Unit conversion         | `x to y`    | Left to right | `2 inch to cm`        | `5.08 cm`
`==`        | Equal                   | `x == y`    | Left to right | `2 == 4 - 2`          | `true`
`!=`        | Unequal                 | `x != y`    | Left to right | `2 != 3`              | `true`
`<`         | Smaller                 | `x < y`     | Left to right | `2 < 3`               | `true`
`>`         | Larger                  | `x > y`     | Left to right | `2 > 3`               | `false`
`<=`        | Smallereq               | `x <= y`    | Left to right | `4 <= 3`              | `false`
`>=`        | Largereq                | `x >= y`    | Left to right | `2 + 4 >= 6`          | `true`

The operators have the following precedence, from highest to lowest:

Operators                         | Description
--------------------------------- | --------------------
`x(...)`                          | Function call and matrix index
`'`                               | Matrix transpose
`!`                               | Factorial
`^`, `.^`                         | Exponentiation
`+`, `-`                          | Unary plus, unary minus
`x unit`                          | Unit
`*`, `/`, `.*`, `./`, `%`, `mod`  | Multiply, divide, modulus, implicit multiply
`+`, `-`                          | Add, subtract
`:`                               | Range
`to`, `in`                        | Unit conversion
`==`, `!=`, `<`, `>`, `<=`, `>=`  | Relational
`?`, `:`                          | Conditional expression
`=`                               | Assignment
`,`                               | Parameter and column separator
`;`                               | Row separator
`\n`, `;`                         | Statement separators


### Functions

Functions are called by entering their name, followed by zero or more
arguments enclosed by parentheses. All available functions are listed on the
page [Functions](functions.md).

```js
math.eval('sqrt(25)');          // 5
math.eval('log(1000, 3 + 7)');  // 4
math.eval('sin(pi / 4)');       // 0.7071067811865475
```

New functions can be defined using the `function` keyword. Functions can be
defined with multiple variables. Function assignments are limited: they can
only be defined on a single line.

```js
var parser = math.parser();

parser.eval('f(x) = x ^ 2 - 5');
parser.eval('f(2)');    // -1
parser.eval('f(3)');    // 4

parser.eval('g(x, y) = x ^ y');
parser.eval('g(2, 3)'); // 8
```


### Constants and variables

Math.js has a number of built in constants such as `pi` and `e`.
All available constants are listed on he page
[Constants](constants.md).

```js
// use constants
math.eval('pi');                // 3.141592653589793
math.eval('e ^ 2');             // 7.3890560989306495
math.eval('log(e)');            // 1
math.eval('e ^ (pi * i) + 1');  // ~0 (Euler)
```

Variables can be defined using the assignment operator `=`, and can be used
like constants.

```js
var parser = math.parser();

// define variables
parser.eval('a = 3.4');     // 3.4
parser.eval('b = 5 / 2');   // 2.5

// use variables
parser.eval('a * b');       // 8.5
```


### Data types

The expression parser supports booleans, numbers, complex numbers, units,
strings, and matrices.


#### Booleans

Booleans `true` and `false` can be used in expressions.

```js
// use booleans
math.eval('true');              // true
math.eval('false');             // false
math.eval('(2 == 3) == false'); // true
```

Booleans can be converted to numbers and strings and vice versa using the
functions `number` and `boolean`, and `string`.

```js
// convert booleans
math.eval('number(true)');      // 1
math.eval('string(false)');     // "false"
math.eval('boolean(1)');        // true
math.eval('boolean("false")');  // false
```


#### Numbers

The most important and basic data type in math.js are numbers. Numbers use a
point as decimal mark. Numbers can be entered with exponential notation.
Examples:

```js
// numbers in math.js
math.eval('2');       // 2
math.eval('3.14');    // 3.14
math.eval('1.4e3');   // 1400
math.eval('22e-3');   // 0.022
```

A number can be converted to a string and vice versa using the functions
`number` and `string`.

```js
// convert a string into a number
math.eval('number("2.3")');   // 2.3
math.eval('string(2.3)');     // "2.3"
```

Math.js uses regular JavaScript numbers, which are floating points with a
limited precision and limited range. The limitations are described in detail
on the page [Numbers](datatypes/numbers.md).

```js
math.eval('1e-325');  // 0
math.eval('1e309');   // Infinity
math.eval('-1e309');  // -Infinity
```

When doing calculations with floats, one can very easily get round-off errors:

```js
// round-off error due to limited floating point precision
math.eval('0.1 + 0.2'); // 0.30000000000000004
```

When outputting results, the function `math.format` can be used to hide
these round-off errors when outputting results for the user:

```js
var ans = math.eval('0.1 + 0.2');   //  0.30000000000000004
math.format(ans, {precision: 14});  // "0.3"
```


#### BigNumbers

Math.js supports BigNumbers for calculations with an arbitrary precision.
The pros and cons of Number and BigNumber are explained in detail on the page
[Numbers](datatypes/numbers.md).

BigNumbers are slower, but have a higher precision. Calculations with big
numbers are supported only by arithmetic functions.

BigNumbers can be created using the `bignumber` function:

```js
math.eval('bignumber(0.1) + bignumber(0.2)'); // BigNumber, 0.3
```

The default number type of the expression parser can be changed at instantiation
of math.js. The expression parser parses numbers as BigNumber by default:

```js
// Configure the type of number: 'number' (default) or 'bignumber'
math.config({number: 'bignumber'});

// all numbers are parsed as BigNumber
math.eval('0.1 + 0.2'); // BigNumber, 0.3
```

BigNumbers can be converted to numbers and vice versa using the functions
`number` and `bignumber`. When converting a BigNumber to a Number, the high
precision of the BigNumber will be lost. When a BigNumber is too large to be represented
as Number, it will be initialized as `Infinity`.


#### Complex numbers

Complex numbers can be created using the imaginary unit `i`, which is defined
as `i^2 = -1`. Complex numbers have a real and complex part, which can be
retrieved using the functions `re` and `im`.

```js
var parser = math.parser();

// create complex numbers
parser.eval('a = 2 + 3i');  // Complex, 2 + 3i
parser.eval('b = 4 - i');   // Complex, 4 - i

// get real and imaginary part of a complex number
parser.eval('re(a)');       // Number,  2
parser.eval('im(a)');       // Number,  3

// calculations with complex numbers
parser.eval('a + b');       // Complex, 6 + 2i
parser.eval('a * b');       // Complex, 11 + 10i
parser.eval('i * i');       // Number,  -1
parser.eval('sqrt(-4)');    // Complex, 2i
```

Math.js does not automatically convert complex numbers with an imaginary part
of zero to numbers. They can be converted to a number using the function
`number`.

```js
// convert a complex number to a number
var parser = math.parser();
parser.eval('a = 2 + 3i');  // Complex, 2 + 3i
parser.eval('b = a - 3i');  // Complex, 2 + 0i
parser.eval('number(b)');   // Number,  2
parser.eval('number(a)');   // Error: 2 + i is no valid number
```


#### Units

math.js supports units. Units can be used in basic arithmetic operations like
add and subtract, and units can be converted from one to another.
An overview of all available units can be found on the page
[Units](datatypes/units.md).

Units can be converted using the operator `to` or `in`.

```js
// create a unit
math.eval('5.4 kg');                    // Unit, 5.4 kg

// convert a unit
math.eval('2 inch to cm');              // Unit, 5.08 cm
math.eval('20 celsius in fahrenheit');  // Unit, ~68 fahrenheit

// calculations with units
math.eval('0.5kg + 33g');               // Unit, 0.533 kg
math.eval('3 inch + 2 cm');             // Unit, 3.7874 inch
math.eval('3 inch + 2 cm');             // Unit, 3.7874 inch
math.eval('12 seconds * 2');            // Unit, 24 seconds
math.eval('sin(45 deg)');               // Number, 0.7071067811865475
```


#### Strings

Strings are enclosed by double quotes ". Strings can be concatenated by adding
them. Parts of a string can be retrieved or replaced by using indexes. Strings
can be converted to a number using function `number`, and numbers can be
converted to a string using function `string`.

```js
var parser = math.parser();

// create a string
parser.eval('"hello"');                 // String, "hello"

// string manipulation
parser.eval('a = "hello" + " world"');  // String, "hello world"
parser.eval('size(a)');                 // Number, 11
parser.eval('a[1:5]');                  // String, "hello"
parser.eval('a[1] = "H"');              // String, "Hello"
parser.eval('a[7:12] = "there!"');      // String, "Hello there!"

// string conversion
parser.eval('number("300")');           // Number, 300
parser.eval('string(300)');             // String, "300"
```

Strings can be used in the `eval` function, to parse expressions inside
the expression parser:

```js
math.eval('eval("2 + 3")'); // 5
```


#### Matrices

Matrices can be created by entering a series of values between square brackets,
elements are separated by a comma `,`.
A matrix like `[1, 2, 3]` will create a vector, a 1 dimensional matrix with
size `[3]`. To create a multi dimensional matrix, matrices can be nested into
each other. For easier creation of two dimensional matrices, a semicolon `;`
can be used to separate rows in a matrix.

```js
// create a matrix
math.eval('[1, 2, 3]');                               // Matrix, size [3]
math.eval('[[1, 2, 3], [4, 5, 6]]');                  // Matrix, size [2, 3]
math.eval('[[[1, 2], [3, 4]], [[5, 6], [7, 8]]]');    // Matrix, size [2, 2, 2]

// create a two dimensional matrix
math.eval('[1, 2, 3; 4, 5, 6]');                      // Matrix, size [2, 3]
```

An other way to create filled matrices is using the functions `zeros`, `ones`,
`eye`, and `range`.

```js
// initialize a matrix with ones or zeros
math.eval('zeros(3, 2)');     // Matrix, [[0, 0], [0, 0], [0, 0]],  size [3, 2]
math.eval('ones(3)');         // Matrix, [1, 1, 1],                 size [3]
math.eval('5 * ones(2, 2)');  // Matrix, [[5, 5], [5, 5]],          size [2, 2]

// create an identity matrix
math.eval('eye(2)');          // Matrix, [[1, 0], [0, 1]],          size [2, 2]

// create a range
math.eval('1:4');             // Matrix, [1, 2, 3, 4],              size [4]
math.eval('0:2:10');          // Matrix, [0, 2, 4, 6, 8, 10],       size [6]
```

A subset can be retrieved from a matrix using indexes, and a subset of a matrix
can be replaced by using indexes. Indexes are enclosed in square brackets, and
contain a number or a range for each of the matrix dimensions. A range can have
its start and/or end undefined. When start is undefined, the range will start
at 1, when end is undefined, the range will end at the end of the matrix.
There is a context variable `end` available as well to denote the end of the
matrix.

*IMPORTANT: matrix indexes and ranges work different from the math.js indexes
in JavaScript: They are one-based with an included upper-bound, similar to most
math applications.*

```js
parser = math.parser();

// create matrices
parser.eval('a = [1, 2; 3, 4]');      // Matrix, [[1, 2], [3, 4]]
parser.eval('b = zeros(2, 2)');       // Matrix, [[0, 0], [0, 0]]
parser.eval('c = 5:9');               // Matrix, [5, 6, 7, 8, 9]

// replace a subset in a matrix
parser.eval('b[1, 1:2] = [5, 6]');    // Matrix, [[5, 6], [0, 0]]
parser.eval('b[2, :] = [7, 8]');      // Matrix, [[5, 6], [7, 8]]

// perform a matrix calculation
parser.eval('d = a * b');             // Matrix, [[19, 22], [43, 50]]

// retrieve a subset of a matrix
parser.eval('d[2, 1]');               // 43
parser.eval('d[2, 1:end]');           // Matrix, [[43, 50]]
parser.eval('c[end - 1 : -1 : 2]');   // Matrix, [8, 7, 6]
```


### Multi line expressions

An expression can contain multiple lines, and expressions can be spread over
multiple lines. Lines can be separated by a newline character `\n` or by a 
semicolon `;`. Output of statements followed by a semicolon will be hided from 
the output, and empty lines are ignored. The output is returned as a `ResultSet`, 
with an entry for every visible statement.

```js
// a multi line expression
math.eval('1 * 3 \n 2 * 3 \n 3 * 3');   // ResultSet, [1, 3, 9]

// semicolon statements are hided from the output
math.eval('a=3; b=4; a + b \n a * b');  // ResultSet, [7, 12]

// single expression spread over multiple lines
math.eval('a = 2 +\n  3');              // 5 
math.eval('[\n  1, 2;\n  3, 4\n]');     // Matrix, [[1, 2], [3, 4]] 
```

The results can be read from a `ResultSet` via the property `ResultSet.entries`
which is an `Array`, or by calling `ResultSet.valueOf()`, which returns the 
array with results.


### Implicit multiplication

The expression parser supports implicit multiplication. Implicit multiplication
has the same precedence as explicit multiplications and divisions, so `3/4 mm`
is evaluated as `(3 / 4) * mm`. Here some examples:

Expression      | Evaluated as:
--------------- | ----------------------
(3 + 2) b       | (3 + 2) * b
3 / 4 mm        | (3 / 4) * mm
(1 + 2) (4 - 2) | (1 + 2) * (4 - 2)
sqrt(2)(4 + 1)  | sqrt(2) * (4 + 1)
A[2, 3]         | A[2, 3]   # get subset
(A)[2, 3]       | (A) * [2, 3]
[2, 3][1, 3]    | [2, 3] * [1, 3]

Implicit multiplication can be tricky as there is ambiguity on how an expression
is evaluated. Use it carefully.

```js
math.eval('(1 + 2)(4 - 2)');  // Number, 6
math.eval('3/4 mm');          // Unit, 0.75 mm
math.eval('2 + 3i');          // Complex, 2 + 3i
```


### Comments

Comments can be added to explain or describe calculations in text. A comment
starts with a sharp sign character `#`, and ends at the end of the line. A line
can contain a comment only, or can contain an expression followed by a comment.

```js
var parser = math.parser();

parser.eval('# define some variables');
parser.eval('width = 3');                             // 3
parser.eval('height = 4');                            // 4
parser.eval('width * height   # calculate the area'); // 12
```


## Customization

Besides parsing and evaluating expressions, the expression parser supports
a number of features to customize processing and evaluation of expressions.

### Function transforms

It is possible to preprocess function arguments and post process a functions
return value by writing a *transform* for the function. A transform is a 
function wrapping around a function to be transformed or completely replaces
a function.

For example, the functions or math.js use zero-based matrix indices (as is 
common in programing languages), but the expression parser uses one-based 
indices. To enable this, all functions dealing with indices have a transform,
which changes input from one-based to zero-based, and transforms output (and
error message) from zero-based to one-based.

```js
// using plain JavaScript, indices are zero-based:
var a = [[1, 2], [3, 4]]; // a 2x2 matrix
math.subset(a, math.index(0, 1)); // returns 2

// using the expression parser, indices are transformed to one-based:
var a = [[1, 2], [3, 4]]; // a 2x2 matrix
var scope = {
  a: a
};
math.eval('subset(a, index(1, 2))', scope); // returns 2
```

To create a transform for a function, the transform function must be attached
to the function as property `transform`:

```js
var math = require('../index');

// create a function
function addIt(a, b) {
  return a + b;
}

// attach a transform function to the function addIt
addIt.transform = function (a, b) {
  console.log('input: a=' + a + ', b=' + b);
  // we can manipulate input here before executing addIt

  var res = addIt(a, b);

  console.log('result: ' + res);
  // we can manipulate result here before returning

  return res;
};

// import the function into math.js
math.import({
  addIt: addIt
});

// use the function via the expression parser
console.log('Using expression parser:');
console.log('2+4=' + math.eval('addIt(2, 4)'));
// This will output:
//
//     input: a=2, b=4
//     result: 6
//     2+4=6

// when used via plain JavaScript, the transform is not invoked
console.log('');
console.log('Using plain JavaScript:');
console.log('2+4=' + math.addIt(2, 4));
// This will output:
//
//     6
```

Functions with a transform must be imported in the `math` namespace, as they 
need to be processed at compile time. They are not supported when passed via a 
scope at evaluation time.


### Custom argument parsing

The expression parser of math.js has support for letting functions
parse and evaluate arguments themselves, instead of calling them with
evaluated arguments. This is useful for example when creating a function
like `plot(f(x), x)` or `integrate(f(x), x, start, end)`, where some of the
arguments need to be processed in a special way. In these cases, the expression
`f(x)` will be evaluated repeatedly by the function, and `x` is not evaluated
but used to specify the variable looping over the function `f(x)`.

Functions having a property `rawArgs` with value `true` are treated in a special
way by the expression parser: they will be invoked with unevaluated arguments, 
allowing the function to process the arguments in a customized way. Raw 
functions are called as:

```
rawFunction(args, math, scope)
```

Where :

- `args` is an Array with nodes of the parsed arguments.
- `math` is the math namespace with which the expression was compiled.
- `scope` is the scope provided when evaluating the expression.

Raw functions must be imported in the `math` namespace, as they need to be
processed at compile time. They are not supported when passed via a scope
at evaluation time.

A simple example:

```js
function myFunction(args, math, scope) {
  // get string representation of the arguments
  var str = args.map(function (arg) {
    return arg.toString();
  })
  
  // evaluate the arguments
  var res = args.map(function (arg) {
    return arg.compile(math).eval(scope);
  });
  
  return 'arguments: ' + str.join(',') + ', evaluated: ' + res.join(',');
}

// mark the function as "rawArgs", so it will be called with unevaluated arguments
myFunction.rawArgs = true;

// import the new function in the math namespace
math.import({
  myFunction: myFunction
})

// use the function
math.eval('myFunction(2 + 3, sqrt(4))'); 
// returns 'arguments: 2 + 3, sqrt(4), evaluated: 5, 2'
```
