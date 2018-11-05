'use strict'

import { createTypeof } from './typeof'
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
  createTypeof
]
