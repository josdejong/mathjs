module.exports = function (math) {
  var util = require('../../util/index.js'),

      Index = require('../../type/Index.js');

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
    Index.apply(i, arguments);
    return i;
  };
};
