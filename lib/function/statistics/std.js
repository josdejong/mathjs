module.exports = function (math) {
  /**
   * Compute the standard deviation of a list of values, defined as the
   * square root of the variance: std(A) = sqrt(var(A)).
   * In case of a (multi dimensional) array or matrix, the standard deviation
   * over all elements will be calculated.
   *
   *     std(a, b, c, ...)
   *     std(A)
   *     std(A, normalization)
   *
   * Where `normalization` is a string having one of the following values:
   *
   * @param {Array | Matrix} array                 A single matrix or or multiple scalar values
   * @param {String} [normalization='unbiased']
   *                        Determines how to normalize the standard deviation:
   *                        - 'unbiased' (default) The sum of squared errors is divided by (n - 1)
   *                        - 'uncorrected'        The sum of squared errors is divided by n
   *                        - 'biased'             The sum of squared errors is divided by (n + 1)
   * @return {*} res
   */
  math.std = function std(array, normalization) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function std requires one or more parameters (0 provided)');
    }

    var variance = math['var'].apply(null, arguments);
    return math.sqrt(variance);
  };
};
