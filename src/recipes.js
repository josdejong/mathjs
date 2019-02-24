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

export { allRecipe } from './all'

// FIXME: work out all recipes

export const typedRecipe = {
  createTyped
}

export const MatrixRecipe = {
  createMatrixClass
}

export const DenseMatrixRecipe = {
  MatrixRecipe,
  createDenseMatrixClass
}

export const equalScalarRecipe = {
  typedRecipe,
  createEqualScalar
}

export const SparseMatrixRecipe = {
  typedRecipe,
  MatrixRecipe,
  equalScalarRecipe,
  createSparseMatrixClass
}

export const BigNumberRecipe = {
  createBigNumberClass
}

export const FractionRecipe = {
  createFractionClass
}

export const matrixRecipe = {
  typedRecipe,
  MatrixRecipe,
  DenseMatrixRecipe,
  SparseMatrixRecipe,
  createMatrix
}

export const addScalarRecipe = {
  typedRecipe,
  createAddScalar
}

export const addRecipe = {
  typedRecipe,
  matrixRecipe,
  addScalarRecipe,
  equalScalarRecipe,
  DenseMatrixRecipe,
  SparseMatrixRecipe,
  createAdd
}

export const unaryMinusRecipe = {
  typedRecipe,
  createUnaryMinus
}

export const subtractRecipe = {
  typedRecipe,
  matrixRecipe,
  equalScalarRecipe,
  addScalarRecipe,
  unaryMinusRecipe,
  DenseMatrixRecipe,
  createSubtract
}

export const multiplyScalarRecipe = {
  typedRecipe,
  createMultiplyScalar
}

export const multiplyRecipe = {
  typedRecipe,
  matrixRecipe,
  addScalarRecipe,
  multiplyScalarRecipe,
  equalScalarRecipe,
  createMultiply
}

export const numberRecipe = {
  typedRecipe,
  createNumber
}

export const bignumberRecipe = {
  typedRecipe,
  BigNumberRecipe,
  createBignumber
}

export const fractionRecipe = {
  typedRecipe,
  FractionRecipe,
  createFraction
}

export const numericRecipe = {
  typedRecipe,
  numberRecipe,
  bignumberRecipe,
  fractionRecipe,
  createNumeric
}

export const divideScalarRecipe = {
  typedRecipe,
  numericRecipe,
  createDivideScalar
}

export const absRecipe = {
  typedRecipe,
  createAbs
}

export const smallerRecipe = {
  typedRecipe,
  matrixRecipe,
  equalScalarRecipe,
  divideScalarRecipe,
  DenseMatrixRecipe,
  createSmaller
}

export const largerRecipe = {
  typedRecipe,
  matrixRecipe,
  DenseMatrixRecipe,
  createLarger
}

export const FibonacciHeapRecipe = {
  smallerRecipe,
  largerRecipe,
  createFibonacciHeapClass
}

export const SpaRecipe = {
  addScalarRecipe,
  equalScalarRecipe,
  FibonacciHeapRecipe,
  createSpaClass
}

export const lupRecipe = {
  typedRecipe,
  matrixRecipe,
  absRecipe,
  addScalarRecipe,
  divideScalarRecipe,
  multiplyScalarRecipe,
  subtractRecipe,
  largerRecipe,
  equalScalarRecipe,
  unaryMinusRecipe,
  DenseMatrixRecipe,
  SparseMatrixRecipe,
  SpaRecipe,
  createLup
}

export const detRecipe = {
  typedRecipe,
  matrixRecipe,
  subtractRecipe,
  multiplyRecipe,
  unaryMinusRecipe,
  lupRecipe,
  createDet
}

export const identityRecipe = {
  typedRecipe,
  matrixRecipe,
  BigNumberRecipe,
  DenseMatrixRecipe,
  SparseMatrixRecipe,
  createIdentity
}

export const invRecipe = {
  typedRecipe,
  matrixRecipe,
  divideScalarRecipe,
  addScalarRecipe,
  multiplyRecipe,
  unaryMinusRecipe,
  detRecipe,
  identityRecipe,
  absRecipe,
  createInv
}

export const divideRecipe = {
  typedRecipe,
  MatrixRecipe,
  multiplyRecipe,
  equalScalarRecipe,
  divideScalarRecipe,
  invRecipe,
  createDivide
}

export const piRecipe = {
  BigNumberRecipe,
  createPi
}

export const sinRecipe = {
  typedRecipe,
  createSin
}
