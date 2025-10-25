import { factory } from '../../utils/factory.js'

export const createCompareUnits = /* #__PURE__ */ factory(
  'compareUnits', ['typed'], ({ typed, Unit }) => ({
    'Unit, Unit': typed.referToSelf(self => (x, y) => {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base')
      }
      return typed.find(self, [x.valueType(), y.valueType()])(x.value, y.value)
    }),
    'Unit, number | bigint | BigNumber | Fraction | Complex': typed.referToSelf(
      self => (x, y) => {
        if (!x.unitless()) {
          throw new Error('To compare Unit with pure numeric, must be unitless')
        }
        return self(x.value, y)
      }),
    'number | bigint | BigNumber | Fraction | Complex, Unit': typed.referToSelf(
      self => (x, y) => {
        if (!y.unitless()) {
          throw new Error('To compare Unit with pure numeric, must be unitless')
        }
        return self(x, y.value)
      })
  })
)
