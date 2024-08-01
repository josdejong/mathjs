import { factory } from '../../utils/factory.js'
import { isFunctionAssignmentNode, isSymbolNode } from '../../utils/is.js'
import { createMap } from '../../function/matrix/map.js'
import { compileInlineExpression } from './utils/compileInlineExpression.js'

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

  function mapTransform (args, math, scope) {
    if (args.length === 0) {
      return map()
    }

    if (args.length === 1) {
      return map(args[0])
    }
    const N = args.length - 1
    let X, callback
    callback = args[N]
    X = args.slice(0, N)
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
    return map(...X, _transformCallback(callback, N))

    function _compileAndEvaluate (arg, scope) {
      return arg.compile().evaluate(scope)
    }
  }
  mapTransform.rawArgs = true

  return mapTransform

  /**
   * Transforms the given callback function based on its type and number of arrays.
   *
   * @param {Function} callback - The callback function to transform.
   * @param {number} numberOfArrays - The number of arrays to pass to the callback function.
   * @returns {*} - The transformed callback function.
   */
  function _transformCallback (callback, numberOfArrays) {
    if (typed.isTypedFunction(callback)) {
      return _transformTypedCallbackFunction(callback, numberOfArrays)
    } else {
      return _transformCallbackFunction(callback, callback.length, numberOfArrays)
    }
  }

  /**
   * Transforms the given typed callback function based on the number of arrays.
   *
   * @param {Function} typedFunction - The typed callback function to transform.
   * @param {number} numberOfArrays - The number of arrays to pass to the callback function.
   * @returns {*} - The transformed typed callback function.
   */
  function _transformTypedCallbackFunction (typedFunction, numberOfArrays) {
    const signatures = Object.fromEntries(
      Object.entries(typedFunction.signatures)
        .map(([signature, callbackFunction]) => {
          const numberOfCallbackInputs = signature.split(',').length
          if (typed.isTypedFunction(callbackFunction)) {
            return [signature, _transformTypedCallbackFunction(callbackFunction, numberOfArrays)]
          } else {
            return [signature, _transformCallbackFunction(callbackFunction, numberOfCallbackInputs, numberOfArrays)]
          }
        })
    )

    if (typeof typedFunction.name === 'string') {
      return typed(typedFunction.name, signatures)
    } else {
      return typed(signatures)
    }
  }
}, { isTransformFunction: true })

/**
 * Transforms the callback function based on the number of callback inputs and arrays.
 * There are three cases:
 * 1. The callback function has N arguments.
 * 2. The callback function has N+1 arguments.
 * 3. The callback function has 2N+1 arguments.
 *
 * @param {Function} callbackFunction - The callback function to transform.
 * @param {number} numberOfCallbackInputs - The number of callback inputs.
 * @param {number} numberOfArrays - The number of arrays.
 * @returns {Function} The transformed callback function.
 */
function _transformCallbackFunction (callbackFunction, numberOfCallbackInputs, numberOfArrays) {
  if (numberOfCallbackInputs === numberOfArrays) {
    return callbackFunction
  } else if (numberOfCallbackInputs === numberOfArrays + 1) {
    return function (...args) {
      const vals = args.slice(0, numberOfArrays)
      const idx = _transformDims(args[numberOfArrays])
      return callbackFunction(...vals, idx)
    }
  } else if (numberOfCallbackInputs > numberOfArrays + 1) {
    return function (...args) {
      const vals = args.slice(0, numberOfArrays)
      const idx = _transformDims(args[numberOfArrays])
      const rest = args.slice(numberOfArrays + 1)
      return callbackFunction(...vals, idx, ...rest)
    }
  } else {
    return callbackFunction
  }
}

/**
 * Transforms the dimensions by adding 1 to each dimension.
 *
 * @param {Array} dims - The dimensions to transform.
 * @returns {Array} The transformed dimensions.
 */
function _transformDims (dims) {
  return dims.map(dim => dim.isBigNumber ? dim.plus(1) : dim + 1)
}
