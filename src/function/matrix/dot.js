import { factory } from '../../utils/factory'
import { isMatrix } from '../../utils/is'

const name = 'dot'
const dependencies = ['typed', 'addScalar', 'multiplyScalar', 'conj', 'size']

export const createDot = /* #__PURE__ */ factory(name, dependencies, ({ typed, addScalar, multiplyScalar, conj, size }) => {
  /**
   * Calculate the dot product of two vectors. The dot product of
   * `A = [a1, a2, ..., an]` and `B = [b1, b2, ..., bn]` is defined as:
   *
   *    dot(A, B) = conj(a1) * b1 + conj(a2) * b2 + ... + conj(an) * bn
   *
   * Syntax:
   *
   *    math.dot(x, y)
   *
   * Examples:
   *
   *    math.dot([2, 4, 1], [2, 2, 3])       // returns number 15
   *    math.multiply([2, 4, 1], [2, 2, 3])  // returns number 15
   *
   * See also:
   *
   *    multiply, cross
   *
   * @param  {Array | Matrix} x     First vector
   * @param  {Array | Matrix} y     Second vector
   * @return {number}               Returns the dot product of `x` and `y`
   */
  return typed(name, {
    'Array | DenseMatrix, Array | DenseMatrix': _denseDot,
    'SparseMatrix, SparseMatrix': _sparseDot
  })

  function _validateDim (x, y) {
    let xSize = size(x)
    let ySize = size(y)
    let xLen, yLen

    // TODO remove this once #1771 is fixed
    if (isMatrix(xSize)) {
      xSize = xSize._data
    }
    if (isMatrix(ySize)) {
      ySize = ySize._data
    }

    if (xSize.length === 1) {
      xLen = xSize[0]
    } else if (xSize.length === 2 && xSize[0] !== 1) {
      xLen = xSize[1]
    } else {
      throw new RangeError('Expected a vector, instead got a matrix of size (' + xSize.join(', ') + ')')
    }

    if (ySize.length === 1) {
      yLen = ySize[0]
    } else if (ySize.length === 2 && ySize[0] === 1) {
      yLen = ySize[1]
    } else {
      throw new RangeError('Expected a vector, instead got a matrix of size (' + ySize.join(', ') + ')')
    }

    if (xLen !== yLen) throw new RangeError('Vectors must have equal length (' + xLen + ' != ' + yLen + ')')
    if (xLen === 0) throw new RangeError('Cannot calculate the dot product of empty vectors')

    return xLen
  }

  function _denseDot (a, b) {
    const N = _validateDim(a, b)

    const adata = isMatrix(a) ? a._data : a
    const adt = isMatrix(a) ? a._datatype : undefined

    const bdata = isMatrix(b) ? b._data : b
    const bdt = isMatrix(b) ? b._datatype : undefined

    // are these 2-dimensional column vectors? (as opposed to 1-dimensional vectors)
    const acolumn = size(a) === 2
    const bcolumn = size(b) === 2

    let add = addScalar
    let mul = multiplyScalar

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      const dt = adt
      // find signatures that matches (dt, dt)
      add = typed.find(addScalar, [dt, dt])
      mul = typed.find(multiplyScalar, [dt, dt])
    }

    // both vectors 1-dimensional
    if (!acolumn && !bcolumn) {
      let c = mul(conj(adata[0]), bdata[0])
      for (let i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i]), bdata[i]))
      }
      return c
    }

    // a is 1-dim, b is column
    if (!acolumn && bcolumn) {
      let c = mul(conj(adata[0][0]), bdata[0])
      for (let i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i][0]), bdata[i]))
      }
      return c
    }

    // a is column, b is 1-dim
    if (acolumn && !bcolumn) {
      let c = mul(conj(adata[0]), bdata[0][0])
      for (let i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i]), bdata[i][0]))
      }
      return c
    }

    // both vectors are column
    if (acolumn && bcolumn) {
      let c = mul(conj(adata[0][0]), bdata[0][0])
      for (let i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i][0]), bdata[i][0]))
      }
      return c
    }
  }

  function _sparseDot (x, y) {
    // TODO
    throw Error()
  }
})
