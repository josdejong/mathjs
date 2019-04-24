// Use case 2
// use a few functions with config

import { create, divideDependencies, piDependencies, sinDependencies } from '..'

const config = { number: 'BigNumber' }

const { divide, sin, pi } = create({
  divideDependencies,
  sinDependencies,
  piDependencies
}, config)

console.log('\nuse case 2')
console.log(divide(sin(divide(pi, 2)), 3).toString())
// sin(pi / 2) / 3 =
// BigNumber 0.3333333333333333333333333333333333333333333333333333333333333333
