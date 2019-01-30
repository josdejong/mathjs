'use strict'

import { createDerivative } from './derivative'
import { createSimplify } from './simplify'
import { createRationalize } from './rationalize'

import { createLup } from './decomposition/lup'
import { createQr } from './decomposition/qr'
import { createSlu } from './decomposition/slu'
import { createLsolve } from './solver/lsolve'
import { createUsolve } from './solver/usolve'
import { createLusolve } from './solver/lusolve'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createDerivative,

  // simplify
  createSimplify,

  // polynomial
  createRationalize,

  // decomposition
  createQr,
  createLup,
  createSlu,

  // solver
  createLsolve,
  createLusolve,
  createUsolve
]
