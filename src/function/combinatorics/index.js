'use strict'

import { createBellNumbers } from './bellNumbers'
import { createComposition } from './composition'
import { createStirlingS2 } from './stirlingS2'
import { createCatalan } from './catalan'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createBellNumbers,
  createComposition,
  createStirlingS2,
  createCatalan
]
