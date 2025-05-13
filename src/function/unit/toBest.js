import { factory } from '../../utils/factory.js'

const name = 'toBest'
const dependencies = ['typed']

export const createToBest = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  return typed(name, {
    '': function (x) {
      return x.toBest()
    },
    Unit: (x, units, options, formatOptions) => x.toBest(units, options, formatOptions)
  }
  )
})
