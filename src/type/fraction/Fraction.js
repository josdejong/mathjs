import Fraction from 'fraction.js'
import { factory } from '../../utils/factory'

const name = 'Fraction'
const dependencies = []

export const createFractionClass = /* #__PURE__ */ factory(name, dependencies, () => {
  /**
   * Attach type information
   */
  Fraction.prototype.type = 'Fraction'
  Fraction.prototype.isFraction = true

  /**
   * Get a JSON representation of a Fraction containing type information
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Fraction", "n": 3, "d": 8}`
   */
  Fraction.prototype.toJSON = function () {
    return {
      mathjs: 'Fraction',
      n: this.s * this.n,
      d: this.d
    }
  }

  /**
   * Instantiate a Fraction from a JSON object
   * @param {Object} json  a JSON object structured as:
   *                       `{"mathjs": "Fraction", "n": 3, "d": 8}`
   * @return {BigNumber}
   */
  Fraction.fromJSON = function (json) {
    return new Fraction(json)
  }

  return Fraction
}, { isClass: true })
