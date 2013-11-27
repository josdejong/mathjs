module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Index = require('../../type/Index'),

      toNumber = util.number.toNumber;

  /**
   * Create an index. An Index can store ranges having start, step, and end
   * for multiple dimensions.
   * Matrix.get, Matrix.set, and math.subset accept an Index as input.
   *
   * Usage:
   *     var index = math.index(range1, range2, ...);
   *
   * Where each range can be any of:
   *     An array [start, end]
   *     An array [start, end, step]
   *     A number
   *     null, this will create select the whole dimension
   *
   * The parameters start, end, and step must be integer numbers.
   *
   * @param {...*} ranges
   */
  math.index = function matrix(ranges) {
    var i = new Index();

    // downgrade BigNumber to Number
    var args = Array.prototype.slice.apply(arguments).map(function (arg) {
      if (arg instanceof BigNumber) {
        return toNumber(arg);
      }
      else if (Array.isArray(arg)) {
        return arg.map(function (elem) {
          return (elem instanceof BigNumber) ? toNumber (elem) : elem;
        });
      }
      else {
        return arg;
      }
    });

    Index.apply(i, args);
    return i;
  };
};
