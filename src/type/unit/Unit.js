import { factory } from '../../utils/factory'
import { warnOnce } from '../../utils/log'

const name = 'Unit'
const dependencies = ['unit']

// TODO: The Unit class is deprecated since v6.0.0, cleanup some day
export const createDeprecatedUnitClass = /* #__PURE__ */ factory(name, dependencies, ({ unit }) => {
  return function Unit (...args) {
    warnOnce('The Unit class is deprecated, use the function unit instead')

    return unit(...args)
  }
}, { isClass: true })
