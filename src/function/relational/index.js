'use strict'

import { createEqual } from './equal'
import { createEqualScalar } from './equalScalar'
import { createLarger } from './larger'
import { createSmaller } from './smaller'
import { createCompare } from './compare'
import { createCompareNatural } from './compareNatural'
import { createCompareText } from './compareText'
import { createDeepEqual } from './deepEqual'
import { createEqualText } from './equalText'
import { createLargerEq } from './largerEq'
import { createSmallerEq } from './smallerEq'
import { createUnequal } from './unequal'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createCompare,
  createCompareNatural,
  createCompareText,
  createDeepEqual,
  createEqual,
  createEqualText,
  createEqualScalar,
  createLarger,
  createLargerEq,
  createSmaller,
  createSmallerEq,
  createUnequal
]
