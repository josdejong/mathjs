// Use case 2
// use a few functions with config

import { create, divideRecipe, sinRecipe, piRecipe } from '../src/mainFull'

const config = { number: 'BigNumber' }

const { divide, sin, pi } = create({
  divideRecipe,
  sinRecipe,
  piRecipe
}, config)

console.log('\nuse case 2')
console.log(divide(sin(divide(pi, 2)), 3).toString())
// sin(pi / 2) / 3 =
// BigNumber 0.3333333333333333333333333333333333333333333333333333333333333333
