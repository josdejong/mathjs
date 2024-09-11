import { createFilter } from '../../function/matrix/filter.js'
import { factory } from '../../utils/factory.js'
import { isFunctionAssignmentNode, isSymbolNode } from '../../utils/is.js'
import { compileInlineExpression } from './utils/compileInlineExpression.js'
import { createTransformCallback } from './utils/transformCallback.js'

const name = 'filter'
const dependencies = ['typed']

export const createFilterTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Attach a transform function to math.filter
   * Adds a property transform containing the transform function.
   *
   * This transform adds support for equations as test function for math.filter,
   * so you can do something like 'filter([3, -2, 5], x > 0)'.
   */
  function filterTransform (args, math, scope) {
    const filter = createFilter({ typed })
    const transformCallback = createTransformCallback({ typed })

    if (args.length === 0) {
      return filter()
    }
    let x = args[0]

    if (args.length === 1) {
      return filter(x)
    }

    const N = args.length - 1
    let callback = args[N]

    if (x) {
      x = _compileAndEvaluate(x, scope)
    }

    if (callback) {
      if (isSymbolNode(callback) || isFunctionAssignmentNode(callback)) {
        // a function pointer, like filter([3, -2, 5], myTestFunction)
        callback = _compileAndEvaluate(callback, scope)
      } else {
        // an expression like filter([3, -2, 5], x > 0)
        callback = compileInlineExpression(callback, math, scope)
      }
    }

    return filter(x, transformCallback(callback, N))
  }
  filterTransform.rawArgs = true

  function _compileAndEvaluate (arg, scope) {
    return arg.compile().evaluate(scope)
  }

  return filterTransform
}, { isTransformFunction: true })
