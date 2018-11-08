'use strict'

import { lazy } from './utils/object'
import { factory } from './utils/factory'
import * as bigConstants from './utils/bignumber/constants'

const name = 'constants'
const dependencies = ['on', 'scope', 'config', 'type.Complex', 'type.BigNumber']

// FIXME: implement support for a factory without name
export const createConstants = factory(name, dependencies, ({ on, scope, config, type: { Complex, BigNumber } }) => {
  // listen for changed in the configuration, automatically reload
  // constants when needed
  on('config', function (curr, prev) {
    if (curr.number !== prev.number) {
      createConstants({ on, scope, config, type: { Complex, BigNumber } })
    }
  })

  setConstant(scope, 'true', true)
  setConstant(scope, 'false', false)
  setConstant(scope, 'null', null)
  setConstant(scope, 'uninitialized', 'Error: Constant uninitialized is removed since v4.0.0. Use null instead')

  if (config().number === 'BigNumber') {
    setConstant(scope, 'Infinity', new BigNumber(Infinity))
    setConstant(scope, 'NaN', new BigNumber(NaN))

    setLazyConstant(scope, 'pi', function () { return bigConstants.pi(BigNumber) })
    setLazyConstant(scope, 'tau', function () { return bigConstants.tau(BigNumber) })
    setLazyConstant(scope, 'e', function () { return bigConstants.e(BigNumber) })
    setLazyConstant(scope, 'phi', function () { return bigConstants.phi(BigNumber) }) // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in Math)
    setLazyConstant(scope, 'E', function () { return scope.e })
    setLazyConstant(scope, 'LN2', function () { return new BigNumber(2).ln() })
    setLazyConstant(scope, 'LN10', function () { return new BigNumber(10).ln() })
    setLazyConstant(scope, 'LOG2E', function () { return new BigNumber(1).div(new BigNumber(2).ln()) })
    setLazyConstant(scope, 'LOG10E', function () { return new BigNumber(1).div(new BigNumber(10).ln()) })
    setLazyConstant(scope, 'PI', function () { return scope.pi })
    setLazyConstant(scope, 'SQRT1_2', function () { return new BigNumber('0.5').sqrt() })
    setLazyConstant(scope, 'SQRT2', function () { return new BigNumber(2).sqrt() })
  } else {
    setConstant(scope, 'Infinity', Infinity)
    setConstant(scope, 'NaN', NaN)

    setConstant(scope, 'pi', Math.PI)
    setConstant(scope, 'tau', Math.PI * 2)
    setConstant(scope, 'e', Math.E)
    setConstant(scope, 'phi', 1.61803398874989484820458683436563811772030917980576286213545) // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in Math)
    setConstant(scope, 'E', scope.e)
    setConstant(scope, 'LN2', Math.LN2)
    setConstant(scope, 'LN10', Math.LN10)
    setConstant(scope, 'LOG2E', Math.LOG2E)
    setConstant(scope, 'LOG10E', Math.LOG10E)
    setConstant(scope, 'PI', scope.pi)
    setConstant(scope, 'SQRT1_2', Math.SQRT1_2)
    setConstant(scope, 'SQRT2', Math.SQRT2)
  }

  // complex i
  setConstant(scope, 'i', Complex.I)

  // meta information
  setConstant(scope, 'version', require('./version'))
})

// create a constant in both math and mathWithTransform
function setConstant (math, name, value) {
  math[name] = value
  math.expression.mathWithTransform[name] = value
}

// create a lazy constant in both math and mathWithTransform
function setLazyConstant (math, name, resolver) {
  lazy(math, name, resolver)
  lazy(math.expression.mathWithTransform, name, resolver)
}
