'use strict';

/**
 * Attach a transform function to math.range
 * Adds a property transform containing the transform function.
 *
 * This transform creates a range which includes the end value
 */
function factory (type, config, load, typed) {
  var range = load(require('../../function/matrix/range'));

  range.transform = typed('range', {
    '...any': function (args) {
      var lastIndex = args.length - 1;
      var last = args[lastIndex];
      if (typeof last !== 'boolean') {
        // append a parameter includeEnd=true
        args.push(true);
      }

      return range.apply(null, args);
    }
  });

  return range.transform;
}

exports.factory = factory;
