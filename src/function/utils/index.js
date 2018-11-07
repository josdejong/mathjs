'use strict'

import { createClone } from './clone'
import { createTypeOf, createDeprecatedTypeof } from './typeOf'
import { createNumeric } from './numeric'

module.exports = [
  createClone,
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
