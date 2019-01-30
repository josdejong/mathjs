'use strict'

import { createClone } from './clone'
import { createIsInteger } from './isInteger'
import { createIsNegative } from './isNegative'
import { createIsNumeric } from './isNumeric'
import { createIsPositive } from './isPositive'
import { createIsPrime } from './isPrime'
import { createIsZero } from './isZero'
import { createIsNaN } from './isNaN'
import { createNumeric } from './numeric'
import { createTypeOf, createDeprecatedTypeof } from './typeOf'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createClone,
  createIsInteger,
  createIsNegative,
  createIsNumeric,
  createIsPositive,
  createIsPrime,
  createIsZero,
  createIsNaN,
  createNumeric,
  createTypeOf,
  createDeprecatedTypeof
]
