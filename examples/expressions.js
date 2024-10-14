/**
 * Expressions can be evaluated in various ways:
 *
 * 1. using the function evaluate
 * 2. using the function parse
 * 3. using a parser. A parser contains functions evaluate and parse,
 *    and keeps a scope with assigned variables in memory
 */
import { compile, evaluate, format, parse, parser } from '../lib/esm/index.js'

// 1. using the function evaluate
//
// Function `evaluate` accepts a single expression or an array with
// expressions as first argument, and has an optional second argument
// containing a scope with variables and functions. The scope is a regular
// JavaScript Object. The scope will be used to resolve symbols, and to write
// assigned variables or function.
console.log('1. USING FUNCTION MATH.EVAL')

// evaluate expressions
console.log('\nevaluate expressions')
print(evaluate('sqrt(3^2 + 4^2)')) // 5
print(evaluate('sqrt(-4)')) // 2i
print(evaluate('2 inch to cm')) // 5.08 cm
print(evaluate('cos(45 deg)')) // 0.70711

// evaluate multiple expressions at once
console.log('\nevaluate multiple expressions at once')
print(evaluate([
  'f = 3',
  'g = 4',
  'f * g'
])) // [3, 4, 12]

// provide a scope (just a regular JavaScript Object)
console.log('\nevaluate expressions providing a scope with variables and functions')
const scope = {
  a: 3,
  b: 4
}

// variables can be read from the scope
print(evaluate('a * b', scope)) // 12

// variable assignments are written to the scope
print(evaluate('c = 2.3 + 4.5', scope)) // 6.8
print(scope.c) // 6.8

// scope can contain both variables and functions
scope.hello = function (name) {
  return 'hello, ' + name + '!'
}
print(evaluate('hello("hero")', scope)) // "hello, hero!"

// define a function as an expression
const f = evaluate('f(x) = x ^ a', scope)
print(f(2)) // 8
print(scope.f(2)) // 8

// 2. using function parse
//
// Function `parse` parses expressions into a node tree. The syntax is
// similar to function `evaluate`.
// Function `parse` accepts a single expression or an array with
// expressions as first argument. The function returns a node tree, which
// then can be compiled against math, and then evaluated against an (optional
// scope. This scope is a regular JavaScript Object. The scope will be used
// to resolve symbols, and to write assigned variables or function.
console.log('\n2. USING FUNCTION MATH.PARSE')

// parse an expression
console.log('\nparse an expression into a node tree')
const node1 = parse('sqrt(3^2 + 4^2)')
print(node1.toString()) // "sqrt((3 ^ 2) + (4 ^ 2))"

// compile and evaluate the compiled code
// you could also do this in two steps: node1.compile().evaluate()
print(node1.evaluate()) // 5

// provide a scope
console.log('\nprovide a scope')
const node2 = parse('x^a')
const code2 = node2.compile()
print(node2.toString()) // "x ^ a"
const scope2 = {
  x: 3,
  a: 2
}
print(code2.evaluate(scope2)) // 9

// change a value in the scope and re-evaluate the node
scope2.a = 3
print(code2.evaluate(scope2)) // 27

// 3. using function compile
//
// Function `compile` compiles expressions into a node tree. The syntax is
// similar to function `evaluate`.
// Function `compile` accepts a single expression or an array with
// expressions as first argument, and returns an object with a function evaluate
// to evaluate the compiled expression. On evaluation, an optional scope can
// be provided. This scope will be used to resolve symbols, and to write
// assigned variables or function.
console.log('\n3. USING FUNCTION MATH.COMPILE')

// parse an expression
console.log('\ncompile an expression')
const code3 = compile('sqrt(3^2 + 4^2)')

// evaluate the compiled code
print(code3.evaluate()) // 5

// provide a scope for the variable assignment
console.log('\nprovide a scope')
const code4 = compile('a = a + 3')
const scope3 = {
  a: 7
}
code4.evaluate(scope3)
print(scope3.a) // 10

// 4. using a parser
//
// In addition to the static functions `evaluate` and `parse`, js
// contains a parser with functions `evaluate` and `parse`, which automatically
// keeps a scope with assigned variables in memory. The parser also contains
// some convenience methods to get, set, and remove variables from memory.
console.log('\n4. USING A PARSER')
const myParser = parser()

// evaluate with parser
console.log('\nevaluate expressions')
print(myParser.evaluate('sqrt(3^2 + 4^2)')) // 5
print(myParser.evaluate('sqrt(-4)')) // 2i
print(myParser.evaluate('2 inch to cm')) // 5.08 cm
print(myParser.evaluate('cos(45 deg)')) // 0.70710678118655

// define variables and functions
console.log('\ndefine variables and functions')
print(myParser.evaluate('x = 7 / 2')) // 3.5
print(myParser.evaluate('x + 3')) // 6.5
print(myParser.evaluate('f2(x, y) = x^y')) // f2(x, y)
print(myParser.evaluate('f2(2, 3)')) // 8

// manipulate matrices
// Note that matrix indexes in the expression parser are one-based with the
// upper-bound included. On a JavaScript level however, js uses zero-based
// indexes with an excluded upper-bound.
console.log('\nmanipulate matrices')
print(myParser.evaluate('k = [1, 2; 3, 4]')) // [[1, 2], [3, 4]]
print(myParser.evaluate('l = zeros(2, 2)')) // [[0, 0], [0, 0]]
print(myParser.evaluate('l[1, 1:2] = [5, 6]')) // [5, 6]
print(myParser.evaluate('l')) // [[5, 6], [0, 0]]
print(myParser.evaluate('l[2, :] = [7, 8]')) // [7, 8]
print(myParser.evaluate('l')) // [[5, 6], [7, 8]]
print(myParser.evaluate('m = k * l')) // [[19, 22], [43, 50]]
print(myParser.evaluate('n = m[2, 1]')) // 43
print(myParser.evaluate('n = m[:, 1]')) // [[19], [43]]

// get and set variables and functions
console.log('\nget and set variables and function in the scope of the parser')
const x = myParser.get('x')
console.log('x =', x) // x = 3.5
const f2 = myParser.get('f2')
console.log('f2 =', format(f2)) // f2 = f2(x, y)
const h = f2(3, 3)
console.log('h =', h) // h = 27

myParser.set('i', 500)
print(myParser.evaluate('i / 2')) // 250
myParser.set('hello', function (name) {
  return 'hello, ' + name + '!'
})
print(myParser.evaluate('hello("hero")')) // "hello, hero!"

// clear defined functions and variables
myParser.clear()

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  const precision = 14
  console.log(format(value, precision))
}
