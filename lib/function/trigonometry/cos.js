'use strict';

var bigCos = require('../../util/bignumber').cos_sin_sec_csc;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));
  var cosh = typed.find(load(require('./cosh')), ['number']);
  var sinh = typed.find(load(require('./sinh')), ['number']);

  /**
   * Calculate the cosine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cos(x)
   *
   * Examples:
   *
   *    math.cos(2);                      // returns Number -0.4161468365471422
   *    math.cos(math.pi / 4);            // returns Number  0.7071067811865475
   *    math.cos(math.unit(180, 'deg'));  // returns Number -1
   *    math.cos(math.unit(60, 'deg'));   // returns Number  0.5
   *
   *    var angle = 0.2;
   *    math.pow(math.sin(angle), 2) + math.pow(math.cos(angle), 2); // returns Number ~1
   *
   * See also:
   *
   *    cos, tan
   *
   * @param {Number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Cosine of x
   */
  var cos = typed('cos', {
    'number': Math.cos,

    'Complex': function (x) {
      // cos(z) = (exp(iz) + exp(-iz)) / 2
      return new type.Complex(
          Math.cos(x.re) * cosh(-x.im),
          Math.sin(x.re) * sinh(-x.im)
      );
    },

    'BigNumber': function (x) {
      return bigCos(x, type.BigNumber, 0, false);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cos is no angle');
      }
      return Math.cos(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, cos);
    }
  });

  return cos;
}

exports.name = 'cos';
exports.factory = factory;
