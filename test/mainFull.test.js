import assert from 'assert'
import { add, matrix, isObject, isMatrix, pi, speedOfLight, sqrt, evaluate } from '../src/mainFull'

describe('mainFull', function () {
  it('should export functions', () => {
    assert.strictEqual(add(2, 3), 5)
    assert.strictEqual(sqrt(4), 2)
  })

  it('should export constants', () => {
    assert.strictEqual(pi, Math.PI)
  })

  it('should export physical constants', () => {
    assert.strictEqual(speedOfLight.toString(), '2.99792458e+8 m / s')
  })

  it('should export type checking functions', () => {
    assert.strictEqual(isObject({}), true)
    assert.strictEqual(isObject(null), false)
    assert.strictEqual(isMatrix([]), false)
    assert.strictEqual(isMatrix(matrix()), true)
  })

  // FIXME: test export of evaluate and parse
  it.skip('should export evaluate having functions and constants', () => {
    assert.strictEqual(evaluate('sqrt(4)'), 2)
    assert.strictEqual(evaluate('pi'), Math.PI)
  })

  // TODO: test export of create and core
  // TODO: test export of errors
  // TODO: test export json reviver
  // TODO: test export of classes
  // TODO: test export of default instance
  // TODO: test snapshot of all exported things
})
