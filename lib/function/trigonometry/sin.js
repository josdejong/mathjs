'use strict';

var bigSin = require('../../util/bignumber').cos_sin_sec_csc;

function factory (type, config, load, typed) {
  var cosh = typed.find(load(require('./cosh')), ['number']);
  var sinh = typed.find(load(require('./sinh')), ['number']);
  var collection = load(require('../../type/matrix/collection'));

  /**
   * Calculate the sine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sin(x)
   *
   * Examples:
   *
   *    math.sin(2);                      // returns Number 0.9092974268256813
   *    math.sin(math.pi / 4);            // returns Number 0.7071067811865475
   *    math.sin(math.unit(90, 'deg'));   // returns Number 1
   *    math.sin(math.unit(30, 'deg'));   // returns Number 0.5
   *
   *    var angle = 0.2;
   *    math.pow(math.sin(angle), 2) + math.pow(math.cos(angle), 2); // returns Number ~1
   *
   * See also:
   *
   *    cos, tan
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Sine of x
   */
  var sin = typed('sin', {
    'number': Math.sin,

    'Complex': function (x) {
      return new type.Complex(
          Math.sin(x.re) * cosh(-x.im),
          Math.cos(x.re) * sinh(x.im)
      );
    },

    'BigNumber': function (x) {
      return bigSin(x, type.BigNumber, 1, false);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sin is no angle');
      }
      return Math.sin(x.value);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sin(0) = 0
      return collection.deepMap(x, sin, true);
    }
  });

  return sin;
}

exports.name = 'sin';
exports.factory = factory;
