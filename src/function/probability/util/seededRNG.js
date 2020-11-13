import seedrandom from 'seedrandom'

const singletonRandom = /* #__PURE__ */ seedrandom(Date.now())

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
