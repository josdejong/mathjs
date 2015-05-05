'use strict';

var errorTransform = require('./error.transform').transform;

/**
 * Attach a transform function to math.mean
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function mean
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  var mean = load(require('../../function/statistics/mean'));
  var isCollection = load(require('../../type/matrix/collection')).isCollection;

  mean.transform = typed('mean', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length == 2 && isCollection(args[0])) {
        var dim = args[1];
        if (typeof dim === 'number') {
          args[1] = dim - 1;
        }
        else if (dim instanceof type.BigNumber) {
          args[1] = dim.minus(1);
        }
      }

      try {
        return mean.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });

  return mean.transform;
}

exports.factory = factory;

