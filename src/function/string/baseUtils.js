import { factory } from '../../utils/factory'

function baseFormatter (base) {
  const prefixes = { 2: '0b', 8: '0o', 16: '0x' }
  const prefix = prefixes[base]
  return function (n) {
    const sign = n < 0 ? '-' : ''
    if (sign) {
      n = -n
    }
    return `${sign}${prefix}${n.toString(base)}`
  }
}

const dependencies = ['typed']

export function createBaseFormatterFactory (name, base) {
  return factory(name, dependencies, ({ typed }) => {
    return typed(name, {
      number: baseFormatter(base)
    })
  })
}
