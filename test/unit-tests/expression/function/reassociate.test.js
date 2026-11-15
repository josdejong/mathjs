// test reassociate
import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const reassoc = math.reassociate
const deflt = math.simplify.defaultContext

describe('ressociate', function () {
  const parens = { parenthesis: 'all' }
  const crazy = { divide: { associative: true }, add: { associative: false } }
  const deeper = math.parse('3 / 4 / (5 + 6 + 7)')

  it('should flatten assocative operators', function () {
    assert.strictEqual(reassoc(math.parse('x y z')).toString(parens), 'x y z')
    // make sure deeper doesn't change
    assert.strictEqual(deeper.toString(parens), '(3 / 4) / ((5 + 6) + 7)')
    assert.strictEqual(
      reassoc(deeper).toString(parens), '(3 / 4) / (5 + 6 + 7)')
    assert.strictEqual(deeper.toString(parens), '(3 / 4) / ((5 + 6) + 7)')
  })

  it('should flatten according to context', function () {
    assert.strictEqual(
      reassoc(math.parse('x y z'),
        { multiply: { associative: false } }).toString(parens),
      '(x y) z')
    assert.strictEqual(reassoc(deeper, crazy).toString(parens),
      'divide(3, 4, (5 + 6) + 7)')
  })

  it('should flatten in place', function () {
    reassoc(deeper, crazy, { inplace: true })
    assert.strictEqual(deeper.toString(parens), 'divide(3, 4, (5 + 6) + 7)')
  })

  it('should associate multi-arg ops left or right', function () {
    const orig = math.parse('add(x,y,z,w)')
    assert.strictEqual(reassoc(orig, deflt, { direction: 'left' }).toString(),
      'add(add(add(x, y), z), w)')
    // make sure orig doesn't change
    assert.strictEqual(orig.toString(), 'add(x, y, z, w)')
    const mult = math.parse('multiply(x,y,z,w)')
    assert.strictEqual(
      reassoc(mult, deflt, { direction: 'right' }).toString(),
      'multiply(x, multiply(y, multiply(z, w)))')
  })

  it('should not change non-associative ops', function () {
    const orig = math.parse('subtract(x,y,z,w)')
    assert.strictEqual(reassoc(orig, deflt, { direction: 'left' }).toString(),
      'subtract(x, y, z, w)')
  })

  it('should flatten according to context', function () {
    const orig = math.parse('add(x,y,divide(w,z,a,b))')
    assert.strictEqual(reassoc(orig, crazy, { direction: 'left' }).toString(),
      'add(x, y, divide(divide(divide(w, z), a), b))')
    assert.strictEqual(reassoc(orig, crazy, { direction: 'right' }).toString(),
      'add(x, y, divide(w, divide(z, divide(a, b))))')
    assert.strictEqual(orig.toString(), 'add(x, y, divide(w, z, a, b))')
    reassoc(orig, crazy, { direction: 'right', inplace: true })
    assert.strictEqual(
      orig.toString(), 'add(x, y, divide(w, divide(z, divide(a, b))))')
  })
})
