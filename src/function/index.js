'use strict'

import algebra from './algebra'
import arithmetic from './arithmetic'
import combinatorics from './combinatorics'
import complex from './complex'
import geometry from './geometry'
import relational from './relational'
import special from './special'
import string from './string'
import trigonometry from './trigonometry'
import unit from './unit'
import utils from './utils'

export default [
  algebra,
  arithmetic,
  require('./bitwise'),
  combinatorics,
  complex,
  geometry,
  require('./logical'),
  require('./matrix'),
  require('./probability'),
  relational,
  require('./set'),
  special,
  require('./statistics'),
  string,
  trigonometry,
  unit,
  utils
]
