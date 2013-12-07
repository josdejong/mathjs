module.exports = function (math, settings) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      object = util.object,
      isArray = util.array.isArray,
      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * Create a diagonal matrix or retrieve the diagonal of a matrix
   *
   *     diag(v)
   *     diag(v, k)
   *     diag(X)
   *     diag(X, k)
   *
   * TODO: more documentation on diag
   *
   * @param {Matrix | Array} x
   * @param {Number} [k]
   * @return {Matrix | Array} matrix
   */
  math.diag = function diag (x, k) {
    var data, vector, i, iMax;

    if (arguments.length != 1 && arguments.length != 2) {
      throw new math.error.ArgumentsError('diag', arguments.length, 1, 2);
    }

    if (k) {
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('Second parameter in function diag must be an integer');
      }
    }
    else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    // check type of input
    if (x instanceof Matrix) {
      // nice, nothing to do
    }
    else if (isArray(x)) {
      // convert to matrix
      x = new Matrix(x);
    }
    else {
      throw new TypeError ('First parameter in function diag must be a Matrix or Array');
    }

    var s = x.size();
    switch (s.length) {
      case 1:
        // x is a vector. create diagonal matrix
        vector = x.valueOf();
        var matrix = new Matrix();
        var defaultValue = 0;
        matrix.resize([vector.length + kSub, vector.length + kSuper], defaultValue);
        data = matrix.valueOf();
        iMax = vector.length;
        for (i = 0; i < iMax; i++) {
          data[i + kSub][i + kSuper] = object.clone(vector[i]);
        }
        return (settings.matrix === 'array') ? matrix.valueOf() : matrix;
        break;

      case 2:
        // x is a matrix get diagonal from matrix
        vector = [];
        data = x.valueOf();
        iMax = Math.min(s[0] - kSub, s[1] - kSuper);
        for (i = 0; i < iMax; i++) {
          vector[i] = object.clone(data[i + kSub][i + kSuper]);
        }
        return (settings.matrix === 'array') ? vector : new Matrix(vector);
        break;

      default:
        throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
  };
};
