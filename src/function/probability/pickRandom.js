import { factory } from '../../utils/factory'
import { isNumber } from '../../utils/is'
import { createRng } from './util/seededRNG'
import { flatten } from '../../utils/array'

const name = 'pickRandom'
const dependencies = ['typed', 'config', '?on']

export const createPickRandom = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, on }) => {
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
   * Random pick one or more values from a one dimensional array.
   * Array elements are picked using a random function with uniform or weighted distribution.
   *
   * Syntax:
   *
   *     math.pickRandom(array)
   *     math.pickRandom(array, number)
   *     math.pickRandom(array, weights)
   *     math.pickRandom(array, number, weights)
   *     math.pickRandom(array, weights, number)
   *
   * Examples:
   *
   *     math.pickRandom([3, 6, 12, 2])                  // returns one of the values in the array
   *     math.pickRandom([3, 6, 12, 2], 2)               // returns an array of two of the values in the array
   *     math.pickRandom([3, 6, 12, 2], [1, 3, 2, 1])    // returns one of the values in the array with weighted distribution
   *     math.pickRandom([3, 6, 12, 2], 2, [1, 3, 2, 1]) // returns an array of two of the values in the array with weighted distribution
   *     math.pickRandom([3, 6, 12, 2], [1, 3, 2, 1], 2) // returns an array of two of the values in the array with weighted distribution
   *
   * See also:
   *
   *     random, randomInt
   *
   * @param {Array | Matrix} array     A one dimensional array
   * @param {Int} number               An int or float
   * @param {Array | Matrix} weights   An array of ints or floats
   * @return {number | Array}          Returns a single random value from array when number is 1 or undefined.
   *                                   Returns an array with the configured number of elements when number is > 1.
   */
  return typed({
    'Array | Matrix': function (possibles) {
      return _pickRandom(possibles)
    },

    'Array | Matrix, number': function (possibles, number) {
      return _pickRandom(possibles, number, undefined)
    },

    'Array | Matrix, Array': function (possibles, weights) {
      return _pickRandom(possibles, undefined, weights)
    },

    'Array | Matrix, Array | Matrix, number': function (possibles, weights, number) {
      return _pickRandom(possibles, number, weights)
    },

    'Array | Matrix, number, Array | Matrix': function (possibles, number, weights) {
      return _pickRandom(possibles, number, weights)
    }
  })

  function _pickRandom (possibles, number, weights) {
    const single = (typeof number === 'undefined')
    if (single) {
      number = 1
    }

    possibles = flatten(possibles.valueOf()).valueOf() // get Array
    if (weights) {
      weights = weights.valueOf() // get Array
    }

    let totalWeights = 0

    if (typeof weights !== 'undefined') {
      if (weights.length !== possibles.length) {
        throw new Error('Weights must have the same length as possibles')
      }

      for (let i = 0, len = weights.length; i < len; i++) {
        if (!isNumber(weights[i]) || weights[i] < 0) {
          throw new Error('Weights must be an array of positive numbers')
        }

        totalWeights += weights[i]
      }
    }

    const length = possibles.length

    if (length === 0) {
      return []
    } else if (number >= length) {
      return number > 1 ? possibles : possibles[0]
    }

    const result = []
    let pick

    while (result.length < number) {
      if (typeof weights === 'undefined') {
        pick = possibles[Math.floor(rng() * length)]
      } else {
        let randKey = rng() * totalWeights

        for (let i = 0, len = possibles.length; i < len; i++) {
          randKey -= weights[i]

          if (randKey < 0) {
            pick = possibles[i]
            break
          }
        }
      }

      if (result.indexOf(pick) === -1) {
        result.push(pick)
      }
    }

    return single ? result[0] : result

    // TODO: return matrix when input was a matrix
    // TODO: add support for multi dimensional matrices
  }
})
