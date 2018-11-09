'use strict'

import { lazy } from './utils/object'
import { factory } from './utils/factory'
import { version } from './version'
import * as bigConstants from './utils/bignumber/constants'

const name = 'constants'
const dependencies = ['on', 'math', 'config', 'type.Complex', 'type.BigNumber']

// FIXME: implement support for a factory without name
export const createConstants = factory(name, dependencies, ({ on, math, config, type: { Complex, BigNumber } }) => {
  // listen for changed in the configuration, automatically reload
  // constants when needed
  on('config', function (curr, prev) {
    if (curr.number !== prev.number) {
      createConstants({ on, math, config, type: { Complex, BigNumber } })
    }
  })

  setConstant(math, 'true', true)
  setConstant(math, 'false', false)
  setConstant(math, 'null', null)
  setConstant(math, 'uninitialized', 'Error: Constant uninitialized is removed since v4.0.0. Use null instead')

  if (config().number === 'BigNumber') {
    setConstant(math, 'Infinity', new BigNumber(Infinity))
    setConstant(math, 'NaN', new BigNumber(NaN))

    setLazyConstant(math, 'pi', function () { return bigConstants.pi(BigNumber) })
    setLazyConstant(math, 'tau', function () { return bigConstants.tau(BigNumber) })
    setLazyConstant(math, 'e', function () { return bigConstants.e(BigNumber) })
    setLazyConstant(math, 'phi', function () { return bigConstants.phi(BigNumber) }) // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in Math)
    setLazyConstant(math, 'E', function () { return math.e })
    setLazyConstant(math, 'LN2', function () { return new BigNumber(2).ln() })
    setLazyConstant(math, 'LN10', function () { return new BigNumber(10).ln() })
    setLazyConstant(math, 'LOG2E', function () { return new BigNumber(1).div(new BigNumber(2).ln()) })
    setLazyConstant(math, 'LOG10E', function () { return new BigNumber(1).div(new BigNumber(10).ln()) })
    setLazyConstant(math, 'PI', function () { return math.pi })
    setLazyConstant(math, 'SQRT1_2', function () { return new BigNumber('0.5').sqrt() })
    setLazyConstant(math, 'SQRT2', function () { return new BigNumber(2).sqrt() })
  } else {
    setConstant(math, 'Infinity', Infinity)
    setConstant(math, 'NaN', NaN)

    setConstant(math, 'pi', Math.PI)
    setConstant(math, 'tau', Math.PI * 2)
    setConstant(math, 'e', Math.E)
    setConstant(math, 'phi', 1.61803398874989484820458683436563811772030917980576286213545) // golden ratio, (1+sqrt(5))/2

    // uppercase constants (for compatibility with built-in Math)
    setConstant(math, 'E', math.e)
    setConstant(math, 'LN2', Math.LN2)
    setConstant(math, 'LN10', Math.LN10)
    setConstant(math, 'LOG2E', Math.LOG2E)
    setConstant(math, 'LOG10E', Math.LOG10E)
    setConstant(math, 'PI', math.pi)
    setConstant(math, 'SQRT1_2', Math.SQRT1_2)
    setConstant(math, 'SQRT2', Math.SQRT2)
  }

  // complex i
  setConstant(math, 'i', Complex.I)

  // meta information
  setConstant(math, 'version', version)
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
