'use strict';

var errorTransform = require('./error.transform').transform;

/**
 * Attach a transform function to math.min
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function min
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  var min = load(require('../../function/statistics/min'));
  var isCollection = load(require('../../type/matrix/collection')).isCollection;

  min.transform = typed('min', {
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
        return min.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });

  return min.transform;
}

exports.factory = factory;
