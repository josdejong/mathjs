'use strict'

const isMatrix = require('./isMatrix')

/**
 * Apply function that takes an array and returns a scalar to all arrays on a specific
 * axis of a multi dimensional array
 * @param {Array | Matrix} array
 * @param {Function} callback     The callback method is invoked with one
 *                                parameter: the current element in the array
 * @param {number | BigNumber} axis
 */
module.exports = function apply (array, callback, axis) {
  if (isMatrix(array)) {
    array = array.valueOf()
  }

  var array_depth = 
  for (let i = 0, ii = array.length; i < ii; i++) {
    const value = array[i]

    if (Array.isArray(value)) {
      apply(value, callback)
    } else {
      callback(value)
    }
  }
}
