var DimensionError = require('../../error/DimensionError');
var IndexError = require('../../error/IndexError');

/**
 * Transform zero-based indices to one-based indices in errors
 * @param {Error} err
 * @returns {Error} Returns the transformed error
 */
exports.transform = function (err) {
  if (err instanceof IndexError) {
    return new IndexError(err.index + 1, err.min + 1, err.max + 1);
  }

  return err;
};
