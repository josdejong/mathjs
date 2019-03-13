// Use case 6
// use dynamically changing config

import { create, allDependencies } from '../src/mainFull'

console.log('\nuse case 6')

const mathjs = create(allDependencies)
console.log(mathjs.divide(mathjs.sin(mathjs.divide(mathjs.pi, 2)), 3))
// sin(pi / 2) / 3 =
// number 0.3333333333333333

mathjs.config({ number: 'BigNumber' })
console.log(mathjs.divide(mathjs.sin(mathjs.divide(mathjs.pi, 2)), 3).toString())
// sin(pi / 2) / 3 =
// BigNumber 0.3333333333333333333333333333333333333333333333333333333333333333
