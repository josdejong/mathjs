import { createBitOr } from '../../function/bitwise/bitOr.js'
import { factory } from '../../utils/factory.js'
import { isBigNumber, isBoolean, isComplex, isNumber, isUnit } from '../../utils/is.js'

const name = 'bitOr'
const dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'concat']

export const createBitOrTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix, concat }) => {
  const or = createBitOr({ typed, matrix, equalScalar, DenseMatrix, concat })

  function bitOrTransform (args, math, scope) {
    const condition1 = args[0].compile().evaluate(scope)
    if (isNumber(condition1) || isBoolean(condition1) || isBigNumber(condition1) || isComplex(condition1) || isUnit(condition1)) {
      if (isNaN(condition1)) {
        return NaN
      }
      if (condition1 === (-1)) {
        return -1
      }
      if (condition1 === true) {
        return 1
      }
    }
    const condition2 = args[1].compile().evaluate(scope)
    return or(condition1, condition2)
  }

  bitOrTransform.rawArgs = true

  return bitOrTransform
}, { isTransformFunction: true })
