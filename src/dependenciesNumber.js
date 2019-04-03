import {
  createAdd,
  createAddScalar,
  createEqualScalar, createMultiply, createMultiplyScalar,
  createSubtract,
  createTyped,
  createUnaryMinus,
  createNumber,
  createNumeric, createAbs, createDivideScalar,
  createSmaller, createLarger,
  createDivide, createPi, createSin
} from './factoriesNumber'

export { allDependencies } from './allNumber'

// FIXME: work out all dependency collections

export const typedDependencies = {
  createTyped
}

export const equalScalarDependencies = {
  typedDependencies,
  createEqualScalar
}

export const addScalarDependencies = {
  typedDependencies,
  createAddScalar
}

export const addDependencies = {
  typedDependencies,
  createAdd
}

export const unaryMinusDependencies = {
  typedDependencies,
  createUnaryMinus
}

export const subtractDependencies = {
  typedDependencies,
  createSubtract
}

export const multiplyScalarDependencies = {
  typedDependencies,
  createMultiplyScalar
}

export const multiplyDependencies = {
  typedDependencies,
  createMultiply
}

export const numberDependencies = {
  typedDependencies,
  createNumber
}

export const numericDependencies = {
  typedDependencies,
  numberDependencies,
  createNumeric
}

export const divideScalarDependencies = {
  typedDependencies,
  createDivideScalar
}

export const absDependencies = {
  typedDependencies,
  createAbs
}

export const smallerDependencies = {
  typedDependencies,
  createSmaller
}

export const largerDependencies = {
  typedDependencies,
  createLarger
}

export const divideDependencies = {
  typedDependencies,
  createDivide
}

export const piDependencies = {
  createPi
}

export const sinDependencies = {
  typedDependencies,
  createSin
}
