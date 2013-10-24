module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;

  /**
   * Compute the minimum value of a list of values.
   * In case of a multi dimensional array, the minimum of the flattened array
   * will be calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated.
   *
   *     min(a, b, c, ...)
   *     min(A)
   *     min(A, dim)
   *
   * @param {... *} args  A single matrix or multiple scalar values
   * @return {*} res
   */
  math.min = function min(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function min requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // min([a, b, c, d, ...])
        return _min(args);
      }
      else if (arguments.length == 2) {
        // min([a, b, c, d, ...], dim)
        return collection.reduce(arguments[0], arguments[1], _getsmaller);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // min(a, b, c, d, ...)
      return _min(arguments);
    }
  };

  function _getsmaller(x, y){
	  if( math.smaller(x,y) )
		  return x;
	  else
		  return y;
  }

  /**
   * Recursively calculate the minimum value in an n-dimensional array
   * @param {Array} array
   * @return {Number} min
   * @private
   */
  function _min(array) {
    var min = null;

    collection.deepForEach(array, function (value) {
      if (min === null || math.smaller(value, min)) {
        min = value;
      }
    });

    if (min === null) {
      throw new Error('Cannot calculate min of an empty array');
    }

    return min;
  }
};
