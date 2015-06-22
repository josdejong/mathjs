'use strict';

var isArray = Array.isArray;

/**
 * Attach a transform function to math.index
 * Adds a property transform containing the transform function.
 *
 * This transform creates a one-based index instead of a zero-based index
 */
function factory (type, config, load) {
  var indexFactory = load(require('../../type/index/function/index'));

  indexFactory.transform = function () {
    var args = [];
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var arg = arguments[i];

      // change from one-based to zero based, and convert BigNumber to number
      if (arg && arg.isRange === true) {
        arg.start--;
        arg.end -= (arg.step > 0 ? 0 : 2);
      }
      else if (arg && arg.isSet === true) {
        arg = arg.map(function (v) { return v - 1; });
      }
      else if (arg && (arg.isArray === true || arg.isMatrix)) {
        arg = arg.map(function (v) { return v - 1; });
      }
      else if (typeof arg === 'number') {
        arg--;
      }
      else if (arg && arg.isBigNumber === true) {
        arg = arg.toNumber() - 1;
      }
      else {
        throw new TypeError('Ranges must be a Number, Range, Array or Matrix');
      }

      args[i] = arg;
    }

    var res = new type.Index();
    type.Index.apply(res, args);
    return res;
  };

  return indexFactory.transform;
}

exports.factory = factory;

