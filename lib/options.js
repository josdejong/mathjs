// math.js options
exports.format = {
  precision: 5   // number of digits in formatted output
};

exports.matrix = {
  'defaultType': 'matrix' // type of default matrix output. Choose 'array' or 'matrix' (default)
};

// TODO: change options to properties with getters to validate the input value

// TODO: remove deprecated options some day (deprecated since version 0.15.0)
if (Object.defineProperty) {
  var fnPrecision = function () {
    throw new Error('Option math.options.precision is deprecated. ' +
        'Use math.options.format.precision instead.')
  };

  Object.defineProperty(exports, 'precision', {
    get: fnPrecision,
    set: fnPrecision,
    enumerable: false,
    configurable: false
  });

  var fnDefault = function () {
    throw new Error('Option math.options.matrix.default is deprecated. ' +
        'Use math.options.matrix.defaultType instead.')
  };

  Object.defineProperty(exports.matrix, 'default', {
    get: fnDefault,
    set: fnDefault,
    enumerable: false,
    configurable: false
  });
}