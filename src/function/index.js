'use strict'

import algebra from './algebra'
import arithmetic from './arithmetic'
import bitwise from './bitwise'
import combinatorics from './combinatorics'
import complex from './complex'
import geometry from './geometry'
import logical from './logical'
import matrix from './matrix'
import relational from './relational'
import set from './set'
import special from './special'
import statistics from './statistics'
import string from './string'
import trigonometry from './trigonometry'
import unit from './unit'
import utils from './utils'

export default [
  algebra,
  arithmetic,
  bitwise,
  combinatorics,
  complex,
  geometry,
  logical,
  matrix,
  require('./probability'),
  relational,
  set,
  special,
  statistics,
  string,
  trigonometry,
  unit,
  utils
]
