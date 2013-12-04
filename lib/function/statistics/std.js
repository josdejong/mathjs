module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;

  /**
   * Compute the mean value of a list of values
   * In case of a multi dimensional array, the mean of the flattened array
   * will be calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated.
   *
   *     mean(a, b, c, ...)
   *     mean(A)
   *     mean(A, dim)
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.std = function std(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function mean requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // mean([a, b, c, d, ...])
        return _std(args);
      }
      else if (arguments.length == 2) {
        // mean([a, b, c, d, ...], dim)
        return _nstd(arguments[0], arguments[1]);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // mean(a, b, c, d, ...)
      return _std(arguments);
    }
  };

  /**
   * Calculate the std value in an n-dimensional array, returning a
   * n-1 dimensional array
   * @param {Array} array
   * @param {Number} dim
   * @return {Number} std
   * @private
   */
  function _nstd(array, dim){
    return collection.deepApply(array, dim, _standard);
  };

  /**
   * Help function to calculate the standard deviation,
   * calculates the standard deviation of a single array
   */
  function _standard(array) {
    var sum = 0;
    var sum2 = 0;
    var num = 0;

    for(i=0; i<array.length; i++){
      sum = math.add(sum, array[i]);
      sum2 = math.add(sum2, math.pow(array[i],2));
      num += 1;
    }

    if (num < 2 ) {
      throw new Error('Cannot calculate std of one or none elements');
    }

    return math.sqrt(
      math.divide(sum2, num) - math.pow(math.divide(sum, num), 2));

  }
  /**
   * Recursively calculate the std value in an n-dimensional array
   * @param {Array} array
   * @return {Number} std
   * @private
   */
  function _std(array) {
    var sum = 0;
    var sum2 = 0;
    var num = 0;

    collection.deepForEach(array, function (value) {
      sum = math.add(sum, value);
      sum2 = math.add(sum2, math.pow(value,2));
      num++;
    });

    if (num < 2 ) {
      throw new Error('Cannot calculate std of one or none elements');
    }

    return math.sqrt(
      math.divide(sum2, num) - math.pow(math.divide(sum, num), 2));
  }
};
