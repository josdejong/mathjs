import { factory } from '../../utils/factory'

const dependencies = ['typed']

const prefixes = { 2: '0b', 8: '0o', 16: '0x' }

function baseFormatter (base) {
  const prefix = prefixes[base]
  return function (n) {
    const sign = n < 0 ? '-' : ''
    if (sign) {
      n = -n
    }
    return `${sign}${prefix}${n.toString(base)}`
  }
}

function createFactory (name, base) {
  return factory(name, dependencies, ({ typed }) => {
    /**
     * Format a number into a different base.
     *
     * Syntax:
     *
     *    math.<name>(value)
     * @param {*} value                               Value to be stringified
     * @return {string} The formatted value
     */
    return typed(name, {
      number: baseFormatter(base)
    })
  })
}

export const createBin = createFactory('bin', 2)

export const createOct = createFactory('oct', 8)

export const createHex = createFactory('hex', 16)
