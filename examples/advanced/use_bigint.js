// This example demonstrates how you could integrate support for BigInt
// in mathjs. It's just a proof of concept, for full support you will
// have to defined more functions and define conversions from and to
// other data types.

const math = require('../../index')

math.import({
  name: 'BigInt',
  path: 'type', // will be imported into math.type.BigInt
  factory: (type, config, load, typed) => {
    typed.addType({
      name: 'BigInt',
      test: (x) => typeof x === 'bigint' // eslint-disable-line
    })

    // we can also add conversions here from number or string to BigInt
    // and vice versa using typed.addConversion(...)

    return BigInt // eslint-disable-line
  },

  // disable lazy loading as this factory has side
  // effects: it adds a type and a conversion.
  lazy: false
})

math.import({
  name: 'bigint',
  factory: (type, config, load, typed) => {
    return typed('bigint', {
      'number | string ': (x) => BigInt(x) // eslint-disable-line
    })
  }
})

math.import({
  name: 'add',
  factory: (type, config, load, typed) => {
    return typed('add', {
      'BigInt, BigInt': (a, b) => a + b
    })
  }
})

math.import({
  name: 'pow',
  factory: (type, config, load, typed) => {
    return typed('pow', {
      'BigInt, BigInt': (a, b) => a ** b
    })
  }
})

console.log(math.eval('bigint(4349) + bigint(5249)'))
console.log(math.eval('bigint(4349) ^ bigint(5249)'))
