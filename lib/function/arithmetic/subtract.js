'use strict';

var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var addScalar = load(require('./addScalar'));
  var unaryMinus = load(require('./unaryMinus'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2);        // returns Number 3.3
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.subtract(a, b);          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4);  // returns Array [1, 3, 0]
   *
   *    var c = math.unit('2.1 km');
   *    var d = math.unit('500m');
   *    math.subtract(c, d);          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x
   *            Initial value
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y
   *            Value to subtract from `x`
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  var subtract = typed('subtract', {

    'number, number': function (x, y) {
      return x - y;
    },

    'Complex, Complex': function (x, y) {
      return new type.Complex (
          x.re - y.re,
          x.im - y.im
      );
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.minus(y);
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      if (y.value == null) {
        throw new Error('Parameter y contains a unit with undefined value');
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      var res = x.clone();
      res.value -= y.value;
      res.fixPrefix = false;

      return res;
    },
    
    'Matrix, Matrix': function (x, y) {
      // matrix sizes
      var xsize = x.size();
      var ysize = y.size();

      // check dimensions
      if (xsize.length !== ysize.length)
        throw new DimensionError(xsize.length, ysize.length);

      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse - sparse
              c = elementWiseOperations.algorithm5(x, y, subtract);
              break;
            default:
              // sparse - dense
              c = elementWiseOperations.algorithm3(y, x, subtract, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense - sparse
              c = elementWiseOperations.algorithm1(x, y, subtract, false);
              break;
            default:
              // dense - dense
              c = elementWiseOperations.algorithm11(x, y, subtract, false);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return subtract(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          // algorithm 7 is faster than 9 since it calls f() for nonzero items only!
          c = elementWiseOperations.algorithm8(x, unaryMinus(y), addScalar);
          break;
        default:
          c = elementWiseOperations.algorithm12(x, y, subtract);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = elementWiseOperations.algorithm8(y, x, subtract, true);
          break;
        default:
          c = elementWiseOperations.algorithm12(y, x, subtract, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm12(matrix(x), y, subtract, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm12(matrix(y), x, subtract, true).valueOf();
    }
  });

  return subtract;
}

exports.name = 'subtract';
exports.factory = factory;
