'use strict'

import { createFractionClass } from './Fraction'
import { createFraction } from './function/fraction'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  // type
  createFractionClass,

  // construction function
  createFraction
]
