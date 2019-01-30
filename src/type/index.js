'use strict'

import bignumber from './bignumber'
import { createBoolean } from './boolean'
import chain from './chain'
import complex from './complex'
import fraction from './fraction'
import matrix from './matrix'
import { createNumber } from './number'
import resultset from './resultset'
import { createString } from './string'
import unit from './unit'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  bignumber,
  createBoolean,
  chain,
  complex,
  fraction,
  matrix,
  createNumber,
  resultset,
  createString,
  unit
]
