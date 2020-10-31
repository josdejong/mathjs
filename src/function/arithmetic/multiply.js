import { factory } from '../../utils/factory'
import { isMatrix } from '../../utils/is'
import { extend } from '../../utils/object'
import { arraySize } from '../../utils/array'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14'

const name = 'multiply'
const dependencies = [
  'typed',
  'matrix',
  'addScalar',
  'multiplyScalar',
  'equalScalar',
  'dot'
]

export const createMultiply = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, addScalar, multiplyScalar, equalScalar, dot }) => {
  const algorithm11 = createAlgorithm11({ typed, equalScalar })
  const algorithm14 = createAlgorithm14({ typed })

  function _validateMatrixDimensions (size1, size2) {
    // check left operand dimensions
    switch (size1.length) {
      case 1:
        // check size2
        switch (size2.length) {
          case 1:
            // Vector x Vector
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vectors must have the same length')
            }
            break
          case 2:
            // Vector x Matrix
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vector length (' + size1[0] + ') must match Matrix rows (' + size2[0] + ')')
            }
            break
          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)')
        }
        break
      case 2:
        // check size2
        switch (size2.length) {
          case 1:
            // Matrix x Vector
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix columns (' + size1[1] + ') must match Vector length (' + size2[0] + ')')
            }
            break
          case 2:
            // Matrix x Matrix
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix A columns (' + size1[1] + ') must match Matrix B rows (' + size2[0] + ')')
            }
            break
          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)')
        }
        break
      default:
        throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix A has ' + size1.length + ' dimensions)')
    }
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (N)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {number}             Scalar value
   */
  function _multiplyVectorVector (a, b, n) {
    // check empty vector
    if (n === 0) { throw new Error('Cannot multiply two empty vectors') }
    return dot(a, b)
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Matrix         (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */
  function _multiplyVectorMatrix (a, b) {
    // process storage
    if (b.storage() !== 'dense') {
      throw new Error('Support for SparseMatrix not implemented')
    }
    return _multiplyVectorDenseMatrix(a, b)
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Dense Matrix   (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */
  function _multiplyVectorDenseMatrix (a, b) {
    // a dense
    const adata = a._data
    const asize = a._size
    const adt = a._datatype
    // b dense
    const bdata = b._data
    const bsize = b._size
    const bdt = b._datatype
    // rows & columns
    const alength = asize[0]
    const bcolumns = bsize[1]

    // datatype
    let dt
    // addScalar signature to use
    let af = addScalar
    // multiplyScalar signature to use
    let mf = multiplyScalar

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt])
      mf = typed.find(multiplyScalar, [dt, dt])
    }

    // result
    const c = []

    // loop matrix columns
    for (let j = 0; j < bcolumns; j++) {
      // sum (do not initialize it with zero)
      let sum = mf(adata[0], bdata[0][j])
      // loop vector
      for (let i = 1; i < alength; i++) {
        // multiply & accumulate
        sum = af(sum, mf(adata[i], bdata[i][j]))
      }
      c[j] = sum
    }

    // return matrix
    return a.createDenseMatrix({
      data: c,
      size: [bcolumns],
      datatype: dt
    })
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {Matrix}             Dense Vector   (M)
   */
  const _multiplyMatrixVector = typed('_multiplyMatrixVector', {
    'DenseMatrix, any': _multiplyDenseMatrixVector,
    'SparseMatrix, any': _multiplySparseMatrixVector
  })

  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Matrix         (NxC)
   *
   * @return {Matrix}             Matrix         (MxC)
   */
  const _multiplyMatrixMatrix = typed('_multiplyMatrixMatrix', {
    'DenseMatrix, DenseMatrix': _multiplyDenseMatrixDenseMatrix,
    'DenseMatrix, SparseMatrix': _multiplyDenseMatrixSparseMatrix,
    'SparseMatrix, DenseMatrix': _multiplySparseMatrixDenseMatrix,
    'SparseMatrix, SparseMatrix': _multiplySparseMatrixSparseMatrix
  })

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix  (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             Dense Vector (M)
   */
  function _multiplyDenseMatrixVector (a, b) {
    // a dense
    const adata = a._data
    const asize = a._size
    const adt = a._datatype
    // b dense
    const bdata = b._data
    const bdt = b._datatype
    // rows & columns
    const arows = asize[0]
    const acolumns = asize[1]

    // datatype
    let dt
    // addScalar signature to use
    let af = addScalar
    // multiplyScalar signature to use
    let mf = multiplyScalar

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt])
      mf = typed.find(multiplyScalar, [dt, dt])
    }

    // result
    const c = []

    // loop matrix a rows
    for (let i = 0; i < arows; i++) {
      // current row
      const row = adata[i]
      // sum (do not initialize it with zero)
      let sum = mf(row[0], bdata[0])
      // loop matrix a columns
      for (let j = 1; j < acolumns; j++) {
        // multiply & accumulate
        sum = af(sum, mf(row[j], bdata[j]))
      }
      c[i] = sum
    }

    // return matrix
    return a.createDenseMatrix({
      data: c,
      size: [arows],
      datatype: dt
    })
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            DenseMatrix    (NxC)
   *
   * @return {Matrix}             DenseMatrix    (MxC)
   */
  function _multiplyDenseMatrixDenseMatrix (a, b) {
    // a dense
    const adata = a._data
    const asize = a._size
    const adt = a._datatype
    // b dense
    const bdata = b._data
    const bsize = b._size
    const bdt = b._datatype
    // rows & columns
    const arows = asize[0]
    const acolumns = asize[1]
    const bcolumns = bsize[1]

    // datatype
    let dt
    // addScalar signature to use
    let af = addScalar
    // multiplyScalar signature to use
    let mf = multiplyScalar

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt])
      mf = typed.find(multiplyScalar, [dt, dt])
    }

    // result
    const c = []

    // loop matrix a rows
    for (let i = 0; i < arows; i++) {
      // current row
      const row = adata[i]
      // initialize row array
      c[i] = []
      // loop matrix b columns
      for (let j = 0; j < bcolumns; j++) {
        // sum (avoid initializing sum to zero)
        let sum = mf(row[0], bdata[0][j])
        // loop matrix a columns
        for (let x = 1; x < acolumns; x++) {
          // multiply & accumulate
          sum = af(sum, mf(row[x], bdata[x][j]))
        }
        c[i][j] = sum
      }
    }

    // return matrix
    return a.createDenseMatrix({
      data: c,
      size: [arows, bcolumns],
      datatype: dt
    })
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            SparseMatrix   (NxC)
   *
   * @return {Matrix}             SparseMatrix   (MxC)
   */
  function _multiplyDenseMatrixSparseMatrix (a, b) {
    // a dense
    const adata = a._data
    const asize = a._size
    const adt = a._datatype
    // b sparse
    const bvalues = b._values
    const bindex = b._index
    const bptr = b._ptr
    const bsize = b._size
    const bdt = b._datatype
    // validate b matrix
    if (!bvalues) { throw new Error('Cannot multiply Dense Matrix times Pattern only Matrix') }
    // rows & columns
    const arows = asize[0]
    const bcolumns = bsize[1]

    // datatype
    let dt
    // addScalar signature to use
    let af = addScalar
    // multiplyScalar signature to use
    let mf = multiplyScalar
    // equalScalar signature to use
    let eq = equalScalar
    // zero value
    let zero = 0

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt])
      mf = typed.find(multiplyScalar, [dt, dt])
      eq = typed.find(equalScalar, [dt, dt])
      // convert 0 to the same datatype
      zero = typed.convert(0, dt)
    }

    // result
    const cvalues = []
    const cindex = []
    const cptr = []
    // c matrix
    const c = b.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    })

    // loop b columns
    for (let jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length
      // indeces in column jb
      const kb0 = bptr[jb]
      const kb1 = bptr[jb + 1]
      // do not process column jb if no data exists
      if (kb1 > kb0) {
        // last row mark processed
        let last = 0
        // loop a rows
        for (let i = 0; i < arows; i++) {
          // column mark
          const mark = i + 1
          // C[i, jb]
          let cij
          // values in b column j
          for (let kb = kb0; kb < kb1; kb++) {
            // row
            const ib = bindex[kb]
            // check value has been initialized
            if (last !== mark) {
              // first value in column jb
              cij = mf(adata[i][ib], bvalues[kb])
              // update mark
              last = mark
            } else {
              // accumulate value
              cij = af(cij, mf(adata[i][ib], bvalues[kb]))
            }
          }
          // check column has been processed and value != 0
          if (last === mark && !eq(cij, zero)) {
            // push row & value
            cindex.push(i)
            cvalues.push(cij)
          }
        }
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length

    // return sparse matrix
    return c
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix    (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             SparseMatrix    (M, 1)
   */
  function _multiplySparseMatrixVector (a, b) {
    // a sparse
    const avalues = a._values
    const aindex = a._index
    const aptr = a._ptr
    const adt = a._datatype
    // validate a matrix
    if (!avalues) { throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix') }
    // b dense
    const bdata = b._data
    const bdt = b._datatype
    // rows & columns
    const arows = a._size[0]
    const brows = b._size[0]
    // result
    const cvalues = []
    const cindex = []
    const cptr = []

    // datatype
    let dt
    // addScalar signature to use
    let af = addScalar
    // multiplyScalar signature to use
    let mf = multiplyScalar
    // equalScalar signature to use
    let eq = equalScalar
    // zero value
    let zero = 0

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt])
      mf = typed.find(multiplyScalar, [dt, dt])
      eq = typed.find(equalScalar, [dt, dt])
      // convert 0 to the same datatype
      zero = typed.convert(0, dt)
    }

    // workspace
    const x = []
    // vector with marks indicating a value x[i] exists in a given column
    const w = []

    // update ptr
    cptr[0] = 0
    // rows in b
    for (let ib = 0; ib < brows; ib++) {
      // b[ib]
      const vbi = bdata[ib]
      // check b[ib] != 0, avoid loops
      if (!eq(vbi, zero)) {
        // A values & index in ib column
        for (let ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
          // a row
          const ia = aindex[ka]
          // check value exists in current j
          if (!w[ia]) {
            // ia is new entry in j
            w[ia] = true
            // add i to pattern of C
            cindex.push(ia)
            // x(ia) = A
            x[ia] = mf(vbi, avalues[ka])
          } else {
            // i exists in C already
            x[ia] = af(x[ia], mf(vbi, avalues[ka]))
          }
        }
      }
    }
    // copy values from x to column jb of c
    for (let p1 = cindex.length, p = 0; p < p1; p++) {
      // row
      const ic = cindex[p]
      // copy value
      cvalues[p] = x[ic]
    }
    // update ptr
    cptr[1] = cindex.length

    // return sparse matrix
    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1],
      datatype: dt
    })
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            DenseMatrix       (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  function _multiplySparseMatrixDenseMatrix (a, b) {
    // a sparse
    const avalues = a._values
    const aindex = a._index
    const aptr = a._ptr
    const adt = a._datatype
    // validate a matrix
    if (!avalues) { throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix') }
    // b dense
    const bdata = b._data
    const bdt = b._datatype
    // rows & columns
    const arows = a._size[0]
    const brows = b._size[0]
    const bcolumns = b._size[1]

    // datatype
    let dt
    // addScalar signature to use
    let af = addScalar
    // multiplyScalar signature to use
    let mf = multiplyScalar
    // equalScalar signature to use
    let eq = equalScalar
    // zero value
    let zero = 0

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt])
      mf = typed.find(multiplyScalar, [dt, dt])
      eq = typed.find(equalScalar, [dt, dt])
      // convert 0 to the same datatype
      zero = typed.convert(0, dt)
    }

    // result
    const cvalues = []
    const cindex = []
    const cptr = []
    // c matrix
    const c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    })

    // workspace
    const x = []
    // vector with marks indicating a value x[i] exists in a given column
    const w = []

    // loop b columns
    for (let jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length
      // mark in workspace for current column
      const mark = jb + 1
      // rows in jb
      for (let ib = 0; ib < brows; ib++) {
        // b[ib, jb]
        const vbij = bdata[ib][jb]
        // check b[ib, jb] != 0, avoid loops
        if (!eq(vbij, zero)) {
          // A values & index in ib column
          for (let ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // a row
            const ia = aindex[ka]
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark
              // add i to pattern of C
              cindex.push(ia)
              // x(ia) = A
              x[ia] = mf(vbij, avalues[ka])
            } else {
              // i exists in C already
              x[ia] = af(x[ia], mf(vbij, avalues[ka]))
            }
          }
        }
      }
      // copy values from x to column jb of c
      for (let p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
        // row
        const ic = cindex[p]
        // copy value
        cvalues[p] = x[ic]
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length

    // return sparse matrix
    return c
  }

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            SparseMatrix      (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  function _multiplySparseMatrixSparseMatrix (a, b) {
    // a sparse
    const avalues = a._values
    const aindex = a._index
    const aptr = a._ptr
    const adt = a._datatype
    // b sparse
    const bvalues = b._values
    const bindex = b._index
    const bptr = b._ptr
    const bdt = b._datatype

    // rows & columns
    const arows = a._size[0]
    const bcolumns = b._size[1]
    // flag indicating both matrices (a & b) contain data
    const values = avalues && bvalues

    // datatype
    let dt
    // addScalar signature to use
    let af = addScalar
    // multiplyScalar signature to use
    let mf = multiplyScalar

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt])
      mf = typed.find(multiplyScalar, [dt, dt])
    }

    // result
    const cvalues = values ? [] : undefined
    const cindex = []
    const cptr = []
    // c matrix
    const c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    })

    // workspace
    const x = values ? [] : undefined
    // vector with marks indicating a value x[i] exists in a given column
    const w = []
    // variables
    let ka, ka0, ka1, kb, kb0, kb1, ia, ib
    // loop b columns
    for (let jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length
      // mark in workspace for current column
      const mark = jb + 1
      // B values & index in j
      for (kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        // b row
        ib = bindex[kb]
        // check we need to process values
        if (values) {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka]
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark
              // add i to pattern of C
              cindex.push(ia)
              // x(ia) = A
              x[ia] = mf(bvalues[kb], avalues[ka])
            } else {
              // i exists in C already
              x[ia] = af(x[ia], mf(bvalues[kb], avalues[ka]))
            }
          }
        } else {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka]
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark
              // add i to pattern of C
              cindex.push(ia)
            }
          }
        }
      }
      // check we need to process matrix values (pattern matrix)
      if (values) {
        // copy values from x to column jb of c
        for (let p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
          // row
          const ic = cindex[p]
          // copy value
          cvalues[p] = x[ic]
        }
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length

    // return sparse matrix
    return c
  }

  /**
   * Multiply two or more values, `x * y`.
   * For matrices, the matrix product is calculated.
   *
   * Syntax:
   *
   *    math.multiply(x, y)
   *    math.multiply(x, y, z, ...)
   *
   * Examples:
   *
   *    math.multiply(4, 5.2)        // returns number 20.8
   *    math.multiply(2, 3, 4)       // returns number 24
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.multiply(a, b)          // returns Complex 5 + 14i
   *
   *    const c = [[1, 2], [4, 3]]
   *    const d = [[1, 2, 3], [3, -4, 7]]
   *    math.multiply(c, d)          // returns Array [[7, -6, 17], [13, -4, 33]]
   *
   *    const e = math.unit('2.1 km')
   *    math.multiply(3, e)          // returns Unit 6.3 km
   *
   * See also:
   *
   *    divide, prod, cross, dot
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to multiply
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
   */
  return typed(name, extend({
    // we extend the signatures of multiplyScalar with signatures dealing with matrices

    'Array, Array': function (x, y) {
      // check dimensions
      _validateMatrixDimensions(arraySize(x), arraySize(y))

      // use dense matrix implementation
      const m = this(matrix(x), matrix(y))
      // return array or scalar
      return isMatrix(m) ? m.valueOf() : m
    },

    'Matrix, Matrix': function (x, y) {
      // dimensions
      const xsize = x.size()
      const ysize = y.size()

      // check dimensions
      _validateMatrixDimensions(xsize, ysize)

      // process dimensions
      if (xsize.length === 1) {
        // process y dimensions
        if (ysize.length === 1) {
          // Vector * Vector
          return _multiplyVectorVector(x, y, xsize[0])
        }
        // Vector * Matrix
        return _multiplyVectorMatrix(x, y)
      }
      // process y dimensions
      if (ysize.length === 1) {
        // Matrix * Vector
        return _multiplyMatrixVector(x, y)
      }
      // Matrix * Matrix
      return _multiplyMatrixMatrix(x, y)
    },

    'Matrix, Array': function (x, y) {
      // use Matrix * Matrix implementation
      return this(x, matrix(y))
    },

    'Array, Matrix': function (x, y) {
      // use Matrix * Matrix implementation
      return this(matrix(x, y.storage()), y)
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, multiplyScalar, false)
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, multiplyScalar, false)
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm11(y, x, multiplyScalar, true)
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, multiplyScalar, true)
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, multiplyScalar, false).valueOf()
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, multiplyScalar, true).valueOf()
    },

    'any, any': multiplyScalar,

    'any, any, ...any': function (x, y, rest) {
      let result = this(x, y)

      for (let i = 0; i < rest.length; i++) {
        result = this(result, rest[i])
      }

      return result
    }
  }, multiplyScalar.signatures))
})
