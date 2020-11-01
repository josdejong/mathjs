import { factory } from '../../utils/factory'
import { isInteger } from '../../utils/number'

function baseFormatter (base) {
  const prefixes = { 2: '0b', 8: '0o', 16: '0x' }
  const prefix = prefixes[base]
  return function (n, size) {
    if (size) {
      if (size < 1) {
        throw new Error('size must be in greater than 0')
      }
      if (!isInteger(size)) {
        throw new Error('size must be an integer')
      }
      if (n > 2 ** (size - 1) - 1 || n < -(2 ** (size - 1))) {
        throw new Error(`Value must be in range [-2^${size-1}, 2^${size-1}-1]`)
      }
      if (!isInteger(n)) {
        throw new Error('Value must be an integer')
      }
      if (n < 0) {
        n = n + 2 ** size
      }
    }
    return `${prefix}${n.toString(base)}`
  }
}

const dependencies = ['typed']

export function createBaseFormatterFactory (name, base) {
  return factory(name, dependencies, ({ typed }) => {
    return typed(name, {
      number: baseFormatter(base),
      'number, number': baseFormatter(base)
    })
  })
}
