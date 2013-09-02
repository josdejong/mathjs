module.exports = function (math) {
  var util = require('../../util/index.js'),

      Unit = require('../../type/Unit.js'),
      collection = require('../../type/collection.js'),

      isCollection = collection.isCollection,
      isString = util.string.isString;

  /**
   * Create a unit. Depending on the passed arguments, the function
   * will create and return a new math.type.Unit object.
   *
   * The method accepts the following arguments:
   *     unit(unit : string)
   *     unit(value : number, unit : string
   *
   * Example usage:
   *     var a = math.unit(5, 'cm');          // 50 mm
   *     var b = math.unit('23 kg');          // 23 kg
   *     var c = math.in(a, math.unit('m');   // 0.05 m
   *
   * @param {* | Array | Matrix} args
   * @return {Unit | Array | Matrix} value
   */
  math.unit = function unit(args) {
    switch(arguments.length) {
      case 1:
        // parse a string
        var arg = arguments[0];

        if (arg instanceof Unit) {
          // create a clone of the unit
          return arg.clone();
        }

        if (isString(arg)) {
          if (Unit.isPlainUnit(arg)) {
            return new Unit(null, arg); // a pure unit
          }

          var u = Unit.parse(arg);        // a unit with value, like '5cm'
          if (u) {
            return u;
          }

          throw new SyntaxError('String "' + arg + '" is no valid unit');
        }

        if (isCollection(args)) {
          return collection.map(args, unit);
        }

        throw new TypeError('A string or a number and string expected in function unit');
        break;

      case 2:
        // a number and a unit
        return new Unit(arguments[0], arguments[1]);
        break;

      default:
        throw new util.error.ArgumentsError('unit', arguments.length, 1, 2);
    }
  };
};
