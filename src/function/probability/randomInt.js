import { factory } from '../../utils/factory'
import { randomMatrix } from './util/randomMatrix'
import { createRng } from './util/seededRNG'
import { isMatrix } from '../../utils/is'

const name = 'randomInt'
const dependencies = ['typed', 'config', '?on']

export const createRandomInt = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, on }) => {
  // seeded pseudo random number generator
  let rng = createRng(config.randomSeed)

  if (on) {
    on('config', function (curr, prev) {
      if (curr.randomSeed !== prev.randomSeed) {
        rng = createRng(curr.randomSeed)
      }
    })
  }

  /**
   * Return a random integer number larger or equal to `min` and smaller than `max`
   * using a uniform distribution.
   *
   * Syntax:
   *
   *     math.randomInt()                // generate a random integer between 0 and 1
   *     math.randomInt(max)             // generate a random integer between 0 and max
   *     math.randomInt(min, max)        // generate a random integer between min and max
   *     math.randomInt(size)            // generate a matrix with random integer between 0 and 1
   *     math.randomInt(size, max)       // generate a matrix with random integer between 0 and max
   *     math.randomInt(size, min, max)  // generate a matrix with random integer between min and max
   *
   * Examples:
   *
   *     math.randomInt(100)    // returns a random integer between 0 and 100
   *     math.randomInt(30, 40) // returns a random integer between 30 and 40
   *     math.randomInt([2, 3]) // returns a 2x3 matrix with random integers between 0 and 1
   *
   * See also:
   *
   *     random, pickRandom
   *
   * @param {Array | Matrix} [size] If provided, an array or matrix with given
   *                                size and filled with random values is returned
   * @param {number} [min]  Minimum boundary for the random value, included
   * @param {number} [max]  Maximum boundary for the random value, excluded
   * @return {number | Array | Matrix} A random integer value
   */
  return typed(name, {
    '': () => _randomInt(0, 1),
    'number': (max) => _randomInt(0, max),
    'number, number': (min, max) => _randomInt(min, max),
    'Array | Matrix': (size) => _randomIntMatrix(size, 0, 1),
    'Array | Matrix, number': (size, max) => _randomIntMatrix(size, 0, max),
    'Array | Matrix, number, number': (size, min, max) => _randomIntMatrix(size, min, max)
  })

  function _randomIntMatrix (size, min, max) {
    const res = randomMatrix(size.valueOf(), () => _randomInt(min, max))
    return isMatrix(size) ? size.create(res) : res
  }

  function _randomInt (min, max) {
    return Math.floor(min + rng() * (max - min))
  }
})
