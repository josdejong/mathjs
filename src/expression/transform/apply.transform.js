'use strict'

const errorTransform = require('./error.transform').transform

/**
 * Attach a transform function to math.apply
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function apply
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  const apply = load(require('../../function/matrix/apply'))

  // @see: comment of concat itself
  return typed('apply', {
    '...any': function (args) {
      // change dim from one-based to zero-based
      const dim = args[1]

      if (type.isNumber(dim)) {
        args[1] = dim - 1
      } else if (type.isBigNumber(dim)) {
        args[1] = dim.minus(1)
      }

      try {
        return apply.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}

exports.name = 'apply'
exports.path = 'expression.transform'
exports.factory = factory
