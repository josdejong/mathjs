'use strict';

var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  /**
   * Create a 2-dimensional identity matrix with size m x n or n x n.
   * The matrix has ones on the diagonal and zeros elsewhere.
   *
   * Syntax:
   *
   *    math.eye(n)
   *    math.eye(m, n)
   *    math.eye([m, n])
   *
   * Examples:
   *
   *    math.eye(3);                    // returns [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
   *    math.eye(3, 2);                 // returns [[1, 0], [0, 1], [0, 0]]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.eye(math.size(b));         // returns [[1, 0, 0], [0, 1, 0]]
   *
   * See also:
   *
   *    diag, ones, zeros, size, range
   *
   * @param {...Number | Matrix | Array} size   The size for the matrix
   * @return {Matrix | Array | Number} A matrix with ones on the diagonal.
   */
  return typed('eye', {
    '': function () {
      return (config.matrix === 'matrix') ? new type.Matrix([]) : [];
    },

    'number | BigNumber': function (rows) {
      var matrix = _eye(rows, rows);
      return (config.matrix === 'matrix') ? matrix : matrix.valueOf();
    },

    'number | BigNumber, number | BigNumber': function (rows, cols) {
      var matrix = _eye(rows, cols);
      return (config.matrix === 'matrix') ? matrix : matrix.valueOf();
    },

    'Array':  function (size) {
      return _eyeVector(size).valueOf();
    },

    'Matrix': function (size) {
      return _eyeVector(size.valueOf());
    }
  });

  function _eyeVector (size) {
    switch (size.length) {
      case 0: return (config.matrix === 'matrix') ? new type.Matrix([]) : [];
      case 1: return _eye(size[0], size[0]);
      case 2: return _eye(size[0], size[1]);
      default: throw new Error('Vector containing two values expected');
    }
  }

  /**
   * Create an identity matrix
   * @param {number | BigNumber} rows
   * @param {number | BigNumber} cols
   * @returns {Matrix}
   * @private
   */
  function _eye (rows, cols) {
    // BigNumber constructor with the right precision
    var Big = rows instanceof type.BigNumber ? rows.constructor :
        cols instanceof type.BigNumber ? cols.constructor : null;

    if (rows instanceof type.BigNumber) rows = rows.toNumber();
    if (cols instanceof type.BigNumber) cols = cols.toNumber();

    if (!isInteger(rows) || rows < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }
    if (!isInteger(cols) || cols < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }

    // create the matrix
    var matrix = new type.Matrix();
    var one = Big ? new type.BigNumber(1) : 1;
    var defaultValue = Big ? new Big(0) : 0;
    matrix.resize([rows, cols], defaultValue);

    // fill in ones on the diagonal
    var minimum = Math.min(rows, cols);
    var data = matrix.valueOf();
    for (var d = 0; d < minimum; d++) {
      data[d][d] = one;
    }

    return matrix;
  }
}

exports.type = 'function';
exports.name = 'eye';
exports.factory = factory;
