import { isArray, isBigNumber, isCollection, isIndex, isMatrix, isNumber, isString, typeOf } from '../../utils/is'
import { isInteger } from '../../utils/number'
import { format } from '../../utils/string'
import { clone, deepStrictEqual } from '../../utils/object'
import { arraySize, getArrayDataType, unsqueeze, validateIndex } from '../../utils/array'
import { factory } from '../../utils/factory'
import { DimensionError } from '../../error/DimensionError'

const name = 'SparseMatrix'
const dependencies = [
  'typed',
  'equalScalar',
  'Matrix'
]

export const createSparseMatrixClass = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar, Matrix }) => {
  /**
   * Sparse Matrix implementation. This type implements a Compressed Column Storage format
   * for sparse matrices.
   * @class SparseMatrix
   */
  function SparseMatrix (data, datatype) {
    if (!(this instanceof SparseMatrix)) { throw new SyntaxError('Constructor must be called with the new operator') }
    if (datatype && !isString(datatype)) { throw new Error('Invalid datatype: ' + datatype) }

    if (isMatrix(data)) {
      // create from matrix
      _createFromMatrix(this, data, datatype)
    } else if (data && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
      // initialize fields
      this._values = data.values
      this._index = data.index
      this._ptr = data.ptr
      this._size = data.size
      this._datatype = datatype || data.datatype
    } else if (isArray(data)) {
      // create from array
      _createFromArray(this, data, datatype)
    } else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + typeOf(data) + ')')
    } else {
      // nothing provided
      this._values = []
      this._index = []
      this._ptr = [0]
      this._size = [0, 0]
      this._datatype = datatype
    }
  }

  function _createFromMatrix (matrix, source, datatype) {
    // check matrix type
    if (source.type === 'SparseMatrix') {
      // clone arrays
      matrix._values = source._values ? clone(source._values) : undefined
      matrix._index = clone(source._index)
      matrix._ptr = clone(source._ptr)
      matrix._size = clone(source._size)
      matrix._datatype = datatype || source._datatype
    } else {
      // build from matrix data
      _createFromArray(matrix, source.valueOf(), datatype || source._datatype)
    }
  }

  function _createFromArray (matrix, data, datatype) {
    // initialize fields
    matrix._values = []
    matrix._index = []
    matrix._ptr = []
    matrix._datatype = datatype
    // discover rows & columns, do not use math.size() to avoid looping array twice
    const rows = data.length
    let columns = 0

    // equal signature to use
    let eq = equalScalar
    // zero value
    let zero = 0

    if (isString(datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [datatype, datatype]) || equalScalar
      // convert 0 to the same datatype
      zero = typed.convert(0, datatype)
    }

    // check we have rows (empty array)
    if (rows > 0) {
      // column index
      let j = 0
      do {
        // store pointer to values index
        matrix._ptr.push(matrix._index.length)
        // loop rows
        for (let i = 0; i < rows; i++) {
          // current row
          const row = data[i]
          // check row is an array
          if (isArray(row)) {
            // update columns if needed (only on first column)
            if (j === 0 && columns < row.length) { columns = row.length }
            // check row has column
            if (j < row.length) {
              // value
              const v = row[j]
              // check value != 0
              if (!eq(v, zero)) {
                // store value
                matrix._values.push(v)
                // index
                matrix._index.push(i)
              }
            }
          } else {
            // update columns if needed (only on first column)
            if (j === 0 && columns < 1) { columns = 1 }
            // check value != 0 (row is a scalar)
            if (!eq(row, zero)) {
              // store value
              matrix._values.push(row)
              // index
              matrix._index.push(i)
            }
          }
        }
        // increment index
        j++
      }
      while (j < columns)
    }
    // store number of values in ptr
    matrix._ptr.push(matrix._index.length)
    // size
    matrix._size = [rows, columns]
  }

  SparseMatrix.prototype = new Matrix()

  /**
   * Create a new SparseMatrix
   */
  SparseMatrix.prototype.createSparseMatrix = function (data, datatype) {
    return new SparseMatrix(data, datatype)
  }

  /**
   * Attach type information
   */
  SparseMatrix.prototype.type = 'SparseMatrix'
  SparseMatrix.prototype.isSparseMatrix = true

  /**
   * Get the matrix type
   *
   * Usage:
   *    const matrixType = matrix.getDataType()  // retrieves the matrix type
   *
   * @memberOf SparseMatrix
   * @return {string}   type information; if multiple types are found from the Matrix, it will return "mixed"
   */
  SparseMatrix.prototype.getDataType = function () {
    return getArrayDataType(this._values, typeOf)
  }

  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     const format = matrix.storage()   // retrieve storage format
   *
   * @memberof SparseMatrix
   * @return {string}           The storage format.
   */
  SparseMatrix.prototype.storage = function () {
    return 'sparse'
  }

  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     const format = matrix.datatype()    // retrieve matrix datatype
   *
   * @memberof SparseMatrix
   * @return {string}           The datatype.
   */
  SparseMatrix.prototype.datatype = function () {
    return this._datatype
  }

  /**
   * Create a new SparseMatrix
   * @memberof SparseMatrix
   * @param {Array} data
   * @param {string} [datatype]
   */
  SparseMatrix.prototype.create = function (data, datatype) {
    return new SparseMatrix(data, datatype)
  }

  /**
   * Get the matrix density.
   *
   * Usage:
   *     const density = matrix.density()                   // retrieve matrix density
   *
   * @memberof SparseMatrix
   * @return {number}           The matrix density.
   */
  SparseMatrix.prototype.density = function () {
    // rows & columns
    const rows = this._size[0]
    const columns = this._size[1]
    // calculate density
    return rows !== 0 && columns !== 0 ? (this._index.length / (rows * columns)) : 0
  }

  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     const subset = matrix.subset(index)               // retrieve subset
   *     const value = matrix.subset(index, replacement)   // replace subset
   *
   * @memberof SparseMatrix
   * @param {Index} index
   * @param {Array | Matrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  SparseMatrix.prototype.subset = function (index, replacement, defaultValue) { // check it is a pattern matrix
    if (!this._values) { throw new Error('Cannot invoke subset on a Pattern only matrix') }

    // check arguments
    switch (arguments.length) {
      case 1:
        return _getsubset(this, index)

        // intentional fall through
      case 2:
      case 3:
        return _setsubset(this, index, replacement, defaultValue)

      default:
        throw new SyntaxError('Wrong number of arguments')
    }
  }

  function _getsubset (matrix, idx) {
    // check idx
    if (!isIndex(idx)) {
      throw new TypeError('Invalid index')
    }

    const isScalar = idx.isScalar()
    if (isScalar) {
      // return a scalar
      return matrix.get(idx.min())
    }
    // validate dimensions
    const size = idx.size()
    if (size.length !== matrix._size.length) {
      throw new DimensionError(size.length, matrix._size.length)
    }

    // vars
    let i, ii, k, kk

    // validate if any of the ranges in the index is out of range
    const min = idx.min()
    const max = idx.max()
    for (i = 0, ii = matrix._size.length; i < ii; i++) {
      validateIndex(min[i], matrix._size[i])
      validateIndex(max[i], matrix._size[i])
    }

    // matrix arrays
    const mvalues = matrix._values
    const mindex = matrix._index
    const mptr = matrix._ptr

    // rows & columns dimensions for result matrix
    const rows = idx.dimension(0)
    const columns = idx.dimension(1)

    // workspace & permutation vector
    const w = []
    const pv = []

    // loop rows in resulting matrix
    rows.forEach(function (i, r) {
      // update permutation vector
      pv[i] = r[0]
      // mark i in workspace
      w[i] = true
    })

    // result matrix arrays
    const values = mvalues ? [] : undefined
    const index = []
    const ptr = []

    // loop columns in result matrix
    columns.forEach(function (j) {
      // update ptr
      ptr.push(index.length)
      // loop values in column j
      for (k = mptr[j], kk = mptr[j + 1]; k < kk; k++) {
        // row
        i = mindex[k]
        // check row is in result matrix
        if (w[i] === true) {
          // push index
          index.push(pv[i])
          // check we need to process values
          if (values) { values.push(mvalues[k]) }
        }
      }
    })
    // update ptr
    ptr.push(index.length)

    // return matrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: size,
      datatype: matrix._datatype
    })
  }

  function _setsubset (matrix, index, submatrix, defaultValue) {
    // check index
    if (!index || index.isIndex !== true) {
      throw new TypeError('Invalid index')
    }

    // get index size and check whether the index contains a single value
    const iSize = index.size()
    const isScalar = index.isScalar()

    // calculate the size of the submatrix, and convert it into an Array if needed
    let sSize
    if (isMatrix(submatrix)) {
      // submatrix size
      sSize = submatrix.size()
      // use array representation
      submatrix = submatrix.toArray()
    } else {
      // get submatrix size (array, scalar)
      sSize = arraySize(submatrix)
    }

    // check index is a scalar
    if (isScalar) {
      // verify submatrix is a scalar
      if (sSize.length !== 0) {
        throw new TypeError('Scalar expected')
      }
      // set value
      matrix.set(index.min(), submatrix, defaultValue)
    } else {
      // validate dimensions, index size must be one or two dimensions
      if (iSize.length !== 1 && iSize.length !== 2) {
        throw new DimensionError(iSize.length, matrix._size.length, '<')
      }

      // check submatrix and index have the same dimensions
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
        submatrix = unsqueeze(submatrix, iSize.length, outer, sSize)
      }

      // check whether the size of the submatrix matches the index size
      if (!deepStrictEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, '>')
      }

      // offsets
      const x0 = index.min()[0]
      const y0 = index.min()[1]

      // submatrix rows and columns
      const m = sSize[0]
      const n = sSize[1]

      // loop submatrix
      for (let x = 0; x < m; x++) {
        // loop columns
        for (let y = 0; y < n; y++) {
          // value at i, j
          const v = submatrix[x][y]
          // invoke set (zero value will remove entry from matrix)
          matrix.set([x + x0, y + y0], v, defaultValue)
        }
      }
    }
    return matrix
  }

  /**
   * Get a single element from the matrix.
   * @memberof SparseMatrix
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */
  SparseMatrix.prototype.get = function (index) {
    if (!isArray(index)) { throw new TypeError('Array expected') }
    if (index.length !== this._size.length) { throw new DimensionError(index.length, this._size.length) }

    // check it is a pattern matrix
    if (!this._values) { throw new Error('Cannot invoke get on a Pattern only matrix') }

    // row and column
    const i = index[0]
    const j = index[1]

    // check i, j are valid
    validateIndex(i, this._size[0])
    validateIndex(j, this._size[1])

    // find value index
    const k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index)
    // check k is prior to next column k and it is in the correct row
    if (k < this._ptr[j + 1] && this._index[k] === i) { return this._values[k] }

    return 0
  }

  /**
   * Replace a single element in the matrix.
   * @memberof SparseMatrix
   * @param {number[]} index   Zero-based index
   * @param {*} v
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be set to zero.
   * @return {SparseMatrix} self
   */
  SparseMatrix.prototype.set = function (index, v, defaultValue) {
    if (!isArray(index)) { throw new TypeError('Array expected') }
    if (index.length !== this._size.length) { throw new DimensionError(index.length, this._size.length) }

    // check it is a pattern matrix
    if (!this._values) { throw new Error('Cannot invoke set on a Pattern only matrix') }

    // row and column
    const i = index[0]
    const j = index[1]

    // rows & columns
    let rows = this._size[0]
    let columns = this._size[1]

    // equal signature to use
    let eq = equalScalar
    // zero value
    let zero = 0

    if (isString(this._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [this._datatype, this._datatype]) || equalScalar
      // convert 0 to the same datatype
      zero = typed.convert(0, this._datatype)
    }

    // check we need to resize matrix
    if (i > rows - 1 || j > columns - 1) {
      // resize matrix
      _resize(this, Math.max(i + 1, rows), Math.max(j + 1, columns), defaultValue)
      // update rows & columns
      rows = this._size[0]
      columns = this._size[1]
    }

    // check i, j are valid
    validateIndex(i, rows)
    validateIndex(j, columns)

    // find value index
    const k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index)
    // check k is prior to next column k and it is in the correct row
    if (k < this._ptr[j + 1] && this._index[k] === i) {
      // check value != 0
      if (!eq(v, zero)) {
        // update value
        this._values[k] = v
      } else {
        // remove value from matrix
        _remove(k, j, this._values, this._index, this._ptr)
      }
    } else {
      // insert value @ (i, j)
      _insert(k, i, j, v, this._values, this._index, this._ptr)
    }

    return this
  }

  function _getValueIndex (i, top, bottom, index) {
    // check row is on the bottom side
    if (bottom - top === 0) { return bottom }
    // loop rows [top, bottom[
    for (let r = top; r < bottom; r++) {
      // check we found value index
      if (index[r] === i) { return r }
    }
    // we did not find row
    return top
  }

  function _remove (k, j, values, index, ptr) {
    // remove value @ k
    values.splice(k, 1)
    index.splice(k, 1)
    // update pointers
    for (let x = j + 1; x < ptr.length; x++) { ptr[x]-- }
  }

  function _insert (k, i, j, v, values, index, ptr) {
    // insert value
    values.splice(k, 0, v)
    // update row for k
    index.splice(k, 0, i)
    // update column pointers
    for (let x = j + 1; x < ptr.length; x++) { ptr[x]++ }
  }

  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @memberof SparseMatrix
   * @param {number[] | Matrix} size  The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  SparseMatrix.prototype.resize = function (size, defaultValue, copy) {
    // validate arguments
    if (!isCollection(size)) {
      throw new TypeError('Array or Matrix expected')
    }

    // SparseMatrix input is always 2d, flatten this into 1d if it's indeed a vector
    const sizeArray = size.valueOf().map(value => {
      return Array.isArray(value) && value.length === 1
        ? value[0]
        : value
    })

    if (sizeArray.length !== 2) { throw new Error('Only two dimensions matrix are supported') }

    // check sizes
    sizeArray.forEach(function (value) {
      if (!isNumber(value) || !isInteger(value) || value < 0) {
        throw new TypeError('Invalid size, must contain positive integers ' +
                            '(size: ' + format(sizeArray) + ')')
      }
    })

    // matrix to resize
    const m = copy ? this.clone() : this
    // resize matrix
    return _resize(m, sizeArray[0], sizeArray[1], defaultValue)
  }

  function _resize (matrix, rows, columns, defaultValue) {
    // value to insert at the time of growing matrix
    let value = defaultValue || 0

    // equal signature to use
    let eq = equalScalar
    // zero value
    let zero = 0

    if (isString(matrix._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [matrix._datatype, matrix._datatype]) || equalScalar
      // convert 0 to the same datatype
      zero = typed.convert(0, matrix._datatype)
      // convert value to the same datatype
      value = typed.convert(value, matrix._datatype)
    }

    // should we insert the value?
    const ins = !eq(value, zero)

    // old columns and rows
    const r = matrix._size[0]
    let c = matrix._size[1]

    let i, j, k

    // check we need to increase columns
    if (columns > c) {
      // loop new columns
      for (j = c; j < columns; j++) {
        // update matrix._ptr for current column
        matrix._ptr[j] = matrix._values.length
        // check we need to insert matrix._values
        if (ins) {
          // loop rows
          for (i = 0; i < r; i++) {
            // add new matrix._values
            matrix._values.push(value)
            // update matrix._index
            matrix._index.push(i)
          }
        }
      }
      // store number of matrix._values in matrix._ptr
      matrix._ptr[columns] = matrix._values.length
    } else if (columns < c) {
      // truncate matrix._ptr
      matrix._ptr.splice(columns + 1, c - columns)
      // truncate matrix._values and matrix._index
      matrix._values.splice(matrix._ptr[columns], matrix._values.length)
      matrix._index.splice(matrix._ptr[columns], matrix._index.length)
    }
    // update columns
    c = columns

    // check we need to increase rows
    if (rows > r) {
      // check we have to insert values
      if (ins) {
        // inserts
        let n = 0
        // loop columns
        for (j = 0; j < c; j++) {
          // update matrix._ptr for current column
          matrix._ptr[j] = matrix._ptr[j] + n
          // where to insert matrix._values
          k = matrix._ptr[j + 1] + n
          // pointer
          let p = 0
          // loop new rows, initialize pointer
          for (i = r; i < rows; i++, p++) {
            // add value
            matrix._values.splice(k + p, 0, value)
            // update matrix._index
            matrix._index.splice(k + p, 0, i)
            // increment inserts
            n++
          }
        }
        // store number of matrix._values in matrix._ptr
        matrix._ptr[c] = matrix._values.length
      }
    } else if (rows < r) {
      // deletes
      let d = 0
      // loop columns
      for (j = 0; j < c; j++) {
        // update matrix._ptr for current column
        matrix._ptr[j] = matrix._ptr[j] - d
        // where matrix._values start for next column
        const k0 = matrix._ptr[j]
        const k1 = matrix._ptr[j + 1] - d
        // loop matrix._index
        for (k = k0; k < k1; k++) {
          // row
          i = matrix._index[k]
          // check we need to delete value and matrix._index
          if (i > rows - 1) {
            // remove value
            matrix._values.splice(k, 1)
            // remove item from matrix._index
            matrix._index.splice(k, 1)
            // increase deletes
            d++
          }
        }
      }
      // update matrix._ptr for current column
      matrix._ptr[j] = matrix._values.length
    }
    // update matrix._size
    matrix._size[0] = rows
    matrix._size[1] = columns
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
   * @memberof SparseMatrix
   * @param {number[]} size           The new size the matrix should have.
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */
  SparseMatrix.prototype.reshape = function (size, copy) {
    // validate arguments
    if (!isArray(size)) { throw new TypeError('Array expected') }
    if (size.length !== 2) { throw new Error('Sparse matrices can only be reshaped in two dimensions') }

    // check sizes
    size.forEach(function (value) {
      if (!isNumber(value) || !isInteger(value) || value < 0) {
        throw new TypeError('Invalid size, must contain positive integers ' +
                            '(size: ' + format(size) + ')')
      }
    })

    // m * n must not change
    if (this._size[0] * this._size[1] !== size[0] * size[1]) {
      throw new Error('Reshaping sparse matrix will result in the wrong number of elements')
    }

    // matrix to reshape
    const m = copy ? this.clone() : this

    // return unchanged if the same shape
    if (this._size[0] === size[0] && this._size[1] === size[1]) {
      return m
    }

    // Convert to COO format (generate a column index)
    const colIndex = []
    for (let i = 0; i < m._ptr.length; i++) {
      for (let j = 0; j < m._ptr[i + 1] - m._ptr[i]; j++) {
        colIndex.push(i)
      }
    }

    // Clone the values array
    const values = m._values.slice()

    // Clone the row index array
    const rowIndex = m._index.slice()

    // Transform the (row, column) indices
    for (let i = 0; i < m._index.length; i++) {
      const r1 = rowIndex[i]
      const c1 = colIndex[i]
      const flat = r1 * m._size[1] + c1
      colIndex[i] = flat % size[1]
      rowIndex[i] = Math.floor(flat / size[1])
    }

    // Now reshaping is supposed to preserve the row-major order, BUT these sparse matrices are stored
    // in column-major order, so we have to reorder the value array now. One option is to use a multisort,
    // sorting several arrays based on some other array.

    // OR, we could easily just:

    // 1. Remove all values from the matrix
    m._values.length = 0
    m._index.length = 0
    m._ptr.length = size[1] + 1
    m._size = size.slice()
    for (let i = 0; i < m._ptr.length; i++) {
      m._ptr[i] = 0
    }

    // 2. Re-insert all elements in the proper order (simplified code from SparseMatrix.prototype.set)
    // This step is probably the most time-consuming
    for (let h = 0; h < values.length; h++) {
      const i = rowIndex[h]
      const j = colIndex[h]
      const v = values[h]
      const k = _getValueIndex(i, m._ptr[j], m._ptr[j + 1], m._index)
      _insert(k, i, j, v, m._values, m._index, m._ptr)
    }

    // The value indices are inserted out of order, but apparently that's... still OK?

    return m
  }

  /**
   * Create a clone of the matrix
   * @memberof SparseMatrix
   * @return {SparseMatrix} clone
   */
  SparseMatrix.prototype.clone = function () {
    const m = new SparseMatrix({
      values: this._values ? clone(this._values) : undefined,
      index: clone(this._index),
      ptr: clone(this._ptr),
      size: clone(this._size),
      datatype: this._datatype
    })
    return m
  }

  /**
   * Retrieve the size of the matrix.
   * @memberof SparseMatrix
   * @returns {number[]} size
   */
  SparseMatrix.prototype.size = function () {
    return this._size.slice(0) // copy the Array
  }

  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @memberof SparseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {SparseMatrix} matrix
   */
  SparseMatrix.prototype.map = function (callback, skipZeros) {
    // check it is a pattern matrix
    if (!this._values) { throw new Error('Cannot invoke map on a Pattern only matrix') }
    // matrix instance
    const me = this
    // rows and columns
    const rows = this._size[0]
    const columns = this._size[1]
    // invoke callback
    const invoke = function (v, i, j) {
      // invoke callback
      return callback(v, [i, j], me)
    }
    // invoke _map
    return _map(this, 0, rows - 1, 0, columns - 1, invoke, skipZeros)
  }

  /**
   * Create a new matrix with the results of the callback function executed on the interval
   * [minRow..maxRow, minColumn..maxColumn].
   */
  function _map (matrix, minRow, maxRow, minColumn, maxColumn, callback, skipZeros) {
    // result arrays
    const values = []
    const index = []
    const ptr = []

    // equal signature to use
    let eq = equalScalar
    // zero value
    let zero = 0

    if (isString(matrix._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [matrix._datatype, matrix._datatype]) || equalScalar
      // convert 0 to the same datatype
      zero = typed.convert(0, matrix._datatype)
    }

    // invoke callback
    const invoke = function (v, x, y) {
      // invoke callback
      v = callback(v, x, y)
      // check value != 0
      if (!eq(v, zero)) {
        // store value
        values.push(v)
        // index
        index.push(x)
      }
    }
    // loop columns
    for (let j = minColumn; j <= maxColumn; j++) {
      // store pointer to values index
      ptr.push(values.length)
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      const k0 = matrix._ptr[j]
      const k1 = matrix._ptr[j + 1]

      if (skipZeros) {
        // loop k within [k0, k1[
        for (let k = k0; k < k1; k++) {
          // row index
          const i = matrix._index[k]
          // check i is in range
          if (i >= minRow && i <= maxRow) {
            // value @ k
            invoke(matrix._values[k], i - minRow, j - minColumn)
          }
        }
      } else {
        // create a cache holding all defined values
        const values = {}
        for (let k = k0; k < k1; k++) {
          const i = matrix._index[k]
          values[i] = matrix._values[k]
        }

        // loop over all rows (indexes can be unordered so we can't use that),
        // and either read the value or zero
        for (let i = minRow; i <= maxRow; i++) {
          const value = (i in values) ? values[i] : 0
          invoke(value, i - minRow, j - minColumn)
        }
      }
    }

    // store number of values in ptr
    ptr.push(values.length)
    // return sparse matrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [maxRow - minRow + 1, maxColumn - minColumn + 1]
    })
  }

  /**
   * Execute a callback function on each entry of the matrix.
   * @memberof SparseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   */
  SparseMatrix.prototype.forEach = function (callback, skipZeros) {
    // check it is a pattern matrix
    if (!this._values) { throw new Error('Cannot invoke forEach on a Pattern only matrix') }
    // matrix instance
    const me = this
    // rows and columns
    const rows = this._size[0]
    const columns = this._size[1]
    // loop columns
    for (let j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      const k0 = this._ptr[j]
      const k1 = this._ptr[j + 1]

      if (skipZeros) {
        // loop k within [k0, k1[
        for (let k = k0; k < k1; k++) {
          // row index
          const i = this._index[k]

          // value @ k
          callback(this._values[k], [i, j], me)
        }
      } else {
        // create a cache holding all defined values
        const values = {}
        for (let k = k0; k < k1; k++) {
          const i = this._index[k]
          values[i] = this._values[k]
        }

        // loop over all rows (indexes can be unordered so we can't use that),
        // and either read the value or zero
        for (let i = 0; i < rows; i++) {
          const value = (i in values) ? values[i] : 0
          callback(value, [i, j], me)
        }
      }
    }
  }

  /**
   * Create an Array with a copy of the data of the SparseMatrix
   * @memberof SparseMatrix
   * @returns {Array} array
   */
  SparseMatrix.prototype.toArray = function () {
    return _toArray(this._values, this._index, this._ptr, this._size, true)
  }

  /**
   * Get the primitive value of the SparseMatrix: a two dimensions array
   * @memberof SparseMatrix
   * @returns {Array} array
   */
  SparseMatrix.prototype.valueOf = function () {
    return _toArray(this._values, this._index, this._ptr, this._size, false)
  }

  function _toArray (values, index, ptr, size, copy) {
    // rows and columns
    const rows = size[0]
    const columns = size[1]
    // result
    const a = []
    // vars
    let i, j
    // initialize array
    for (i = 0; i < rows; i++) {
      a[i] = []
      for (j = 0; j < columns; j++) { a[i][j] = 0 }
    }

    // loop columns
    for (j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      const k0 = ptr[j]
      const k1 = ptr[j + 1]
      // loop k within [k0, k1[
      for (let k = k0; k < k1; k++) {
        // row index
        i = index[k]
        // set value (use one for pattern matrix)
        a[i][j] = values ? (copy ? clone(values[k]) : values[k]) : 1
      }
    }
    return a
  }

  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @memberof SparseMatrix
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  SparseMatrix.prototype.format = function (options) {
    // rows and columns
    const rows = this._size[0]
    const columns = this._size[1]
    // density
    const density = this.density()
    // rows & columns
    let str = 'Sparse Matrix [' + format(rows, options) + ' x ' + format(columns, options) + '] density: ' + format(density, options) + '\n'
    // loop columns
    for (let j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      const k0 = this._ptr[j]
      const k1 = this._ptr[j + 1]
      // loop k within [k0, k1[
      for (let k = k0; k < k1; k++) {
        // row index
        const i = this._index[k]
        // append value
        str += '\n    (' + format(i, options) + ', ' + format(j, options) + ') ==> ' + (this._values ? format(this._values[k], options) : 'X')
      }
    }
    return str
  }

  /**
   * Get a string representation of the matrix
   * @memberof SparseMatrix
   * @returns {string} str
   */
  SparseMatrix.prototype.toString = function () {
    return format(this.toArray())
  }

  /**
   * Get a JSON representation of the matrix
   * @memberof SparseMatrix
   * @returns {Object}
   */
  SparseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'SparseMatrix',
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size,
      datatype: this._datatype
    }
  }

  /**
   * Get the kth Matrix diagonal.
   *
   * @memberof SparseMatrix
   * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Matrix}                     The matrix vector with the diagonal values.
   */
  SparseMatrix.prototype.diagonal = function (k) {
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (isBigNumber(k)) { k = k.toNumber() }
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

    // diagonal arrays
    const values = []
    const index = []
    const ptr = []
    // initial ptr value
    ptr[0] = 0
    // loop columns
    for (let j = kSuper; j < columns && values.length < n; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      const k0 = this._ptr[j]
      const k1 = this._ptr[j + 1]
      // loop x within [k0, k1[
      for (let x = k0; x < k1; x++) {
        // row index
        const i = this._index[x]
        // check row
        if (i === j - kSuper + kSub) {
          // value on this column
          values.push(this._values[x])
          // store row
          index[values.length - 1] = i - kSub
          // exit loop
          break
        }
      }
    }
    // close ptr
    ptr.push(values.length)
    // return matrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [n, 1]
    })
  }

  /**
   * Generate a matrix from a JSON object
   * @memberof SparseMatrix
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "SparseMatrix", "values": [], "index": [], "ptr": [], "size": []}`,
   *                       where mathjs is optional
   * @returns {SparseMatrix}
   */
  SparseMatrix.fromJSON = function (json) {
    return new SparseMatrix(json)
  }

  /**
   * Create a diagonal matrix.
   *
   * @memberof SparseMatrix
   * @param {Array} size                       The matrix size.
   * @param {number | Array | Matrix } value   The values for the diagonal.
   * @param {number | BigNumber} [k=0]         The kth diagonal where the vector will be filled in.
   * @param {number} [defaultValue]            The default value for non-diagonal
   * @param {string} [datatype]                The Matrix datatype, values must be of this datatype.
   *
   * @returns {SparseMatrix}
   */
  SparseMatrix.diagonal = function (size, value, k, defaultValue, datatype) {
    if (!isArray(size)) { throw new TypeError('Array expected, size parameter') }
    if (size.length !== 2) { throw new Error('Only two dimensions matrix are supported') }

    // map size & validate
    size = size.map(function (s) {
      // check it is a big number
      if (isBigNumber(s)) {
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
      if (isBigNumber(k)) { k = k.toNumber() }
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError('The parameter k must be an integer number')
      }
    } else {
      // default value
      k = 0
    }

    // equal signature to use
    let eq = equalScalar
    // zero value
    let zero = 0

    if (isString(datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [datatype, datatype]) || equalScalar
      // convert 0 to the same datatype
      zero = typed.convert(0, datatype)
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
    } else if (isMatrix(value)) {
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

    // create arrays
    const values = []
    const index = []
    const ptr = []

    // loop items
    for (let j = 0; j < columns; j++) {
      // number of rows with value
      ptr.push(values.length)
      // diagonal index
      const i = j - kSuper
      // check we need to set diagonal value
      if (i >= 0 && i < n) {
        // get value @ i
        const v = _value(i)
        // check for zero
        if (!eq(v, zero)) {
          // column
          index.push(i + kSub)
          // add value
          values.push(v)
        }
      }
    }
    // last value should be number of values
    ptr.push(values.length)
    // create SparseMatrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [rows, columns]
    })
  }

  /**
   * Swap rows i and j in Matrix.
   *
   * @memberof SparseMatrix
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   *
   * @return {Matrix}        The matrix reference
   */
  SparseMatrix.prototype.swapRows = function (i, j) {
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
    SparseMatrix._swapRows(i, j, this._size[1], this._values, this._index, this._ptr)
    // return current instance
    return this
  }

  /**
   * Loop rows with data in column j.
   *
   * @param {number} j            Column
   * @param {Array} values        Matrix values
   * @param {Array} index         Matrix row indeces
   * @param {Array} ptr           Matrix column pointers
   * @param {Function} callback   Callback function invoked for every row in column j
   */
  SparseMatrix._forEachRow = function (j, values, index, ptr, callback) {
    // indeces for column j
    const k0 = ptr[j]
    const k1 = ptr[j + 1]
    // loop
    for (let k = k0; k < k1; k++) {
      // invoke callback
      callback(index[k], values[k])
    }
  }

  /**
   * Swap rows x and y in Sparse Matrix data structures.
   *
   * @param {number} x         Matrix row index 1
   * @param {number} y         Matrix row index 2
   * @param {number} columns   Number of columns in matrix
   * @param {Array} values     Matrix values
   * @param {Array} index      Matrix row indeces
   * @param {Array} ptr        Matrix column pointers
   */
  SparseMatrix._swapRows = function (x, y, columns, values, index, ptr) {
    // loop columns
    for (let j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      const k0 = ptr[j]
      const k1 = ptr[j + 1]
      // find value index @ x
      const kx = _getValueIndex(x, k0, k1, index)
      // find value index @ x
      const ky = _getValueIndex(y, k0, k1, index)
      // check both rows exist in matrix
      if (kx < k1 && ky < k1 && index[kx] === x && index[ky] === y) {
        // swap values (check for pattern matrix)
        if (values) {
          const v = values[kx]
          values[kx] = values[ky]
          values[ky] = v
        }
        // next column
        continue
      }
      // check x row exist & no y row
      if (kx < k1 && index[kx] === x && (ky >= k1 || index[ky] !== y)) {
        // value @ x (check for pattern matrix)
        const vx = values ? values[kx] : undefined
        // insert value @ y
        index.splice(ky, 0, y)
        if (values) { values.splice(ky, 0, vx) }
        // remove value @ x (adjust array index if needed)
        index.splice(ky <= kx ? kx + 1 : kx, 1)
        if (values) { values.splice(ky <= kx ? kx + 1 : kx, 1) }
        // next column
        continue
      }
      // check y row exist & no x row
      if (ky < k1 && index[ky] === y && (kx >= k1 || index[kx] !== x)) {
        // value @ y (check for pattern matrix)
        const vy = values ? values[ky] : undefined
        // insert value @ x
        index.splice(kx, 0, x)
        if (values) { values.splice(kx, 0, vy) }
        // remove value @ y (adjust array index if needed)
        index.splice(kx <= ky ? ky + 1 : ky, 1)
        if (values) { values.splice(kx <= ky ? ky + 1 : ky, 1) }
      }
    }
  }

  return SparseMatrix
}, { isClass: true })
