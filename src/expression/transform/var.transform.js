'use strict'

const errorTransform = require('./error.transform').transform
const isCollection = require('../../utils/collection/isCollection')

/**
 * Attach a transform function to math.var
 * Adds a property transform containing the transform function.
 *
 * This transform changed the `dim` parameter of function var
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  const variance = load(require('../../function/statistics/var'))

  return typed('var', {
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
        return variance.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}

exports.name = 'var'
exports.path = 'expression.transform'
exports.factory = factory
