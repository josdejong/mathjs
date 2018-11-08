import { create as _create } from './core/core'

// type
import { createNumber } from './type/number'
import { createBigNumberClass } from './type/bignumber/BigNumber'
import { createBignumber } from './type/bignumber/function/bignumber'
import { createComplexClass } from './type/complex/Complex'
import { createComplex } from './type/complex/function/complex'
import { createFractionClass } from './type/fraction/Fraction'
import { createFraction } from './type/fraction/function/fraction'
import { createMatrix } from './type/matrix/function/matrix'
import { createMatrixClass } from './type/matrix/Matrix'
import { createDenseMatrixClass } from './type/matrix/DenseMatrix'
import { createSparseMatrixClass } from './type/matrix/SparseMatrix'

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
import { createSmaller } from './function/relational/smaller'
import { createLarger } from './function/relational/larger'

// utils
import { createClone } from './function/utils/clone'
import { createIsInteger } from './function/utils/isInteger'
import { createIsNegative } from './function/utils/isNegative'
import { createIsNumeric } from './function/utils/isNumeric'
import { createIsPositive } from './function/utils/isPositive'
import { createIsPrime } from './function/utils/isPrime'
import { createIsZero } from './function/utils/isZero'
import { createIsNaN } from './function/utils/isNaN'
import { createNumeric } from './function/utils/numeric'
import { createTypeOf } from './function/utils/typeOf'
import { createEmbeddedDocs } from './expression/embeddedDocs'

const math = _create()

export { create } from './core/core'

export const typed = math.typed
export const config = math.config
export const on = math.on

// utils (1)
export const clone = createClone({ typed })
export const isInteger = createIsInteger({ typed })
export const isNegative = createIsNegative({ typed })
export const isNumeric = createIsNumeric({ typed })
export const isPositive = createIsPositive({ typed })
export const isZero = createIsZero({ typed })
export const isNaN = createIsNaN({ typed })
export const typeOf = createTypeOf({ typed })

// relational (1)
export const equalScalar = createEqualScalar({ typed, config })

export const Matrix = createMatrixClass()
export const BigNumber = createBigNumberClass({ config, on })
export const Complex = createComplexClass({ config, on })
export const Fraction = createFractionClass()
export const DenseMatrix = createDenseMatrixClass({ typed, typeOf, type: { Matrix } })
export const SparseMatrix = createSparseMatrixClass({ typed, typeOf, equalScalar, type: { Matrix } })

// for backward compatibility
export const type = {
  BigNumber,
  Complex,
  Matrix,
  DenseMatrix,
  SparseMatrix
}

// type
export const number = createNumber({ typed })
export const bignumber = createBignumber({ typed, type: { BigNumber } })
export const complex = createComplex({ typed, type: { Complex } })
export const fraction = createFraction({ typed, type: { Fraction } })
export const matrix = createMatrix({ typed, type: { Matrix } })

// utils (2)
export const isPrime = createIsPrime({ typed, type: { BigNumber } })
export const numeric = createNumeric({ typed, typeOf, number, bignumber, fraction })

// arithmetic (1)
export const divideScalar = createDivideScalar({ typed, typeOf, numeric })

// complex (1)
export const conj = () => { throw new Error('Sorry conj is not yet implemented') } // FIXME: load conj

// matrix (1)
export const identity = () => { throw new Error('Sorry identity is not yet implemented') } // FIXME: load identity
export const inv = () => { throw new Error('Sorry inv is not yet implemented') } // FIXME: load inv
export const zeros = () => { throw new Error('Sorry zeros is not yet implemented') } // FIXME: load zeros

// relational (2)
export const smaller = createSmaller({ typed, config, matrix, equalScalar, divideScalar, type: { DenseMatrix } })
export const larger = createLarger({ typed, config, matrix, type: { DenseMatrix } })

// arithmetic (2)
export const unaryMinus = createUnaryMinus({ typed })
export const unaryPlus = createUnaryPlus({ typed, config, type: { BigNumber } })
export const abs = createAbs({ typed })
export const addScalar = createAddScalar({ typed })
export const add = createAdd({ typed, matrix, addScalar, equalScalar, type: { DenseMatrix, SparseMatrix } })
export const cbrt = createCbrt({ config, typed, isNegative, unaryMinus, matrix, type: { Complex, BigNumber, Fraction } })
export const ceil = createCeil({ typed })
export const cube = createCube({ typed })
export const exp = createExp({ typed })
export const expm1 = createExpm1({ typed, type: { Complex } })
export const fix = createFix({ typed, type: { Complex } })
export const floor = createFloor({ typed })
export const gcd = createGcd({ typed, matrix, equalScalar, type: { BigNumber, DenseMatrix } })
export const lcm = createLcm({ typed, matrix, equalScalar })
export const log = createLog({ typed, config, divideScalar, type: { Complex } })
export const log10 = createLog10({ typed, config, type: { Complex } })
export const log1p = createLog1p({ typed, config, divideScalar, log, type: { Complex } })
export const log2 = createLog2({ typed, config, type: { Complex } })
export const mod = createMod({ typed, matrix, equalScalar, type: { DenseMatrix } })
export const multiplyScalar = createMultiplyScalar({ typed })
export const multiply = createMultiply({ typed, matrix, addScalar, multiplyScalar, equalScalar })
export const nthRoot = createNthRoot({ typed, matrix, equalScalar, type: { BigNumber } })
export const nthRoots = createNthRoots({ typed, config, divideScalar, type: { Complex } })
export const pow = createPow({ typed, config, identity, multiply, matrix, number, fraction, type: { Complex } })
export const round = createRound({ typed, matrix, equalScalar, zeros, type: { BigNumber, DenseMatrix } })
export const sign = createSign({ typed, type: { BigNumber, Fraction } })
export const sqrt = createSqrt({ config, typed, type: { Complex } })
export const square = createSquare({ typed })
export const subtract = createSubtract({ typed, matrix, equalScalar, addScalar, unaryMinus, type: { DenseMatrix } })
export const xgcd = createXgcd({ typed, config, matrix, type: { BigNumber } })
export const divide = createDivide({ typed, matrix, multiply, equalScalar, divideScalar, inv })
export const hypot = createHypot({ typed, abs, addScalar, divideScalar, multiplyScalar, sqrt, smaller, isPositive })
export const norm = createNorm({ typed, abs, add, pow, conj, sqrt, multiply, equalScalar, larger, smaller, matrix })
export const dotMultiply = createDotMultiply({ typed, matrix, equalScalar, multiplyScalar })
export const dotPow = createDotPow({ typed, equalScalar, matrix, pow, type: { DenseMatrix } })
export const dotDivide = createDotDivide({ typed, matrix, equalScalar, divideScalar, type: { DenseMatrix } })

// TODO: export constants
// TODO: export physical constants

export const expression = {
  docs: createEmbeddedDocs()
}
