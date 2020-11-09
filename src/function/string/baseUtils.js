import { factory } from '../../utils/factory'

function baseFormatter (base, {typed, add, subtract, pow, smaller, larger, unaryMinus, bignumber, isInteger}) {
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
      if (larger(n, subtract(pow(bignumber(2), size - 1), 1)) || smaller(n, unaryMinus(pow(bignumber(2), (size - 1))))) {
        throw new Error(`Value must be in range [-2^${size-1}, 2^${size-1}-1]`)
      }
      if (!isInteger(n)) {
        throw new Error('Value must be an integer')
      }
      if (smaller(n, 0)) {
        n = add(n, pow(2, size))
      }
    }
    return `${prefix}${n.toString(base)}`
  }
}

const dependencies = ['typed', 'add', 'subtract', 'pow', 'smaller', 'larger', 'unaryMinus', 'bignumber', 'isInteger']

export function createBaseFormatterFactory (name, base) {
  return factory(name, dependencies, (dependencies) => {
    return dependencies.typed(name, {
      'number | BigNumber': baseFormatter(base, dependencies),
      'number | BigNumber, number': baseFormatter(base, dependencies)
    })
  })
}
