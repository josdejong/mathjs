import { applyCallback } from '../../utils/applyCallback.js'
import { filter, filterRegExp } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { isFunctionAssignmentNode, isSymbolNode } from '../../utils/is.js'
import { compileInlineExpression } from './utils/compileInlineExpression.js'

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

    return filter(x, callback)
  }
  filterTransform.rawArgs = true

  // one based version of function filter
  const filter = typed('filter', {
    'Array, function': _filter,

    'Matrix, function': function (x, test) {
      return x.create(_filter(x.toArray(), test))
    },

    'Array, RegExp': filterRegExp,

    'Matrix, RegExp': function (x, test) {
      return x.create(filterRegExp(x.toArray(), test))
    }
  })

  return filterTransform
}, { isTransformFunction: true })

/**
 * Filter values in a callback given a callback function
 *
 * !!! Passes a one-based index !!!
 *
 * @param {Array} x
 * @param {Function} callback
 * @return {Array} Returns the filtered array
 * @private
 */
function _filter (x, callback) {
  return filter(x, function (value, index, array) {
    // invoke the callback function with the right number of arguments
    return applyCallback(callback, value, [index + 1], array, 'filter')
  })
}
