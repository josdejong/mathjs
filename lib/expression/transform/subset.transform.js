'use strict';

var errorTransform = require('./error.transform').transform;

/**
 * Attach a transform function to math.subset
 * Adds a property transform containing the transform function.
 *
 * This transform creates a range which includes the end value
 */
function factory (type, config, load, typed) {
  var subset = load(require('../../function/matrix/subset'));

  subset.transform = typed('subset', {
    '...any': function (args) {
      try {
        return subset.apply(null, args);
      }
      catch (err) {
        throw errorTransform(err);
      }
    }
  });

  return subset.transform;
}

exports.factory = factory;
