import { factory } from '../../utils/factory.js'

const name = 'ComplexInfinity'
const dependencies = []

export const createComplexInfinityClass = /* #__PURE__ */ factory(name, dependencies, () => {
  function ComplexInfinity () {}

  ComplexInfinity.prototype = new ComplexInfinity()
  ComplexInfinity.prototype.type = 'ComplexInfinity'
  ComplexInfinity.prototype.isComplexInfinity = true

  return ComplexInfinity
},
{ isClass: true })
