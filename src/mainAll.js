export { create } from './core/core'
import { create as _create } from './core/core'

// type
import { createMatrix } from './type/matrix/function/matrix'
import { createMatrixClass } from './type/matrix/Matrix'
import { createDenseMatrixClass } from './type/matrix/DenseMatrix'
import { createSparseMatrixClass } from './type/matrix/SparseMatrix'
import { createAlgorithm01 } from './type/matrix/utils/algorithm01'
import { createAlgorithm02 } from './type/matrix/utils/algorithm02'
import { createAlgorithm03 } from './type/matrix/utils/algorithm03'
import { createAlgorithm04 } from './type/matrix/utils/algorithm04'
import { createAlgorithm05 } from './type/matrix/utils/algorithm05'
import { createAlgorithm06 } from './type/matrix/utils/algorithm06'
import { createAlgorithm07 } from './type/matrix/utils/algorithm07'
import { createAlgorithm08 } from './type/matrix/utils/algorithm08'
import { createAlgorithm09 } from './type/matrix/utils/algorithm09'
import { createAlgorithm10 } from './type/matrix/utils/algorithm10'
import { createAlgorithm11 } from './type/matrix/utils/algorithm11'
import { createAlgorithm12 } from './type/matrix/utils/algorithm12'
import { createAlgorithm13 } from './type/matrix/utils/algorithm13'
import { createAlgorithm14 } from './type/matrix/utils/algorithm14'

// arithmetic
import { createAbs } from './function/arithmetic/abs'
import { createAdd } from './function/arithmetic/add'
import { createAddScalar } from './function/arithmetic/addScalar'
import { createCbrt } from './function/arithmetic/cbrt'
import { createCeil } from './function/arithmetic/ceil'
import { createCube } from './function/arithmetic/cube'
import { createDivide } from './function/arithmetic/divide'
import { createDivideScalar } from './function/arithmetic/divideScalar'
import { createDotDivide } from './function/arithmetic/dotDivide'
import { createDotMultiply } from './function/arithmetic/dotMultiply'
import { createDotPow } from './function/arithmetic/dotPow'
import { createExp } from './function/arithmetic/exp'
import { createExpm1 } from './function/arithmetic/expm1'
import { createFix } from './function/arithmetic/fix'
import { createFloor } from './function/arithmetic/floor'
import { createGcd } from './function/arithmetic/gcd'
import { createHypot } from './function/arithmetic/hypot'
import { createLcm } from './function/arithmetic/lcm'
import { createLog } from './function/arithmetic/log'
import { createLog10 } from './function/arithmetic/log10'
import { createLog1p } from './function/arithmetic/log1p'
import { createLog2 } from './function/arithmetic/log2'
import { createMod } from './function/arithmetic/mod'
import { createMultiply } from './function/arithmetic/multiply'
import { createMultiplyScalar } from './function/arithmetic/multiplyScalar'
import { createNorm } from './function/arithmetic/norm'
import { createNthRoot } from './function/arithmetic/nthRoot'
import { createNthRoots } from './function/arithmetic/nthRoots'
import { createPow } from './function/arithmetic/pow'
import { createRound } from './function/arithmetic/round'
import { createSign } from './function/arithmetic/sign'
import { createSqrt } from './function/arithmetic/sqrt'
import { createSquare } from './function/arithmetic/square'
import { createSubtract } from './function/arithmetic/subtract'
import { createUnaryMinus } from './function/arithmetic/unaryMinus'
import { createUnaryPlus } from './function/arithmetic/unaryPlus'
import { createXgcd } from './function/arithmetic/xgcd'

// relational
import { createEqualScalar } from './function/relational/equalScalar'

// utils
import { createClone } from './function/utils/clone'
import { createTypeOf } from './function/utils/typeOf'

const math = _create()

export const typed = math.typed
export const config = math.config

export const clone = createClone({ typed })
export const typeOf = createTypeOf({ typed })

export const equalScalar = createEqualScalar({ typed, config })

const Matrix = createMatrixClass()
const DenseMatrix = createDenseMatrixClass({ typed, typeOf, type: { Matrix } })
const SparseMatrix = createSparseMatrixClass({ typed, typeOf, equalScalar, type: { Matrix } })

export const type = {
  Matrix,
  DenseMatrix,
  SparseMatrix
}

export const matrix = createMatrix({ typed, type: { Matrix } })

const algorithm01 = createAlgorithm01({ typed, type: { DenseMatrix } })
const algorithm04 = createAlgorithm04({ typed, equalScalar, type: { SparseMatrix } })
const algorithm10 = createAlgorithm10({ typed, type: { DenseMatrix } })
const algorithm11 = createAlgorithm11({ typed, equalScalar, type: { SparseMatrix } })
const algorithm13 = createAlgorithm13({ typed, type: { DenseMatrix } })
const algorithm14 = createAlgorithm14({ typed, clone, type: { DenseMatrix } })

export const abs = createAbs({ typed })
export const addScalar = createAddScalar({ typed })
export const add = createAdd({ typed, matrix, addScalar, utils: { algorithm01, algorithm04, algorithm10, algorithm13, algorithm14 } })
export const multiplyScalar = createMultiplyScalar({ typed })
export const multiply = createMultiply({ typed, matrix, addScalar, multiplyScalar, equalScalar, type: { DenseMatrix, SparseMatrix }, utils: { algorithm11, algorithm14 } })
