import { createAnd } from '../../function/logical/and.js'
import { factory } from '../../utils/factory.js'
import { isCollection } from '../../utils/is.js'

const name = 'and'
const dependencies = ['typed', 'matrix', 'zeros', 'add', 'equalScalar', 'not', 'concat']

export const createAndTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, not, concat }) => {
  const and = createAnd({ typed, matrix, equalScalar, zeros, not, concat })

  function andTransform (args, math, scope) {
    if (args.length !== 2) {
      // Short-circuiting needs exactly two operands; let the function itself
      // report the wrong number of arguments.
      return and(...args.map(arg => arg.compile().evaluate(scope)))
    }
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
