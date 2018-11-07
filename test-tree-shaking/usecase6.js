// Use case 6
// create functions yourself: mix and match functions

import { create } from '../src/mainAll'
import { add as addNumber, multiply as multiplyNumber } from '../src/plain/number'
import { add as addBigNumber, multiply as multiplyBigNumber, bignumber } from '../src/plain/bignumber'

const math = create()

const add = math.typed(addNumber, addBigNumber)
const multiply = math.typed(multiplyNumber, multiplyBigNumber)

console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
console.log('2 * bignumber(3) + 4 = ' + add(multiply(2, bignumber(3)), 4))
