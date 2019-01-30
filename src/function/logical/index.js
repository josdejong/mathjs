'use strict'
import { createAnd } from './and'
import { createNot } from './not'
import { createOr } from './or'
import { createXor } from './xor'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createAnd,
  createNot,
  createOr,
  createXor
]
