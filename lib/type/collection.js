// utility methods for arrays and matrices

var util = require('../util/index'),

    Matrix = require('./Matrix'),

    isArray = util.array.isArray,
    isString = util.string.isString;

/**
 * Convert function arguments to an array. Arguments can have the following
 * signature:
 *     fn()
 *     fn(n)
 *     fn(m, n, p, ...)
 *     fn([m, n, p, ...])
 * @param {...Number | Array | Matrix} args
 * @returns {Array} array
 */
exports.argsToArray = function argsToArray(args) {
  var array;
  if (args.length == 0) {
    // fn()
    array = [];
  }
  else if (args.length == 1) {
    // fn(n)
    // fn([m, n, p, ...])
    array = args[0];
    if (array instanceof Matrix) {
      array = array.valueOf();
    }
    if (!isArray(array)) {
      array = [array];
    }
  }
  else {
    // fn(m, n, p, ...)
    array = Array.prototype.slice.apply(args);
  }
  return array;
};


/**
 * Test whether a value is a collection: an Array or Matrix
 * @param {*} x
 * @returns {boolean} isCollection
 */
exports.isCollection = function isCollection (x) {
  return (isArray(x) || (x instanceof Matrix));
};

/**
 * Execute the callback function element wise for each element in array and any
 * nested array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @return {Array | Matrix} res
 */
exports.deepMap = function deepMap(array, callback) {
  if (array && (typeof array.map === 'function')) {
    return array.map(function (x) {
      return deepMap(x, callback);
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
exports.deepMap2 = function deepMap2(array1, array2, callback) {
  var res, len, i;

  if (isArray(array1)) {
    if (isArray(array2)) {
      // callback(array, array)
      if (array1.length != array2.length) {
        throw new RangeError('Dimension mismatch ' +
            '(' +  array1.length + ' != ' + array2.length + ')');
      }

      res = [];
      len = array1.length;
      for (i = 0; i < len; i++) {
        res[i] = deepMap2(array1[i], array2[i], callback);
      }
    }
    else if (array2 instanceof Matrix) {
      // callback(array, matrix)
      res = deepMap2(array1, array2.valueOf(), callback);
      return new Matrix(res);
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
  else if (array1 instanceof Matrix) {
    if (array2 instanceof Matrix) {
      // callback(matrix, matrix)
      res = deepMap2(array1.valueOf(), array2.valueOf(), callback);
      return new Matrix(res);
    }
    else {
      // callback(matrix, array)
      // callback(matrix, object)
      res = deepMap2(array1.valueOf(), array2, callback);
      return new Matrix(res);
    }
  }
  else {
    if (isArray(array2)) {
      // callback(object, array)
      res = [];
      len = array2.length;
      for (i = 0; i < len; i++) {
        res[i] = deepMap2(array1, array2[i], callback);
      }
    }
    else if (array2 instanceof Matrix) {
      // callback(object, matrix)
      res = deepMap2(array1, array2.valueOf(), callback);
      return new Matrix(res);
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
 * array with one less dimension, aplying the given
 * callback in the selected dimension.
 * @param {Array | Matrix} mat
 * @param {Number} dim
 * @param {function} callback
 * @return {Array | Matrix} res
 */
exports.reduce = function reduce (mat, dim, callback) {
	if (mat instanceof Matrix) {
		return new Matrix(_reduce(mat.valueOf(), dim, callback));
	}else {
		return _reduce(mat, dim, callback);
	}
};

/**
 * Reduce a given matrix aplying a function to a given
 * dimension of it. Very similar to reduce.
 * @param {Array | Matrix} mat
 * @param {Number} dim
 * @param {function} callback
 * @return {Array | Matrix} res
 */
exports.deepApply = function deepApply (mat, dim, callback) {
  if (mat instanceof Matrix) {
    return new Matrix(_deepApply(mat.valueOf(), dim, callback));
  }else {
    return _deepApply(mat, dim, callback);
  }
};



/**
 * Apply a function to an specific dimension of a matrix
 * @param {Array} mat
 * @param {Number} dim
 * @param {Function} callback
 * @returns {Array} ret
 * @private
 */
function _deepApply(mat, dim, callback){
  var i, ret, val, tran;

	if(dim<=0){
		if( !isArray(mat[0]) ){
      return callback(mat);
		}else{
			tran = _switch(mat);
			ret = [];
			for(i=0; i<tran.length; i++){
				ret[i] = _deepApply(tran[i], dim-1, callback);
			}
			return ret
		}
	}else{
		ret = [];
		for(i=0; i<mat.length; i++){
			ret[i] = _deepApply(mat[i], dim-1, callback);
		}
		return ret;
	}
}

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
		if( !isArray(mat[0]) ){
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
			return ret
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
exports.deepForEach = function deepForEach (array, callback) {
  if (array instanceof Matrix) {
    array = array.valueOf();
  }

  for (var i = 0, ii = array.length; i < ii; i++) {
    var value = array[i];

    if (isArray(value)) {
      deepForEach(value, callback);
    }
    else {
      callback(value);
    }
  }
};
