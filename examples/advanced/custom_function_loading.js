// Load the math.js core and only the functions and data types that we need
// Note that we load function implementations for a specific data type
// (lib/number/arithmetic) and not generic implementations (lib/arithmetic)
const core = require('../../core')
const bignumber = require('../../lib/type/bignumber')
const numberArithmetic = require('../../lib/plain/number/arithmetic')
const bignumberArithmetic = require('../../lib/plain/bignumber/arithmetic')

// Create a new, empty math.js instance
// It will only contain methods `import` and `config`
const math = core.create()

// import the functions and data types that we need
math.import([
  bignumber,
  numberArithmetic,
  bignumberArithmetic
])

// math.add now contains two signatures: for numbers and bignumbers
console.log('math.add', Object.keys(math.add.signatures))

const a1 = math.divide(1, 3)
console.log('a1', a1.toString())

const a2 = math.divide(1, math.bignumber(3))
console.log('a2', a2.toString())
