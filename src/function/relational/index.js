'use strict'

import { createEqualScalar } from './equalScalar'
import { createSmaller } from './smaller'

module.exports = [
  require('./compare'),
  require('./compareNatural'),
  require('./compareText'),
  require('./deepEqual'),
  require('./equal'),
  require('./equalText'),
  createEqualScalar,
  require('./larger'),
  require('./largerEq'),
  createSmaller,
  require('./smallerEq'),
  require('./unequal')
]
