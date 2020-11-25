import { factory } from '../../utils/factory'

function baseFormatter (base, { typed, add, subtract, divide, floor, mod, pow, smaller, larger, equal, unaryMinus, number, bignumber, isInteger }) {
  function format (n, base) {
    const digits = '0123456789abcdef'
    const result = []
    if (equal(n, 0)) {
      return '0'
    }
    while (larger(n, 0)) {
      result.push(digits[number(mod(n, base))])
      n = floor(divide(n, base))
    }
    return result.reverse().join('')
  }
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
      if (larger(n, subtract(pow(bignumber(2), size - 1), 1)) || smaller(n, unaryMinus(pow(bignumber(2), size - 1)))) {
        throw new Error(`Value must be in range [-2^${size - 1}, 2^${size - 1}-1]`)
      }
      if (!isInteger(n)) {
        throw new Error('Value must be an integer')
      }
      if (smaller(n, 0)) {
        n = add(n, pow(bignumber(2), size))
      }
      return `${prefix}${format(n, base)}`
    } else {
      let sign = ''
      if (smaller(n, 0)) {
        n = unaryMinus(n)
        sign = '-'
      }
      return `${sign}${prefix}${format(n, base)}`
    }
  }
}

const dependencies = ['typed', 'add', 'subtract', 'divide', 'floor', 'mod', 'pow', 'smaller', 'larger', 'equal', 'unaryMinus', 'number', 'bignumber', 'isInteger']

export function createBaseFormatterFactory (name, base) {
  return factory(name, dependencies, (dependencies) => {
    return dependencies.typed(name, {
      'number | BigNumber': baseFormatter(base, dependencies),
      'number | BigNumber, number': baseFormatter(base, dependencies)
    })
  })
}
