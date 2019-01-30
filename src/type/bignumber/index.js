'use strict'

import { createBignumber } from './function/bignumber'
import { createBigNumberClass } from './BigNumber'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  // type
  createBigNumberClass,

  // construction function
  createBignumber
]
