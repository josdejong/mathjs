// test resize
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('resize', function () {
  it('should resize an array', function () {
    const array = [[0, 1, 2], [3, 4, 5]]
    assert.deepStrictEqual(math.resize(array, [3, 2]), [[0, 1], [3, 4], [0, 0]])

    // content should be cloned
    const x = math.complex(2, 3)
    const a = [x]
    const b = math.resize(a, [2], 4)
    assert.deepStrictEqual(b, [x, 4])
    assert.notStrictEqual(b[0], x)
  })

  it('should resize an array with a default value', function () {
    const array = [[0, 1, 2], [3, 4, 5]]
    assert.deepStrictEqual(math.resize(array, [3, 2], 5), [[0, 1], [3, 4], [5, 5]])
    assert.deepStrictEqual(math.resize(array, [2]), [0, 3])
  })

  it('should resize an array with null as default value', function () {
    const array = []
    assert.deepStrictEqual(math.resize(array, [3], null), [null, null, null])
  })

  it('should resize an array with bignumbers', function () {
    const zero = math.bignumber(0)
    const one = math.bignumber(1)
    const two = math.bignumber(2)
    const three = math.bignumber(3)
    const array = [one, two, three]
    assert.deepStrictEqual(math.resize(array, [three, two], zero),
      [[one, zero], [two, zero], [three, zero]])
  })

  it('should resize a matrix', function () {
    const matrix = math.matrix([[0, 1, 2], [3, 4, 5]])
    assert.deepStrictEqual(math.resize(matrix, [3, 2]),
      math.matrix([[0, 1], [3, 4], [0, 0]]))
    assert.deepStrictEqual(math.resize(matrix, math.matrix([3, 2])),
      math.matrix([[0, 1], [3, 4], [0, 0]]))

    // content should be cloned
    const x = math.complex(2, 3)
    const a = math.matrix([x])
    const b = math.resize(a, [2], 4)
    assert.deepStrictEqual(b, math.matrix([x, 4]))
    assert.notStrictEqual(b.valueOf()[0], x)
  })

  it('should resize an array into a scalar', function () {
    const array = [[0, 1, 2], [3, 4, 5]]
    assert.deepStrictEqual(math.resize(array, []), 0)
  })

  it('should resize a matrix into a scalar', function () {
    const matrix = math.matrix([[0, 1, 2], [3, 4, 5]])
    assert.deepStrictEqual(math.resize(matrix, []), 0)
  })

  it('should resize a scalar into an array when array is specified in settings', function () {
    const math2 = math.create({ matrix: 'Array' })

    assert.deepStrictEqual(math2.resize(2, [3], 4), [2, 4, 4])
    assert.deepStrictEqual(math2.resize(2, [2, 2], 4), [[2, 4], [4, 4]])
  })

  it('should resize a vector into a 2d matrix', function () {
    const math2 = math.create({ matrix: 'Array' })

    assert.deepStrictEqual(math2.resize([1, 2, 3], [3, 2], 0), [[1, 0], [2, 0], [3, 0]])
  })

  it('should resize 2d matrix into a vector', function () {
    const math2 = math.create({ matrix: 'Array' })

    assert.deepStrictEqual(math2.resize([[1, 2], [3, 4], [5, 6]], [3], 0), [1, 3, 5])
  })

  it('should resize a scalar into a matrix', function () {
    assert.deepStrictEqual(math.resize(2, [3], 4), math.matrix([2, 4, 4]))
    assert.deepStrictEqual(math.resize(2, [2, 2], 4), math.matrix([[2, 4], [4, 4]]))
  })

  it('should resize a scalar into a scalar', function () {
    const x = math.complex(2, 3)
    const y = math.resize(x, [])
    assert.deepStrictEqual(x, y)
    assert.notStrictEqual(x, y)
  })

  it('should resize a string', function () {
    assert.strictEqual(math.resize('hello', [2]), 'he')
    assert.strictEqual(math.resize('hello', [8]), 'hello   ')
    assert.strictEqual(math.resize('hello', [5]), 'hello')
    assert.strictEqual(math.resize('hello', [8], '!'), 'hello!!!')
  })

  it('should throw an error on invalid arguments', function () {
    assert.throws(function () { math.resize() })
    assert.throws(function () { math.resize([]) })
    assert.throws(function () { math.resize([], 2) })
    assert.throws(function () { math.resize([], [], 4, 555) })

    assert.throws(function () { math.resize([], ['no number']) }, /Invalid size/)
    assert.throws(function () { math.resize([], [2.3]) }, /Invalid size/)

    assert.throws(function () { math.resize('hello', []) })
    assert.throws(function () { math.resize('hello', [2, 3]) })
    assert.throws(function () { math.resize('hello', [8], 'charzzz') })
    assert.throws(function () { math.resize('hello', [8], 2) })

    assert.throws(function () { math.resize('hello', ['no number']) }, /Invalid size/)
    assert.throws(function () { math.resize('hello', [2.3]) }, /Invalid size/)
  })

  it('should LaTeX resize', function () {
    const expression = math.parse('resize([1,2],1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{resize}\\left(\\begin{bmatrix}1\\\\2\\end{bmatrix},1\\right)')
  })
})
