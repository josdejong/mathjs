module.exports = function (math) {
  var Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      isCollection = collection.isCollection;

  /**
   * Compute the mean value of a list of values
   * In case of a multi dimensional array, the mean of the flattened array
   * will be calculated.
   *
   *     mean(a, b, c, ...)
   *     mean([a, b, c, ...])
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.mean = function mean(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function mean requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // mean([a, b, c, d, ...])
        return _mean(args);
      }
      else if (arguments.length == 2) {
        // mean([a, b, c, d, ...], dim)
        // TODO: implement support for calculating the mean over specified dimension
        return _nmean(arguments[0], arguments[1]-1);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // mean(a, b, c, d, ...)
      return _mean(arguments);
    }
  };

  /**
   * Calculate the mean value in an n-dimensional array, returning a
   * n-1 dimensional array
   * @param {Array} array
   * @param {Number} dimension
   * @return {Number} mean
   * @private
   */
  function _nmean(array, dim){
	  var sum, len, tmp;
	  sum = collection.reduce(array, dim, math.add);
	  tmp = array;
	  while(--dim){
		  tmp = tmp[0];
	  }
	  len = tmp.length;
	  return math.divide(sum/len);
  };

  /**
   * Recursively calculate the mean value in an n-dimensional array
   * @param {Array} array
   * @return {Number} mean
   * @private
   */
  function _mean(array) {
    var sum = 0;
    var num = 0;

    collection.deepForEach(array, function (value) {
      sum = math.add(sum, value);
      num++;
    });

    if (num === 0) {
      throw new Error('Cannot calculate mean of an empty array');
    }

    return math.divide(sum, num);
  }
};
