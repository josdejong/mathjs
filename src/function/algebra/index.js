'use strict'

import { createDerivative } from './derivative'
import { createSimplify } from './simplify'
import { createResolve } from './simplify/resolve'
import { createRationalize } from './rationalize'
import { createSimplifyConstant } from './simplify/simplifyConstant'
import { createSimplifyCore } from './simplify/simplifyCore'

import { createLup } from './decomposition/lup'
import { createQr } from './decomposition/qr'
import { createSlu } from './decomposition/slu'
import { createLsolve } from './solver/lsolve'
import { createUsolve } from './solver/usolve'
import { createLusolve } from './solver/lusolve'

export default [
  createDerivative,

  // simplify
  createSimplify,
  createResolve,
  createSimplifyConstant,
  createSimplifyCore,

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
