'use strict'

import { createAbs } from './abs'
import { createAdd } from './add'
import { createAddScalar } from './addScalar'
import { createCbrt } from './cbrt'
import { createCeil } from './ceil'
import { createCube } from './cube'
import { createDivide } from './divide'
import { createDivideScalar } from './divideScalar'
import { createExp } from './exp'
import { createFix } from './fix'
import { createFloor } from './floor'
import { createHypot } from './hypot'
import { createLog } from './log'
import { createMultiplyScalar } from './multiplyScalar'
import { createNorm } from './norm'
import { createPow } from './pow'
import { createSqrt } from './sqrt'

module.exports = [
  createAbs,
  createAdd,
  createAddScalar,
  createCbrt,
  createCeil,
  createCube,
  createDivide,
  createDivideScalar,
  require('./dotDivide'),
  require('./dotMultiply'),
  require('./dotPow'),
  createExp,
  require('./expm1'),
  createFix,
  createFloor,
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
