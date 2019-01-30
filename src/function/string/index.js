'use strict'

import { createFormat } from './format'
import { createPrint } from './print'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createFormat,
  createPrint
]
