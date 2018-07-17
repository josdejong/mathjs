'use strict'

/**
 * Attach a transform function to math.range
 * Adds a property transform containing the transform function.
 *
 * This transform creates a range which includes the end value
 */
function factory (type, config, load, typed) {
  const range = load(require('../../function/matrix/range'))

  return typed('range', {
    '...any': function (args) {
      const lastIndex = args.length - 1
      const last = args[lastIndex]
      if (typeof last !== 'boolean') {
        // append a parameter includeEnd=true
        args.push(true)
      }

      return range.apply(null, args)
    }
  })
}

exports.name = 'range'
exports.path = 'expression.transform'
exports.factory = factory
