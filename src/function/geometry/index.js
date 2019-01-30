'use strict'

import { createIntersect } from './intersect'
import { createDistance } from './distance'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createIntersect,
  createDistance
]
