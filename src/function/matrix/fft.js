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
  'i',
  'dotDivide',
  'conj',
  'pow',
  'ceil',
  'log2'
]

export const createFft = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  matrix,
  addScalar,
  multiplyScalar,
  divideScalar,
  exp,
  tau,
  i: I,
  dotDivide,
  conj,
  pow,
  ceil,
  log2
}) => {
  /**
   * Calculate N-dimensional Fourier transform
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
   * @return {Array | Matrix}       N-dimensional Fourier transformation of the array
   */
  return typed(name, {
    Array: _ndFft,
    Matrix: function (matrix) {
      return matrix.create(_ndFft(matrix.valueOf()), matrix.datatype())
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
   * Perform an 1-dimensional non-power-of-2 Fourier transform using Chirp-Z Transform
   *
   * @param {Array} arr      The array
   * @return {Array}         resulting array
   */
  function _czt (arr) {
    const n = arr.length
    const w = exp(divideScalar(multiplyScalar(-1, multiplyScalar(I, tau)), n))
    const chirp = []
    for (let i = 1 - n; i < n; i++) {
      chirp.push(pow(w, divideScalar(pow(i, 2), 2)))
    }
    const N2 = pow(2, ceil(log2(n + n - 1)))
    const xp = [
      ...new Array(n).fill(0).map((_, i) => multiplyScalar(arr[i], chirp[n - 1 + i])),
      ...new Array(N2 - n).fill(0)
    ]
    const ichirp = [
      ...new Array(n + n - 1).fill(0).map((_, i) => divideScalar(1, chirp[i])),
      ...new Array(N2 - (n + n - 1)).fill(0)
    ]
    const fftXp = _fft(xp)
    const fftIchirp = _fft(ichirp)
    const fftProduct = new Array(N2).fill(0).map((_, i) => multiplyScalar(fftXp[i], fftIchirp[i]))
    const ifftProduct = dotDivide(conj(_ndFft(conj(fftProduct))), N2)
    const ret = []
    for (let i = n - 1; i < n + n - 1; i++) {
      ret.push(multiplyScalar(ifftProduct[i], chirp[i]))
    }
    return ret
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
    } else {
      // use chirp-z transform for non-power-of-2 FFT
      return _czt(arr)
    }
    // throw new Error('Can only calculate FFT of power-of-two size')
  }
})
