// Use case 4
// create some functions with custom config

import { createAddFull, createBignumberFull, createMultiplyFull } from '../src/factoryFull'

console.log('\nuse case 4')

const config = {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'BigNumber',
  precision: 64,
  predictable: false,
  randomSeed: null
}

const bignumber = createBignumberFull({ config })
const add = createAddFull({ config })
const multiply = createMultiplyFull({ config })

console.log('2 * 3 + 4 = ' + add(multiply(bignumber(2), 3), 4))
