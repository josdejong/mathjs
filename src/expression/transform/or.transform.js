import { createOr } from '../../function/logical/or.js'
import { factory } from '../../utils/factory.js'
import { testCondition } from './utils/testCondition.js'
import { isBigNumber, isBoolean, isComplex, isNumber, isUnit } from '../../utils/is.js'

const name = 'or'
const dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'concat']

export const createOrTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix, concat }) => {
  const or = createOr({ typed, matrix, equalScalar, DenseMatrix, concat })

  function orTransform (args, math, scope) {
    const condition1 = args[0].compile().evaluate(scope)
    if (isNumber(condition1) || isBoolean(condition1) || isBigNumber(condition1) || isComplex(condition1) || isUnit(condition1)) {
      if (testCondition(condition1)) {
        return true
      }
    }
    const condition2 = args[1].compile().evaluate(scope)
    return or(condition1, condition2)
  }

  orTransform.rawArgs = true

  return orTransform
}, { isTransformFunction: true })
