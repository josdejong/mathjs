// This example demonstrates how you could integrate support for BigInt
// in mathjs. It's just a proof of concept, for full support you will
// have to defined more functions and define conversions from and to
// other data types.

const { create, all, factory } = require('../..')
const math = create(all)

// we can also add conversions here from number or string to BigInt
// and vice versa using math.typed.addConversion(...)

math.import([
  factory('BigInt', ['typed'], function createBigInt ({ typed }) {
    typed.addType({
      name: 'BigInt',
      test: (x) => typeof x === 'bigint' // eslint-disable-line
    })

    return BigInt // eslint-disable-line
  }, { lazy: false }),

  factory('bigint', ['typed', 'BigInt'], function createBigint ({ typed, BigInt }) {
    return typed('bigint', {
      'number | string ': (x) => BigInt(x) // eslint-disable-line
    })
  }),

  factory('add', ['typed'], function createBigIntAdd ({ typed }) {
    return typed('add', {
      'BigInt, BigInt': (a, b) => a + b
    })
  }),

  factory('pow', ['typed'], function createBigIntPow ({ typed }) {
    return typed('pow', {
      'BigInt, BigInt': (a, b) => a ** b
    })
  })
])

console.log(math.evaluate('4349 + 5249'))
console.log(math.evaluate('bigint(4349) + bigint(5249)'))
console.log(math.evaluate('bigint(4349) ^ bigint(5249)'))
