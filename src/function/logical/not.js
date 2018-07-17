'use strict'

const deepMap = require('../../utils/collection/deepMap')

function factory (type, config, load, typed) {
  const latex = require('../../utils/latex')

  /**
   * Logical `not`. Flips boolean value of a given parameter.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.not(x)
   *
   * Examples:
   *
   *    math.not(2)      // returns false
   *    math.not(0)      // returns true
   *    math.not(true)   // returns false
   *
   *    a = [2, -7, 0]
   *    math.not(a)      // returns [false, false, true]
   *
   * See also:
   *
   *    and, or, xor
   *
   * @param  {number | BigNumber | Complex | Unit | Array | Matrix} x First value to check
   * @return {boolean | Array | Matrix}
   *            Returns true when input is a zero or empty value.
   */
  const not = typed('not', {
    'number': function (x) {
      return !x
    },

    'Complex': function (x) {
      return x.re === 0 && x.im === 0
    },

    'BigNumber': function (x) {
      return x.isZero() || x.isNaN()
    },

    'Unit': function (x) {
      return x.value !== null ? not(x.value) : true
    },

    'Array | Matrix': function (x) {
      return deepMap(x, not)
    }
  })

  not.toTex = {
    1: latex.operators['not'] + `\\left(\${args[0]}\\right)`
  }

  return not
}

exports.name = 'not'
exports.factory = factory
