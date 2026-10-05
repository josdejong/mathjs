import { createOr } from '../../function/logical/or.js'
import { factory } from '../../utils/factory.js'
import { isCollection } from '../../utils/is.js'

const name = 'or'
const dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'not', 'concat']

export const createOrTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix, not, concat }) => {
  const or = createOr({ typed, matrix, equalScalar, DenseMatrix, not, concat })

  function orTransform (args, math, scope) {
    const condition1 = args[0].compile().evaluate(scope)
    // Check truth without mixing the operand's type with a boolean.
    if (!isCollection(condition1) && or(condition1, condition1)) {
      return true
    }
    const condition2 = args[1].compile().evaluate(scope)
    return or(condition1, condition2)
  }

  orTransform.rawArgs = true

  return orTransform
}, { isTransformFunction: true })
