'use strict'

import { createBitAnd } from './bitAnd'
import { createBitNot } from './bitNot'
import { createBitOr } from './bitOr'
import { createBitXor } from './bitXor'
import { createLeftShift } from './leftShift'
import { createRightArithShift } from './rightArithShift'
import { createRightLogShift } from './rightLogShift'

export default [
  createBitAnd,
  createBitNot,
  createBitOr,
  createBitXor,
  createLeftShift,
  createRightArithShift,
  createRightLogShift
]
