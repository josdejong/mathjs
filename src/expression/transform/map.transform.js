import { factory } from '../../utils/factory.js'
import { isFunctionAssignmentNode, isSymbolNode } from '../../utils/is.js'
import { createMap } from '../../function/matrix/map.js'
import { compileInlineExpression } from './utils/compileInlineExpression.js'
import { createTransformCallback } from './utils/transformCallback.js'

const name = 'map'
const dependencies = ['typed']

export const createMapTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Attach a transform function to math.map
   * Adds a property transform containing the transform function.
   *
   * This transform creates a one-based index instead of a zero-based index
   */
  const map = createMap({ typed })
  const transformCallback = createTransformCallback({ typed })

  function mapTransform (args, math, scope) {
    if (args.length === 0) {
      return map()
    }

    if (args.length === 1) {
      return map(args[0])
    }
    const N = args.length - 1
    let X = args.slice(0, N)
    let callback = args[N]
    X = X.map(arg => _compileAndEvaluate(arg, scope))

    if (callback) {
      if (isSymbolNode(callback) || isFunctionAssignmentNode(callback)) {
        // a function pointer, like filter([3, -2, 5], myTestFunction)
        callback = _compileAndEvaluate(callback, scope)
      } else {
        // an expression like filter([3, -2, 5], x > 0)
        callback = compileInlineExpression(callback, math, scope)
      }
    }
    return map(...X, transformCallback(callback, N))

    function _compileAndEvaluate (arg, scope) {
      return arg.compile().evaluate(scope)
    }
  }
  mapTransform.rawArgs = true

  return mapTransform
}, { isTransformFunction: true })
