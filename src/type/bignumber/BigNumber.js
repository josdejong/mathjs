import Decimal from 'decimal.js'
import { factory } from '../../utils/factory.js'

const name = 'BigNumber'
const dependencies = ['?on', 'config']
const trigonometricMethods = [
  'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh',
  'cos', 'cosh', 'sin', 'sinh', 'tan', 'tanh',
  'cosine', 'hyperbolicCosine', 'hyperbolicSine', 'hyperbolicTangent',
  'inverseCosine', 'inverseHyperbolicCosine', 'inverseHyperbolicSine',
  'inverseHyperbolicTangent', 'inverseSine', 'inverseTangent', 'sine', 'tangent'
]

export const createBigNumberClass = /* #__PURE__ */ factory(name, dependencies, ({ on, config }) => {
  const BigNumber = Decimal.clone({ precision: config.precision, modulo: Decimal.EUCLID })
  BigNumber.prototype = Object.create(BigNumber.prototype)

  trigonometricMethods.forEach(method => {
    const originalMethod = BigNumber.prototype[method]

    BigNumber.prototype[method] = function (...args) {
      const precision = BigNumber.precision
      const rounding = BigNumber.rounding

      try {
        return originalMethod.apply(this, args)
      } catch (error) {
        if (error instanceof Error &&
          error.message.includes('Precision limit exceeded') &&
          !error.message.includes('decimal.js trigonometric functions are limited')) {
          error.message += '; decimal.js trigonometric functions are limited to approximately ' +
            `1000 digits of working precision (configured precision is ${config.precision})`
        }
        throw error
      } finally {
        BigNumber.precision = precision
        BigNumber.rounding = rounding
      }
    }
  })

  /**
   * Attach type information
   */
  BigNumber.prototype.type = 'BigNumber'
  BigNumber.prototype.isBigNumber = true

  /**
   * Get a JSON representation of a BigNumber containing
   * type information
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "BigNumber", "value": "0.2"}`
   */
  BigNumber.prototype.toJSON = function () {
    return {
      mathjs: 'BigNumber',
      value: this.toString()
    }
  }

  /**
   * Instantiate a BigNumber from a JSON object
   * @param {Object} json  a JSON object structured as:
   *                       `{"mathjs": "BigNumber", "value": "0.2"}`
   * @return {BigNumber}
   */
  BigNumber.fromJSON = function (json) {
    return new BigNumber(json.value)
  }

  if (on) {
    // listen for changed in the configuration, automatically apply changed precision
    on('config', function (curr, prev) {
      if (curr.precision !== prev.precision) {
        BigNumber.config({ precision: curr.precision })
      }
    })
  }

  return BigNumber
}, { isClass: true })
