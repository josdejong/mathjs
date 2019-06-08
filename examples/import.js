/**
 * Math.js can easily be extended with functions and variables using the
 * `import` function. The function `import` accepts a module name or an object
 * containing functions and variables.
 */

// load math.js (using node.js)
const { create, all } = require('..')
const math = create(all)

/**
 * Define new functions and variables
 */
math.import({
  myConstant: 42,
  hello: function (name) {
    return 'hello, ' + name + '!'
  }
})

// defined methods can be used in both JavaScript as well as the parser
print(math.myConstant * 2) // 84
print(math.hello('user')) // 'hello, user!'

print(math.evaluate('myConstant + 10')) // 52
print(math.evaluate('hello("user")')) // 'hello, user!'

/**
 * Import the math library numbers.js, https://github.com/sjkaliski/numbers.js
 * The library must be installed first using npm:
 *     npm install numbers
 */
try {
  // load the numbers.js library
  const numbers = require('numbers')

  // import the numbers.js library into math.js
  math.import(numbers, { wrap: true, silent: true })

  if (math.fibonacci) {
    // calculate fibonacci
    print(math.fibonacci(7)) // 13
    print(math.evaluate('fibonacci(7)')) // 13
  }
} catch (err) {
  console.log('Warning: To use numbers.js, the library must ' +
      'be installed first via `npm install numbers`.')
}

/**
 * Import the math library numeric.js, https://github.com/sloisel/numeric
 * The library must be installed first using npm:
 *     npm install numeric
 */
try {
  // load the numeric.js library
  const numeric = require('numeric')

  // import the numeric.js library into math.js
  math.import(numeric, { wrap: true, silent: true })

  if (math.eig) {
    // calculate eigenvalues of a matrix
    print(math.evaluate('eig([1, 2; 4, 3])').lambda.x) // [5, -1]

    // solve AX = b
    const A = math.evaluate('[1, 2, 3; 2, -1, 1; 3, 0, -1]')
    const b = [9, 8, 3]
    print(math.solve(A, b)) // [2, -1, 3]
  }
} catch (err) {
  console.log('Warning: To use numeric.js, the library must ' +
      'be installed first via `npm install numeric`.')
}

/**
 * By default, the function import does not allow overriding existing functions.
 * Existing functions can be overridden by specifying option `override: true`
 */
math.import({
  pi: 3.14
}, {
  override: true
})

print(math.pi) // returns 3.14 instead of 3.141592653589793

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  const precision = 14
  console.log(math.format(value, precision))
}
