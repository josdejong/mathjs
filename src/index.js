// This file contains all factory functions of math.js

import expression from './expression'
import type from './type'
import functions from './function'
import json from './json'
import error from './error'
import {
  createE,
  createFalse,
  createI,
  createInfinity,
  createLN10,
  createLN2,
  createLOG10E,
  createLOG2E,
  createNaN,
  createNull,
  createPhi,
  createPi,
  createSQRT2,
  createSQRT1_2, // eslint-disable-line camelcase
  createTau,
  createTrue,
  createUppercaseE,
  createUppercasePi,
  createVersion
} from './constants'

export default [
  type, // data types (Matrix, Complex, Unit, ...)

  // constants
  createTrue,
  createFalse,
  createNull,
  createInfinity,
  createNaN,
  createPi,
  createUppercasePi,
  createTau,
  createE,
  createUppercaseE,
  createPhi,
  createLN2,
  createLN10,
  createLOG2E,
  createLOG10E,
  createSQRT1_2, // eslint-disable-line camelcase
  createSQRT2,
  createI,
  createVersion,

  functions, // functions

  // load ./expression *after* ./function since we need to
  // attach transforms to functions that are imported there
  expression, // expression parsing

  json, // serialization utility (math.json.reviver)
  error
]
