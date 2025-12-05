import { getArrayDataType } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { parseRange } from '../../utils/collection.js'
import {
  isBigInt, isBigNumber, isCollection, isComplex, isFraction,
  isIndex, isMatrix, isNumber, isRange, isUnit
} from '../../utils/is.js'

const name = 'Range'
const dependencies = [
  'typed', 'typeOf', '?Index', '?BigNumber', '?Fraction', '?Complex',
  'Matrix', '?DenseMatrix', 'size', 'getMatrixDataType',
  'one', 'zero', 'add', 'subtract', 'multiply', 'divide', 'scalarDivide',
  'floor', 'equal', 'smallerEq', 'largerEq', 'isZero', 'isBounded',
  'number', 'numeric', 'format'
]

// Some optimized operator functions used for special cases below. We
// make them constants up here rather than generate them on the fly so that
// they will not disrupt `deepStrictEqual`
const identity = n => n
const toBigInt = n => BigInt(n)
const byBigInt = (n, b) => BigInt(n) * b

export const createRangeClass = /* #__PURE__ */ factory(name, dependencies, ({
  typed, typeOf, Index, BigNumber, Fraction, Complex,
  Matrix, DenseMatrix, size, getMatrixDataType,
  one, zero, add, subtract, multiply, divide, scalarDivide,
  floor, equal, smallerEq, largerEq, isZero, isBounded,
  number, numeric, format
}) => {
  // Helpers for constructor; note the canonical attributes correspond positionally
  // two-to-one with the first list of attributes that are available for external use
  const attrs = 'start,end,step,length,last'.split(',')
  const enoughAttrs = ['start', 'step', 'length'] // determine range uniquely
  function isAttrs (thing) {
    if (!thing) return false
    if (typeof thing !== 'object') return false
    for (const key in thing) if (!attrs.includes(key)) return false
    return true
  }
  function getBdSegments (attributes) {
    let bound = null
    let segments = attributes.length
    if ('last' in attributes) {
      bound = attributes.last
      segments -= 1
    } else bound = attributes.end
    return [bound, segments]
  }
  // More optimized operator functions, see above.
  const toBigNumber = n => new BigNumber(n)
  const toFraction = n => new Fraction(n)
  const toComplex = n => new Complex(n)
  const multBigIntArray = typed.find(multiply, ['bigint', 'Array'])
  const arrayByBigint = (n, b) => multBigIntArray(BigInt(n), b)
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
   * Every Range has several attributes that determine its entries. Once
   * constructed, these attributes cannot be changed; they are read-only.
   *
   * Every Range has these attributes:
   *   * start: the first element of the Range (the value `a` above).
   *   * step: the step or common difference of the Range (the value `d` above).
   *   * length: the number of elements in the Range, or one more than the
   *     largest value of `s` above. Note that this attribute may be Infinity,
   *     so that a Range can represent an unending arithmetic progression.
   *
   * In addition, a Range may have one or both of the following attributes:
   *   * last: the inclusive final limit of the Range. This value must be
   *     of the form `a + td` for some number `t`, in which case the Range
   *     consists of `a + sd` for all nonnegative integers `s ≤ t`.
   *   * end: an exclusive limit of the Range. This value must be of the
   *     form `a + ud` for some number `u`, in which case the Range consists
   *     of `a + sd` for all nonnegative integers `s < u`.
   *
   * There is a consistency relation, in that if the last value is the start
   * value plus _t_ times the step value, then the length must be the floor
   * of _t_ plus one. Similarly, if the end value is the start value plus _u_
   * times the step, then the length must be the ceiling of u. If the step
   * of a Range is zero, then it generally does not have an end or last value
   * to avoid breaking this consistency relation.
   *
   * A Range can be constructed from a plain object with any of the above
   * attributes, presuming they are consistent. In addition, for convenience
   * and backward compatibility, the first constructor argument (if any) that
   * is not of this form gives the start value, the second gives the end
   * value, and the third gives the step value.
   *
   * Because of the consistency relation and defaults provided for convenience,
   * some or even all of the attributes may be missing in the constructor.
   * If any are missing, they are deduced for you in the following order:
   *   * step: filled in via consistency if start, length, and at least one
   *     of last and end are specified; otherwise set to the "one" value of
   *     the type of start, last, or end if specified, or the number 1 if not.
   *   * start: filled in via consistency with the step if length and at
   *     least one of last and end are specified; otherwise set to the "zero"
   *     value of the type of last or end if specified, or the number 0 if not.
   *   * length: filled in via consistency with start and step if at least
   *     one of last and end are specified; otherwise, set to 0.
   *
   * In addition, if the length value is finite and the step is nonzero, the
   * following are set whether or not they were specified, to canonicalize
   * the attributes of the Range (which makes it easier to use and interpret):
   *   * last: Set to the start value plus the step times the length
   *     minus one.
   *   * end: Set to the start value plus the step times the length.
   *
   * Note that the endpoints and increment may be specified with any type
   * handled by mathjs, but they must support the operations needed by Range
   * (addition, multiplication by an integer ordinary number, comparison).
   * The data type of the range is the data type of `start + n*step`, where `n`
   * is an integer number; the package assumes that this data type does not
   * depend on the value of `n`.
   *
   * Ranges support any non-modifying Matrix methods.
   *
   * Examples:
   *
   *     const c = new Range(2, 5)
   *     c.toArray()                           // [2, 3, 4]
   *     const b = new Range({start: 2, last: 5})
   *     b.toArray()                           // [2, 3, 4, 5]
   *     new Range({start: 2, end: 5})         // [2, 3, 4]
   *
   *     const d = new Range(2, -2, -1)
   *     d.toArray()                           // [2, 1, 0, -1]
   *     const d2 = new Range(2, {step: -1}, -2) // same Range
   *
   *     const e = new Range(3n)               // 3n, 4n, 5n, ... forever
   *     e.toArray()                           // throws
   *     const f = new Range()                 // []
   *
   *     const g = new Range({start: 9, step: fraction(2, 3), end: 11})
   *     g.toArray()  // [fraction(9), fraction(29, 3), fraction(31, 3)]
   *
   * @class Range
   * @constructor Range
   * @param {number} [start]  included lower bound
   * @param {number} [end]    excluded upper bound
   * @param {number} [step]   step size, default value is 1
   */
  function Range (...specs) {
    if (!(this instanceof Range)) {
      throw new SyntaxError('Constructor must be called with the new operator')
    }

    const attributes = {}
    // Read the first object supplying attributes, if any
    for (const spec of specs) {
      if (isAttrs(spec)) {
        Object.assign(attributes, spec)
        break
      }
    }
    let role = 0
    let attrCount = 0
    // Now interpret the positional arguments, ignoring one attributes object
    for (const spec of specs) {
      if (isAttrs(spec)) {
        attrCount += 1
        if (attrCount > 1) {
          throw new Error('Only one attributes object may specify a Range')
        }
      } else {
        if (role === 3) {
          throw new Error(
            'Only start, end, and step allowed as positional arguments ' +
            'of Range constructor')
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
    // First make sure the length is a number
    if ('length' in attributes) {
      attributes.length = number(attributes.length)
    }
    // Now deduce "step" if necessary
    if (attributes.step === undefined || attributes.step === null) {
      const prereqs = 'start' in attributes && 'length' in attributes
      if (prereqs && ('last' in attributes || 'end' in attributes)) {
        const [bound, segments] = getBdSegments(attributes)
        if (segments === 0) attributes.step = zero(attributes.start)
        else {
          const span = subtract(bound, attributes.start)
          // if the span is computed in bigints, we want a bigint increment
          let bigi = isBigInt(span)
          bigi ||= isMatrix(span) && span.datatype() === 'bigint'
          bigi ||= Array.isArray(span) && getArrayDataType(span) === 'bigint'
          const denominator = bigi ? BigInt(segments) : segments
          attributes.step = divide(span, denominator)
        }
      } else if ('start' in attributes) {
        attributes.step = one(attributes.start)
      } else if ('last' in attributes) {
        attributes.step = one(attributes.last)
      } else if ('end' in attributes) {
        attributes.step = one(attributes.end)
      } else attributes.step = 1
    } else if (!isBounded(attributes.step)) {
      throw new RangeError('A Range must have a finite increment')
    }
    // Now that we have the increment b, we can choose the multiplication
    // operation. For n an integer JavaScript number, we want n*b to be the sum
    // of n copies of b. If we simply use mathjs multiply, this property will
    // hold for most types b might have, but not for bigint (because e.g.
    // 1.657 * 3n should be 4.971, so mathjs makes that combination always
    // return number, not bigint). So we need to take care in choosing what
    // function we will use to multiply:
    this.times = typed.find(multiply, ['number', typeOf(attributes.step)])
    const incr = attributes.step
    // Special cases for times (for speedup when increment is 1)
    if (!isUnit(incr) && equal(incr, 1)) {
      if (isNumber(incr)) this.times = identity
      else if (isBigInt(incr)) this.times = toBigInt
      else if (isBigNumber(incr)) this.times = toBigNumber
      else if (isFraction(incr)) this.times = toFraction
      else if (isComplex(incr)) this.times = toComplex
    } else if (isBigInt(incr)) { // and special cases b/c of bigint conversions
      this.times = byBigInt
    } else if (isMatrix(incr) && incr.datatype() === 'bigint') {
      const mult = typed.find(multiply, ['bigint', typeOf(incr)])
      this.times = (n, b) => mult(BigInt(n), b)
    } else if (Array.isArray(incr) && getArrayDataType(incr) === 'bigint') {
      this.times = arrayByBigint
    }

    // Next deduce "start" if necessary
    if (attributes.start === undefined || attributes.start === null) {
      if ('length' in attributes &&
        ('last' in attributes || 'end' in attributes)
      ) {
        const [bound, segments] = getBdSegments(attributes)
        attributes.start = subtract(
          bound, this.times(segments, attributes.step))
      } else if ('last' in attributes) {
        attributes.start = zero(attributes.last)
      } else if ('end' in attributes) {
        attributes.start = zero(attributes.end)
      } else attributes.start = zero(attributes.step)
    }
    if (!isBounded(attributes.start)) {
      throw new RangeError('A Range must start on a finite value')
    }

    // Now deduce length if need be
    if (attributes.length === undefined || attributes.length === null) {
      if ('last' in attributes) {
        if (!isBounded(attributes.last)) attributes.length = Infinity
        else {
          const rawLength = scalarDivide(
            subtract(attributes.last, attributes.start), attributes.step)
          if (rawLength === undefined) {
            let message = `No scalar multiple of ${attributes.step} takes `
            message += `${attributes.start} to ${attributes.last}`
            throw new Error(message)
          }
          attributes.length = Math.floor(number(rawLength)) + 1
        }
      } else if ('end' in attributes) {
        if (!isBounded(attributes.end)) attributes.length = Infinity
        else {
          const rawLength = scalarDivide(
            subtract(attributes.end, attributes.start), attributes.step)
          if (rawLength === undefined) {
            let message = `No scalar multiple of ${attributes.step} takes `
            message += `${attributes.start} to ${attributes.end}`
            throw new Error(message)
          }
          attributes.length = Math.ceil(number(rawLength))
        }
      } else attributes.length = 0
    }
    if (attributes.length < 0) attributes.length = 0

    // Finally fill in last and end as appropriate
    if (Number.isFinite(attributes.length)) {
      attributes.length = Math.floor(attributes.length)
      // canonicalize limits
      if (isZero(attributes.step)) {
        // We certainly know the last entry:
        attributes.last = attributes.start
        // But there is no way to have an exclusive limit unless the
        // length is zero
        attributes.end =
          attributes.length === 0 ? attributes.start : undefined
      } else {
        attributes.last = add(
          attributes.start, this.times(attributes.length - 1, attributes.step))
        attributes.end = add(attributes.last, attributes.step)
      }
    } else {
      attributes.last = undefined
      attributes.end = undefined
    }

    // Canonicalize the type of start to match all the other values:
    attributes.start = add(attributes.start, this.times(0, attributes.step))

    // set up data type and remaining operations
    this.plus = typed.find(
      add, [typeOf(attributes.start), typeOf(this.times(1, attributes.step))])
    const subsize = size(attributes.step)
    this.subcollection = !!subsize.length
    if (this.subcollection) {
      this._datatype = getMatrixDataType(attributes.start)
    } else this._datatype = typeOf(attributes.start)

    this._size = [attributes.length, ...subsize]

    // Finally, set up the read-only properties:
    for (const key of attrs) {
      Object.defineProperty(this, key, {
        value: attributes[key],
        enumerable: true
      })
    }
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
   * [DEPRECATED; use `math.parse` directly] Parse a string into a range.
   * The string contains the start, optional step, and end, separated by colons.
   * If the string does not contain a valid range, null is returned.
   * Note that currently only ordinary Javascript floating-point number
   * items are permitted for start, step, and end in this string notation.
   * For example str='0:2:11'.
   * The default step, if it is not specified, is 1.
   * If the string begins with a ':', 0 is filled in for the first value.
   * If it ends with a ':', Infinity is filled in for the last value.
   * By default, the end value is excluded from the range.
   *
   * @memberof Range
   * @param {string} str
   * @param {?number} limit
   * @return {Range | null} range
   */
  Range.parse = function (str) {
    if (Range.parseMethodMustWarn) {
      console.warn(
        'Using deprecated class method Range.parse(); ' +
        'use library function math.parse() instead.')
      Range.parseMethodMustWarn = false
    }

    if (typeof str !== 'string') return null
    const fields = parseRange(str)
    if (fields === null) return null
    if (fields.start === '') fields.start = '0'
    if (fields.end === '') fields.end = 'Infinity'
    if (fields.step === '') fields.step = '1'
    for (const key in fields) {
      const value = Number(fields[key])
      if (isNaN(value)) return null
      fields[key] = value
    }
    return new Range(fields)
  }
  // inject Range constructor into parent class,
  // for use by all Matrix implementations
  Matrix.createRange = function (...args) {
    return new Range(...args)
  }

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
   * Get the matrix type
   *
   * Usage:
   *    const matrixType = matrix.getDataType()  // retrieves the matrix type
   *
   * @memberOf Range
   * @return {string}   type information
   */
  Range.prototype.getDataType = function () {
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
        start: numeric(0, datatype),
        end: numeric(0, datatype)
      })
    }
    let start = data[0]
    if (datatype) start = numeric(start, datatype)
    if (data.length === 1) return new Range({ start, last: start })
    let last = data[data.length - 1]
    if (datatype) last = numeric(last, datatype)
    if (data.length === 2) {
      return new Range({ start, last, stap: subtract(last, start) })
    }
    let entry = data[1]
    if (datatype) entry = numeric(entry, datatype)
    const step = subtract(entry, start)
    for (let i = 2; i < data.length; ++i) {
      entry = add(entry, step)
      if (!equal(entry, data[i])) {
        if (DenseMatrix) return new DenseMatrix(data, datatype)
        throw new Error('Data supplied is not in the form of a Range')
      }
    }
    return new Range({ start, last, step })
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
    for (const key of enoughAttrs) spec[key] = this[key]
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
      throw new Error('Ranges are immutable, cannot replace entries')
    }
    if (!isIndex(index)) throw new TypeError('Invalid index')
    index = Matrix.parseWithinIndex(index, this._size)
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
    if (this.length < wanted.length) {
      throw new Error('Cannot subset a Range by a longer Range')
    }
    if (!Number.isFinite(wanted.length)) {
      return new Range({
        start: this.layer(wanted.start),
        step: this.step * wanted.step
      })
    }
    return new Range({
      start: this.layer(wanted.start),
      end: this.layer(wanted.end),
      step: this.step * wanted.step
    })
  }

  /**
   * Get the entry at an integer position in a Range.
   * @memberof Range
   * @param {number} which   Zero-based position
   * @return {*} value
   */
  Range.prototype.layer = function (index) {
    if (index < 0 || index >= this.length) {
      throw new RangeError('index out of Range')
    }
    return this.plus(this.start, this.times(index, this.step))
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
    if (this.length === 0) return undefined
    if (this.length === 1) return this.start
    if (this.subcollection) {
      throw new TypeError('Elements of sequence are collections, so unordered')
    }
    if (Number.isFinite(this.length)) {
      return smallerEq(this.start, this.last) ? this.start : this.last
    }
    // Infinite sequence
    return smallerEq(this.start, this.layer(1)) ? this.start : undefined
  }

  /**
   * Calculate the maximum value in the range
   * @memberof Range
   * @return {number | undefined} max
   */
  Range.prototype.max = function () {
    if (this.length === 0) return undefined
    if (this.length === 1) return this.start
    if (this.subcollection) {
      throw new TypeError('Elements of sequence are collections, so unordered')
    }
    if (Number.isFinite(this.length)) {
      return largerEq(this.start, this.last) ? this.start : this.last
    }
    // Infinite sequence
    return largerEq(this.start, this.layer(1)) ? this.start : undefined
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
    if (!Number.isFinite(this.length)) throw new Error('Attempt to infinite loop')
    let x = this.start
    for (let i = 0; i < this.length; ++i) {
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
      x = this.plus(x, this.step)
    }
  }

  /**
   * Iterate over the range elements
   * @return {Iterable<{ value, index: number[] }>}
   */
  Range.prototype[Symbol.iterator] = function * () {
    let x = this.start
    for (let i = 0; i < this.length; ++i) {
      if (this.subcollection) {
        for (const { value, ix } of x) yield ({ value, index: [i, ...ix] })
      } else yield ({ value: x, index: [i] })
      x = this.plus(x, this.step)
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
    if (!Number.isFinite(this.length)) {
      throw new Error(
        'Attempt to infinite loop Range with ' +
        `start=${this.start} step=${this.step}`)
    }
    const array = []
    let x = this.start
    for (let i = 0; i < this.length; ++i) {
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
      x = this.plus(x, this.step)
    }
    if (DenseMatrix) return new DenseMatrix(array)
    return array
  }

  /**
   * Returns an array containing the rows of a 2D Range
   * @returns {Array<Matrix>}
   */
  Range.prototype.rows = function () {
    if (!Number.isFinite(this.length)) {
      throw new Error('Attempt to infinite loop')
    }
    if (this._size.length !== 2) {
      throw new TypeError('Rows can only be returned for a 2D matrix.')
    }
    const result = []
    let x = this.start
    for (let i = 0; i < this.length; ++i) {
      if (DenseMatrix) result.push(new DenseMatrix(x, this._datatype))
      else result.push(x)
      x = this.plus(x, this.step)
    }
    return result
  }

  /**
   * Returns an array containing the columns of a 2D Range
   * @returns {Array<Matrix>}
   */
  Range.prototype.columns = function () {
    if (!Number.isFinite(this.length)) {
      throw new Error('Attempt to infinite loop')
    }
    if (this._size.length !== 2) {
      throw new TypeError('Rows can only be returned for a 2D matrix.')
    }
    const colArrays = []
    let x = this.start
    if (this.length) for (const { value } of x) colArrays.push([value])
    for (let i = 1; i < this.length; ++i) {
      x = this.plus(x, this.step)
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
    if (!Number.isFinite(this.length)) {
      throw new Error('Attempt to infinite loop')
    }
    const array = []
    let x = this.start
    for (let i = 0; i < this.length; ++i) {
      if (this.subcollection) array.push(x.valueOf())
      else array.push(x)
      x = this.plus(x, this.step)
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
    let str = format(this.start, options)
    if (this.subcollection || this.step !== one(this.start)) {
      str += ':' + format(this.step, options)
    }
    str += ':' + format(this.end, options)
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
      start: number(this.start), step: number(this.step), length: this.length
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
    for (const key of enoughAttrs) {
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
   *    `{"mathjs": "Range", "start": 2, "step": 1, "length": 3}`
   * @return {Range}
   */
  Range.fromJSON = function (json) {
    const spec = {}
    for (const key of attrs) {
      const item = json[key]
      if (item === undefined || item === null) continue
      if (typeof item === 'object' && 'fromJSON' in item) {
        spec[key] = item.fromJSON()
      } else spec[key] = item
    }
    return new Range(spec)
  }

  Range.parseMethodMustWarn = true

  return Range
}, { isClass: true })
