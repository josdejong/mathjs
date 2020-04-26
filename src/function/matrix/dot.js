import { arraySize as size } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'dot'
const dependencies = ['typed', 'add', 'multiply']

export const createDot = /* #__PURE__ */ factory(name, dependencies, ({ typed, add, multiply }) => {
  /**
   * Calculate the dot product of two vectors. The dot product of
   * `A = [a1, a2, a3, ..., an]` and `B = [b1, b2, b3, ..., bn]` is defined as:
   *
   *    dot(A, B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn
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
    'Matrix, Matrix': function (x, y) {
      return _dot(x.toArray(), y.toArray())
    },

    'Matrix, Array': function (x, y) {
      return _dot(x.toArray(), y)
    },

    'Array, Matrix': function (x, y) {
      return _dot(x, y.toArray())
    },

    'Array, Array': _dot
  })

  /**
   * Calculate the dot product for two arrays
   * @param {Array} x  First vector
   * @param {Array} y  Second vector
   * @returns {number} Returns the dot product of x and y
   * @private
   */
  // TODO: double code with math.multiply
  function _dot (x, y) {
    const xSize = size(x)
    const ySize = size(y)
    const len = xSize[0]

    if (xSize.length !== 1 || ySize.length !== 1) throw new RangeError('Vector expected') // TODO: better error message
    if (xSize[0] !== ySize[0]) throw new RangeError('Vectors must have equal length (' + xSize[0] + ' != ' + ySize[0] + ')')
    if (len === 0) throw new RangeError('Cannot calculate the dot product of empty vectors')

    const wasmSrc = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 8, 1, 96, 3, 127, 127, 127, 1, 124, 3, 2, 1, 0, 5, 4, 1, 1, 1, 100, 7, 16, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 3, 100, 111, 116, 0, 0, 10, 60, 1, 58, 2, 2, 127, 1, 124, 32, 2, 65, 0, 74, 4, 64, 3, 64, 32, 5, 32, 0, 32, 3, 65, 3, 116, 34, 4, 106, 43, 3, 0, 32, 1, 32, 4, 106, 43, 3, 0, 162, 160, 33, 5, 32, 3, 65, 1, 106, 34, 3, 32, 2, 71, 13, 0, 11, 11, 32, 5, 11, 11, 9, 1, 0, 65, 128, 12, 11, 2, 160, 6])
    const wasmModule = new WebAssembly.Module(wasmSrc)
    const wasmInst = new WebAssembly.Instance(wasmModule)
    const { memory, dot } = wasmInst.exports

    while (len * Float64Array.BYTES_PER_ELEMENT > memory.buffer.byteLength) memory.grow(1)

    const float64array = new Float64Array(memory.buffer, 0, len * 2)

    for (let i = 0; i < len; i++) {
      float64array[i] = x[i]
      float64array[i + len] = y[i]
    }

    const prod = dot(0, len * float64array.BYTES_PER_ELEMENT, len)

    return prod
  }
})
