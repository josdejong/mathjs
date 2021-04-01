// test zeros
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix

describe('matrixFrom...', function () {
  it('...Function', function () {
    let expected, actual

    // an antisymmetric matrix
    expected = matrix([[0,-1,-2],[1,0,-1],[2,1,0]])
    actual = math.matrixFromFunction([3,3], i => i[0] - i[1])
    assert.deepStrictEqual(actual, expected)

    // a sparse subdiagonal matrix
    expected = matrix([[0,0,0,0,0],[4,0,0,0,0],[0,4,0,0,0],[0,0,4,0,0],[0,0,0,4,0]], 'sparse')
    actual = math.matrixFromFunction([5, 5], 'sparse', i => i[0] - i[1] === 1 ? 4 : 0)
    assert.deepStrictEqual(actual, expected)

    // a random vector
    actual = math.matrixFromFunction([5], i => math.random())
    assert.deepStrictEqual(actual.size(), [5])
    let counter = 0
    for (const { value } of actual) {
      assert.ok(value >= 0)
      assert.ok(value <= 1)
      counter++
    }
    assert.strictEqual(counter, 5)
  })

})
