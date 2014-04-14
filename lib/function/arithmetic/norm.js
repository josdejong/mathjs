module.exports = function (math) {
  var util = require('../../util/index'),

      array = require('../../../lib/util/array'),
          
      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the norm of a number, vector or matrix.
   *
   *     norm(x)
   *     norm(x, p)
   *
   * p is optional. If not provided, defaults to 2.
   *
   * @param  {Number | BigNumber | Complex | Boolean | Array | Matrix} x
   * @param  {Number | Infinity} [p]
   * @return {Number} the p-norm
   */
  math.norm = function norm(x, p) {
    if (arguments.length < 1 || arguments.length > 2) {
      throw new util.error.ArgumentsError('norm', arguments.length, 1, 2);
    }

    if (isNumber(x)) {
      // norm(x) = abs(x)
      return Math.abs(x);
    }

    if (isComplex(x)) {
      // ignore p, complex numbers 
      return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    if (x instanceof BigNumber) {
      // norm(x) = abs(x)
      return x.abs();
    }

    if (isBoolean(x)) {
      // norm(x) = abs(x)
      return Math.abs(x);
    }
    
    if (isArray(x)) {
      // size
      var sizeX = array.size(x);
      // p
      p = p || 2;
      // check it is a Vector
      if (sizeX.length == 1) {
        // check p
        if (p == Number.POSITIVE_INFINITY) {
          // norm(x, Infinity) = max(abs(x))
          var n = 0;
          collection.deepForEach(x, function (value) {
            var v = math.abs(value);
            if (math.larger(v, n))
              n = v;
          });
          return n;
        }
        else if (isNumber(p) && !isNaN(p)) {
          // check p != 0
          if (!math.equal(p, 0)) {
            // norm(x, p) = sum(abs(xi) ^ p) ^ 1/p
            var n = 0;
            collection.deepForEach(x, function (value) {
              n += math.pow(math.abs(value), p);
            });
            return math.pow(n, 1 / p);
          }
          return Number.POSITIVE_INFINITY;
        }
        else {
          // invalid parameter value
          throw new Error('Parameter [p] in function norm must be a Number');
        }
      }
      else if (sizeX.length == 2) {
        // check p
        if (p == 1) {
          // norm(x) = the largest column sum
          var c = [];
          // loop rows
          for (var i = 0; i < x.length; i++) {
            var r = x[i];
            // loop columns
            for (var j = 0; j < r.length; j++) {
              c[j] = (c[j] || 0) + math.abs(r[j]);
            }
          }
          return math.max(c);
        }
        else if (p == Number.POSITIVE_INFINITY) {
          // norm(x) = the largest row sum
          var n = 0;
          // loop rows
          for (var i = 0; i < x.length; i++) {            
            var rs = 0;
            var r = x[i];
            // loop columns
            for (var j = 0; j < r.length; j++) {
              rs = math.add(rs, math.abs(r[j]));
            }
            if (math.larger(rs, n))
              n = rs;
          }
          return n;
        }
        else {
          // not implemented
          throw new Error('Unsupported parameter value, missing implementation of matrix singular value decomposition');
        }
      }
    }

    if (x instanceof Matrix) {
      return norm(x.valueOf(), p);
    }

    throw new math.error.UnsupportedTypeError('norm', x);
  };
};
