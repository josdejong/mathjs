module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isCollection = collection.isCollection,
      isNumber = util.number.isNumber,
      isBoolean = util.boolean.isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex;

  /**
   * Create a complex value or convert a value to a complex value.
   *
   * The method accepts the following arguments:
   *     complex()                           creates a complex value with zero
   *                                         as real and imaginary part.
   *     complex(re : number, im : string)   creates a complex value with provided
   *                                         values for real and imaginary part.
   *     complex(re : number)                creates a complex value with provided
   *                                         real value and zero imaginary part.
   *     complex(arg : string)               parses a string into a complex value.
   *     complex(array : Array)              converts the elements of the array
   *                                         or matrix element wise into a
   *                                         complex value.
   *
   * Example usage:
   *     var a = math.complex(3, -4);     // 3 - 4i
   *     a.re = 5;                        // a = 5 - 4i
   *     var i = a.im;                    // -4;
   *     var b = math.complex('2 + 6i');  // 2 + 6i
   *     var c = math.complex();          // 0 + 0i
   *     var d = math.add(a, b);          // 5 + 2i
   *
   * @param {* | Array | Matrix} [args]
   * @return {Complex | Array | Matrix} value
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

        if (isNumber(arg)) {
          return new Complex(arg, 0);
        }

        if (isComplex(arg)) {
          // create a clone
          return arg.clone();
        }

        if (isString(arg)) {
          var c = Complex.parse(arg);
          if (c) {
            return c;
          }
          else {
            throw new SyntaxError('String "' + arg + '" is no valid complex number');
          }
        }

        if (isCollection(arg)) {
          return collection.map(arg, complex);
        }

        if (isBoolean(arg)) {
          return new Complex(Number(arg), 0);
        }

        throw new TypeError(
            'Two numbers or a single string expected in function complex');
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
