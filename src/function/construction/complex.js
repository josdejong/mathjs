module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js').Complex,

      isString = util.string.isString,
      isComplex = Complex.isComplex;

  /**
   * Create a complex value. Depending on the passed arguments, the function
   * will create and return a new math.type.Complex object.
   *
   * The method accepts the following arguments:
   *     complex()                           creates a complex value with zero
   *                                         as real and imaginary part.
   *     complex(re : number, im : string)   creates a complex value with provided
   *                                         values for real and imaginary part.
   *     complex(arg : string)               parses a string into a complex value.
   *
   * Example usage:
   *     var a = math.complex(3, -4);     // 3 - 4i
   *     a.re = 5;                        // a = 5 - 4i
   *     var i = a.im;                    // -4;
   *     var b = math.complex('2 + 6i');  // 2 + 6i
   *     var c = math.complex();          // 0 + 0i
   *     var d = math.add(a, b);          // 5 + 2i
   *
   * @param {*} [args]
   * @return {Complex} value
   */
  math.complex = function complex(args) {
    switch (arguments.length) {
      case 0:
        // no parameters. Set re and im zero
        return new Complex(0, 0);
        break;

      case 1:
        // parse string into a complex number
        var arg = arguments[0];
        if (isComplex(arg)) {
          // create a clone
          return arg.clone();
        }
        else if (isString(arg)) {
          var c = Complex.parse(arg);
          if (c) {
            return c;
          }
          else {
            throw new SyntaxError('String "' + arg + '" is no valid complex number');
          }
        }
        else {
          throw new TypeError(
              'Two numbers or a single string expected in function complex');
        }
        break;

      case 2:
        // re and im provided
        return new Complex(arguments[0], arguments[1]);
        break;

      default:
        throw new util.error.ArgumentsError('complex', arguments.length, 0, 2);
    }
  };
};
