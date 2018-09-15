'use strict'

function factory (type, config, load, typed) {
  const add = load(require('../arithmetic/add'))
  const divide = load(require('../arithmetic/divide'))
  const multiply = load(require('../arithmetic/multiply'))
  const combinations = load(require('../probability/combinations'))
  const isNegative = load(require('../utils/isNegative'))
  const isInteger = load(require('../utils/isInteger'))

  /**
   * The Catalan Numbers enumerate combinatorial structures of many different types.
   * catalan only takes integer arguments.
   * The following condition must be enforced: n >= 0
   *
   * Syntax:
   *
   *   math.catalan(n)
   *
   * Examples:
   *
   *    math.catalan(3) // returns 5
   *    math.catalan(8) // returns 1430
   *
   * See also:
   *
   *    bellNumbers
   *
   * @param {Number | BigNumber} n    nth Catalan number
   * @return {Number | BigNumber}     Cn(n)
   */
  const catalan = typed('catalan', {
    'number | BigNumber': function (n) {
      if (!isInteger(n) || isNegative(n)) {
        throw new TypeError('Non-negative integer value expected in function catalan')
      }

      return divide(combinations(multiply(n, 2), n), add(n, 1))
    }
  })

  catalan.toTex = { 1: `\\mathrm{C}_{\${args[0]}}` }

  return catalan
}

exports.name = 'catalan'
exports.factory = factory
