module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;

  /**
   * Compute the maximum value of a list of values
   * In case of a multi dimensional array, the maximum of the flattened array
   * will be calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated.
   *
   *     max(a, b, c, ...)
   *     max(A)
   *     max(A, dim)
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
        return collection.reduce(arguments[0], arguments[1], _getlarger);
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

  function _getlarger(x, y){
	  if( math.larger(x,y) )
		  return x;
	  else
		  return y;
  }

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
