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
