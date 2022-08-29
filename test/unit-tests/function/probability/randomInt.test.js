import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const math2 = math.create({ randomSeed: 'test' })
const randomInt = math2.randomInt

describe('randomInt', function () {
  it('should have a function randomInt', function () {
    assert.strictEqual(typeof math.randomInt, 'function')
  })

  it('should pick uniformly distributed integers in [min, max)', function () {
    const picked = []

    times(10000, function () {
      picked.push(randomInt(-15, -5))
    })

    assertUniformDistributionInt(picked, -15, -5)
  })

  it('should pick uniformly distributed random array, with elements in [min, max)', function () {
    const picked = []
    const matrices = []
    const size = [2, 3, 4]

    times(1000, function () {
      matrices.push(randomInt(size, -14.9, -2))
    })

    // Collect all values in one array
    matrices.forEach(function (matrix) {
      assert.deepStrictEqual(math.size(matrix), size)
      math.forEach(matrix, function (val) {
        picked.push(val)
      })
    })
    assert.strictEqual(picked.length, 2 * 3 * 4 * 1000)
    assertUniformDistributionInt(picked, -14.9, -2)
  })

  it('should throw an error if called with invalid arguments', function () {
    assert.throws(function () {
      randomInt(1, 2, [4, 8])
    })

    assert.throws(function () {
      randomInt(1, 2, 3, 6)
    })
  })

  it('should throw an error in case of wrong number of arguments', function () {
    assert.throws(function () { randomInt([2, 3], 10, 100, 12) }, / Too many arguments/)
  })

  it('should LaTeX randomInt', function () {
    const expression = math.parse('randomInt(0,100)')
    assert.strictEqual(expression.toTex(), '\\mathrm{randomInt}\\left(0,100\\right)')
  })
})

const assertUniformDistributionInt = function (values, min, max) {
  const valuesRange = range(Math.floor(min), Math.floor(max))
  let count

  values.forEach(function (val) {
    assert.ok(valuesRange.includes(val))
  })

  valuesRange.forEach(function (val) {
    count = values.filter(function (testVal) { return testVal === val }).length
    assertApproxEqual(count / values.length, 1 / valuesRange.length, 0.03)
  })
}

const assertApproxEqual = function (testVal, val, tolerance) {
  const diff = Math.abs(val - testVal)
  if (diff > tolerance) assert.strictEqual(testVal, val)
  else assert.ok(diff <= tolerance)
}

function times (n, callback) {
  for (let i = 0; i < n; i++) {
    callback()
  }
}

function range (start, end) {
  const array = []

  for (let i = start; i < end; i++) {
    array.push(i)
  }

  return array
}
