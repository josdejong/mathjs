'use strict'

import { factory } from '../../utils/factory'
import { isCollection, isMatrix } from '../../utils/is'
import { randomDataForMatrix } from './util/randomDataForMatrix'
import { createRng } from './util/seededRNG'

const name = 'randomInt'
const dependencies = ['typed', 'config', '?on', 'matrix']

export const createRandomInt = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, on, matrix }) => {
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
    'number | Array': function (arg) {
      const min = 0

      if (isCollection(arg)) {
        const size = arg
        const max = 1
        const res = randomDataForMatrix(size.valueOf(), min, max, _randomInt)
        return !isMatrix(size) ? res : matrix(res)
      } else {
        const max = arg
        return _randomInt(min, max)
      }
    },
    'number | Array, number': function (arg1, arg2) {
      if (isCollection(arg1)) {
        const size = arg1
        const max = arg2
        const min = 0
        const res = randomDataForMatrix(size.valueOf(), min, max, _randomInt)
        return isMatrix(size) ? matrix(res) : res
      } else {
        const min = arg1
        const max = arg2
        return _randomInt(min, max)
      }
    },
    'Array, number, number': function (size, min, max) {
      const res = randomDataForMatrix(size.valueOf(), min, max, _randomInt)
      return (size && size.isMatrix === true) ? matrix(res) : res
    }
  })

  function _randomInt (min, max) {
    return Math.floor(min + uniform() * (max - min))
  }

  function uniform () {
    return rng()
  }
})
