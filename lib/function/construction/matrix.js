'use strict';

var string = require('../../util/string'),

    isString = string.isString;

module.exports = function (math) {

  var Matrix = math.type.Matrix;

  var _createStorage = function (data, format) {
    // check data is an array
    if (isArray(data)) {
      // format to use
      format = format || 'default';
      // check format
      if (!isString(format))
        throw new TypeError('format must be a string value');
      // get format constructor
      var f = Matrix.format[format];
      if (!f)
        throw new SyntaxError('Unsupported Matrix Storage Format: ' + format);
      // create instance
      return new f(data);
    }
    // check it is a storage json representation
    if (typeof data === 'object' && isString(data.format)) {
      // get format constructor
      var f = Matrix.format[data.format];
      if (!f)
        throw new SyntaxError('Unsupported Matrix Storage Format: ' + data.format);
      // deserialize json
      return f.fromJSON(data);
    }
    throw new SyntaxError('Unsupported data structure');
  };
  
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
   * @return {Matrix} The created matrix
   */
  math.matrix = function matrix(data, format) {
    if (arguments.length > 2) {
      throw new math.error.ArgumentsError('matrix', arguments.length, 0, 2);
    }
    // format to use
    format = format || 'default';
    // check format
    if (!isString(format))
      throw new TypeError('format must be a string value');
    // get format constructor
    var f = Matrix.format[format];
    if (!f)
      throw new SyntaxError('Unsupported Matrix Storage Format: ' + format);
    // create instance
    return new f(data);
  };
};
