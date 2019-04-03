import { createInv } from './function/matrix/inv'
import { createDivideScalar } from './function/arithmetic/divideScalar'
import { createEqualScalar } from './function/relational/equalScalar'
import { createMultiply } from './function/arithmetic/multiply'
import { createMatrix } from './type/matrix/function/matrix'
import { createSparseMatrixClass } from './type/matrix/SparseMatrix'
import { createDenseMatrixClass } from './type/matrix/DenseMatrix'
import { createAddScalar } from './function/arithmetic/addScalar'
import { createMatrixClass } from './type/matrix/Matrix'
import { createMultiplyScalar } from './function/arithmetic/multiplyScalar'
import { createAdd } from './function/arithmetic/add'
import { createNumeric } from './function/utils/numeric'
import { createNumber } from './type/number'
import { createBignumber } from './type/bignumber/function/bignumber'
import { createFraction } from './type/fraction/function/fraction'
import { createBigNumberClass } from './type/bignumber/BigNumber'
import { createFractionClass } from './type/fraction/Fraction'
import { createUnaryMinus } from './function/arithmetic/unaryMinus'
import { createAbs } from './function/arithmetic/abs'
import { createDet } from './function/matrix/det'
import { createSubtract } from './function/arithmetic/subtract'
import { createIdentity } from './function/matrix/identity'
import { createLup } from './function/algebra/decomposition/lup'
import { createLarger } from './function/relational/larger'
import { createSpaClass } from './type/matrix/Spa'
import { createFibonacciHeapClass } from './type/matrix/FibonacciHeap'
import { createSmaller } from './function/relational/smaller'
import { createDivide } from './function/arithmetic/divide'
import { createTyped } from './core/function/typed'
import { createPi } from './constants'
import { createSin } from './function/trigonometry/sin'

export { allDependencies } from './allFull'

// FIXME: work out all dependency collections

export const typedDependencies = {
  createTyped
}

export const MatrixDependencies = {
  createMatrixClass
}

export const DenseMatrixDependencies = {
  MatrixDependencies,
  createDenseMatrixClass
}

export const equalScalarDependencies = {
  typedDependencies,
  createEqualScalar
}

export const SparseMatrixDependencies = {
  typedDependencies,
  MatrixDependencies,
  equalScalarDependencies,
  createSparseMatrixClass
}

export const BigNumberDependencies = {
  createBigNumberClass
}

export const FractionDependencies = {
  createFractionClass
}

export const matrixDependencies = {
  typedDependencies,
  MatrixDependencies,
  DenseMatrixDependencies,
  SparseMatrixDependencies,
  createMatrix
}

export const addScalarDependencies = {
  typedDependencies,
  createAddScalar
}

export const addDependencies = {
  typedDependencies,
  matrixDependencies,
  addScalarDependencies,
  equalScalarDependencies,
  DenseMatrixDependencies,
  SparseMatrixDependencies,
  createAdd
}

export const unaryMinusDependencies = {
  typedDependencies,
  createUnaryMinus
}

export const subtractDependencies = {
  typedDependencies,
  matrixDependencies,
  equalScalarDependencies,
  addScalarDependencies,
  unaryMinusDependencies,
  DenseMatrixDependencies,
  createSubtract
}

export const multiplyScalarDependencies = {
  typedDependencies,
  createMultiplyScalar
}

export const multiplyDependencies = {
  typedDependencies,
  matrixDependencies,
  addScalarDependencies,
  multiplyScalarDependencies,
  equalScalarDependencies,
  createMultiply
}

export const numberDependencies = {
  typedDependencies,
  createNumber
}

export const bignumberDependencies = {
  typedDependencies,
  BigNumberDependencies,
  createBignumber
}

export const fractionDependencies = {
  typedDependencies,
  FractionDependencies,
  createFraction
}

export const numericDependencies = {
  typedDependencies,
  numberDependencies,
  bignumberDependencies,
  fractionDependencies,
  createNumeric
}

export const divideScalarDependencies = {
  typedDependencies,
  numericDependencies,
  createDivideScalar
}

export const absDependencies = {
  typedDependencies,
  createAbs
}

export const smallerDependencies = {
  typedDependencies,
  matrixDependencies,
  equalScalarDependencies,
  divideScalarDependencies,
  DenseMatrixDependencies,
  createSmaller
}

export const largerDependencies = {
  typedDependencies,
  matrixDependencies,
  DenseMatrixDependencies,
  createLarger
}

export const FibonacciHeapDependencies = {
  smallerDependencies,
  largerDependencies,
  createFibonacciHeapClass
}

export const SpaDependencies = {
  addScalarDependencies,
  equalScalarDependencies,
  FibonacciHeapDependencies,
  createSpaClass
}

export const lupDependencies = {
  typedDependencies,
  matrixDependencies,
  absDependencies,
  addScalarDependencies,
  divideScalarDependencies,
  multiplyScalarDependencies,
  subtractDependencies,
  largerDependencies,
  equalScalarDependencies,
  unaryMinusDependencies,
  DenseMatrixDependencies,
  SparseMatrixDependencies,
  SpaDependencies,
  createLup
}

export const detDependencies = {
  typedDependencies,
  matrixDependencies,
  subtractDependencies,
  multiplyDependencies,
  unaryMinusDependencies,
  lupDependencies,
  createDet
}

export const identityDependencies = {
  typedDependencies,
  matrixDependencies,
  BigNumberDependencies,
  DenseMatrixDependencies,
  SparseMatrixDependencies,
  createIdentity
}

export const invDependencies = {
  typedDependencies,
  matrixDependencies,
  divideScalarDependencies,
  addScalarDependencies,
  multiplyDependencies,
  unaryMinusDependencies,
  detDependencies,
  identityDependencies,
  absDependencies,
  createInv
}

export const divideDependencies = {
  typedDependencies,
  MatrixDependencies,
  multiplyDependencies,
  equalScalarDependencies,
  divideScalarDependencies,
  invDependencies,
  createDivide
}

export const piDependencies = {
  BigNumberDependencies,
  createPi
}

export const sinDependencies = {
  typedDependencies,
  createSin
}
