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
    const xSize = _size(x)
    const ySize = _size(y)
    let xLen, yLen

    if (xSize.length === 1) {
      xLen = xSize[0]
    } else if (xSize.length === 2 && xSize[1] === 1) {
      xLen = xSize[0]
    } else {
      throw new RangeError('Expected a column vector, instead got a matrix of size (' + xSize.join(', ') + ')')
    }

    if (ySize.length === 1) {
      yLen = ySize[0]
    } else if (ySize.length === 2 && ySize[1] === 1) {
      yLen = ySize[0]
    } else {
      throw new RangeError('Expected a column vector, instead got a matrix of size (' + ySize.join(', ') + ')')
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
    const aIsColumn = _size(a).length === 2
    const bIsColumn = _size(b).length === 2

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
    if (!aIsColumn && !bIsColumn) {
      let c = mul(conj(adata[0]), bdata[0])
      for (let i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i]), bdata[i]))
      }
      return c
    }

    // a is 1-dim, b is column
    if (!aIsColumn && bIsColumn) {
      let c = mul(conj(adata[0]), bdata[0][0])
      for (let i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i]), bdata[i][0]))
      }
      return c
    }

    // a is column, b is 1-dim
    if (aIsColumn && !bIsColumn) {
      let c = mul(conj(adata[0][0]), bdata[0])
      for (let i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i][0]), bdata[i]))
      }
      return c
    }

    // both vectors are column
    if (aIsColumn && bIsColumn) {
      let c = mul(conj(adata[0][0]), bdata[0][0])
      for (let i = 1; i < N; i++) {
        c = add(c, mul(conj(adata[i][0]), bdata[i][0]))
      }
      return c
    }
  }

  function _sparseDot (x, y) {
    _validateDim(x, y)

    const xindex = x._index
    const xvalues = x._values

    const yindex = y._index
    const yvalues = y._values

    // TODO optimize add & mul using datatype
    let c = 0
    const add = addScalar
    const mul = multiplyScalar

    let i = 0
    let j = 0
    while (i < xindex.length && j < yindex.length) {
      const I = xindex[i]
      const J = yindex[j]

      if (I < J) {
        i++
        continue
      }
      if (I > J) {
        j++
        continue
      }
      if (I === J) {
        c = add(c, mul(xvalues[i], yvalues[j]))
        i++
        j++
      }
    }

    return c
  }

  // TODO remove this once #1771 is fixed
  function _size (x) {
    return isMatrix(x) ? x.size() : size(x)
  }
})
