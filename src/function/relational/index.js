'use strict'

import { createEqual } from './equal'
import { createEqualScalar } from './equalScalar'
import { createLarger } from './larger'
import { createSmaller } from './smaller'

export default [
  require('./compare'),
  require('./compareNatural'),
  require('./compareText'),
  require('./deepEqual'),
  createEqual,
  require('./equalText'),
  createEqualScalar,
  createLarger,
  require('./largerEq'),
  createSmaller,
  require('./smallerEq'),
  require('./unequal')
]
