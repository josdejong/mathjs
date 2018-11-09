// This file contains all factory functions of math.js

import expression from './expression'
import type from './type'
import functions from './function'
import { createConstants } from './constants'
import error from './error'

export default [
  type, // data types (Matrix, Complex, Unit, ...)
  createConstants, // constants

  functions, // functions

  // load ./expression *after* ./function since we need to
  // attach transforms to functions that are imported there
  expression, // expression parsing

  require('./json'), // serialization utility (math.json.reviver)
  error
]
