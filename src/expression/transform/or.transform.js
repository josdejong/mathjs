import { createOr } from '../../function/logical/or.js'
import { factory } from '../../utils/factory.js'
import { isCollection } from '../../utils/is.js'

const name = 'or'
const dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix', 'concat']

export const createOrTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix, concat }) => {
  const or = createOr({ typed, matrix, equalScalar, DenseMatrix, concat })

  function orTransform (args, math, scope) {
    if (args.length < 2) {
      // let the underlying function throw a "Too few arguments" error,
      // like when calling it directly
      return or(...args.map(arg => arg.compile().evaluate(scope)))
    }

    // evaluate the arguments lazily: stop as soon as the result is true
    let result = args[0].compile().evaluate(scope)
    for (let i = 1; i < args.length; i++) {
      if (!isCollection(result) && or(result, false)) {
        return true
      }
      result = or(result, args[i].compile().evaluate(scope))
    }

    return result
  }

  orTransform.rawArgs = true

  return orTransform
}, { isTransformFunction: true })
