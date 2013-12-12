module.exports = function (math, settings) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isString = util.string.isString,
      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber;

  /**
   * Create an array from a range.
   *
   * The method accepts the following arguments
   *     range(str)                   Create a range from a string, where the
   *                                  string contains the start, optional step,
   *                                  and end, separated by a colon.
   *     range(start, end)            Create a range with start and end and a
   *                                  default step size of 1
   *     range(start, end, step)      Create a range with start, step, and end.
   *
   * Example usage:
   *     math.range(2, 6);        // [2,3,4,5]
   *     math.range(2, -3, -1);   // [2,1,0,-1,-2]
   *     math.range('2:1:6');     // [2,3,4,5]
   *
   * @param {...*} args
   * @return {Array | Matrix} range
   */
  math.range = function range(args) {
    var start, end, step;

    switch (arguments.length) {
      case 1:
        // parse string into a range
        if (isString(args)) {
          var r = _parse(args);
          if (!r){
            throw new SyntaxError('String "' + r + '" is no valid range');
          }

          start = r.start;
          end = r.end;
          step = r.step;
        }
        else {
          throw new TypeError(
              'Two or three numbers or a single string expected in function range');
        }
        break;

      case 2:
        // range(start, end)
        start = arguments[0];
        end = arguments[1];
        step = 1;
        break;

      case 3:
        // range(start, end, step)
        start = arguments[0];
        end = arguments[1];
        step = arguments[2];
        break;

      default:
        throw new math.error.ArgumentsError('range', arguments.length, 2, 3);
    }

    // verify type of parameters
    if (!isNumber(start) && !(start instanceof BigNumber)) {
      throw new TypeError('Parameter start must be a number');
    }
    if (!isNumber(end) && !(end instanceof BigNumber)) {
      throw new TypeError('Parameter end must be a number');
    }
    if (!isNumber(step) && !(step instanceof BigNumber)) {
      throw new TypeError('Parameter step must be a number');
    }

    // go big
    if (start instanceof BigNumber || end instanceof BigNumber || step instanceof BigNumber) {
      // create a range with big numbers
      var asBigNumber = true;

      // convert start, end, step to BigNumber
      if (!(start instanceof BigNumber)) {
        start = toBigNumber(start);
      }
      if (!(end instanceof BigNumber)) {
        end = toBigNumber(end);
      }
      if (!(step instanceof BigNumber)) {
        step = toBigNumber(step);
      }

      if (!(start instanceof BigNumber) || !(end instanceof BigNumber) || !(step instanceof BigNumber)) {
        // not all values can be converted to big number :(
        // fall back to numbers
        asBigNumber = false;
        start = toNumber(start);
        end   = toNumber(end);
        step  = toNumber(step);
      }
    }

    // generate the range
    var array = asBigNumber ? _bigRange(start, end, step) : _range(start, end, step);

    // return as array or matrix
    return (settings.matrix === 'array') ? array : new Matrix(array);
  };

  /**
   * Create a range with numbers
   * @param {Number} start
   * @param {Number} end
   * @param {Number} step
   * @returns {Array} range
   * @private
   */
  function _range (start, end, step) {
    var array = [],
        x = start;
    if (step > 0) {
      while (x < end) {
        array.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x > end) {
        array.push(x);
        x += step;
      }
    }

    return array;
  }

  /**
   * Create a range with big numbers
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} step
   * @returns {Array} range
   * @private
   */
  function _bigRange (start, end, step) {
    var array = [],
        x = start.clone(),
        zero = new BigNumber(0);
    if (step.gt(zero)) {
      while (x.lt(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }
    else if (step.lt(zero)) {
      while (x.gt(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }

    return array;
  }

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @param {String} str
   * @return {Object | null} range Object containing properties start, end, step
   * @private
   */
  function _parse (str) {
    var args = str.split(':'),
        nums = null;

    if (settings.number === 'bignumber') {
      // bignumber
      try {
        nums = args.map(function (arg) {
          return new BigNumber(arg);
        });
      }
      catch (err) {
        return null;
      }
    }
    else {
      // number
      nums = args.map(function (arg) {
        return parseFloat(arg);
      });

      var invalid = nums.some(function (num) {
        return isNaN(num);
      });
      if(invalid) {
        return null;
      }
    }

    switch (nums.length) {
      case 2:
        return {
          start: nums[0],
          end: nums[1],
          step: 1
        };

      case 3:
        return {
          start: nums[0],
          end: nums[2],
          step: nums[1]
        };

      default:
        return null;
    }
  }

};
