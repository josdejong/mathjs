'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isString = util.string.isString,
      isNumber = util.number.isNumber;

  /**
   * Create an array from a range.
   * By default, the range end is excluded. This can be customized by providing
   * an extra parameter `includeEnd`.
   *
   * Syntax:
   *
   *     math.range(str [, includeEnd])               // Create a range from a string,
   *                                                  // where the string contains the
   *                                                  // start, optional step, and end,
   *                                                  // separated by a colon.
   *     math.range(start, end [, includeEnd])        // Create a range with start and
   *                                                  // end and a step size of 1.
   *     math.range(start, end, step [, includeEnd])  // Create a range with start, step,
   *                                                  // and end.
   *
   * Where:
   *
   * - `str: String`
   *   A string 'start:end' or 'start:step:end'
   * - `start: {Number | BigNumber}`
   *   Start of the range
   * - `end: Number | BigNumber`
   *   End of the range, excluded by default, included when parameter includeEnd=true
   * - `step: Number | BigNumber`
   *   Step size. Default value is 1.
   * - `includeEnd: boolean`
   *   Option to specify whether to include the end or not. False by default.
   *
   * Examples:
   *
   *     math.range(2, 6);        // [2, 3, 4, 5]
   *     math.range(2, -3, -1);   // [2, 1, 0, -1, -2]
   *     math.range('2:1:6');     // [2, 3, 4, 5]
   *     math.range(2, 6, true);  // [2, 3, 4, 5, 6]
   *
   * See also:
   *
   *     ones, zeros, size, subset
   *
   * @param {*} args   Parameters describing the ranges `start`, `end`, and optional `step`.
   * @return {Array | Matrix} range
   */
  math.range = function range(args) {
    var params = Array.prototype.slice.call(arguments),
        start,
        end,
        step,
        includeEnd = false;

    // read the includeEnd parameter
    if (isBoolean(params[params.length - 1])) {
      includeEnd = params.pop() ? true : false;
    }

    switch (params.length) {
      case 1:
        // range(str)
        // parse string into a range
        if (isString(params[0])) {
          var r = _parse(params[0]);
          if (!r){
            throw new SyntaxError('String "' + params[0] + '" is no valid range');
          }

          start = r.start;
          end = r.end;
          step = r.step;
        }
        else {
          throw new TypeError('Two or three numbers or a single string expected in function range');
        }
        break;

      case 2:
        // range(str, end)
        // range(start, end)
        start = params[0];
        end = params[1];
        step = 1;
        break;

      case 3:
        // range(start, end, step)
        start = params[0];
        end = params[1];
        step = params[2];
        break;

      case 4:
        throw new TypeError('Parameter includeEnd must be a boolean');

      default:
        throw new math.error.ArgumentsError('range', arguments.length, 2, 4);
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
      if (!(start instanceof BigNumber)) start = BigNumber.convert(start);
      if (!(end instanceof BigNumber))   end   = BigNumber.convert(end);
      if (!(step instanceof BigNumber))  step  = BigNumber.convert(step);

      if (!(start instanceof BigNumber) || !(end instanceof BigNumber) || !(step instanceof BigNumber)) {
        // not all values can be converted to big number :(
        // fall back to numbers
        asBigNumber = false;
        if (start instanceof BigNumber) start = start.toNumber();
        if (end instanceof BigNumber)   end   = end.toNumber();
        if (step instanceof BigNumber)  step  = step.toNumber();
      }
    }

    // generate the range
    var fn = asBigNumber ?
        (includeEnd ? _bigRangeInc : _bigRange) :
        (includeEnd ? _rangeInc    : _range);
    var array = fn(start, end, step);

    // return as array or matrix
    return (config.matrix === 'array') ? array : new Matrix(array);
  };

  /**
   * Create a range with numbers. End is excluded
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
   * Create a range with numbers. End is included
   * @param {Number} start
   * @param {Number} end
   * @param {Number} step
   * @returns {Array} range
   * @private
   */
  function _rangeInc (start, end, step) {
    var array = [],
        x = start;
    if (step > 0) {
      while (x <= end) {
        array.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x >= end) {
        array.push(x);
        x += step;
      }
    }

    return array;
  }

  /**
   * Create a range with big numbers. End is excluded
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
   * Create a range with big numbers. End is included
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} step
   * @returns {Array} range
   * @private
   */
  function _bigRangeInc (start, end, step) {
    var array = [],
        x = start.clone(),
        zero = new BigNumber(0);
    if (step.gt(zero)) {
      while (x.lte(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }
    else if (step.lt(zero)) {
      while (x.gte(end)) {
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

    if (config.number === 'bignumber') {
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
        // use Number and not parseFloat as Number returns NaN on invalid garbage in the string
        return Number(arg);
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
