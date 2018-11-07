'use strict'

import bignumber from './bignumber'
import complex from './complex'
import fraction from './fraction'
import { createNumber } from './number'

export default [
  bignumber,
  require('./boolean'),
  require('./chain'),
  complex,
  fraction,
  require('./matrix'),
  createNumber,
  require('./resultset'),
  require('./string'),
  require('./unit')
]
