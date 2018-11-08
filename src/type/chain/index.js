'use strict'

import { createChainClass } from './Chain'
import { createChain } from './function/chain'

export default [
  // type
  createChainClass,

  // construction function
  createChain
]
