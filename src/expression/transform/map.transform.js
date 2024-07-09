import { factory } from '../../utils/factory.js'
import { isFunctionAssignmentNode, isSymbolNode } from '../../utils/is.js'
import { createMap } from '../../function/matrix/map.js'
import { compileInlineExpression } from './utils/compileInlineExpression.js'

const name = 'map'
const dependencies = ['typed', 'subset', 'index']

export const createMapTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, subset, index }) => {
  /**
   * Attach a transform function to math.map
   * Adds a property transform containing the transform function.
   *
   * This transform creates a one-based index instead of a zero-based index
   */
  const map = createMap({ typed, subset, index })

  function mapTransform(args, math, scope) {
    let x, callback

    if (args[0]) {
      x = args[0].compile().evaluate(scope)
    }

    if (args[1]) {
      if (isSymbolNode(args[1]) || isFunctionAssignmentNode(args[1])) {
        // a function pointer, like filter([3, -2, 5], myTestFunction)
        callback = args[1].compile().evaluate(scope)
      } else {
        // an expression like filter([3, -2, 5], x > 0)
        callback = compileInlineExpression(args[1], math, scope)
      }
    }
    return map(x, fixFunction(callback))
  }
  mapTransform.rawArgs = true

  return mapTransform

  function fixFunction(callback) {
    return typed.isTypedFunction(callback) ? fixTypedFunction(callback) : fixCallback(callback)
  }

  function fixTypedFunction(typedFunction) {
    //console.log(typedFunction.signatures)
    const signatures = Object.fromEntries(
      Object.entries(typedFunction.signatures)
        //.filter(([signature, callbackFunction]) => (typeof signature === "string" && signature.length > 1) && (typeof callbackFunction === "function"))
        .map(([signature, callbackFunction]) => [signature, fixFunction(callbackFunction)])
    )

    if (typeof typedFunction.name === 'string' && typedFunction.name.length > 0) {
      return typed(
        typedFunction.name,
        signatures)
    } else {
      return typed(signatures)
    }

  }
}, { isTransformFunction: true })

function fixCallback(callbackFunction) {
  const callbackLength = callbackFunction.length
  if (callbackLength <= 1) {
    return callbackFunction
  } else if (callbackLength === 2) {
    return function (val, idx){return callbackFunction(val, fixDims(idx))}
  } else if (callbackLength === 3) {
    return function (val, idx, array){return callbackFunction(val, fixDims(idx), array)}
  } else {
    return callbackFunction
  }
}

function fixDims(dims) {
  return dims.map(dim => dim.isBigNumber ? dim.plus(1) : dim + 1)
}