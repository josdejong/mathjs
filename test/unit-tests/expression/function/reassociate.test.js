// test reassociate
import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const reassoc = math.reassociate
const deflt = math.simplify.defaultContext

describe('reassociate', function () {
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

  it('should reassociate within all node types having children', function () {
    const orig = math.parse('[a + b + c]')
    let flat = reassoc(orig)
    assert.strictEqual(orig.toString(parens), '[(a + b) + c]')
    assert.strictEqual(flat.toString(parens), '[a + b + c]')
    flat = reassoc(math.parse('A[2*3*4]'))
    assert.strictEqual(flat.toString(parens), 'A[2 * 3 * 4]')
    flat = reassoc(math.parse('A = x y z'))
    assert.strictEqual(flat.toString(parens), 'A = (x y z)')
    flat = reassoc(math.parse('A; 3 + 2 + 1'))
    assert.strictEqual(flat.toString(parens), 'A;\n3 + 2 + 1')
    flat = reassoc(math.parse('A ? 3*2*1 : B'))
    assert.strictEqual(flat.toString(parens), '(A) ? (3 * 2 * 1) : (B)')
    flat = reassoc(math.parse('f(x) = z y x'))
    assert.strictEqual(flat.toString(parens), 'f(x) = (z y x)')
    flat = reassoc(math.parse('max(4+5+6)'))
    assert.strictEqual(flat.toString(parens), 'max(4 + 5 + 6)')
    flat = reassoc(math.parse('{a: 6*5*4}'))
    assert.strictEqual(flat.toString(parens), '{"a": 6 * 5 * 4}')
    flat = reassoc(math.parse('(((a + b + c)))'))
    assert.strictEqual(flat.toString(parens), 'a + b + c')
    flat = reassoc(math.parse('2:7+6+5'))
    assert.strictEqual(flat.toString(parens), '(2):(7 + 6 + 5)')
    flat = reassoc(math.parse('1 <= i+j+k < 10'))
    assert.strictEqual(flat.toString(parens), '(1) <= (i + j + k) < (10)')
  })

  it('should avoid aliasing of original and result by default', function () {
    const orig = math.parse('[a + b + c]')
    const flat = reassoc(orig)
    flat.items[0].args[2].name = 'CHANGED'
    assert.strictEqual(orig.toString(), '[a + b + c]')
    assert.strictEqual(flat.toString(parens), '[a + b + CHANGED]')
  })
})
