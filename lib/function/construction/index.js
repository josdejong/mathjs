'use strict';

function factory (type, config, load, typed) {
  /**
   * Create an index. An Index can store ranges having start, step, and end
   * for multiple dimensions.
   * Matrix.get, Matrix.set, and math.subset accept an Index as input.
   *
   * Syntax:
   *
   *     math.index(range1, range2, ...)
   *
   * Where:
   *
   * Each range can be any of:
   *
   * - An array [start, end]
   * - An array [start, end, step]
   * - A number
   * - An instance of `Range`
   *
   * The parameters start, end, and step must be integer numbers. Start and end
   * are zero based. The start of a range is included, the end is excluded.
   *
   * Examples:
   *
   *    var math = math.js
   *
   *    var b = [1, 2, 3, 4, 5];
   *    math.subset(b, math.index([1, 3]));     // returns [2, 3]
   *
   *    var a = math.matrix([[1, 2], [3, 4]]);
   *    a.subset(math.index(0, 1));             // returns 2
   *    a.subset(math.index(1, null));          // returns [3, 4]
   *
   * See also:
   *
   *    bignumber, boolean, complex, matrix, number, string, unit
   *
   * @param {...*} ranges   Zero or more ranges or numbers.
   * @return {Index}        Returns the created index
   */
  return typed('index', {
    '...number | BigNumber | Range | Array': function (args) {
      var ranges = args.map(function (arg) {
        if (arg instanceof type.BigNumber) {
          return arg.toNumber(); // convert BigNumber to Number
        }
        else if (Array.isArray(arg)) {
          return arg.map(function (elem) {
            // convert BigNumber to Number
            return (elem instanceof type.BigNumber) ? elem.toNumber() : elem;
          });
        }
        else {
          return arg;
        }
      });

      var res = new type.Index();
      type.Index.apply(res, ranges);
      return res;
    }
  });
}

exports.type = 'function';
exports.name = 'index';
exports.factory = factory;
