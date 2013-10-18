module.exports = function (math) {
  var Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      isCollection = collection.isCollection;

  /**
   * Compute the maximum value of a list of values
   * In case of a multi dimensional array, the maximum of the flattened array
   * will be calculated.
   *
   *     max(a, b, c, ...)
   *     max([a, b, c, ...])
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.max = function max(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function max requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // max([a, b, c, d, ...])
        return _max(args);
      }
      else if (arguments.length == 2) {
        // max([a, b, c, d, ...], dim)
        // TODO: implement support for calculating the max over specified dimension
        throw new Error('Specifying a dimension is not yet implemented...');
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // max(a, b, c, d, ...)
      return _max(arguments);
    }
  };

  /**
   * Recursively calculate the maximum value in an n-dimensional array
   * @param {Array} array
   * @return {Number} max
   * @private
   */
  function _max(array) {
    var max = null;

    collection.deepForEach(array, function (value) {
      if (max === null || math.larger(value, max)) {
        max = value;
      }
    });

    if (max === null) {
      throw new Error('Cannot calculate max of an empty array');
    }

    return max;
  }
};
