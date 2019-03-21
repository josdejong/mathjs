'use strict'

const util = require('../../utils/index')
const DimensionError = require('../../error/DimensionError')

const string = util.string
const array = util.array
const object = util.object
const number = util.number

const isArray = Array.isArray
const isNumber = number.isNumber
const isInteger = number.isInteger
const isString = string.isString

const validateIndex = array.validateIndex

function factory (type, config, load, typed) {
  const getArrayDataType = load(require('./utils/getArrayDataType'))
  const Matrix = load(require('./Matrix')) // force loading Matrix (do not use via type.Matrix)

  /**
   * Dense Matrix implementation. A regular, dense matrix, supporting multi-dimensional matrices. This is the default matrix type.
   * @class DenseMatrix
   */
  function DenseMatrix (data, datatype) {
    if (!(this instanceof DenseMatrix)) { throw new SyntaxError('Constructor must be called with the new operator') }
    if (datatype && !isString(datatype)) { throw new Error('Invalid datatype: ' + datatype) }

    if (type.isMatrix(data)) {
      // check data is a DenseMatrix
      if (data.type === 'DenseMatrix') {
        // clone data & size
        this._data = object.clone(data._data)
        this._size = object.clone(data._size)
        this._datatype = datatype || data._datatype
      } else {
        // build data from existing matrix
        this._data = data.toArray()
        this._size = data.size()
        this._datatype = datatype || data._datatype
      }
    } else if (data && isArray(data.data) && isArray(data.size)) {
      // initialize fields from JSON representation
      this._data = data.data
      this._size = data.size
      this._datatype = datatype || data.datatype
    } else if (isArray(data)) {
      // replace nested Matrices with Arrays
      this._data = preprocess(data)
      // get the dimensions of the array
      this._size = array.size(this._data)
      // verify the dimensions of the array, TODO: compute size while processing array
      array.validate(this._data, this._size)
      // data type unknown
      this._datatype = datatype
    } else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')')
    } else {
      // nothing provided
      this._data = []
      this._size = [0]
      this._datatype = datatype
    }
  }

  DenseMatrix.prototype = new Matrix()

  /**
   * Attach type information
   */
  DenseMatrix.prototype.type = 'DenseMatrix'
  DenseMatrix.prototype.isDenseMatrix = true

  /**
   * Get the matrix type
   *
   * Usage:
   *    const matrixType = matrix.getDataType()  // retrieves the matrix type
   *
   * @memberOf DenseMatrix
   * @return {string}   type information; if multiple types are found from the Matrix, it will return "mixed"
   */
  DenseMatrix.prototype.getDataType = function () {
    return getArrayDataType(this._data)
  }

  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     const format = matrix.storage()  // retrieve storage format
   *
   * @memberof DenseMatrix
   * @return {string}           The storage format.
   */
  DenseMatrix.prototype.storage = function () {
    return 'dense'
  }

  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     const format = matrix.datatype()   // retrieve matrix datatype
   *
   * @memberof DenseMatrix
   * @return {string}           The datatype.
   */
  DenseMatrix.prototype.datatype = function () {
    return this._datatype
  }

  /**
   * Create a new DenseMatrix
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {string} [datatype]
   */
  DenseMatrix.prototype.create = function (data, datatype) {
    return new DenseMatrix(data, datatype)
  }

  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     const subset = matrix.subset(index)               // retrieve subset
   *     const value = matrix.subset(index, replacement)   // replace subset
   *
   * @memberof DenseMatrix
   * @param {Index} index
   * @param {Array | Matrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  DenseMatrix.prototype.subset = function (index, replacement, defaultValue) {
    switch (arguments.length) {
      case 1:
        return _get(this, index)

        // intentional fall through
      case 2:
      case 3:
        return _set(this, index, replacement, defaultValue)

      default:
        throw new SyntaxError('Wrong number of arguments')
    }
  }

  /**
   * Get a single element from the matrix.
   * @memberof DenseMatrix
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */
  DenseMatrix.prototype.get = function (index) {
    if (!isArray(index)) { throw new TypeError('Array expected') }
    if (index.length !== this._size.length) { throw new DimensionError(index.length, this._size.length) }

    // check index
    for (let x = 0; x < index.length; x++) { validateIndex(index[x], this._size[x]) }

    let data = this._data
    for (let i = 0, ii = index.length; i < ii; i++) {
      const indexI = index[i]
      validateIndex(indexI, data.length)
      data = data[indexI]
    }

    return data
  }

  /**
   * Replace a single element in the matrix.
   * @memberof DenseMatrix
   * @param {number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be left undefined.
   * @return {DenseMatrix} self
   */
  DenseMatrix.prototype.set = function (index, value, defaultValue) {
    if (!isArray(index)) { throw new TypeError('Array expected') }
    if (index.length < this._size.length) { throw new DimensionError(index.length, this._size.length, '<') }

    let i, ii, indexI

    // enlarge matrix when needed
    const size = index.map(function (i) {
      return i + 1
    })
    _fit(this, size, defaultValue)

    // traverse over the dimensions
    let data = this._data
    for (i = 0, ii = index.length - 1; i < ii; i++) {
      indexI = index[i]
      validateIndex(indexI, data.length)
      data = data[indexI]
    }

    // set new value
    indexI = index[index.length - 1]
    validateIndex(indexI, data.length)
    data[indexI] = value

    return this
  }

  /**
   * Get a submatrix of this matrix
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix
   * @param {Index} index   Zero-based index
   * @private
   */
  function _get (matrix, index) {
    if (!type.isIndex(index)) {
      throw new TypeError('Invalid index')
    }

    const isScalar = index.isScalar()
    if (isScalar) {
      // return a scalar
      return matrix.get(index.min())
    } else {
      // validate dimensions
      const size = index.size()
      if (size.length !== matrix._size.length) {
        throw new DimensionError(size.length, matrix._size.length)
      }

      // validate if any of the ranges in the index is out of range
      const min = index.min()
      const max = index.max()
      for (let i = 0, ii = matrix._size.length; i < ii; i++) {
        validateIndex(min[i], matrix._size[i])
        validateIndex(max[i], matrix._size[i])
      }

      // retrieve submatrix
      // TODO: more efficient when creating an empty matrix and setting _data and _size manually
      return new DenseMatrix(_getSubmatrix(matrix._data, index, size.length, 0), matrix._datatype)
    }
  }

  /**
   * Recursively get a submatrix of a multi dimensional matrix.
   * Index is not checked for correct number or length of dimensions.
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {Index} index
   * @param {number} dims   Total number of dimensions
   * @param {number} dim    Current dimension
   * @return {Array} submatrix
   * @private
   */
  function _getSubmatrix (data, index, dims, dim) {
    const last = (dim === dims - 1)
    const range = index.dimension(dim)

    if (last) {
      return range.map(function (i) {
        validateIndex(i, data.length)
        return data[i]
      }).valueOf()
    } else {
      return range.map(function (i) {
        validateIndex(i, data.length)
        const child = data[i]
        return _getSubmatrix(child, index, dims, dim + 1)
      }).valueOf()
    }
  }

  /**
   * Replace a submatrix in this matrix
   * Indexes are zero-based.
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix
   * @param {Index} index
   * @param {DenseMatrix | Array | *} submatrix
   * @param {*} defaultValue          Default value, filled in on new entries when
   *                                  the matrix is resized.
   * @return {DenseMatrix} matrix
   * @private
   */
  function _set (matrix, index, submatrix, defaultValue) {
    if (!index || index.isIndex !== true) {
      throw new TypeError('Invalid index')
    }

    // get index size and check whether the index contains a single value
    const iSize = index.size()
    const isScalar = index.isScalar()

    // calculate the size of the submatrix, and convert it into an Array if needed
    let sSize
    if (type.isMatrix(submatrix)) {
      sSize = submatrix.size()
      submatrix = submatrix.valueOf()
    } else {
      sSize = array.size(submatrix)
    }

    if (isScalar) {
      // set a scalar

      // check whether submatrix is a scalar
      if (sSize.length !== 0) {
        throw new TypeError('Scalar expected')
      }

      matrix.set(index.min(), submatrix, defaultValue)
    } else {
      // set a submatrix

      // validate dimensions
      if (iSize.length < matrix._size.length) {
        throw new DimensionError(iSize.length, matrix._size.length, '<')
      }

      if (sSize.length < iSize.length) {
        // calculate number of missing outer dimensions
        let i = 0
        let outer = 0
        while (iSize[i] === 1 && sSize[i] === 1) {
          i++
        }
        while (iSize[i] === 1) {
          outer++
          i++
        }

        // unsqueeze both outer and inner dimensions
        submatrix = array.unsqueeze(submatrix, iSize.length, outer, sSize)
      }

      // check whether the size of the submatrix matches the index size
      if (!object.deepEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, '>')
      }

      // enlarge matrix when needed
      const size = index.max().map(function (i) {
        return i + 1
      })
      _fit(matrix, size, defaultValue)

      // insert the sub matrix
      const dims = iSize.length
      const dim = 0
      _setSubmatrix(matrix._data, index, submatrix, dims, dim)
    }

    return matrix
  }

  /**
   * Replace a submatrix of a multi dimensional matrix.
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {Index} index
   * @param {Array} submatrix
   * @param {number} dims   Total number of dimensions
   * @param {number} dim
   * @private
   */
  function _setSubmatrix (data, index, submatrix, dims, dim) {
    const last = (dim === dims - 1)
    const range = index.dimension(dim)

    if (last) {
      range.forEach(function (dataIndex, subIndex) {
        validateIndex(dataIndex)
        data[dataIndex] = submatrix[subIndex[0]]
      })
    } else {
      range.forEach(function (dataIndex, subIndex) {
        validateIndex(dataIndex)
        _setSubmatrix(data[dataIndex], index, submatrix[subIndex[0]], dims, dim + 1)
      })
    }
  }

  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @memberof DenseMatrix
   * @param {number[]} size           The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  DenseMatrix.prototype.resize = function (size, defaultValue, copy) {
    // validate arguments
    if (!isArray(size)) { throw new TypeError('Array expected') }

    // matrix to resize
    const m = copy ? this.clone() : this
    // resize matrix
    return _resize(m, size, defaultValue)
  }

  function _resize (matrix, size, defaultValue) {
    // check size
    if (size.length === 0) {
      // first value in matrix
      let v = matrix._data
      // go deep
      while (isArray(v)) {
        v = v[0]
      }
      return v
    }
    // resize matrix
    matrix._size = size.slice(0) // copy the array
    matrix._data = array.resize(matrix._data, matrix._size, defaultValue)
    // return matrix
    return matrix
  }

  /**
   * Reshape the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (reshape in place).
   *
   * NOTE: This might be better suited to copy by default, instead of modifying
   *       in place. For now, it operates in place to remain consistent with
   *       resize().
   *
   * @memberof DenseMatrix
   * @param {number[]} size           The new size the matrix should have.
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */
  DenseMatrix.prototype.reshape = function (size, copy) {
    const m = copy ? this.clone() : this

    m._data = array.reshape(m._data, size)
    m._size = size.slice(0)
    return m
  }

  /**
   * Enlarge the matrix when it is smaller than given size.
   * If the matrix is larger or equal sized, nothing is done.
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix           The matrix to be resized
   * @param {number[]} size
   * @param {*} defaultValue          Default value, filled in on new entries.
   * @private
   */
  function _fit (matrix, size, defaultValue) {
    const // copy the array
      newSize = matrix._size.slice(0)

    let changed = false

    // add dimensions when needed
    while (newSize.length < size.length) {
      newSize.push(0)
      changed = true
    }

    // enlarge size when needed
    for (let i = 0, ii = size.length; i < ii; i++) {
      if (size[i] > newSize[i]) {
        newSize[i] = size[i]
        changed = true
      }
    }

    if (changed) {
      // resize only when size is changed
      _resize(matrix, newSize, defaultValue)
    }
  }

  /**
   * Create a clone of the matrix
   * @memberof DenseMatrix
   * @return {DenseMatrix} clone
   */
  DenseMatrix.prototype.clone = function () {
    const m = new DenseMatrix({
      data: object.clone(this._data),
      size: object.clone(this._size),
      datatype: this._datatype
    })
    return m
  }

  /**
   * Retrieve the size of the matrix.
   * @memberof DenseMatrix
   * @returns {number[]} size
   */
  DenseMatrix.prototype.size = function () {
    return this._size.slice(0) // return a clone of _size
  }

  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @memberof DenseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   *
   * @return {DenseMatrix} matrix
   */
  DenseMatrix.prototype.map = function (callback) {
    // matrix instance
    const me = this
    const recurse = function (value, index) {
      if (isArray(value)) {
        return value.map(function (child, i) {
          return recurse(child, index.concat(i))
        })
      } else {
        return callback(value, index, me)
      }
    }
    // return dense format
    return new DenseMatrix({
      data: recurse(this._data, []),
      size: object.clone(this._size),
      datatype: this._datatype
    })
  }

  /**
   * Execute a callback function on each entry of the matrix.
   * @memberof DenseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   */
  DenseMatrix.prototype.forEach = function (callback) {
    // matrix instance
    const me = this
    const recurse = function (value, index) {
      if (isArray(value)) {
        value.forEach(function (child, i) {
          recurse(child, index.concat(i))
        })
      } else {
        callback(value, index, me)
      }
    }
    recurse(this._data, [])
  }

  /**
   * Create an Array with a copy of the data of the DenseMatrix
   * @memberof DenseMatrix
   * @returns {Array} array
   */
  DenseMatrix.prototype.toArray = function () {
    return object.clone(this._data)
  }

  /**
   * Get the primitive value of the DenseMatrix: a multidimensional array
   * @memberof DenseMatrix
   * @returns {Array} array
   */
  DenseMatrix.prototype.valueOf = function () {
    return this._data
  }

  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @memberof DenseMatrix
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  DenseMatrix.prototype.format = function (options) {
    return string.format(this._data, options)
  }

  /**
   * Get a string representation of the matrix
   * @memberof DenseMatrix
   * @returns {string} str
   */
  DenseMatrix.prototype.toString = function () {
    return string.format(this._data)
  }

  /**
   * Get a JSON representation of the matrix
   * @memberof DenseMatrix
   * @returns {Object}
   */
  DenseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'DenseMatrix',
      data: this._data,
      size: this._size,
      datatype: this._datatype
    }
  }

  /**
   * Get the kth Matrix diagonal.
   *
   * @memberof DenseMatrix
   * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Matrix}                     The matrix with the diagonal values.
   */
  DenseMatrix.prototype.diagonal = function (k) {
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (type.isBigNumber(k)) { k = k.toNumber() }
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError('The parameter k must be an integer number')
      }
    } else {
      // default value
      k = 0
    }

    const kSuper = k > 0 ? k : 0
    const kSub = k < 0 ? -k : 0

    // rows & columns
    const rows = this._size[0]
    const columns = this._size[1]

    // number diagonal values
    const n = Math.min(rows - kSub, columns - kSuper)

    // x is a matrix get diagonal from matrix
    const data = []

    // loop rows
    for (let i = 0; i < n; i++) {
      data[i] = this._data[i + kSub][i + kSuper]
    }

    // create DenseMatrix
    return new DenseMatrix({
      data: data,
      size: [n],
      datatype: this._datatype
    })
  }

  /**
   * Create a diagonal matrix.
   *
   * @memberof DenseMatrix
   * @param {Array} size                     The matrix size.
   * @param {number | Matrix | Array } value The values for the diagonal.
   * @param {number | BigNumber} [k=0]       The kth diagonal where the vector will be filled in.
   * @param {number} [defaultValue]          The default value for non-diagonal
   * @param {string} [datatype]              The datatype for the diagonal
   *
   * @returns {DenseMatrix}
   */
  DenseMatrix.diagonal = function (size, value, k, defaultValue, datatype) {
    if (!isArray(size)) { throw new TypeError('Array expected, size parameter') }
    if (size.length !== 2) { throw new Error('Only two dimensions matrix are supported') }

    // map size & validate
    size = size.map(function (s) {
      // check it is a big number
      if (type.isBigNumber(s)) {
        // convert it
        s = s.toNumber()
      }
      // validate arguments
      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error('Size values must be positive integers')
      }
      return s
    })

    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (type.isBigNumber(k)) { k = k.toNumber() }
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError('The parameter k must be an integer number')
      }
    } else {
      // default value
      k = 0
    }

    if (defaultValue && isString(datatype)) {
      // convert defaultValue to the same datatype
      defaultValue = typed.convert(defaultValue, datatype)
    }

    const kSuper = k > 0 ? k : 0
    const kSub = k < 0 ? -k : 0

    // rows and columns
    const rows = size[0]
    const columns = size[1]

    // number of non-zero items
    const n = Math.min(rows - kSub, columns - kSuper)

    // value extraction function
    let _value

    // check value
    if (isArray(value)) {
      // validate array
      if (value.length !== n) {
        // number of values in array must be n
        throw new Error('Invalid value array length')
      }
      // define function
      _value = function (i) {
        // return value @ i
        return value[i]
      }
    } else if (type.isMatrix(value)) {
      // matrix size
      const ms = value.size()
      // validate matrix
      if (ms.length !== 1 || ms[0] !== n) {
        // number of values in array must be n
        throw new Error('Invalid matrix length')
      }
      // define function
      _value = function (i) {
        // return value @ i
        return value.get([i])
      }
    } else {
      // define function
      _value = function () {
        // return value
        return value
      }
    }

    // discover default value if needed
    if (!defaultValue) {
      // check first value in array
      defaultValue = type.isBigNumber(_value(0)) ? new type.BigNumber(0) : 0
    }

    // empty array
    let data = []

    // check we need to resize array
    if (size.length > 0) {
      // resize array
      data = array.resize(data, size, defaultValue)
      // fill diagonal
      for (let d = 0; d < n; d++) {
        data[d + kSub][d + kSuper] = _value(d)
      }
    }

    // create DenseMatrix
    return new DenseMatrix({
      data: data,
      size: [rows, columns]
    })
  }

  /**
   * Generate a matrix from a JSON object
   * @memberof DenseMatrix
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "DenseMatrix", data: [], size: []}`,
   *                       where mathjs is optional
   * @returns {DenseMatrix}
   */
  DenseMatrix.fromJSON = function (json) {
    return new DenseMatrix(json)
  }

  /**
   * Swap rows i and j in Matrix.
   *
   * @memberof DenseMatrix
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   *
   * @return {Matrix}        The matrix reference
   */
  DenseMatrix.prototype.swapRows = function (i, j) {
    // check index
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error('Row index must be positive integers')
    }
    // check dimensions
    if (this._size.length !== 2) {
      throw new Error('Only two dimensional matrix is supported')
    }
    // validate index
    validateIndex(i, this._size[0])
    validateIndex(j, this._size[0])

    // swap rows
    DenseMatrix._swapRows(i, j, this._data)
    // return current instance
    return this
  }

  /**
   * Swap rows i and j in Dense Matrix data structure.
   *
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   * @param {Array} data     Matrix data
   */
  DenseMatrix._swapRows = function (i, j, data) {
    // swap values i <-> j
    const vi = data[i]
    data[i] = data[j]
    data[j] = vi
  }

  /**
   * Preprocess data, which can be an Array or DenseMatrix with nested Arrays and
   * Matrices. Replaces all nested Matrices with Arrays
   * @memberof DenseMatrix
   * @param {Array} data
   * @return {Array} data
   */
  function preprocess (data) {
    for (let i = 0, ii = data.length; i < ii; i++) {
      const elem = data[i]
      if (isArray(elem)) {
        data[i] = preprocess(elem)
      } else if (elem && elem.isMatrix === true) {
        data[i] = preprocess(elem.valueOf())
      }
    }

    return data
  }

  // register this type in the base class Matrix
  type.Matrix._storage.dense = DenseMatrix
  type.Matrix._storage['default'] = DenseMatrix

  // exports
  return DenseMatrix
}

exports.name = 'DenseMatrix'
exports.path = 'type'
exports.factory = factory
exports.lazy = false // no lazy loading, as we alter type.Matrix._storage
