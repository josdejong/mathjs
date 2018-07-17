'use strict'

const ArgumentsError = require('../../error/ArgumentsError')
const isCollection = require('../../utils/collection/isCollection')
const isNumber = require('../../utils/number').isNumber

// TODO: rethink math.distribution
// TODO: rework to a typed function
function factory (type, config, load, typed, math) {
  const matrix = load(require('../../type/matrix/function/matrix'))
  const array = require('../../utils/array')

  // seeded pseudo random number generator
  const rng = load(require('./seededRNG'))

  /**
   * Create a distribution object with a set of random functions for given
   * random distribution.
   *
   * Syntax:
   *
   *     math.distribution(name)
   *
   * Examples:
   *
   *     const normalDist = math.distribution('normal') // create a normal distribution
   *     normalDist.random(0, 10)                     // get a random value between 0 and 10
   *
   * See also:
   *
   *     random, randomInt, pickRandom
   *
   * @param {string} name   Name of a distribution. Choose from 'uniform', 'normal'.
   * @return {Object}       Returns a distribution object containing functions:
   *                        `random([size] [, min] [, max])`,
   *                        `randomInt([min] [, max])`,
   *                        `pickRandom(array)`
   */
  function distribution (name) {
    if (!distributions.hasOwnProperty(name)) { throw new Error('Unknown distribution ' + name) }

    const args = Array.prototype.slice.call(arguments, 1)
    const distribution = distributions[name].apply(this, args)

    return (function (distribution) {
      // This is the public API for all distributions
      const randFunctions = {

        random: function (arg1, arg2, arg3) {
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
            const res = _randomDataForMatrix(size.valueOf(), min, max, _random)
            return type.isMatrix(size) ? matrix(res) : res
          }
          return _random(min, max)
        },

        randomInt: typed({
          'number | Array': function (arg) {
            const min = 0

            if (isCollection(arg)) {
              const size = arg
              const max = 1
              const res = _randomDataForMatrix(size.valueOf(), min, max, _randomInt)
              return type.isMatrix(size) ? matrix(res) : res
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
              const res = _randomDataForMatrix(size.valueOf(), min, max, _randomInt)
              return type.isMatrix(size) ? matrix(res) : res
            } else {
              const min = arg1
              const max = arg2
              return _randomInt(min, max)
            }
          },
          'Array, number, number': function (size, min, max) {
            const res = _randomDataForMatrix(size.valueOf(), min, max, _randomInt)
            return (size && size.isMatrix === true) ? matrix(res) : res
          }
        }),

        pickRandom: typed({
          'Array': function (possibles) {
            return _pickRandom(possibles)
          },
          'Array, number | Array': function (possibles, arg2) {
            let number, weights

            if (Array.isArray(arg2)) {
              weights = arg2
            } else if (isNumber(arg2)) {
              number = arg2
            } else {
              throw new TypeError('Invalid argument in function pickRandom')
            }

            return _pickRandom(possibles, number, weights)
          },
          'Array, number | Array, Array | number': function (possibles, arg2, arg3) {
            let number, weights

            if (Array.isArray(arg2)) {
              weights = arg2
              number = arg3
            } else {
              weights = arg3
              number = arg2
            }

            if (!Array.isArray(weights) || !isNumber(number)) {
              throw new TypeError('Invalid argument in function pickRandom')
            }

            return _pickRandom(possibles, number, weights)
          }
        })
      }

      function _pickRandom (possibles, number, weights) {
        const single = (typeof number === 'undefined')

        if (single) {
          number = 1
        }

        if (type.isMatrix(possibles)) {
          possibles = possibles.valueOf() // get Array
        } else if (!Array.isArray(possibles)) {
          throw new TypeError('Unsupported type of value in function pickRandom')
        }

        if (array.size(possibles).length > 1) {
          throw new Error('Only one dimensional vectors supported')
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

        // TODO: add support for multi dimensional matrices
      }

      function _random (min, max) {
        return min + distribution() * (max - min)
      }

      function _randomInt (min, max) {
        return Math.floor(min + distribution() * (max - min))
      }

      // This is a function for generating a random matrix recursively.
      function _randomDataForMatrix (size, min, max, randFunc) {
        const data = []
        size = size.slice(0)

        if (size.length > 1) {
          for (let i = 0, length = size.shift(); i < length; i++) {
            data.push(_randomDataForMatrix(size, min, max, randFunc))
          }
        } else {
          for (let i = 0, length = size.shift(); i < length; i++) {
            data.push(randFunc(min, max))
          }
        }

        return data
      }

      return randFunctions
    })(distribution)
  }

  // Each distribution is a function that takes no argument and when called returns
  // a number between 0 and 1.
  let distributions = {

    uniform: function () {
      return rng
    },

    // Implementation of normal distribution using Box-Muller transform
    // ref : http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
    // We take : mean = 0.5, standard deviation = 1/6
    // so that 99.7% values are in [0, 1].
    normal: function () {
      return function () {
        let u1
        let u2
        let picked = -1
        // We reject values outside of the interval [0, 1]
        // TODO: check if it is ok to do that?
        while (picked < 0 || picked > 1) {
          u1 = rng()
          u2 = rng()
          picked = 1 / 6 * Math.pow(-2 * Math.log(u1), 0.5) * Math.cos(2 * Math.PI * u2) + 0.5
        }
        return picked
      }
    }
  }

  distribution.toTex = undefined // use default template

  return distribution
}

exports.name = 'distribution'
exports.factory = factory
