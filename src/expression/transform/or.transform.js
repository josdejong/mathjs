import { createOr } from '../../function/logical/or.js'
import { factory } from '../../utils/factory.js'
import { isCollection } from '../../utils/is.js'

const name = 'or'
const dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'concat']

export const createOrTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix, concat }) => {
  const or = createOr({ typed, matrix, equalScalar, DenseMatrix, concat })

  function orTransform (args, math, scope) {
    const condition1 = args[0].compile().evaluate(scope)
    if (!isCollection(condition1) && or(condition1, false)) {
      return true
    }
    const condition2 = args[1].compile().evaluate(scope)
    return or(condition1, condition2)
  }

  orTransform.rawArgs = true

  return orTransform
}, { isTransformFunction: true })
