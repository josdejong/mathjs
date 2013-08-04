/**
 * Create a boolean or convert a string or number to a boolean.
 * In case of a number, true is returned for non-zero numbers, and false in
 * case of zero.
 * Strings can be 'true' or 'false', or can contain a number.
 * @param {String | Number | Boolean} value
 * @return {Boolean} bool
 */
math['boolean'] = function (value) {
  if (arguments.length != 1) {
    throw newArgumentsError('boolean', arguments.length, 0, 1);
  }

  if (value === 'true' || value === true) {
    return true;
  }
  else if (value === 'false' || value === false) {
    return false;
  }
  else if (isNumber(value)) {
    return (value !== 0);
  }
  else if (isString(value)) {
    // try case insensitive
    var lcase = value.toLowerCase();
    if (lcase === 'true') {
      return true;
    }
    else if (lcase === 'false') {
      return false;
    }

    // try whether a number
    var num = Number(value);
    if (value != '' && !isNaN(num)) {
      return (num !== 0);
    }
  }

  throw new SyntaxError(value.toString() + ' is no valid boolean');
};
