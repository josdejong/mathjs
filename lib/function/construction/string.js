module.exports = function (math) {
  var util = require('../../util/index.js'),

      collection = require('../../type/collection.js'),

      number = util.number,
      isNumber = util.number.isNumber,
      isCollection = collection.isCollection;

  /**
   * Create a string or convert any object into a string
   * @param {*} [value]
   * @return {String} str
   */
  math.string = function string (value) {
    switch (arguments.length) {
      case 0:
        return '';

      case 1:
        return _toString(value);

      default:
        throw new util.error.ArgumentsError('string', arguments.length, 0, 1);
    }
  };

  /**
   * Recursive toString function
   * @param {*} value  Value can be anything: number, string, array, Matrix, ...
   * @returns {String} str
   * @private
   */
  function _toString(value) {
    if (isCollection(value)) {
      var array = value.valueOf();

      var str = '[';
      var len = array.length;
      for (var i = 0; i < len; i++) {
        if (i != 0) {
          str += ', ';
        }
        str += _toString(array[i]);
      }
      str += ']';
      return str;
    }
    else if (isNumber(value)) {
      return number.format(value);
    }
    else {
      return value.toString();
    }
  }
};
