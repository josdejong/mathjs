'use strict'

import seedrandom from 'seed-random'
import { factory } from '../../utils/factory'

// create a random seed here to prevent an infinite loop from seed-random
// inside the factory. Reason is that math.random is defined as a getter/setter
// and seed-random generates a seed from the local entropy by reading every
// defined object including `math` itself. That means that whilst getting
// math.random, it tries to get math.random, etc... an infinite loop.
// See https://github.com/ForbesLindesay/seed-random/issues/6
const singletonRandom = seedrandom()

const name = 'rng'
const dependencies = ['on', 'config.randomSeed']

// TODO: rethink math.distribution
// TODO: rework to a typed function
export const createRng = factory(name, dependencies, ({ on, config }) => {
  let random

  // create a new random generator with given seed
  function setSeed (seed) {
    random = seed === null ? singletonRandom : seedrandom(String(seed))
  }

  // initialize a seeded pseudo random number generator with config's random seed
  setSeed(config.randomSeed)

  // wrapper function so the rng can be updated via generator
  function rng () {
    return random()
  }

  // updates generator with a new instance of a seeded pseudo random number generator
  on('config', function (curr, prev, changes) {
    // if the user specified a randomSeed
    if (changes.randomSeed !== undefined) {
      // update generator with a new instance of a seeded pseudo random number generator
      setSeed(curr.randomSeed)
    }
  })

  return rng
})
