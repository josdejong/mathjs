'use strict'

import { createTypeOf, createDeprecatedTypeof } from './typeOf'
import { createNumeric } from './numeric'

module.exports = [
  require('./clone'),
  createNumeric,
  require('./isInteger'),
  require('./isNegative'),
  require('./isNumeric'),
  require('./isPositive'),
  require('./isPrime'),
  require('./isZero'),
  require('./isNaN'),
  createTypeOf,
  createDeprecatedTypeof
]
