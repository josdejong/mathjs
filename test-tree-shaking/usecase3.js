// Use case 3
// just use some plain functions, no runtime type checking

import { addNumber, multiplyNumber } from '../src/plain/number'

console.log('\nuse case 3')
console.log('2 * 3 + 4 = ' + addNumber(multiplyNumber(2, 3), 4))
