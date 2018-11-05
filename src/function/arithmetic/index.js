'use strict'

import { createAbs } from './abs'
import { createAddScalar } from './addScalar'
import { createCbrt } from './cbrt'
import { createDivideScalar } from './divideScalar'
import { createExp } from './exp'
import { createHypot } from './hypot'
import { createLog } from './log'
import { createMultiplyScalar } from './multiplyScalar'
import { createNorm } from './norm'
import { createPow } from './pow'
import { createSqrt } from './sqrt'

module.exports = [
  createAbs,
  require('./add'),
  createAddScalar,
  createCbrt,
  require('./ceil'),
  require('./cube'),
  require('./divide'),
  createDivideScalar,
  require('./dotDivide'),
  require('./dotMultiply'),
  require('./dotPow'),
  createExp,
  require('./expm1'),
  require('./fix'),
  require('./floor'),
  require('./gcd'),
  createHypot,
  require('./lcm'),
  createLog,
  require('./log10'),
  require('./log1p'),
  require('./log2'),
  require('./mod'),
  require('./multiply'),
  createMultiplyScalar,
  createNorm,
  require('./nthRoot'),
  require('./nthRoots'),
  createPow,
  require('./round'),
  require('./sign'),
  createSqrt,
  require('./square'),
  require('./subtract'),
  require('./unaryMinus'),
  require('./unaryPlus'),
  require('./xgcd')
]
