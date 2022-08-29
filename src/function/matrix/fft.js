import { arraySize } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'fft'
const dependencies = [
  'typed',
  'matrix',
  'addScalar',
  'multiplyScalar',
  'divideScalar',
  'exp',
  'tau',
  'i'
]

export const createFft = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  matrix,
  addScalar,
  multiplyScalar,
  divideScalar,
  exp,
  tau,
  i: I
}) => {
  /**
   * Calculate N-dimensional fourier transform
   *
   * Syntax:
   *
   *     math.fft(arr)
   *
   * Examples:
   *
   *    math.fft([[1, 0], [1, 0]]) // returns [[{re:2, im:0}, {re:2, im:0}], [{re:0, im:0}, {re:0, im:0}]]
   *
   *
   * See Also:
   *
   *      ifft
   *
   * @param {Array | Matrix} arr    An array or matrix
   * @return {Array | Matrix}       N-dimensional fourier transformation of the array
   */
  return typed(name, {
    Array: _ndFft,
    Matrix: function (matrix) {
      return matrix.create(_ndFft(matrix.toArray()))
    }
  })

  /**
   * Perform an N-dimensional Fourier transform
   *
   * @param {Array} arr      The array
   * @return {Array}         resulting array
   */
  function _ndFft (arr) {
    const size = arraySize(arr)
    if (size.length === 1) return _fft(arr, size[0])
    // ndFft along dimension 1,...,N-1 then 1dFft along dimension 0
    return _1dFft(arr.map(slice => _ndFft(slice, size.slice(1))), 0)
  }

  /**
   * Perform an 1-dimensional Fourier transform
   *
   * @param {Array} arr      The array
   * @param {number} dim     dimension of the array to perform on
   * @return {Array}         resulting array
   */
  function _1dFft (arr, dim) {
    const size = arraySize(arr)
    if (dim !== 0) return new Array(size[0]).fill(0).map((_, i) => _1dFft(arr[i], dim - 1))
    if (size.length === 1) return _fft(arr)
    function _transpose (arr) { // Swap first 2 dimensions
      const size = arraySize(arr)
      return new Array(size[1]).fill(0).map((_, j) => new Array(size[0]).fill(0).map((_, i) => arr[i][j]))
    }
    return _transpose(_1dFft(_transpose(arr), 1))
  }

  /**
   * Perform an 1-dimensional Fourier transform
   *
   * @param {Array} arr      The array
   * @return {Array}         resulting array
   */
  function _fft (arr) {
    const len = arr.length
    if (len === 1) return [arr[0]]
    if (len % 2 === 0) {
      const ret = [
        ..._fft(arr.filter((_, i) => i % 2 === 0), len / 2),
        ..._fft(arr.filter((_, i) => i % 2 === 1), len / 2)
      ]
      for (let k = 0; k < len / 2; k++) {
        const p = ret[k]
        const q = multiplyScalar(
          ret[k + len / 2],
          exp(
            multiplyScalar(multiplyScalar(tau, I), divideScalar(-k, len))
          )
        )
        ret[k] = addScalar(p, q)
        ret[k + len / 2] = addScalar(p, multiplyScalar(-1, q))
      }
      return ret
    }
    throw new Error('Can only calculate FFT of power-of-two size')
  }
})
