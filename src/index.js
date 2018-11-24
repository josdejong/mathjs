// This file contains all factory functions of math.js

import expression from './expression'
import type from './type'
import functions from './function'
import json from './json'
import error from './error'
import {
  createInfinity,
  createNull,
  createFalse,
  createTrue,
  createNaN,
  createPi,
  createTau,
  createPhi,
  createE,
  createLN2,
  createLN10,
  createLOG2E,
  createLOG10E,
  createSQRTHalf,
  createSQRT2,
  createI,
  createVersion
} from './constants'
import { factory } from './utils/factory'

// for backward compatibility with v5
const createUppercasePi = factory('PI', ['pi'], ({ pi }) => pi)
const createUppercaseE = factory('E', ['e'], ({ e }) => e)

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
  createSQRTHalf,
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
