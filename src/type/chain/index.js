'use strict'

import { createChainClass } from './Chain'
import { createChain } from './function/chain'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  // type
  createChainClass,

  // construction function
  createChain
]
