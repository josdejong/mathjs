'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var addScalar = load(require('./addScalar'));
  
  var algorithm01 = load(require('../../type/matrix/util/algorithm01'));
  var algorithm04 = load(require('../../type/matrix/util/algorithm04'));
  var algorithm09 = load(require('../../type/matrix/util/algorithm09'));
  var algorithm12 = load(require('../../type/matrix/util/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));

  /**
   * Add two values, `x + y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.add(x, y)
   *
   * Examples:
   *
   *    math.add(2, 3);               // returns Number 5
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(-4, 1);
   *    math.add(a, b);               // returns Complex -2 + 4i
   *
   *    math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]
   *
   *    var c = math.unit('5 cm');
   *    var d = math.unit('2.1 mm');
   *    math.add(c, d);               // returns Unit 52.1 mm
   *
   * See also:
   *
   *    subtract
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} x First value to add
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} y Second value to add
   * @return {Number | BigNumber | Complex | Unit | String | Array | Matrix} Sum of `x` and `y`
   */
  var add = typed('add', {

    'any, any': addScalar,
    
    'Matrix, Matrix': function (x, y) {
      // result
      var c;
      
      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm04(x, y, addScalar);
              break;
            default:
              // sparse + dense
              c = algorithm01(y, x, addScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm01(x, y, addScalar, false);
              break;
            default:
              // dense + dense
              c = algorithm12(x, y, addScalar);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return add(matrix(x), matrix(y)).valueOf();
    },
    
    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return add(matrix(x), y);
    },
    
    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return add(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm09(x, y, addScalar, false);
          break;
        default:
          c = algorithm13(x, y, addScalar, false);
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
          c = algorithm09(y, x, addScalar, true);
          break;
        default:
          c = algorithm13(y, x, addScalar, true);
          break;
      }
      return c;
    },
    
    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(x), y, addScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(y), x, addScalar, true).valueOf();
    }
  });
  
  return add;
}

exports.name = 'add';
exports.factory = factory;
