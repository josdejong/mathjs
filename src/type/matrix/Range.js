import { getArrayDataType } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import {
  isBigInt, isCollection, isIndex, isMatrix, isNumber, isRange
} from '../../utils/is.js'

const name = 'Range'
const dependencies = [
  'typed', 'typeOf', '?Index',
  'Matrix', '?DenseMatrix', 'size', 'getMatrixDataType',
  'one', 'zero', 'add', 'subtract', 'multiply', 'divide', 'scalarDivide',
  'floor', 'equal', 'smallerEq', 'isZero', 'isBounded',
  'number', 'numeric', 'format'
]

export const createRangeClass = /* #__PURE__ */ factory(name, dependencies, ({
  typed, typeOf, Index,
  Matrix, DenseMatrix, size, getMatrixDataType,
  one, zero, add, subtract, multiply, divide, scalarDivide,
  floor, equal, smallerEq, isZero, isBounded,
  number, numeric, format
}) => {
  // Helpers for constructor
  const attrs = 'from,til,by,for,to'.split(',')
  function isAttrs (thing) {
    if (!thing) return false
    if (typeof thing !== 'object') return false
    for (const key in thing) if (!attrs.includes(key)) return false
    return true
  }
  function getBdSegments (attributes) {
    let bound = null
    let segments = attributes.for
    if ('to' in attributes) {
      bound = attributes.to
      segments -= 1
    } else bound = attributes.til
    return [bound, segments]
  }

  /**
   * Range Matrix implementation.
   *
   * A Range is a matrix representing an arithmetic sequence. The
   * elements of a Range consist of the values of `a + sd`, where
   * `a` and `d` are any entities for which the relevant operations are
   * defined, and `s` is an integer number from 0 to one less than the
   * length of the Range. A common case is for `a` to be an integer number
   * and `d` to be 1, in which case the Range becomes a vector of
   * consecutive numbers. Ranges whose elements can be converted to numbers
   * may be used to index other Matrices.
   *
   * Note that Ranges are "lazy" in that the entries are not stored in memory,
   * but generated as needed. As a consequence, attempts to alter individual
   * entries of a Range will throw an error.
   *
   * Every range has the following attributes:
   *   * from: the first element of the Range (the value `a` above).
   *   * by: the step or common difference of the Range (the value `d` above).
   *   * for: the number of elements in the Range, or one more than the
   *     largest value of `s` above. Equal to the length of the Range. Note
   *     that `for` may be Infinity, so that a Range can represent an unending
   *     arithmetic progression.
   *
   * In addition, a Range may have one or both of the following attributes
   * and will have at least one of them if it has finitely many elements.
   *   * to: the inclusive final limit of the Range. This value must be
   *     of the form `a + td` for some number `t`, in which case the Range
   *     consists of `a + sd` for all nonnegative integers `s ≤ t`.
   *   * til: an exclusive limit of the Range. This value must be of the
   *     form `a + ud` for some number `u`, in which case the Range consists
   *     of `a + sd` for all nonnegative integers `s < u`.
   *
   * There is a consistency relation, in that if the `to` value is the `from`
   * value plus t times the `by` value, then the `for` value must be the floor
   * of t plus one. Similarly, if `til` is `from` plus u times `by`, then
   * `for` must be the ceiling of u. Note the `by` value can only be zero if
   * `for` is 0, 1, or infinite. Every element in such a range is equal to
   * the `from` value.
   *
   * A Range can be constructed from a plain object with any of the above
   * attributes, presuming they are consistent. In addition, for convenience
   * and backward compatibility, the first constructor argument (if any) that
   * is not of this form gives the `from` value, the second gives the `til`
   * value, and the third gives the `by` value.
   *
   * Because of the consistency relation and some convenience defaults, some
   * or even all of the attributes may be missing in the constructor. If any
   * are missing, they are filled for you in the following order:
   *   * by: filled in via consistency if `start`, `for`, and at least one
   *     of `to` and `til` are specified; otherwise set to the "one" value of
   *     the type of `to`, `til`, or `from` if specified, or the number
   *     1 if not.
   *   * from: filled in via consistency with `by` if `for` and at least one
   *     of `to` and `til` are specified; otherwise set to the zero value
   *     of the type of `to` or `til` if specified, or the number 0 if not.
   *   * for: filled in via consistency with `from` and `by` if at least one
   *     of `to` and `til` are specified; otherwise, set to 0.
   *
   * In addition, if the `for` value is finite, the following are set
   * whether or not they were specified, to canonicalize the attributes
   * of the Range (which makes it easier to use and interpret):
   *   * to: Set to `from` plus `by` times the `for` value minus one.
   *   * til: Set to `from` plus `by` times the `for` value.
   *
   * Note that the endpoints and increment may be specified with any type
   * handled by mathjs, but they must support the operations needed by Range
   * (addition, multiplication by an integer ordinary number, comparison).
   * The data type of the range is the data type of `from + n*by`, where `n`
   * is an integer number; the package assumes that this data type does not
   * depend on the value of `n`.
   *
   * Ranges support any non-modifying Matrix methods.
   *
   * Examples:
   *
   *     const c = new Range(2, 5)
   *     c.toArray()                           // [2, 3, 4]
   *     const b = new Range({from: 2, to: 5})
   *     b.toArray()                           // [2, 3, 4, 5]
   *
   *     const d = new Range(2, -2, -1)
   *     d.toArray()                           // [2, 1, 0, -1]
   *     const d2 = new Range(2, {by: -1}, -2) // same Range
   *
   *     const e = new Range(3n)               // 3n, 4n, 5n, ... forever
   *     e.toArray()                           // throws
   *     const f = new Range()                 // []
   *
   *     const g = new Range({for: 3, by: fraction(2, 3), til: 11})
   *     g.toArray()  // [fraction(9), fraction(29, 3), fraction(31, 3)]
   *
   * @class Range
   * @constructor Range
   * @param {number} start  included lower bound
   * @param {number} [step] step size, default value is 1
   * @param {number} end    included upper bound
   */
  function Range (...specs) {
    if (!(this instanceof Range)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }
    const attributes = {}
    for (const spec of specs) {
      if (isAttrs(spec)) {
        Object.assign(attributes, spec)
        break
      }
    }
    let role = 0
    let attrCount = 0
    for (const spec of specs) {
      if (isAttrs(spec)) {
        attrCount += 1
        if (attrCount > 1) {
          throw new Error('Only one attributes object may specify a Range')
        }
      } else {
        if (role === 3) {
          throw new Error(
            'Only from, til, and by allowed as arguments of Range constructor')
        }
        const key = attrs[role]
        if (key in attributes) {
          throw new Error(
            `May not specify Range attribute "${key}" via key and argument.`)
        }
        attributes[key] = spec
        role += 1
      }
    }

    // OK, we have extracted all of the specified attributes. Now fill in
    // the rest/canonicalize them as specified.
    if ('for' in attributes) {
      attributes.for = number(attributes.for)
    }
    if (attributes.by === undefined || attributes.by === null) {
      const prereqs = 'from' in attributes && 'for' in attributes
      if (prereqs && ('to' in attributes || 'til' in attributes)) {
        const [bound, segments] = getBdSegments(attributes)
        if (segments === 0) attributes.by = subtract(attributes.from, bound)
        else {
          const span = subtract(bound, attributes.from)
          // if the span is computed in bigints, we want a bigint increment
          let bigi = isBigInt(span)
          bigi ||= isMatrix(span) && span.datatype() === 'bigint'
          bigi ||= Array.isArray(span) && getArrayDataType(span) === 'bigint'
          const denominator = bigi ? BigInt(segments) : segments
          attributes.by = divide(span, denominator)
        }
      } else if ('to' in attributes) {
        attributes.by = one(attributes.to)
      } else if ('til' in attributes) {
        attributes.by = one(attributes.til)
      } else if ('from' in attributes) {
        attributes.by = one(attributes.from)
      } else attributes.by = 1
    } else if (!isBounded(attributes.by)) {
      throw new RangeError('A Range must have a finite increment')
    }
    // now that we have the increment b, we can choose the multiplication
    // operation. For n an integer JavaScript number, we want n*b to be
    // the sum of n copies of b. This relation is true for most types b can
    // have with mathjs multiply, but not with bigint (because e.g. 1.657 * 3n
    // should be 4.971, so we make it always number, not bigint).
    this.times = typed.find(multiply, ['number', typeOf(attributes.by)])
    const incr = attributes.by
    if (isBigInt(incr)) {
      this.times = (n, b) => BigInt(n) * b
    } else if (isMatrix(incr) && incr.datatype() === 'bigint') {
      const mult = typed.find(multiply, ['bigint', typeOf(incr)])
      this.times = (n, b) => mult(BigInt(n), b)
    } else if (Array.isArray(incr) && getArrayDataType(incr) === 'bigint') {
      const mult = typed.find(multiply, ['bigint', 'Array'])
      this.times = (n, b) => mult(BigInt(n), b)
    }
    if (attributes.from === undefined || attributes.from === null) {
      if ('for' in attributes && ('to' in attributes || 'til' in attributes)) {
        const [bound, segments] = getBdSegments(attributes)
        attributes.from = subtract(bound, this.times(segments, attributes.by))
      } else if ('to' in attributes) {
        attributes.from = zero(attributes.to)
      } else if ('til' in attributes) {
        attributes.from = zero(attributes.til)
      } else attributes.from = 0
    }
    if (!isBounded(attributes.from)) {
      throw new RangeError('A Range must start on a finite value')
    }

    if (attributes.for === undefined || attributes.for === null) {
      if ('to' in attributes) {
        if (!isBounded(attributes.to)) attributes.for = Infinity
        else {
          const rawFor = scalarDivide(
            subtract(attributes.to, attributes.from), attributes.by)
          if (rawFor === undefined) {
            let message = `No scalar multiple of ${attributes.by} takes `
            message += `${attributes.from} to ${attributes.to}`
            throw new Error(message)
          }
          attributes.for = Math.floor(number(rawFor)) + 1
        }
      } else if ('til' in attributes) {
        if (!isBounded(attributes.til)) attributes.for = Infinity
        else {
          const rawFor = scalarDivide(
            subtract(attributes.til, attributes.from), attributes.by)
          if (rawFor === undefined) {
            let message = `No scalar multiple of ${attributes.by} takes `
            message += `${attributes.from} to ${attributes.til}`
            throw new Error(message)
          }
          attributes.for = Math.ceil(number(rawFor))
        }
      } else attributes.for = 0
      if (attributes.for < 0) attributes.for = 0
    }
    if (Number.isFinite(attributes.for)) {
      attributes.for = Math.floor(attributes.for)
      // canonicalize limits
      attributes.to =
        add(attributes.from, this.times(attributes.for - 1, attributes.by))
      attributes.til =
        add(attributes.from, this.times(attributes.for, attributes.by))
    }

    Object.assign(this, attributes)
    // Canonicalize the type of from and by:
    this.from = add(this.from, this.times(0, this.by))
    this.by = this.times(1, this.by)

    // for backwards compatibility, some clients may use the
    // following properties:
    this.start = this.from
    this.step = this.by
    this.end = this.til

    // set up data type and operations

    this.plus = typed.find(add, [typeOf(this.from), typeOf(this.by)])
    const subsize = size(this.from)
    this.subcollection = !!subsize.length
    if (this.subcollection) {
      this._datatype = getMatrixDataType(this.from)
    } else this._datatype = typeOf(this.from)

    this._size = [this.for, ...subsize]
  }

  Range.prototype = new Matrix()

  /**
   * Attach type information
   */
  Object.defineProperty(Range, 'name', { value: 'Range' })
  Range.prototype.constructor = Range
  Range.prototype.type = 'Range'
  Range.prototype.isRange = true

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and inclusive limit,
   * separated by colons.
   * If the string does not contain a valid range, null is returned.
   * Note that currently only ordinary Javascript floating-point number
   * items are permitted for start, step, and end in this string notation.
   * For example str='0:2:11'.
   * If the string begins with a ':', 0 is filled in for the first value.
   * An optional second argument gives the value to use for the last value
   * if the string ends with a ':'.
   *
   * @memberof Range
   * @param {string} str
   * @param {?number} limit
   * @return {Range | null} range
   */
  Range.parse = function (str, limit = NaN) {
    if (typeof str !== 'string') {
      return null
    }
    const args = str.split(':').map(term => term.trim())
    const last = args.length - 1
    if (last < 1 || last > 2) return null
    const from = args[0].length === 0 ? 0 : parseFloat(args[0])
    if (isNaN(from)) return null
    const to = args[last].length === 0 ? limit : parseFloat(args[last])
    if (isNaN(last)) return null
    if (last === 1) return new Range({ from, to })
    const by = parseFloat(args[1])
    if (isNaN(by)) return null
    return new Range({ from, by, to })
  }
  // inject Range.parse into parent class for use by all Matrix implementations
  Matrix.parseRange = Range.parse

  /**
   * Get the datatype of the entries of the range.
   *
   * Usage:
   *     const format = range.datatype()   // retrieve renge datatype
   *
   * @memberof Range
   * @return {string}           The datatype.
   */
  Range.prototype.datatype = function () {
    return this._datatype
  }

  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     const format = range.storage()   // retrieve storage format
   *
   * @return {string}           The storage format.
   */
  Matrix.prototype.storage = function () {
    return 'range' // neither 'sparse' or 'dense' seemed fair
  }

  /**
   * Create a new Range from data if possible, otherwise DenseMatrix
   *
   * Note that to conform with the Matrix prototype, this should accept
   * an Array of the data and the datatype of the data. Hence, it attempts
   * to "reverse engineer" a Range that will encode that data with the
   * proper datatype, and if not, reverts to creating a DenseMatrix.
   *
   * @memberof Range
   * @param {Array} data
   * @param {string} [datatype]
   */
  Range.prototype.create = function (data, datatype) {
    if (data.length === 0) {
      return new Range({
        from: numeric(0, datatype),
        til: numeric(0, datatype)
      })
    }
    let from = data[0]
    if (datatype) from = numeric(from, datatype)
    if (data.length === 1) return new Range({ from, to: from })
    let to = data[data.length - 1]
    if (datatype) to = numeric(to, datatype)
    if (data.length === 2) {
      return new Range({ from, to, by: subtract(to, from) })
    }
    let entry = data[1]
    if (datatype) entry = numeric(entry, datatype)
    const by = subtract(entry, from)
    for (let i = 2; i < data.length; ++i) {
      entry = add(entry, by)
      if (!equal(entry, data[i])) {
        if (DenseMatrix) return new DenseMatrix(data, datatype)
        throw new Error('Data supplied is not in the form of a Range')
      }
    }
    return new Range({ from, to, by })
  }

  /**
   * Create a new Range
   *
   * Convenience method to call the constructor from an instance of Range.
   * Takes exactly the same possible arguments as the constructor.
   *
   * @memberof Range
   * @param {..args} arguments
   * @return {Range} fresh Range
   */
  Range.prototype.createRange = function (...args) {
    return new Range(...args)
  }

  /**
   * Create a clone of the range
   * @return {Range} clone
   */
  Range.prototype.clone = function () {
    const spec = {}
    for (const key of attrs) spec[key] = this[key]
    return new Range(spec)
  }

  /**
   * Get a subset of the range (replacement prohibited)
   *
   * Usage:
   *     const subset = range.subset(index)               // retrieve subset
   *
   * @param {Index} index
   */

  Range.prototype.subset = function (index, replacement, defaultValue) {
    if (replacement || defaultValue) {
      throw new Error('Replacement of a portion of a Range is not supported')
    }
    if (!isIndex(index)) throw new TypeError('Invalid index')
    const wanted = index.dimension(0)
    const sizes = index.size()
    if (isNumber(wanted)) {
      const item = this.layer(wanted)
      if (sizes.length === 1) return wanted
      if (!Index) {
        throw new Error('No Indexing into 2D Range without Matrix support')
      }
      // Caller thinks we can index into the result, have at it
      const newIndex = []
      for (let d = 1; d < sizes.length; ++d) newIndex.push(index.dimension(d))
      return item.subset(new Index(...newIndex))
    }
    if (!isRange(wanted) || sizes.length > 1) {
      // Punt to Matrix subsetting
      if (!DenseMatrix) {
        throw new Error('No general subset of Range without Matrix support')
      }
      return new DenseMatrix(this.toArray(), this._datatype).subset(index)
    }

    // Indexing a range by a single range produces a range
    if (this.for < wanted.for) {
      throw new Error('Cannot subset a Range by a longer Range')
    }
    if (!Number.isFinite(wanted.for)) {
      return new Range({
        from: this.layer(wanted.from),
        by: this.by * wanted.by
      })
    }
    return new Range({
      from: this.layer(wanted.from),
      to: this.layer(wanted.to),
      by: this.by * wanted.by
    })
  }

  /**
   * Get the entry at an integer position in a Range.
   * @memberof Range
   * @param {number} which   Zero-based position
   * @return {*} value
   */
  Range.prototype.layer = function (index) {
    if (index < 0 || index >= this.for) {
      throw new RangeError('index out of Range')
    }
    return this.plus(this.from, this.times(index, this.by))
  }

  /**
   * Get a single element from a Range.
   * @memberof Range
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */
  Range.prototype.get = function (index) {
    const item = this.layer(index[0])
    if (index.length === 1) return item
    return item.get(index.slice(1))
  }

  /**
   * Replacing a single element of a Range is not supported
   */
  Range.prototype.set = function () {
    throw new Error(
      'Replacement of an element of a Range is not supported')
  }

  /**
   * Resize the Range to the given size. Returns a fresh Matrix when
   * `copy=true`, otherwise fails because a Range cannot be resized in place.
   *
   * @memberof Range
   * @param {number[] || Matrix} size The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  Range.prototype.resize = function (size, defaultValue, copy) {
    // validate arguments
    if (!isCollection(size)) {
      throw new TypeError('Array or Matrix expected for new size')
    }
    if (!copy) throw new Error('A Range cannot be resized in place')
    if (!DenseMatrix) {
      throw new Error('No Range resize without Matrix support')
    }
    const mat = new DenseMatrix(this.valueOf(), this._datatype)
    return mat.resize(size, defaultValue)
  }

  /**
   * Reshape the Range to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise fails because a Range cannot be reshaped.
   *
   * @memberof Range
   * @param {number[]} size           The new size the matrix should have.
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */
  Range.prototype.reshape = function (size, copy) {
    if (!copy) throw new Error('A Range cannot be reshaped in place')
    if (!DenseMatrix) {
      throw new Error('No Range reshape without Matrix support')
    }
    return new DenseMatrix(this.valueOf(), this._datatype).reshape(size)
  }

  /**
   * Retrieve the size of the Range.
   * Returns an array containing one number, the number of elements in the range.
   * @memberof Range
   * @returns {number[]} size
   */
  Range.prototype.size = function () {
    return this._size
  }

  /**
   * Calculate the minimum value in the range
   * @memberof Range
   * @return {number | undefined} min
   */
  Range.prototype.min = function () {
    if (!this.for) return undefined
    if (smallerEq(this.from, this.to)) return this.from
    return this.to
  }

  /**
   * Calculate the maximum value in the range
   * @memberof Range
   * @return {number | undefined} max
   */
  Range.prototype.max = function () {
    if (!this.for) return undefined
    if (smallerEq(this.from, this.to)) return this.to
    return this.from
  }

  /**
   * Execute a callback function for each value in theRrange.
   * @memberof Range
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Range being traversed.
   * @param {boolean} skipZeros   If true, the callback function is invoked only for non-zero entries
   * @param {boolean} isUnary     If true, the callback function is invoked with one parameter
   */
  Range.prototype.forEach = function (
    callback, skipZeros = false, isUnary = false
  ) {
    if (!Number.isFinite(this.for)) throw new Error('Attempt to infinite loop')
    let x = this.from
    for (let i = 0; i < this.for; ++i) {
      if (this.subcollection) {
        if (isUnary) x.forEach(callback, skipZeros, isUnary)
        else {
          const me = this
          x.forEach((val, ix) => callback(val, [i, ...ix], me), skipZeros)
        }
      } else {
        if (skipZeros && isZero(x)) continue
        if (isUnary) callback(x)
        else callback(x, [i], this)
      }
      x = this.plus(x, this.by)
    }
  }

  /**
   * Iterate over the range elements
   * @return {Iterable<{ value, index: number[] }>}
   */
  Range.prototype[Symbol.iterator] = function * () {
    let x = this.from
    for (let i = 0; i < this.for; ++i) {
      if (this.subcollection) {
        for (const { value, ix } of x) yield ({ value, index: [i, ...ix] })
      } else yield ({ value: x, index: [i] })
      x = this.plus(x, this.by)
    }
  }

  /**
   * Execute a callback function for each value in the Range, and return the
   * results as a Matrix
   * @memberof Range
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Range being traversed.
   * @returns {Array} array
   */
  Range.prototype.map = function (
    callback, skipZeros = false, isUnary = false
  ) {
    if (!Number.isFinite(this.for)) throw new Error('Attempt to infinite loop')
    const array = []
    let x = this.from
    for (let i = 0; i < this.for; ++i) {
      if (this.subcollection) {
        if (isUnary) array.push(x.map(callback, skipZeros, isUnary))
        else {
          const me = this
          array.push(
            x.map((val, ix) => callback(val, [i, ...ix], me), skipZeros))
        }
      } else {
        if (skipZeros && isZero(x)) continue
        if (isUnary) array.push(callback(x))
        else array.push(callback(x, [i], this))
      }
      x = this.plus(x, this.by)
    }
    if (DenseMatrix) return new DenseMatrix(array)
    return array
  }

  /**
   * Returns an array containing the rows of a 2D Range
   * @returns {Array<Matrix>}
   */
  Range.prototype.rows = function () {
    if (!Number.isFinite(this.for)) throw new Error('Attempt to infinite loop')
    if (this._size.length !== 2) {
      throw new TypeError('Rows can only be returned for a 2D matrix.')
    }
    const result = []
    let x = this.from
    for (let i = 0; i < this.for; ++i) {
      if (DenseMatrix) result.push(new DenseMatrix(x, this._datatype))
      else result.push(x)
      x = this.plus(x, this.by)
    }
    return result
  }

  /**
   * Returns an array containing the columns of a 2D Range
   * @returns {Array<Matrix>}
   */
  Range.prototype.columns = function () {
    if (!Number.isFinite(this.for)) throw new Error('Attempt to infinite loop')
    if (this._size.length !== 2) {
      throw new TypeError('Rows can only be returned for a 2D matrix.')
    }
    const colArrays = []
    let x = this.from
    if (this.for) for (const { value } of x) colArrays.push([value])
    for (let i = 1; i < this.for; ++i) {
      x = this.plus(x, this.by)
      for (const { value, ix } of x) colArrays[ix[0]].push(value)
    }
    if (DenseMatrix) {
      return colArrays.map(arr => new DenseMatrix(arr, this._datatype))
    }
    return colArrays
  }

  /**
   * Create an Array with a copy of the Range data
   * @memberof Range
   * @returns {Array} array
   */
  Range.prototype.toArray = function () {
    if (!Number.isFinite(this.for)) throw new Error('Attempt to infinite loop')
    const array = []
    let x = this.from
    for (let i = 0; i < this.for; ++i) {
      if (this.subcollection) array.push(x.valueOf())
      else array.push(x)
      x = this.plus(x, this.by)
    }
    return array
  }

  /**
   * Get the primitive value of the Range, a one dimensional array
   * @memberof Range
   * @returns {Array} array
   */
  Range.prototype.valueOf = function () {
    // TODO: implement a caching mechanism for range.valueOf()
    return this.toArray()
  }

  /**
   * Get a string representation of the range, with optional formatting options.
   * Output is formatted as 'start:step:end', for example '2:6' or '0:0.2:11'
   * Note that the result is not guaranteed to be parseable unless the
   * data type of the Range is `number`
   * @memberof Range
   * @param {Object | number | function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  Range.prototype.format = function (options = {}) {
    let str = format(this.from, options)
    if (this.subcollection || this.by !== one(this.from)) {
      str += ':' + format(this.by, options)
    }
    str += ':' + format(this.to, options)
    return str
  }

  /**
   * Get a string representation of the range.
   * @memberof Range
   * @returns {string}
   */
  Range.prototype.toString = function () {
    return this.format()
  }

  /**
   * Return itself if it has datatype number, otherwise a new similar range
   * consisting of numbers.
   * @memberof Range
   * @returns {Range}
   */
  Range.prototype.toNumber = function () {
    if (this._datatype === 'number') return this
    return new Range({
      from: number(this.from), by: number(this.by), for: this.for
    })
  }

  /**
   * Get a JSON representation of the range
   * @memberof Range
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Range", ...rangeAttributes}`
   */
  Range.prototype.toJSON = function () {
    const json = { mathjs: 'Range' }
    for (const key of attrs) {
      const attr = this[key]
      if (attr === undefined || attr === null) continue
      if (typeof attr === 'object' && 'toJSON' in attr) {
        json[key] = attr.toJSON()
      } else json[key] = attr
    }
    return json
  }

  /**
   * Instantiate a Range from a JSON object
   * @memberof Range
   * @param {Object} json A JSON object structured as:
   *                      `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
   * @return {Range}
   */
  Range.fromJSON = function (json) {
    const spec = {}
    // backwards compatibility
    if (typeof json === 'object') {
      if ('start' in json) spec.from = json.start
      if ('end' in json) spec.til = json.end
      if ('step' in json) spec.by = json.step
    }
    for (const key of attrs) {
      const item = json[key]
      if (item === undefined || item === null) continue
      if (typeof item === 'object' && 'fromJSON' in item) {
        spec[key] = item.fromJSON()
      } else spec[key] = item
    }
    return new Range(spec)
  }

  return Range
}, { isClass: true })
