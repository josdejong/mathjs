// TODO: constants2 should fully replace constants

import { factory } from './utils/factory'

export const createI = factory('i', ['type.Complex'], ({ type: { Complex } }) => {
  return new Complex(0, 1)
})
