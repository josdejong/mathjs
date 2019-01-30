'use strict'
import { createCombinations } from './combinations'
import { createFactorial } from './factorial'
import { createGamma } from './gamma'
import { createKldivergence } from './kldivergence'
import { createMultinomial } from './multinomial'
import { createPermutations } from './permutations'
import { createPickRandom } from './pickRandom'
import { createRandom } from './random'
import { createRandomInt } from './randomInt'

console.log('This index file is deprecated since v6.0.0. Please use factory.js instead')

export default [
  createCombinations,
  createFactorial,
  createGamma,
  createKldivergence,
  createMultinomial,
  createPermutations,
  createPickRandom,
  createRandom,
  createRandomInt
]
