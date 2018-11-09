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
import { createDistribution } from './distribution'

export default [
  createDistribution, // TODO: rethink math.distribution
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
