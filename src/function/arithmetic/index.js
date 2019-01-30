'use strict'

import { createAbs } from './abs'
import { createAdd } from './add'
import { createAddScalar } from './addScalar'
import { createCbrt } from './cbrt'
import { createCeil } from './ceil'
import { createCube } from './cube'
import { createDivide } from './divide'
import { createDivideScalar } from './divideScalar'
import { createDotDivide } from './dotDivide'
import { createDotMultiply } from './dotMultiply'
import { createDotPow } from './dotPow'
import { createExp } from './exp'
import { createExpm1 } from './expm1'
import { createFix } from './fix'
import { createFloor } from './floor'
import { createGcd } from './gcd'
import { createHypot } from './hypot'
import { createLcm } from './lcm'
import { createLog } from './log'
import { createLog10 } from './log10'
import { createLog1p } from './log1p'
import { createLog2 } from './log2'
import { createMod } from './mod'
import { createMultiply } from './multiply'
import { createMultiplyScalar } from './multiplyScalar'
import { createNorm } from './norm'
import { createNthRoot } from './nthRoot'
import { createNthRoots } from './nthRoots'
import { createPow } from './pow'
import { createRound } from './round'
import { createSign } from './sign'
import { createSqrt } from './sqrt'
import { createSquare } from './square'
import { createSubtract } from './subtract'
import { createUnaryMinus } from './unaryMinus'
import { createUnaryPlus } from './unaryPlus'
import { createXgcd } from './xgcd'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createAbs,
  createAdd,
  createAddScalar,
  createCbrt,
  createCeil,
  createCube,
  createDivide,
  createDivideScalar,
  createDotDivide,
  createDotMultiply,
  createDotPow,
  createExp,
  createExpm1,
  createFix,
  createFloor,
  createGcd,
  createHypot,
  createLcm,
  createLog,
  createLog10,
  createLog1p,
  createLog2,
  createMod,
  createMultiply,
  createMultiplyScalar,
  createNorm,
  createNthRoot,
  createNthRoots,
  createPow,
  createRound,
  createSign,
  createSqrt,
  createSquare,
  createSubtract,
  createUnaryMinus,
  createUnaryPlus,
  createXgcd
]
