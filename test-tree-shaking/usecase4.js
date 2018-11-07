// Use case 4
// create your own config and load some functions

import { create, add, multiply } from '../src/mainAll'

const math = create([add, multiply])
math.config({ number: 'BigNumber' })

console.log('2 * 3 + 4 = ' + math.add(math.multiply(2, 3), 4))
