'use strict'

import arithmetic from './arithmetic'

export default [
  require('./algebra'),
  arithmetic,
  // Object.keys(arithmetic).map(key => arithmetic[key]), // TODO: make this mapping redundant
  require('./bitwise'),
  require('./combinatorics'),
  require('./complex'),
  require('./geometry'),
  require('./logical'),
  require('./matrix'),
  require('./probability'),
  require('./relational'),
  require('./set'),
  require('./special'),
  require('./statistics'),
  require('./string'),
  require('./trigonometry'),
  require('./unit'),
  require('./utils')
]
