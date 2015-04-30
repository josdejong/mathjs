'use strict';

function factory (type, config, load, typed) {

  var collection = load(require('../../type/collection'));
  var matrix = load(require('../construction/matrix'));
  var addScalar = load(require('./addScalar'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

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
              c = elementWiseOperations.algorithm4(x, y, addScalar, false);
              break;
            default:
              // sparse + dense
              c = elementWiseOperations.algorithm1(y, x, addScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = elementWiseOperations.algorithm1(x, y, addScalar, false);
              break;
            default:
              c = elementWiseOperations.algorithm0(x, y, addScalar, false);
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
          c = elementWiseOperations.algorithm7(x, y, addScalar, false);
          break;
        default:
          c = collection.deepMap2(x, y, add);
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
          c = elementWiseOperations.algorithm7(y, x, addScalar, true);
          break;
        default:
          c = collection.deepMap2(x, y, add);
          break;
      }
      return c;
    },
    
    'Array, any': function (x, y) {
      return collection.deepMap2(x, y, add);
    },

    'any, Array': function (x, y) {
      return collection.deepMap2(x, y, add);
    }
  });
  
  return add;
}

exports.name = 'add';
exports.factory = factory;
