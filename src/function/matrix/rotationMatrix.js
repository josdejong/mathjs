import { isBigNumber } from '../../utils/is'
import { factory } from '../../utils/factory'

const name = 'rotationMatrix'
const dependencies = [
  'typed',
  'config',
  'multiplyScalar',
  'addScalar',
  'unaryMinus',
  'norm',
  'matrix',
  'BigNumber',
  'DenseMatrix',
  'SparseMatrix',
  'cos',
  'sin'
]

export const createRotationMatrix = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed, config, multiplyScalar,
    addScalar, unaryMinus, norm, BigNumber,
    matrix, DenseMatrix, SparseMatrix, cos, sin
  }) => {
  /**
   * Create a 2-dimensional counter-clockwise rotation matrix (2x2) for a given angle (expressed in radians).
   * Create a 2-dimensional counter-clockwise rotation matrix (3x3) by a given angle (expressed in radians) around a given axis (1x3).
   *
   * Syntax:
   *
   *    math.rotationMatrix(theta)
   *    math.rotationMatrix(theta, format)
   *    math.rotationMatrix(theta, [v])
   *    math.rotationMatrix(theta, [v], format)
   *
   * Examples:
   *
   *    math.rotationMatrix(math.pi / 2)                      // returns [[0, -1], [1, 0]]
   *    math.rotationMatrix(math.bignumber(1))                // returns [[bignumber(cos(1)), bignumber(-sin(1))], [bignumber(sin(1)), bignumber(cos(1))]]
   *    math.rotationMatrix(math.complex(1 + i))              // returns [[cos(1 + i), -sin(1 + i)], [sin(1 + i), cos(1 + i)]]
   *    math.rotationMatrix(math.unit('1rad'))                // returns [[cos(1), -sin(1)], [sin(1), cos(1)]]
   *
   *    math.rotationMatrix(math.pi / 2, [0, 1, 0])           // returns [[0, 0, 1], [0, 1, 0], [-1, 0, 0]]
   *    math.rotationMatrix(math.pi / 2, matrix([0, 1, 0]))   // returns matrix([[0, 0, 1], [0, 1, 0], [-1, 0, 0]])
   *
   *
   * See also:
   *
   *    matrix, cos, sin
   *
   *
   * @param {number | BigNumber | Complex | Unit} theta    Rotation angle
   * @param {Array | Matrix} [v]                           Rotation axis
   * @param {string} [format]                              Result Matrix storage format
   * @return {Array | Matrix}                              Rotation matrix
   */

  return typed(name, {
    '': function () {
      return (config.matrix === 'Matrix') ? matrix([]) : []
    },

    string: function (format) {
      return matrix(format)
    },

    'number | BigNumber | Complex | Unit': function (theta) {
      return _rotationMatrix2x2(theta, config.matrix === 'Matrix' ? 'dense' : undefined)
    },

    'number | BigNumber | Complex | Unit, string': function (theta, format) {
      return _rotationMatrix2x2(theta, format)
    },

    'number | BigNumber | Complex | Unit, Array': function (theta, v) {
      const matrixV = matrix(v)
      _validateVector(matrixV)
      return _rotationMatrix3x3(theta, matrixV, undefined)
    },

    'number | BigNumber | Complex | Unit, Matrix': function (theta, v) {
      _validateVector(v)
      const storageType = v.storage() || (config.matrix === 'Matrix' ? 'dense' : undefined)
      return _rotationMatrix3x3(theta, v, storageType)
    },

    'number | BigNumber | Complex | Unit, Array, string': function (theta, v, format) {
      const matrixV = matrix(v)
      _validateVector(matrixV)
      return _rotationMatrix3x3(theta, matrixV, format)
    },

    'number | BigNumber | Complex | Unit, Matrix, string': function (theta, v, format) {
      _validateVector(v)
      return _rotationMatrix3x3(theta, v, format)
    }

  })

  /**
   * Returns 2x2 matrix of 2D rotation of angle theta
   *
   * @param {number | BigNumber | Complex | Unit} theta  The rotation angle
   * @param {string} format                              The result Matrix storage format
   * @returns {Matrix}
   * @private
   */
  function _rotationMatrix2x2 (theta, format) {
    const Big = isBigNumber(theta)

    const minusOne = Big ? new BigNumber(-1) : -1
    const cosTheta = cos(theta)
    const sinTheta = sin(theta)
    const data = [[cosTheta, multiplyScalar(minusOne, sinTheta)], [sinTheta, cosTheta]]

    return _convertToFormat(data, format)
  }

  function _validateVector (v) {
    const size = v.size()
    if (size.length < 1 || size[0] !== 3) {
      throw new RangeError('Vector must be of dimensions 1x3')
    }
  }

  function _mul (array) {
    return array.reduce((p, curr) => multiplyScalar(p, curr))
  }

  function _convertToFormat (data, format) {
    if (format) {
      if (format === 'sparse') {
        return new SparseMatrix(data)
      }
      if (format === 'dense') {
        return new DenseMatrix(data)
      }
      throw new TypeError(`Unknown matrix type "${format}"`)
    }
    return data
  }

  /**
   * Returns a 3x3 matrix of rotation of angle theta around vector v
   *
   * @param {number | BigNumber | Complex | Unit} theta The rotation angle
   * @param {Matrix} v                                  The rotation axis vector
   * @param {string} format                             The storage format of the resulting matrix
   * @returns {Matrix}
   * @private
   */
  function _rotationMatrix3x3 (theta, v, format) {
    const normV = norm(v)
    if (normV === 0) {
      throw new RangeError('Rotation around zero vector')
    }

    const Big = isBigNumber(theta) ? BigNumber : null

    const one = Big ? new Big(1) : 1
    const minusOne = Big ? new Big(-1) : -1
    const vx = Big ? new Big(v.get([0]) / normV) : v.get([0]) / normV
    const vy = Big ? new Big(v.get([1]) / normV) : v.get([1]) / normV
    const vz = Big ? new Big(v.get([2]) / normV) : v.get([2]) / normV
    const c = cos(theta)
    const oneMinusC = addScalar(one, unaryMinus(c))
    const s = sin(theta)

    const r11 = addScalar(c, _mul([vx, vx, oneMinusC]))
    const r12 = addScalar(_mul([vx, vy, oneMinusC]), _mul([minusOne, vz, s]))
    const r13 = addScalar(_mul([vx, vz, oneMinusC]), _mul([vy, s]))

    const r21 = addScalar(_mul([vx, vy, oneMinusC]), _mul([vz, s]))
    const r22 = addScalar(c, _mul([vy, vy, oneMinusC]))
    const r23 = addScalar(_mul([vy, vz, oneMinusC]), _mul([minusOne, vx, s]))

    const r31 = addScalar(_mul([vx, vz, oneMinusC]), _mul([minusOne, vy, s]))
    const r32 = addScalar(_mul([vy, vz, oneMinusC]), _mul([vx, s]))
    const r33 = addScalar(c, _mul([vz, vz, oneMinusC]))

    const data = [[r11, r12, r13], [r21, r22, r23], [r31, r32, r33]]

    return _convertToFormat(data, format)
  }
})
