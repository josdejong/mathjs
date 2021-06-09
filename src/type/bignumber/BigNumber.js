import Decimal from 'decimal.js'
import { factory } from '../../utils/factory.js'

const name = 'BigNumber'
const dependencies = ['?on', 'config']

export const createBigNumberClass = /* #__PURE__ */ factory(name, dependencies, ({ on, config }) => {
  const EUCLID = 9 // Use euclidian division for mod calculation

  const BigNumber = Decimal.clone({ precision: config.precision, modulo: EUCLID })
  BigNumber.prototype = Object.create(BigNumber.prototype)

  /**
   * Attach type information
   */
  BigNumber.prototype.type = 'BigNumber'
  BigNumber.prototype.isBigNumber = true

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
