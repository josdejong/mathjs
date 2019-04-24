// Expression parser security
//
// Executing arbitrary expressions like enabled by the expression parser of
// mathjs involves a risk in general. When you're using mathjs to let users
// execute arbitrary expressions, it's good to take a moment to think about
// possible security and stability implications, especially when running the
// code server side.
//
// There is a small number of functions which yield the biggest security risk
// in the expression parser of math.js:
//
// - `import` and `createUnit` which alter the built-in functionality and allow
//   overriding existing functions and units.
// - `evaluate`, `parse`, `simplify`, and `derivative` which parse arbitrary input
//   into a manipulable expression tree.
//
// To make the expression parser less vulnerable whilst still supporting most
// functionality, these functions can be disabled, as demonstrated in this
// example.

const { create, all } = require('../..')
const math = create(all)

const limitedEvaluate = math.evaluate

math.import({
  'import': function () { throw new Error('Function import is disabled') },
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'evaluate': function () { throw new Error('Function evaluate is disabled') },
  'parse': function () { throw new Error('Function parse is disabled') },
  'simplify': function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') }
}, { override: true })

console.log(limitedEvaluate('sqrt(16)')) // Ok, 4
console.log(limitedEvaluate('parse("2+3")')) // Error: Function parse is disabled
