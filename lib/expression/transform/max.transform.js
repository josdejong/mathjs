'use strict';

var errorTransform = require('./error.transform').transform;

/**
 * Attach a transform function to math.max
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function max
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  var max = load(require('../../function/statistics/max'));
  var isCollection = load(require('../../type/matrix/collection')).isCollection;

  max.transform = typed('max', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length == 2 && isCollection(args[0])) {
        var dim = args[1];
        if (typeof dim === 'number') {
          args[1] = dim - 1;
        }
        else if (dim && dim.isBigNumber === true) {
          args[1] = dim.minus(1);
        }
      }

      try {
        return max.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });

  return max.transform;
}

exports.factory = factory;
