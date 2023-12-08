import { createAnd } from '../../function/logical/and.js'
import { factory } from '../../utils/factory.js'
import { isCollection } from '../../utils/is.js'

const name = 'and'
const dependencies = ['typed', 'matrix', 'zeros', 'add', 'equalScalar', 'not', 'concat']

export const createAndTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, not, concat }) => {
  const and = createAnd({ typed, matrix, equalScalar, zeros, not, concat })

  function andTransform (args, math, scope) {
    const condition1 = args[0].compile().evaluate(scope)
    if (!isCollection(condition1) && !and(condition1, true)) {
      return false
    }
    const condition2 = args[1].compile().evaluate(scope)
    return and(condition1, condition2)
  }

  andTransform.rawArgs = true

  return andTransform
}, { isTransformFunction: true })
