module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;

  /**
   * Compute the product of a list of values
   * In case of a (multi dimensional) array or matrix, the product of all
   * elements will be calculated.
   *
   *     prod(a, b, c, ...)
   *     prod(A)
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.prod = function prod(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function prod requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // prod([a, b, c, d, ...])
        return _prod(args);
      }
      else if (arguments.length == 2) {
        // prod([a, b, c, d, ...], dim)
        // TODO: implement prod(A, dim)
        throw new Error('prod(A, dim) is not yet supported');
        //return collection.reduce(arguments[0], arguments[1], math.prod);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // prod(a, b, c, d, ...)
      return _prod(arguments);
    }
  };

  /**
   * Recursively calculate the product of an n-dimensional array
   * @param {Array} array
   * @return {Number} prod
   * @private
   */
  function _prod(array) {
    var prod = undefined;

    collection.deepForEach(array, function (value) {
      prod = (prod === undefined) ? value : math.multiply(prod, value);
    });

    if (prod === undefined) {
      throw new Error('Cannot calculate prod of an empty array');
    }

    return prod;
  }
};
