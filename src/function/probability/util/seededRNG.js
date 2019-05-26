// create a random seed here to prevent an infinite loop from seed-random
// inside the factory. Reason is that math.random is defined as a getter/setter
// and seed-random generates a seed from the local entropy by reading every
// defined object including `math` itself. That means that whilst getting
// math.random, it tries to get math.random, etc... an infinite loop.
// See https://github.com/ForbesLindesay/seed-random/issues/6
import seedrandom from 'seed-random'

const singletonRandom = /* #__PURE__ */ seedrandom()

export function createRng (randomSeed) {
  let random

  // create a new random generator with given seed
  function setSeed (seed) {
    random = seed === null ? singletonRandom : seedrandom(String(seed))
  }

  // initialize a seeded pseudo random number generator with config's random seed
  setSeed(randomSeed)

  // wrapper function so the rng can be updated via generator
  function rng () {
    return random()
  }

  return rng
}
