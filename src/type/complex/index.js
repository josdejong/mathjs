'use strict'

import { createComplexClass } from './Complex'
import { createComplex } from './function/complex'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  // type
  createComplexClass,

  // construction function
  createComplex
]
