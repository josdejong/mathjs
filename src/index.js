// This file contains all factory functions of math.js

import type from './type'
import functions from './function'

export default [
  type, // data types (Matrix, Complex, Unit, ...)
  // require('./constants'), // constants // TODO: load constants here again after refactored

  functions, // functions

  // load ./expression *after* ./function since we need to
  // attach transforms to functions that are imported there
  require('./expression'), // expression parsing

  require('./json'), // serialization utility (math.json.reviver)
  require('./error') // errors
]
