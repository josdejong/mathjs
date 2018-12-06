'use strict'

const errorTransform = require('./error.transform').transform
const isCollection = require('../../utils/collection/isCollection')

/**
 * Attach a transform function to math.std
 * Adds a property transform containing the transform function.
 *
 * This transform changed the `dim` parameter of function std
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  const std = load(require('../../function/statistics/std'))

  return typed('std', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length >= 2 && isCollection(args[0])) {
        const dim = args[1]
        if (type.isNumber(dim)) {
          args[1] = dim - 1
        } else if (type.isBigNumber(dim)) {
          args[1] = dim.minus(1)
        }
      }

      try {
        return std.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}

exports.name = 'std'
exports.path = 'expression.transform'
exports.factory = factory
