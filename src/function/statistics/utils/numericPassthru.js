import { factory } from '../../../utils/factory.js'

const name = 'numericPassthru'
const dependencies = ['typed']

export const createNumericPassthru = factory(name, dependencies, ({ typed }) => {
  return typed(name, {
    'number|BigNumber|Complex|Fraction|bigint|Unit': x => x // did I miss any?
  })
})
