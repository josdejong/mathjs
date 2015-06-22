'use strict';

var errorTransform = require('./error.transform').transform;

/**
 * Attach a transform function to math.range
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function concat
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  var concat = load(require('../../function/matrix/concat'));

  // @see: comment of concat itself
  concat.transform = typed('concat', {
    '...any': function (args) {
      // change last argument from one-based to zero-based
      var lastIndex = args.length - 1;
      var last = args[lastIndex];
      if (typeof last === 'number') {
        args[lastIndex] = last - 1;
      }
      else if (last && last.isBigNumber === true) {
        args[lastIndex] = last.minus(1);
      }

      try {
        return concat.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });

  return concat.transform;
}

exports.factory = factory;
