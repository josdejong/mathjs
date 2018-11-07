// Use case 3
// just use some plain functions, no runtime type checking

import { add, multiply } from '../src/plain/number'

console.log('\nuse case 3')
console.log('2 * 3 + 4 = ' + add(multiply(2, 3), 4))
