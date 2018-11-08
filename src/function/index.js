'use strict'

import algebra from './algebra'
import arithmetic from './arithmetic'
import complex from './complex'
import relational from './relational'
import trigonometry from './trigonometry'
import utils from './utils'

export default [
  algebra,
  arithmetic,
  // Object.keys(arithmetic).map(key => arithmetic[key]), // TODO: make this mapping redundant
  require('./bitwise'),
  require('./combinatorics'),
  complex,
  require('./geometry'),
  require('./logical'),
  require('./matrix'),
  require('./probability'),
  relational,
  require('./set'),
  require('./special'),
  require('./statistics'),
  require('./string'),
  trigonometry,
  require('./unit'),
  utils
]
