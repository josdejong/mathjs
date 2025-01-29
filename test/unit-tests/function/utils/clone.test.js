import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('clone', function () {
  it('should clone a boolean', function () {
    assert.strictEqual(math.clone(true), true)
    assert.strictEqual(math.clone(false), false)
  })

  it('should clone null', function () {
    assert.strictEqual(math.clone(null), null)
  })

  it('should clone a number', function () {
    let a = 1
    const b = math.clone(a)
    a = 2
    assert.strictEqual(a, 2)
    assert.strictEqual(b, 1)
  })

  it('should clone a bigint', function () {
    let a = 1n
    const b = math.clone(a)
    a = 2n
    assert.strictEqual(a, 2n)
    assert.strictEqual(b, 1n)
  })

  it('should throw an error on wrong number of arguments', function () {
    assert.throws(function () { math.clone() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.clone(2, 4) }, /TypeError: Too many arguments/)
  })

  it('should clone a bignumber', function () {
    const a = math.bignumber('2.3e500')
    const b = math.clone(a)
    assert.deepStrictEqual(a, b)
  })

  it('should clone a string', function () {
    let a = 'hello world'
    const b = math.clone(a)
    a = 'bye!'
    assert.strictEqual(a, 'bye!')
    assert.strictEqual(b, 'hello world')
  })

  it('should clone a complex number', function () {
    const a = math.complex(2, 3)
    const b = math.clone(a)
    assert.notStrictEqual(a, b)
    a.re = 5
    assert.strictEqual(a.toString(), '5 + 3i')
    assert.strictEqual(b.toString(), '2 + 3i')
  })

  it('should clone a unit', function () {
    const a = math.unit('5mm')
    const b = math.clone(a)
    a.value = 10
    assert.strictEqual(a.toString(), '10 m')
    assert.strictEqual(b.toString(), '5 mm')
  })

  it('should clone a fraction', function () {
    const a = math.fraction(2, 3)
    const b = math.clone(a)
    assert.deepStrictEqual(a, b)
  })

  it('should clone an array', function () {
    const a = [1, 2, [3, 4]]
    const b = math.clone(a)
    a[2][1] = 5
    assert.strictEqual(b[2][1], 4)
  })

  it('should clone a matrix', function () {
    let a = math.matrix([[1, 2], [3, 4]])
    let b = math.clone(a)
    a.valueOf()[0][0] = 5
    assert.strictEqual(b.valueOf()[0][0], 1)

    a = math.matrix([1, 2, math.complex(2, 3), 4])
    b = math.clone(a)
    a.valueOf()[2].re = 5
    assert.strictEqual(b.valueOf()[2].re, 2)
  })

  it('should clone a function', function () {
    const f = () => 42
    const a = math.matrix([f])
    const b = math.clone(a)
    assert.strictEqual(b.get([0]), f)
  })

  it('should LaTeX clone', function () {
    const expression = math.parse('clone(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{clone}\\left(1\\right)')
  })
})
