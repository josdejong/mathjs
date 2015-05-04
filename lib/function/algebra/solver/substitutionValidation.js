'use strict';

var util = require('../../../util/index');

var string = util.string;
var array = util.array;
var object = util.object;

var isArray = Array.isArray;

function factory (type) {
  
  var Matrix = type.Matrix;
  
  /**
   * Validates matrix and column vector b for backward/forward substitution algorithms.
   *
   * @param {Matrix} m            An N x N matrix
   * @param {Array | Matrix} b    A column vector
   *
   * @return {Array}    Dense copy of column vector b
   */
  var substitutionValidation = function (m, b) {
    // matrix size
    var size = m.size();
    // validate matrix dimensions
    if (size.length !== 2)
      throw new RangeError('Matrix must be two dimensional (size: ' + string.format(size) + ')');
    // rows & columns
    var rows = size[0];
    var columns = size[1];
    // validate rows & columns
    if (rows !== columns) 
      throw new RangeError('Matrix must be square (size: ' + string.format(size) + ')');
    // check b is matrix
    if (b instanceof Matrix) {
      // matrix size
      var msize = b.size();
      // check matrix dimensions, vector
      if (msize.length === 1) {
        // check vector length
        if (msize[0] !== rows)
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
      }
      else if (msize.length === 2) {
        // array must be a column vector
        if (msize[0] !== rows || msize[1] !== 1)
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
      }
      else {
        // throw error
        throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
      }
      // dense copy of column vector
      var x = new Array(rows);
      // copy values (skip zeros)
      b.forEach(function (v, index) {
        x[index[0]] = object.clone(v);
      }, true);
      // return vector
      return x;
    }
    // check b is array
    if (isArray(b)) {
      // size
      var asize = array.size(b);
      // check matrix dimensions, vector
      if (asize.length === 1) {
        // check vector length
        if (asize[0] !== rows)
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
        // return copy of b
        return object.clone(b);
      }
      if (asize.length === 2) {
        // array must be a column vector
        if (asize[0] !== rows || asize[1] !== 1)
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
        // loop rows in array, return copy of column vector
        return b.map(function (v) {
          return object.clone(v[0]);
        });
      }
      // throw error
      throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');      
    }
  };
  
  return substitutionValidation;
}

exports.name = 'substitutionValidation';
exports.factory = factory;