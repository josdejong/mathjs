// This file contains all factory functions of math.js

module.exports = [
  require('./type'), // data types (Matrix, Complex, Unit, ...)
  require('./constants'), // constants
  require('./expression'), // expression parsing
  require('./function'), // functions
  require('./json'), // serialization utility (math.json.reviver)
  require('./error') // errors
]
