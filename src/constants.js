import { factory } from './utils/factory.js'
import { version } from './version.js'
import {
  createBigNumberE,
  createBigNumberPhi,
  createBigNumberPi,
  createBigNumberTau
} from './utils/bignumber/constants.js'
import { pi, tau, e, phi } from './plain/number/index.js'

export const createTrue = /* #__PURE__ */ factory('true', [], () => true)
export const createFalse = /* #__PURE__ */ factory('false', [], () => false)
export const createNull = /* #__PURE__ */ factory('null', [], () => null)

function createConstant (name, generators) {
  return recreateFactory(name, ['config', '?BigNumber'], (dep) => {
    const constType = dep.config.compute.numberApproximate
    return generators[constType](dep[constType])
  })
}

export const createInfinity = /* #__PURE__ */ createConstant('Infinity', {
  number: () => Infinity,
  BigNumber: Big => new Big(Infinity)
})

export const createNaN = /* #__PURE__ */ createConstant('NaN', {
  number: () => NaN,
  BigNumber: Big => new Big(NaN)
})

export const createPi = /* #__PURE__ */ createConstant('pi', {
  number: () => pi,
  BigNumber: Big => createBigNumberPi(Big)
})

export const createTau = /* #__PURE__ */ createConstant('tau', {
  number: () => tau,
  BigNumber: Big => createBigNumberTau(Big)
})

export const createE = /* #__PURE__ */ createConstant('e', {
  number: () => e,
  BigNumber: Big => createBigNumberE(Big)
})

// golden ratio, (1+sqrt(5))/2
export const createPhi = /* #__PURE__ */ createConstant('phi', {
  number: () => phi,
  BigNumber: Big => createBigNumberPhi(Big)
})

export const createLN2 = /* #__PURE__ */ createConstant('LN2', {
  number: () => Math.LN2,
  BigNumber: Big => new Big(2).ln()
})

export const createLN10 = /* #__PURE__ */ createConstant('LN10', {
  number: () => Math.LN10,
  BigNumber: Big => new Big(10).ln()
})

export const createLOG2E = /* #__PURE__ */ createConstant('LOG2E', {
  number: () => Math.LOG2E,
  BigNumber: Big => new Big(1).div(new Big(2).ln())
})

export const createLOG10E = /* #__PURE__ */ createConstant('LOG10E', {
  number: () => Math.LOG10E,
  BigNumber: Big => new Big(1).div(new Big(10).ln())
})

export const createSQRT1_2 = /* #__PURE__ */ createConstant( // eslint-disable-line camelcase
  'SQRT1_2',
  {
    number: () => Math.SQRT1_2,
    BigNumber: Big => new Big('0.5').sqrt()
  }
)

export const createSQRT2 = /* #__PURE__ */ createConstant('SQRT2', {
  number: () => Math.SQRT2,
  BigNumber: Big => new Big(2).sqrt()
})

export const createI = /* #__PURE__ */ recreateFactory(
  'i',
  ['Complex'],
  ({ Complex }) => Complex.I
)

// for backward compatibility with v5
export const createUppercasePi = /* #__PURE__ */ factory('PI', ['pi'], ({ pi }) => pi)
export const createUppercaseE = /* #__PURE__ */ factory('E', ['e'], ({ e }) => e)

export const createVersion = /* #__PURE__ */ factory('version', [], () => version)

// helper function to create a factory with a flag recreateOnConfigChange
// idea: allow passing optional properties to be attached to the factory function as 4th argument?
function recreateFactory (name, dependencies, create) {
  return factory(name, dependencies, create, {
    recreateOnConfigChange: true
  })
}
