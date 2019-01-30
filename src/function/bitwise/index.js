'use strict'

import { createBitAnd } from './bitAnd'
import { createBitNot } from './bitNot'
import { createBitOr } from './bitOr'
import { createBitXor } from './bitXor'
import { createLeftShift } from './leftShift'
import { createRightArithShift } from './rightArithShift'
import { createRightLogShift } from './rightLogShift'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createBitAnd,
  createBitNot,
  createBitOr,
  createBitXor,
  createLeftShift,
  createRightArithShift,
  createRightLogShift
]
