/**
 * Expressions can be evaluated in various ways:
 *
 * 1. using the function math.eval
 * 2. using the function math.parse
 * 3. using a parser. A parser contains functions eval and parse,
 *    and keeps a scope with assigned variables in memory
 */

// load math.js
var math = require('../index');

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  console.log(math.format(value));
}

// 1. using the function math.eval
//
// Function `eval` accepts a single expression or an array with
// expressions as first argument, and has an optional second argument
// containing a scope with variables and functions. The scope is a regular
// JavaScript Object. The scope will be used to resolve symbols, and to write
// assigned variables or function.
console.log('1. USING FUNCTION MATH.EVAL');

// evaluate expressions
console.log('\nevaluate expressions');
print(math.eval('sqrt(3^2 + 4^2)'));        // a = 5
print(math.eval('sqrt(-4)'));               // b = 2i
print(math.eval('2 inch in cm'));           // c = 5.08 cm
print(math.eval('cos(45 deg)'));            // d = 0.70711

// evaluate multiple expressions at once
console.log('\nevaluate multiple expressions at once');
print(math.eval([
  'f = 3',
  'g = 4',
  'f * g'
]));                                        // [3, 4, 12]

// provide a scope (just a regular JavaScript Object)
console.log('\nevaluate expressions providing a scope with variables and functions');
var scope = {
  a: 3,
  b: 4
};

// variables can be read from the scope
print(math.eval('a * b', scope));           // 12

// variable assignments are written to the scope
print(math.eval('c = 2.3 + 4.5', scope));   // 6.8
print(scope.c);                             // 6.8

// scope can contain both variables and functions
scope.hello = function (name) {
  return 'hello, ' + name + '!';
};
print(math.eval('hello("hero")', scope));   // "hello, hero!"

// define a function as an expression
var f = math.eval('function f(x) = x ^ a', scope);
print(f(2));                                // 8
print(scope.f(2));                          // 8



// 2. using function math.parse
//
// Function `math.parse` parses expressions into a node tree. The syntax is
// similar to function `math.eval`.
// Function `parse` accepts a single expression or an array with
// expressions as first argument, and has an optional second argument
// containing a scope with variables and functions. The scope is a regular
// JavaScript Object. The scope will be used to resolve symbols, and to write
// assigned variables or function. Variables are linked dynamically to the
// provided scope.
console.log('\n2. USING FUNCTION MATH.PARSE');

// parse an expression
console.log('\nparse an expression into a node tree');
var node1 = math.parse('sqrt(3^2 + 4^2)');
print(node1.toString());                    // "ans = sqrt((3 ^ 2) + (4 ^ 2))"

// evaluate a node
print(node1.eval());                        // 5

// provide a scope
console.log('\nprovide a scope');
var scope = {
  x: 3,
  a: 2
};
var node2 = math.parse('x^a', scope);
print(node2.toString());                    // "ans = x ^ a"
print(node2.eval());                        // 9

// change a value in the scope and re-evaluate the node
scope.a = 3;
print(node2.eval());                        // 27



// 3. using a parser
//
// In addition to the static functions `math.eval` and `math.parse`, math.js
// contains a parser with functions `eval` and `parse`, which automatically
// keeps a scope with assigned variables in memory. The parser also contains
// some convenience methods to get, set, and remove variables from memory.
console.log('\n3. USING A PARSER');
var parser = math.parser();

// evaluate with parser
console.log('\nevaluate expressions');
print(parser.eval('sqrt(3^2 + 4^2)'));          // 5
print(parser.eval('sqrt(-4)'));                 // 2i
print(parser.eval('2 inch in cm'));             // 5.08 cm
print(parser.eval('cos(45 deg)'));              // 0.70711

// define variables and functions
console.log('\ndefine variables and functions');
print(parser.eval('x = 7 / 2'));                // 3.5
print(parser.eval('x + 3'));                    // 6.5
print(parser.eval('function f(x, y) = x^y'));   // f(x, y)
print(parser.eval('f(2, 3)'));                  // 8

// get and set variables and functions
console.log('\nget and set variables and function in the scope of the parser');
var x = parser.get('x');                        // x = 7
console.log('x =', x);
var f = parser.get('f');                        // f = function
console.log('f =', f);
var g = f(3, 3);                                // g = 27
console.log('g =', g);

parser.set('h', 500);
print(parser.eval('h / 2'));                    // 250
parser.set('hello', function (name) {
  return 'hello, ' + name + '!';
});
print(parser.eval('hello("hero")'));            // "hello, hero!"

// clear defined functions and variables
parser.clear();
