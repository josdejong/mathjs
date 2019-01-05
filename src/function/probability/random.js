'use strict'

import { factory } from '../../utils/factory'
import { ArgumentsError } from '../../error/ArgumentsError'
import { isCollection, isMatrix, isNumber } from '../../utils/is'
import { createRng } from './util/seededRNG'
import { randomDataForMatrix } from './util/randomDataForMatrix'

const name = 'random'
const dependencies = ['config', '?on', 'matrix']

export const createRandom = /* #__PURE__ */ factory(name, dependencies, ({ config, on, matrix }) => {
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
   * Return a random number larger or equal to `min` and smaller than `max`
   * using a uniform distribution.
   *
   * Syntax:
   *
   *     math.random()                // generate a random number between 0 and 1
   *     math.random(max)             // generate a random number between 0 and max
   *     math.random(min, max)        // generate a random number between min and max
   *     math.random(size)            // generate a matrix with random numbers between 0 and 1
   *     math.random(size, max)       // generate a matrix with random numbers between 0 and max
   *     math.random(size, min, max)  // generate a matrix with random numbers between min and max
   *
   * Examples:
   *
   *     math.random()       // returns a random number between 0 and 1
   *     math.random(100)    // returns a random number between 0 and 100
   *     math.random(30, 40) // returns a random number between 30 and 40
   *     math.random([2, 3]) // returns a 2x3 matrix with random numbers between 0 and 1
   *
   * See also:
   *
   *     randomInt, pickRandom
   *
   * @param {Array | Matrix} [size] If provided, an array or matrix with given
   *                                size and filled with random values is returned
   * @param {number} [min]  Minimum boundary for the random value, included
   * @param {number} [max]  Maximum boundary for the random value, excluded
   * @return {number | Array | Matrix} A random number
   */
  // TODO: rework random to a typed-function
  return function random (arg1, arg2, arg3) {
    let size, min, max

    if (arguments.length > 3) {
      throw new ArgumentsError('random', arguments.length, 0, 3)
    } else if (arguments.length === 1) {
      // `random(max)` or `random(size)`
      if (isCollection(arg1)) {
        size = arg1
      } else {
        max = arg1
      }
    } else if (arguments.length === 2) {
      // `random(min, max)` or `random(size, max)`
      if (isCollection(arg1)) {
        size = arg1
        max = arg2
      } else {
        min = arg1
        max = arg2
      }
    } else {
      // `random(size, min, max)`
      size = arg1
      min = arg2
      max = arg3
    }

    // TODO: validate type of size
    if ((min !== undefined && !isNumber(min)) || (max !== undefined && !isNumber(max))) {
      throw new TypeError('Invalid argument in function random')
    }

    if (max === undefined) max = 1
    if (min === undefined) min = 0
    if (size !== undefined) {
      const res = randomDataForMatrix(size.valueOf(), min, max, _random)
      return isMatrix(size) ? matrix(res) : res
    }
    return _random(min, max)
  }

  function _random (min, max) {
    return min + uniform() * (max - min)
  }

  function uniform () {
    return rng()
  }
})
