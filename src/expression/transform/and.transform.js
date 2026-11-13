import { createAnd } from '../../function/logical/and.js'
import { factory } from '../../utils/factory.js'
import { isCollection } from '../../utils/is.js'

const name = 'and'
const dependencies = ['typed', 'matrix', 'zeros', 'add', 'equalScalar', 'not', 'concat']

export const createAndTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, not, concat }) => {
  const and = createAnd({ typed, matrix, equalScalar, zeros, not, concat })

  function andTransform (args, math, scope) {
    if (args.length < 2) {
      // let the underlying function throw a "Too few arguments" error,
      // like when calling it directly
      return and(...args.map(arg => arg.compile().evaluate(scope)))
    }

    // evaluate the arguments lazily: stop as soon as the result is false
    let result = args[0].compile().evaluate(scope)
    for (let i = 1; i < args.length; i++) {
      if (!isCollection(result) && !and(result, true)) {
        return false
      }
      result = and(result, args[i].compile().evaluate(scope))
    }

    return result
  }

  andTransform.rawArgs = true

  return andTransform
}, { isTransformFunction: true })
