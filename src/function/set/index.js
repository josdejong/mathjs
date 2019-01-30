'use strict'

import { createSetCartesian } from './setCartesian'
import { createSetDifference } from './setDifference'
import { createSetDistinct } from './setDistinct'
import { createSetIntersect } from './setIntersect'
import { createSetIsSubset } from './setIsSubset'
import { createSetMultiplicity } from './setMultiplicity'
import { createSetPowerset } from './setPowerset'
import { createSetSize } from './setSize'
import { createSetSymDifference } from './setSymDifference'
import { createSetUnion } from './setUnion'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createSetCartesian,
  createSetDifference,
  createSetDistinct,
  createSetIntersect,
  createSetIsSubset,
  createSetMultiplicity,
  createSetPowerset,
  createSetSize,
  createSetSymDifference,
  createSetUnion
]
