import { createBitOr } from '../../function/bitwise/bitOr.js'
import { factory } from '../../utils/factory.js'
import { isCollection } from '../../utils/is.js'

const name = 'bitOr'
const dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'concat']

export const createBitOrTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix, concat }) => {
  const bitOr = createBitOr({ typed, matrix, equalScalar, DenseMatrix, concat })

  function bitOrTransform (args, math, scope) {
    const condition1 = args[0].compile().evaluate(scope)
    if (!isCollection(condition1)) {
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
    return bitOr(condition1, condition2)
  }

  bitOrTransform.rawArgs = true

  return bitOrTransform
}, { isTransformFunction: true })
