'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../../type/matrix/function/matrix'));

  var SparseMatrix = type.SparseMatrix;
  var DenseMatrix = type.DenseMatrix;

  /** 
   * 
   */
  var permute = typed('permute', {
    
    'Matrix, Array, Array': function (m, p, q) {
      
    },

    'Array, Array, Array': function (a, p, q) {
      // use matrix implementation
      return permute(matrix(a, p, q).valueOf();
    }
  });

  return permute;
}

exports.name = 'permute';
exports.factory = factory;
