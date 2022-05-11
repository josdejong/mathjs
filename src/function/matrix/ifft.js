import { arraySize } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { isMatrix } from '../../utils/is.js'

const name = 'ifft'
const dependencies = [
  'typed',
  'fft',
  'dotDivide',
  'conj'
]

export const createIfft = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  fft,
  dotDivide,
  conj
}) => {
  /**
   * Calculate N-dimensional inverse fourier transform
   *
   * Syntax:
   *
   *     math.ifft(arr)
   *
   * Examples:
   *
   *    math.ifft([[2, 2], [0, 0]]) // returns [[1, 0], [1, 0]]
   *
   * See Also:
   *
   *      fft
   *
   * @param {Array | Matrix} arr    An array or matrix
   * @return {Array | Matrix}       N-dimensional fourier transformation of the array
   */
  return typed(name, {
    'Array | Matrix': function (arr) {
      const size = isMatrix(arr) ? arr.size() : arraySize(arr)
      return dotDivide(conj(fft(conj(arr))), size.reduce((acc, curr) => acc * curr, 1))
    }
  })
})
