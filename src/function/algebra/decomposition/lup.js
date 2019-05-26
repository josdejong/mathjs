import { clone } from '../../../utils/object'
import { factory } from '../../../utils/factory'

const name = 'lup'
const dependencies = [
  'typed',
  'matrix',
  'abs',
  'addScalar',
  'divideScalar',
  'multiplyScalar',
  'subtract',
  'larger',
  'equalScalar',
  'unaryMinus',
  'DenseMatrix',
  'SparseMatrix',
  'Spa'
]

export const createLup = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    matrix,
    abs,
    addScalar,
    divideScalar,
    multiplyScalar,
    subtract,
    larger,
    equalScalar,
    unaryMinus,
    DenseMatrix,
    SparseMatrix,
    Spa
  }
) => {
  /**
   * Calculate the Matrix LU decomposition with partial pivoting. Matrix `A` is decomposed in two matrices (`L`, `U`) and a
   * row permutation vector `p` where `A[p,:] = L * U`
   *
   * Syntax:
   *
   *    math.lup(A)
   *
   * Example:
   *
   *    const m = [[2, 1], [1, 4]]
   *    const r = math.lup(m)
   *    // r = {
   *    //   L: [[1, 0], [0.5, 1]],
   *    //   U: [[2, 1], [0, 3.5]],
   *    //   P: [0, 1]
   *    // }
   *
   * See also:
   *
   *    slu, lsolve, lusolve, usolve
   *
   * @param {Matrix | Array} A    A two dimensional matrix or array for which to get the LUP decomposition.
   *
   * @return {{L: Array | Matrix, U: Array | Matrix, P: Array.<number>}} The lower triangular matrix, the upper triangular matrix and the permutation matrix.
   */
  return typed(name, {

    'DenseMatrix': function (m) {
      return _denseLUP(m)
    },

    'SparseMatrix': function (m) {
      return _sparseLUP(m)
    },

    'Array': function (a) {
      // create dense matrix from array
      const m = matrix(a)
      // lup, use matrix implementation
      const r = _denseLUP(m)
      // result
      return {
        L: r.L.valueOf(),
        U: r.U.valueOf(),
        p: r.p
      }
    }
  })

  function _denseLUP (m) {
    // rows & columns
    const rows = m._size[0]
    const columns = m._size[1]
    // minimum rows and columns
    let n = Math.min(rows, columns)
    // matrix array, clone original data
    const data = clone(m._data)
    // l matrix arrays
    const ldata = []
    const lsize = [rows, n]
    // u matrix arrays
    const udata = []
    const usize = [n, columns]
    // vars
    let i, j, k
    // permutation vector
    const p = []
    for (i = 0; i < rows; i++) { p[i] = i }
    // loop columns
    for (j = 0; j < columns; j++) {
      // skip first column in upper triangular matrix
      if (j > 0) {
        // loop rows
        for (i = 0; i < rows; i++) {
          // min i,j
          const min = Math.min(i, j)
          // v[i, j]
          let s = 0
          // loop up to min
          for (k = 0; k < min; k++) {
            // s = l[i, k] - data[k, j]
            s = addScalar(s, multiplyScalar(data[i][k], data[k][j]))
          }
          data[i][j] = subtract(data[i][j], s)
        }
      }
      // row with larger value in cvector, row >= j
      let pi = j
      let pabsv = 0
      let vjj = 0
      // loop rows
      for (i = j; i < rows; i++) {
        // data @ i, j
        const v = data[i][j]
        // absolute value
        const absv = abs(v)
        // value is greater than pivote value
        if (larger(absv, pabsv)) {
          // store row
          pi = i
          // update max value
          pabsv = absv
          // value @ [j, j]
          vjj = v
        }
      }
      // swap rows (j <-> pi)
      if (j !== pi) {
        // swap values j <-> pi in p
        p[j] = [p[pi], p[pi] = p[j]][0]
        // swap j <-> pi in data
        DenseMatrix._swapRows(j, pi, data)
      }
      // check column is in lower triangular matrix
      if (j < rows) {
        // loop rows (lower triangular matrix)
        for (i = j + 1; i < rows; i++) {
          // value @ i, j
          const vij = data[i][j]
          if (!equalScalar(vij, 0)) {
            // update data
            data[i][j] = divideScalar(data[i][j], vjj)
          }
        }
      }
    }
    // loop columns
    for (j = 0; j < columns; j++) {
      // loop rows
      for (i = 0; i < rows; i++) {
        // initialize row in arrays
        if (j === 0) {
          // check row exists in upper triangular matrix
          if (i < columns) {
            // U
            udata[i] = []
          }
          // L
          ldata[i] = []
        }
        // check we are in the upper triangular matrix
        if (i < j) {
          // check row exists in upper triangular matrix
          if (i < columns) {
            // U
            udata[i][j] = data[i][j]
          }
          // check column exists in lower triangular matrix
          if (j < rows) {
            // L
            ldata[i][j] = 0
          }
          continue
        }
        // diagonal value
        if (i === j) {
          // check row exists in upper triangular matrix
          if (i < columns) {
            // U
            udata[i][j] = data[i][j]
          }
          // check column exists in lower triangular matrix
          if (j < rows) {
            // L
            ldata[i][j] = 1
          }
          continue
        }
        // check row exists in upper triangular matrix
        if (i < columns) {
          // U
          udata[i][j] = 0
        }
        // check column exists in lower triangular matrix
        if (j < rows) {
          // L
          ldata[i][j] = data[i][j]
        }
      }
    }
    // l matrix
    const l = new DenseMatrix({
      data: ldata,
      size: lsize
    })
    // u matrix
    const u = new DenseMatrix({
      data: udata,
      size: usize
    })
    // p vector
    const pv = []
    for (i = 0, n = p.length; i < n; i++) { pv[p[i]] = i }
    // return matrices
    return {
      L: l,
      U: u,
      p: pv,
      toString: function () {
        return 'L: ' + this.L.toString() + '\nU: ' + this.U.toString() + '\nP: ' + this.p
      }
    }
  }

  function _sparseLUP (m) {
    // rows & columns
    const rows = m._size[0]
    const columns = m._size[1]
    // minimum rows and columns
    const n = Math.min(rows, columns)
    // matrix arrays (will not be modified, thanks to permutation vector)
    const values = m._values
    const index = m._index
    const ptr = m._ptr
    // l matrix arrays
    const lvalues = []
    const lindex = []
    const lptr = []
    const lsize = [rows, n]
    // u matrix arrays
    const uvalues = []
    const uindex = []
    const uptr = []
    const usize = [n, columns]
    // vars
    let i, j, k
    // permutation vectors, (current index -> original index) and (original index -> current index)
    const pvCo = []
    const pvOc = []
    for (i = 0; i < rows; i++) {
      pvCo[i] = i
      pvOc[i] = i
    }
    // swap indices in permutation vectors (condition x < y)!
    const swapIndeces = function (x, y) {
      // find pv indeces getting data from x and y
      const kx = pvOc[x]
      const ky = pvOc[y]
      // update permutation vector current -> original
      pvCo[kx] = y
      pvCo[ky] = x
      // update permutation vector original -> current
      pvOc[x] = ky
      pvOc[y] = kx
    }
    // loop columns
    for (j = 0; j < columns; j++) {
      // sparse accumulator
      const spa = new Spa()
      // check lower triangular matrix has a value @ column j
      if (j < rows) {
        // update ptr
        lptr.push(lvalues.length)
        // first value in j column for lower triangular matrix
        lvalues.push(1)
        lindex.push(j)
      }
      // update ptr
      uptr.push(uvalues.length)
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      const k0 = ptr[j]
      const k1 = ptr[j + 1]
      // copy column j into sparse accumulator
      for (k = k0; k < k1; k++) {
        // row
        i = index[k]
        // copy column values into sparse accumulator (use permutation vector)
        spa.set(pvCo[i], values[k])
      }
      // skip first column in upper triangular matrix
      if (j > 0) {
        // loop rows in column j (above diagonal)
        spa.forEach(0, j - 1, function (k, vkj) {
          // loop rows in column k (L)
          SparseMatrix._forEachRow(k, lvalues, lindex, lptr, function (i, vik) {
            // check row is below k
            if (i > k) {
              // update spa value
              spa.accumulate(i, unaryMinus(multiplyScalar(vik, vkj)))
            }
          })
        })
      }
      // row with larger value in spa, row >= j
      let pi = j
      let vjj = spa.get(j)
      let pabsv = abs(vjj)
      // loop values in spa (order by row, below diagonal)
      spa.forEach(j + 1, rows - 1, function (x, v) {
        // absolute value
        const absv = abs(v)
        // value is greater than pivote value
        if (larger(absv, pabsv)) {
          // store row
          pi = x
          // update max value
          pabsv = absv
          // value @ [j, j]
          vjj = v
        }
      })
      // swap rows (j <-> pi)
      if (j !== pi) {
        // swap values j <-> pi in L
        SparseMatrix._swapRows(j, pi, lsize[1], lvalues, lindex, lptr)
        // swap values j <-> pi in U
        SparseMatrix._swapRows(j, pi, usize[1], uvalues, uindex, uptr)
        // swap values in spa
        spa.swap(j, pi)
        // update permutation vector (swap values @ j, pi)
        swapIndeces(j, pi)
      }
      // loop values in spa (order by row)
      spa.forEach(0, rows - 1, function (x, v) {
        // check we are above diagonal
        if (x <= j) {
          // update upper triangular matrix
          uvalues.push(v)
          uindex.push(x)
        } else {
          // update value
          v = divideScalar(v, vjj)
          // check value is non zero
          if (!equalScalar(v, 0)) {
            // update lower triangular matrix
            lvalues.push(v)
            lindex.push(x)
          }
        }
      })
    }
    // update ptrs
    uptr.push(uvalues.length)
    lptr.push(lvalues.length)

    // return matrices
    return {
      L: new SparseMatrix({
        values: lvalues,
        index: lindex,
        ptr: lptr,
        size: lsize
      }),
      U: new SparseMatrix({
        values: uvalues,
        index: uindex,
        ptr: uptr,
        size: usize
      }),
      p: pvCo,
      toString: function () {
        return 'L: ' + this.L.toString() + '\nU: ' + this.U.toString() + '\nP: ' + this.p
      }
    }
  }
})
