import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { flatten } from '../../../../src/utils/array.js'

const math2 = math.create({ randomSeed: 'test2' })
const pickRandom = math2.pickRandom
const matrix = math2.matrix

describe('pickRandom', function () {
  it('should have a function pickRandom', function () {
    assert.strictEqual(typeof math.pickRandom, 'function')
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

  it('should return an empty array if the given number is 0', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 0

    assert.strictEqual(pickRandom(possibles, number).length, 0)
    assert.strictEqual(pickRandom(possibles, number, weights).length, 0)
    assert.strictEqual(pickRandom(possibles, weights, number).length, 0)
    assert.strictEqual(pickRandom(possibles, { weights, number }).length, 0)
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
    assert.strictEqual(pickRandom(possibles, { weights, number }).length, 1)
  })

  it('should pick the given number of values from the given array', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 3

    assert.strictEqual(pickRandom(possibles, number).length, number)
    assert.strictEqual(pickRandom(possibles, number, weights).length, number)
    assert.strictEqual(pickRandom(possibles, weights, number).length, number)
    assert.strictEqual(pickRandom(possibles, { weights, number }).length, number)
  })

  it('should pick the given number of values from the given array also when this is more than the number of possibles', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 10

    assert.strictEqual(pickRandom(possibles, number).length, number)
    assert.strictEqual(pickRandom(possibles, number, weights).length, number)
    assert.strictEqual(pickRandom(possibles, weights, number).length, number)
    assert.strictEqual(pickRandom(possibles, { weights, number }).length, number)
  })

  it('should pick the given number of values element-wise', function () {
    const possibles = [[1, 2], [3, 4]]

    assert.strictEqual(typeof pickRandom(possibles), 'number')
    assert.strictEqual(typeof pickRandom(possibles, { elementWise: true }), 'number')
    assert.strictEqual(Array.isArray(pickRandom(possibles, { elementWise: false })), true)
  })

  it('should return a matrix when input was a matrix', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 5, 2, 4, 6]
    const number = 2

    const result1 = pickRandom(math.matrix(possibles), number)
    assert.strictEqual(result1.isMatrix, true)
    assert.strictEqual(result1.size()[0], 2)

    const result2 = pickRandom(matrix(possibles), number, weights)
    assert.strictEqual(result2.isMatrix, true)
    assert.strictEqual(result2.size()[0], 2)

    const result3 = pickRandom(matrix(possibles), weights, number)
    assert.strictEqual(result3.isMatrix, true)
    assert.strictEqual(result3.size()[0], 2)

    const result4 = pickRandom(possibles, number, matrix(weights))
    assert.strictEqual(result4.isMatrix, true)
    assert.strictEqual(result4.size()[0], 2)

    const result5 = pickRandom(possibles, matrix(weights), number)
    assert.strictEqual(result5.isMatrix, true)
    assert.strictEqual(result5.size()[0], 2)

    const result6 = pickRandom(possibles, matrix(weights), number)
    assert.strictEqual(result6.isMatrix, true)
    assert.strictEqual(result6.size()[0], 2)
  })

  it('should pick a number from the given multi dimensional array following an uniform distribution', function () {
    const possibles = [[11, 12], [22, 23], [33, 34], [44, 45], [55, 56]]
    const picked = []

    times(1000, () => picked.push(pickRandom(possibles)))

    flatten(possibles).forEach(possible => {
      const count = flatten(picked).filter(val => val === possible).length
      assert.strictEqual(math.round(count / picked.length, 1), 0.1)
    })
  })

  it('should pick a value from the given multi dimensional array following an uniform distribution', function () {
    // just to be sure that works for any kind of array
    const possibles = [[[11], [12]], ['test', 45], 'another test', 10, false, [1.3, 4.5, true]]
    const picked = []

    times(1000, () => picked.push(pickRandom(possibles)))
    flatten(possibles).forEach(possible => {
      const count = picked.filter(val => val === possible).length
      assert.strictEqual(math.round(count / picked.length, 1), 0.1)
    })
  })

  it('should pick a value from the given array following an uniform distribution if only possibles are passed', function () {
    const possibles = [11, 22, 33, 44, 55]
    const picked = []
    let count

    times(1000, function () {
      picked.push(pickRandom(possibles))
    })

    count = picked.filter(function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 22 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)
  })

  it('should pick a given number of values from the given array following an uniform distribution if no weights were passed', function () {
    const possibles = [11, 22, 33, 44, 55]
    const number = 2
    const picked = []
    let count

    times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, number))
    })

    assert.strictEqual(picked.length, 2000)

    count = picked.filter(function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 22 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)
  })

  it('should pick a value from the given array following a weighted distribution', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 4, 0, 2, 3]
    const picked = []
    let count

    times(1000, function () {
      picked.push(pickRandom(possibles, weights))
    })

    count = picked.filter(function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = picked.filter(function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = picked.filter(function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = picked.filter(function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.3)
  })

  it('should return an array of values from the given array following a weighted distribution', function () {
    const possibles = [11, 22, 33, 44, 55]
    const weights = [1, 4, 0, 2, 3]
    const number = 2
    const picked = []
    let count

    times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, number, weights))
    })

    count = picked.filter(function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = picked.filter(function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = picked.filter(function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = picked.filter(function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 55 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.3)

    times(1000, function () {
      picked.push.apply(picked, pickRandom(possibles, weights, number))
    })

    count = picked.filter(function (val) { return val === 11 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.1)

    count = picked.filter(function (val) { return val === 22 }).length
    assert.strictEqual(math.round((count) / picked.length, 1), 0.4)

    count = picked.filter(function (val) { return val === 33 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0)

    count = picked.filter(function (val) { return val === 44 }).length
    assert.strictEqual(math.round(count / picked.length, 1), 0.2)

    count = picked.filter(function (val) { return val === 55 }).length
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
    assert.strictEqual(expression.toTex(), '\\mathrm{pickRandom}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}\\right)')
  })
})

function times (n, callback) {
  for (let i = 0; i < n; i++) {
    callback()
  }
}
