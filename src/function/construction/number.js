var error = require('../../util/error.js');

/**
 * Create a number or convert a string to a number
 * @param {String | Number | Boolean} [value]
 * @return {Number} num
 */
module.exports = function number (value) {
  switch (arguments.length) {
    case 0:
      return 0;
    case 1:
      var num = Number(value);
      if (isNaN(num)) {
        num = Number(value.valueOf());
      }
      if (isNaN(num)) {
        throw new SyntaxError(value.toString() + ' is no valid number');
      }
      return num;
    default:
      throw new error.ArgumentsError('number', arguments.length, 0, 1);
  }
};
