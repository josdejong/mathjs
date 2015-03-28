'use strict';

var string = require('../../util/string');

var isArray = Array.isArray;
var isString = string.isString;

module.exports = function (math) {
  var Matrix = math.type.Matrix;

  /**
   * Create a Matrix. The function creates a new `math.type.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   *
   * Syntax:
   *
   *    math.matrix()               // creates an empty matrix using default storage format (dense).
   *    math.matrix(data)           // creates a matrix with initial data using default storage format (dense).
   *    math.matrix('dense')        // creates an empty matrix using the given storage format.
   *    math.matrix(data, 'dense')  // creates a matrix with initial data using the given storage format.
   *
   * Examples:
   *
   *    var m = math.matrix([[1, 2], [3, 4]]);
   *    m.size();                        // Array [2, 2]
   *    m.resize([3, 2], 5);
   *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @param {string} [format]          The Matrix storage format
   *
   * @return {Matrix} The created matrix
   */
  math.matrix = function matrix(data, format) {
    // check arguments
    switch (arguments.length) {
      case 0:
        // set data and format
        data = [];
        format = 'default';
        break;
      case 1:
        // check data was provided
        if (isArray(data)) {
          // use default format
          format = 'default';          
        }
        else if (data instanceof Matrix) {
          // same format as matrix
          format = data.storage();
        }
        else if (isString(data)) {
          // set format
          format = data;
          // empty array
          data = [];
        }
        break;
      case 2:
        // check data is an array
        if (!isArray(data) && !(data instanceof Matrix)) {
          // throw
          throw new TypeError('data must be an array value or Matrix instance');
        }
        break;
      default:
        throw new math.error.ArgumentsError('matrix', arguments.length, 0, 2);  
    }

    // get storage format constructor
    var constructor = Matrix.storage(format);

    // create instance
    return new constructor(data);
  };
};
