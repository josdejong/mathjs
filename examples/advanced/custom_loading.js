// Load the math.js core
const core = require('../../core')

// Create a new, empty math.js instance
// It will only contain methods `import` and `config`
const math = core.create()

// load the data types you need. Let's say you just want to use fractions,
// but no matrices, complex numbers, bignumbers, and other stuff.
//
// To load all data types:
//
//     math.import(require('../../lib/type'))
//
math.import(require('../../lib/type/fraction'))

// Load the functions you need.
//
// To load all functions:
//
//     math.import(require('../../lib/function'))
//
// To load all functions of a specific category:
//
//     math.import(require('../../lib/function/arithmetic'))
//
math.import(require('../../lib/function/arithmetic/add'))
math.import(require('../../lib/function/arithmetic/subtract'))
math.import(require('../../lib/function/arithmetic/multiply'))
math.import(require('../../lib/function/arithmetic/divide'))
math.import(require('../../lib/function/string/format'))

// Use the loaded functions
const a = math.fraction(1, 3)
const b = math.fraction(3, 7)
const c = math.add(a, b)
console.log('result:', math.format(c)) // outputs "result: 16/21"

// Now, when bundling your application for use in the browser, only the used
// parts of math.js will be bundled. For example to create a bundle using
// browserify:
//
//     browserify custom_loading.js -o custom_loading.bundle.js
//
