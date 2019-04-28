import assert from 'assert'
import math from '../../../src/entry/bundleAny'
import _ from 'underscore'

const math2 = math.create({ randomSeed: 'test2' })
const pickRandom = math2.pickRandom

describe('pickRandom', function () {
  it('should have a function pickRandom', function () {
    assert.strictEqual(typeof math.pickRandom, 'function')
  })

  it('should throw an error when providing a multi dimensional matrix', function () {
    assert.throws(function () {
      pickRandom(math.matrix([[1, 2], [3, 4]]))
    }, /Only one dimensional vectors supported/)
  })

  it('should throw an error if the length of the weights does not match the length of the possibles', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4]
    const number = 2

    assert.throws(function () {
      pickRandom(possibles, weights)
    }, /Weights must have the same length as possibles/)

    assert.throws(function () {
      pickRandom(possibles, number, weights)
    }, /Weights must have the same length as possibles/)

    assert.throws(function () {
      pickRandom(possibles, weights, number)
    }, /Weights must have the same length as possibles/)
  })

  it('should throw an error if the weights array contains a non number or negative value', function () {
    const possibles = [11, 22, 33, 44, 55]
    let weights = [1, 5, 2, -1, 6]

    assert.throws(function () {
      pickRandom(possibles, weights)
    }, /Weights must be an array of positive numbers/)

    weights = [1, 5, 2, 'stinky', 6]

    assert.throws(function () {
      pickRandom(possibles, weights)
    }, /Weights must be an array of positive numbers/)
  })

  it('should return a single value if no number argument was passed', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]

    assert.notStrictEqual(possibles.indexOf(pickRandom(possibles)), -1)
    assert.notStrictEqual(possibles.indexOf(pickRandom(possibles, weights)), -1)
  })

  it('should return a single value if no number argument was passed (2)', function () {
    const possibles = [5]

    assert.strictEqual(pickRandom(possibles), 5)
  })

  it('should return the given array if the given number is equal its length', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 5

    assert.strictEqual(pickRandom(possibles, number), possibles)
    assert.strictEqual(pickRandom(possibles, number, weights), possibles)
    assert.strictEqual(pickRandom(possibles, weights, number), possibles)
  })

  it('should return the given array if the given number is greater than its length', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 6

    assert.strictEqual(pickRandom(possibles, number), possibles)
    assert.strictEqual(pickRandom(possibles, number, weights), possibles)
    assert.strictEqual(pickRandom(possibles, weights, number), possibles)
  })

  it('should return an empty array if the given number is 0', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 0

    assert.strictEqual(pickRandom(possibles, number).length, 0)
    assert.strictEqual(pickRandom(possibles, number, weights).length, 0)
    assert.strictEqual(pickRandom(possibles, weights, number).length, 0)
  })

  it('should return an array of length 1 if the number passed is 1', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 1

    assert(Array.isArray(pickRandom(possibles, number)))
    assert(Array.isArray(pickRandom(possibles, number, weights)))
    assert(Array.isArray(pickRandom(possibles, weights, number)))

    assert.strictEqual(pickRandom(possibles, number).length, 1)
    assert.strictEqual(pickRandom(possibles, number, weights).length, 1)
    assert.strictEqual(pickRandom(possibles, weights, number).length, 1)
  })

  it('should pick the given number of values from the given array', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 3

    assert.strictEqual(pickRandom(possibles, number).length, number)
    assert.strictEqual(pickRandom(possibles, number, weights).length, number)
    assert.strictEqual(pickRandom(possibles, weights, number).length, number)
  })

  it('should pick a value from the given array following an uniform distribution if only possibles are passed', function () {
    const possibles = [11, 22, 33, 44, 55]
    const picked = []
    let count

    _.times(1000, function () {
      picked.push(pickRandom(possibles))
    })

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)
  })

  it('should pick a value from the given matrix following an uniform distribution', function () {
    const possibles = math.matrix([11, 22, 33, 44, 55])
    const picked = []
    let count

    _.times(1000, function () {
      picked.push(pickRandom(possibles))
    })

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)
  })

  it('should pick a given number of values from the given array following an uniform distribution if no weights were passed', function () {
    const possibles = [11, 22, 33, 44, 55]
    const number = 2
    const picked = []
    let count

    _.times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, number))
    })

    assert.strictEqual(picked.length, 2000)

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)
  })

  it('should pick numbers from the given matrix following an uniform distribution', function () {
    const possibles = math.matrix([11, 22, 33, 44, 55])
    const number = 3
    const picked = []
    let count

    _.times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, number))
    })

    assert.strictEqual(picked.length, 3000)

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)
  })

  it('should pick a value from the given array following a weighted distribution', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 4, 0, 2, 3]
    const picked = []
    let count

    _.times(1000, function () {
      picked.push(pickRandom(possibles, weights))
    })

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.3)
  })

  it('should pick a value from the given matrix following a weighted distribution', function () {
    const possibles = math.matrix([11, 22, 33, 44, 55])
    const weights = [1, 4, 0, 2, 3]
    const picked = []
    let count

    _.times(1000, function () {
      picked.push(pickRandom(possibles, weights))
    })

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.3)
  })

  it('should return an array of values from the given array following a weighted distribution', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 4, 0, 2, 3]
    const number = 2
    const picked = []
    let count

    _.times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, number, weights))
    })

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.3)

    _.times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, weights, number))
    })

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.3)
  })

  it('should return an array of values from the given matrix following a weighted distribution', function () {
    const possibles = math.matrix([11, 22, 33, 44, 55])
    const weights = [1, 4, 0, 2, 3]
    const number = 2
    const picked = []
    let count

    _.times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, number, weights))
    })

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.3)

    _.times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, weights, number))
    })

    count = _.filter(picked, function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = _.filter(picked, function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = _.filter(picked, function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = _.filter(picked, function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = _.filter(picked, function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.3)
  })

  it('should throw an error in case of wrong type of arguments', function () {
    assert.throws(function () { pickRandom(23) }, /Unexpected type of argument/)
    assert.throws(function () { pickRandom() }, /Too few arguments/)
    assert.throws(function () { pickRandom([], 23, [], 9) }, /Too many arguments/)

    // TODO: more type testing...
  })

  it('should LaTeX pickRandom', function () {
    const expression = math.parse('pickRandom([1,2,3])')
    assert.strictEqual(expression.toTex(), '\\mathrm{pickRandom}\\left(\\begin{bmatrix}1\\\\2\\\\3\\\\\\end{bmatrix}\\right)')
  })
})
