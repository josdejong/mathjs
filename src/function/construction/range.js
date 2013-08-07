module.exports = function (math) {
  var util = require('../../util/index.js'),

      Range = require('../../type/Range.js'),

      isString = util.string.isString;

  /**
   * Create a range. The function creates a new math.type.Range object.
   *
   * A range works similar to an Array, with functions like
   * forEach and map. However, a Range object is very cheap to create compared to
   * a large Array with indexes, as it stores only a start, step and end value of
   * the range.
   *
   * The method accepts the following arguments
   *     range(str)                   Create a range from a string, where the
   *                                  string contains the start, optional step,
   *                                  and end, separated by a colon.
   *     range(start, end)            Create a range with start and end and a
   *                                  default step size of 1
   *     range(start, step, end)      Create a range with start, step, and end.
   *
   * Example usage:
   *     var c = math.range(2, 1, 5);     // 2:1:5
   *     c.toArray();                     // [2, 3, 4, 5]
   *     var d = math.range(2, -1, -2);   // 2:-1:-2
   *     d.forEach(function (value, index) {
 *         console.log(index, value);
 *     });
   *     var e = math.range('2:1:5');     // 2:1:5
   *
   * @param {...*} args
   * @return {Range} range
   */
  math.range = function range(args) {
    switch (arguments.length) {
      case 1:
        // parse string into a range
        if (args instanceof Range) {
          // create a clone
          return args.clone();
        }
        else if (isString(args)) {
          var r = Range.parse(args);
          if (r) {
            return r;
          }
          else {
            throw new SyntaxError('String "' + r + '" is no valid range');
          }
        }
        else {
          throw new TypeError(
              'Two or three numbers or a single string expected in function range');
        }
        break;

      case 2:
        // range(start, end)
        return new Range(arguments[0], null, arguments[1]);
        break;

      case 3:
        // range(start, step, end)
        return new Range(arguments[0], arguments[1], arguments[2]);
        break;

      default:
        throw new util.error.ArgumentsError('range', arguments.length, 2, 3);
    }
  };
};
