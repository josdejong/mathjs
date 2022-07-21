import { factory } from '../../utils/factory.js'

export const createTrigUnit = /* #__PURE__ */ factory(
  'trigUnit', ['typed'], ({ typed }) => ({
    Unit: typed.referToSelf(self => x => {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function cot is no angle')
      }
      return typed.find(self, x.valueType())(x.value)
    })
  })
)
