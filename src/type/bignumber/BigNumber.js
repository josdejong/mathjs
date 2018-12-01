'use strict'

import Decimal from 'decimal.js'
import { factory } from '../../utils/factory'

const name = 'type.BigNumber'
const dependencies = ['config.precision']

export const createBigNumberClass = /* #__PURE__ */ factory(name, dependencies, ({ config: { precision } }) => {
  const BigNumber = Decimal.clone({ precision })

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

  return BigNumber
})
