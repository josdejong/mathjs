module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      BigNumber = math.type.BigNumber,
      collection = require('../../type/collection'),

      isNumber = require('../../util/number').isNumber,
      isCollection = collection.isCollection,

      flatten = require('../../util/array').flatten;

  /**
   * Compute the median of a list of values. The values are sorted and the
   * middle value is returned. In case of an even number of values,
   * the average of the two middle values is returned.
   * Supported types of values are: Number, BigNumber, Unit
   *
   * In case of a (multi dimensional) array or matrix, the median of all
   * elements will be calculated.
   *
   *     median(a, b, c, ...)
   *     median(A)
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.median = function median(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function median requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // median([a, b, c, d, ...])
        return _median(args.valueOf());
      }
      else if (arguments.length == 2) {
        // median([a, b, c, d, ...], dim)
        // TODO: implement median(A, dim)
        throw new Error('median(A, dim) is not yet supported');
        //return collection.reduce(arguments[0], arguments[1], ...);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // median(a, b, c, d, ...)
      return _median(Array.prototype.slice.call(arguments));
    }
  };

  /**
   * Recursively calculate the median of an n-dimensional array
   * @param {Array} array
   * @return {Number} median
   * @private
   */
  function _median(array) {
    var flat = flatten(array);

    flat.sort(math.compare);

    var num = flat.length;

    if (num == 0) {
      throw new Error('Cannot calculate median of an empty array');
    }

    if (num % 2 == 0) {
      // even: return the average of the two middle values
      var left = flat[num / 2 - 1];
      var right = flat[num / 2];

      if (!isNumber(left) && !(left instanceof BigNumber) && !(left instanceof Unit)) {
        throw new math.error.UnsupportedTypeError('median', math['typeof'](left));
      }
      if (!isNumber(right) && !(right instanceof BigNumber) && !(right instanceof Unit)) {
        throw new math.error.UnsupportedTypeError('median', math['typeof'](right));
      }

      return math.divide(math.add(left, right), 2);
    }
    else {
      // odd: return the middle value
      var middle = flat[(num - 1) / 2];

      if (!isNumber(middle) && !(middle instanceof BigNumber) && !(middle instanceof Unit)) {
        throw new math.error.UnsupportedTypeError('median', math['typeof'](middle));
      }

      return middle;
    }
  }
};
