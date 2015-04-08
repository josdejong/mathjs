'use strict';

function factory (type, config, load, typed) {

  /**
   * Create a Vector. The function creates a new `math.type.Vector` object from
   * an `Array`. A Vector has utility functions to manipulate the data in the
   * vector, like getting the size and getting or setting values in the vector.
   *
   * Syntax:
   *
   *    math.vector()               // creates an empty vector using the default storage format.
   *    math.vector(data)           // creates a vector with initial data using the default storage format.
   *    math.vector('dense')        // creates an empty vector using the dense storage format.
   *    math.vector(data, 'dense')  // creates a vector with initial data using the dense storage format.
   *
   * Examples:
   *
   *    var v = math.vector([1, 2, 3, 4]);
   *    v.size();                        // Number 4
   *    v.valueOf();                     // Array [1, 2, 3, 4]
   *    v.get(1)                         // Number 2
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit
   *
   * @param {Array | Matrix | Vector} [data]    One dimensional array, matrix or vector
   * @param {string} [format]                   The Vector storage format
   *
   * @return {Vector} The created vector
   */
  var vector = typed('vector', {
    '': function () {
      return _create([]);
    },
    
    'string': function (format) {
      return _create([], format);
    },

    'Array': function (data) {
      return _create(data);
    },

    'Matrix': function (data) {
      return _create(data);
    },
    
    'Vector': function (data) {
      return _create(data, data.storage());
    },
    
    'Array | Matrix | Vector, string': _create
  });

  /**
   * Create a new Matrix with given storage format
   * @param {Array} data
   * @param {string} [format]
   * @returns {Matrix} Returns a new Matrix
   * @private
   */
  function _create(data, format) {
    // get storage format constructor
    var V = type.Vector.storage(format || 'default');

    // create instance
    return new V(data);
  }
  
  return vector;
}

exports.name = 'vector';
exports.factory = factory;
