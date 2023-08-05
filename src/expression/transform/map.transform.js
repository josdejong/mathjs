import { applyCallback } from '../../utils/applyCallback.js'
import { map } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { isFunctionAssignmentNode, isSymbolNode } from '../../utils/is.js'
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
  function mapTransform (args, math, scope) {
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

    return map(x, callback)
  }
  mapTransform.rawArgs = true

  // one-based version of map function
  const map = typed('map', {
    'Array, function': function (x, callback) {
      return _map(x, callback, x)
    },

    'Matrix, function': function (x, callback) {
      return x.create(_map(x.valueOf(), callback, x))
    }
  })

  return mapTransform
}, { isTransformFunction: true })

/**
 * Map for a multidimensional array. One-based indexes
 * @param {Array} array
 * @param {function} callback
 * @param {Array} orig
 * @return {Array}
 * @private
 */
function _map (array, callback, orig) {
  function recurse (value, index) {
    if (Array.isArray(value)) {
      return map(value, function (child, i) {
        // we create a copy of the index array and append the new index value
        return recurse(child, index.concat(i + 1)) // one based index, hence i + 1
      })
    } else {
      // invoke the (typed) callback function with the right number of arguments
      return applyCallback(callback, value, index, orig, 'map')
    }
  }

  return recurse(array, [])
}
