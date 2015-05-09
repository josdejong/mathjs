'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../../type/matrix/function/matrix'));
  var divideScalar = load(require('../../arithmetic/divideScalar'));
  var multiply = load(require('../../arithmetic/multiply'));
  var subtract = load(require('../../arithmetic/subtract'));
  var equalScalar = load(require('../../relational/equalScalar'));

  var substitutionValidation = load(require('./substitutionValidation'));

  var SparseMatrix = type.SparseMatrix;
  var DenseMatrix = type.DenseMatrix;

  /** 
   * 
   */
  var permute = typed('permute', {
    
    'Matrix, Array, Array': function (m, p, q) {
      
    },

    'Array, Array | Matrix': function (a, p, q) {
      
    }
  });

  return permute;
}

exports.name = 'permute';
exports.factory = factory;
