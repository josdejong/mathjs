import { createBitAnd } from '../../function/bitwise/bitAnd.js'
import { factory } from '../../utils/factory.js'
import { isBigNumber, isBoolean, isComplex, isNumber, isUnit } from '../../utils/is.js'

const name = 'bitAnd'
const dependencies = ['typed', 'matrix', 'zeros', 'add', 'equalScalar', 'not', 'concat']

export const createBitAndTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, not, concat }) => {
  const and = createBitAnd({ typed, matrix, equalScalar, zeros, not, concat })

  function bitAndTransform (args, math, scope) {
    const condition1 = args[0].compile().evaluate(scope)
    if (isNumber(condition1) || isBoolean(condition1) || isBigNumber(condition1) || isComplex(condition1) || isUnit(condition1)) {
      if (isNaN(condition1)) {
        return NaN
      }
      if (condition1 === 0 || condition1 === false) {
        return 0
      }
    }
    const condition2 = args[1].compile().evaluate(scope)
    return and(condition1, condition2)
  }

  bitAndTransform.rawArgs = true

  return bitAndTransform
}, { isTransformFunction: true })
