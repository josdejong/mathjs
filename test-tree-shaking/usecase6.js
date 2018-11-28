// Use case 6
// create functions yourself: mix and match functions

import { createTyped, createBigNumberClass } from '../src/factory'
import { addNumber, multiplyNumber } from '../src/plain/number'
import { addBigNumber, multiplyBigNumber, bignumber } from '../src/plain/bignumber'
import { DEFAULT_CONFIG } from '../src/core/config'

console.log('\nuse case 6')

const BigNumber = createBigNumberClass({ config: DEFAULT_CONFIG })
const typed = createTyped({ type: { BigNumber } })

const add = typed('add', addNumber, addBigNumber)
const multiply = typed('multiply', multiplyNumber, multiplyBigNumber)

console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
console.log('2 * bignumber(3) + 4 = ' + add(multiply(2, bignumber(3)), 4))
