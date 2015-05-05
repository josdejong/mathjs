// utility methods for arrays and matrices
'use strict';

var util = require('../../util/index');
var arraySize = require('../../util/array').size;
var IndexError = require('../../error/IndexError');
var DimensionError = require('../../error/DimensionError');

function factory (type, config, load, typed) {
  var matrix = load(require('./function/matrix'));

  var collection = {};

  /**
   * Test whether a value is a collection: an Array or Matrix
   * @param {*} x
   * @returns {boolean} isCollection
   */
  collection.isCollection = function(x) {
    return (Array.isArray(x) || (x instanceof type.Matrix));
  };

  /**
   * Execute the callback function element wise for each element in array and any
   * nested array
   * Returns an array with the results
   * @param {Array | Matrix} array
   * @param {function} callback   The callback is called with two parameters:
   *                              value1 and value2, which contain the current
   *                              element of both arrays.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {Array | Matrix} res
   */
  collection.deepMap = function deepMap(array, callback, skipZeros) {
    if (array && (typeof array.map === 'function')) {
      // TODO: replace array.map with a for loop to improve performance
      return array.map(function (x) {
        return deepMap(x, callback, skipZeros);
      });
    }
    else {
      return callback(array);
    }
  };

  /**
   * Execute the callback function element wise for each entry in two given arrays,
   * and for any nested array. Objects can also be scalar objects.
   * Returns an array with the results.
   * @param {Array | Matrix | Object} array1
   * @param {Array | Matrix | Object} array2
   * @param {function} callback   The callback is called with two parameters:
   *                              value1 and value2, which contain the current
   *                              element of both arrays.
   * @return {Array | Matrix} res
   */
  collection.deepMap2 = function deepMap2(array1, array2, callback) {
    var res, len, i;

    if (Array.isArray(array1)) {
      if (Array.isArray(array2)) {
        // callback(array, array)
        if (array1.length != array2.length) {
          throw new DimensionError(array1.length, array2.length);
        }

        res = [];
        len = array1.length;
        for (i = 0; i < len; i++) {
          res[i] = deepMap2(array1[i], array2[i], callback);
        }
      }
      else if (array2 instanceof type.Matrix) {
        // callback(array, matrix)
        res = deepMap2(array1, array2.valueOf(), callback);
        return matrix(res);
      }
      else {
        // callback(array, object)
        res = [];
        len = array1.length;
        for (i = 0; i < len; i++) {
          res[i] = deepMap2(array1[i], array2, callback);
        }
      }
    }
    else if (array1 instanceof type.Matrix) {
      if (array2 instanceof type.Matrix) {
        // callback(matrix, matrix)
        res = deepMap2(array1.valueOf(), array2.valueOf(), callback);
        return matrix(res);
      }
      else {
        // callback(matrix, array)
        // callback(matrix, object)
        res = deepMap2(array1.valueOf(), array2, callback);
        return matrix(res);
      }
    }
    else {
      if (Array.isArray(array2)) {
        // callback(object, array)
        res = [];
        len = array2.length;
        for (i = 0; i < len; i++) {
          res[i] = deepMap2(array1, array2[i], callback);
        }
      }
      else if (array2 instanceof type.Matrix) {
        // callback(object, matrix)
        res = deepMap2(array1, array2.valueOf(), callback);
        return matrix(res);
      }
      else {
        // callback(object, object)
        res = callback(array1, array2);
      }
    }

    return res;
  };

  /**
   * Reduce a given matrix or array to a new matrix or
   * array with one less dimension, applying the given
   * callback in the selected dimension.
   * @param {Array | Matrix} mat
   * @param {Number} dim
   * @param {function} callback
   * @return {Array | Matrix} res
   */
  collection.reduce = function(mat, dim, callback) {
    var size = Array.isArray(mat) ? arraySize(mat) : mat.size();
    if (dim < 0) {
      // TODO: would be more clear when throwing a DimensionError here
      throw new IndexError(dim);
    }
    if (dim >= size.length) {
      // TODO: would be more clear when throwing a DimensionError here
      throw new IndexError(dim, size.length);
    }

      if (mat instanceof type.Matrix) {
          return matrix(_reduce(mat.valueOf(), dim, callback));
      }else {
          return _reduce(mat, dim, callback);
      }
  };

  /**
   * Recursively reduce a matrix
   * @param {Array} mat
   * @param {Number} dim
   * @param {Function} callback
   * @returns {Array} ret
   * @private
   */
  function _reduce(mat, dim, callback){
    var i, ret, val, tran;

      if(dim<=0){
          if( !Array.isArray(mat[0]) ){
              val = mat[0];
              for(i=1; i<mat.length; i++){
                  val = callback(val, mat[i]);
              }
              return val;
          }else{
              tran = _switch(mat);
              ret = [];
              for(i=0; i<tran.length; i++){
                  ret[i] = _reduce(tran[i], dim-1, callback);
              }
              return ret;
          }
      }else{
          ret = [];
          for(i=0; i<mat.length; i++){
              ret[i] = _reduce(mat[i], dim-1, callback);
          }
          return ret;
      }
  }

  /**
   * Transpose a matrix
   * @param {Array} mat
   * @returns {Array} ret
   * @private
   */
  function _switch(mat){
    var I = mat.length;
    var J = mat[0].length;
    var i, j;
    var ret = [];
    for( j=0; j<J; j++) {
      var tmp = [];
      for( i=0; i<I; i++) {
        tmp.push(mat[i][j]);
      }
      ret.push(tmp);
    }
    return ret;
  }

  /**
   * Recursively loop over all elements in a given multi dimensional array
   * and invoke the callback on each of the elements.
   * @param {Array | Matrix} array
   * @param {function} callback     The callback method is invoked with one
   *                                parameter: the current element in the array
   */
  collection.deepForEach = function deepForEach (array, callback) {
    if (array instanceof type.Matrix) {
      array = array.valueOf();
    }

    for (var i = 0, ii = array.length; i < ii; i++) {
      var value = array[i];

      if (Array.isArray(value)) {
        deepForEach(value, callback);
      }
      else {
        callback(value);
      }
    }
  };
  
  return collection;
}

exports.name = 'collection';
exports.factory = factory;
