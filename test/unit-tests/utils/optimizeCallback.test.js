import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { optimizeCallback } from '../../../src/utils/optimizeCallback.js'

describe('optimizeCallback', function () {
  function unaryCallback (a) {
    a + 1
  }
  const typedUnaryCallback = math.typed('unaryCallback', {
    number: unaryCallback
  })

  function ternaryCallback (a, b, c) {
    return a + b + c + 1
  }
  const typedTernaryCallback = math.typed('ternaryCallback', {
    'number, number, number': ternaryCallback
  })

  const arrayOfNumbers = [1, 2, 3]
  const name = 'myFunction'

  it('should find the right number of arguments for a function', function () {
    const optimizedUnary = optimizeCallback(unaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedUnary.isUnary, true)
    const optimizedTernary = optimizeCallback(ternaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTernary.isUnary, false)
  })

  it('should find the right number of arguments for a typed function', function () {
    const optimizedTypedUnary = optimizeCallback(typedUnaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTypedUnary.isUnary, true)
    const optimizedTypedTernary = optimizeCallback(typedTernaryCallback, arrayOfNumbers, name, false)
    assert.strictEqual(optimizedTypedTernary.isUnary, false)
  })

  it('should return unary functions as unary when isUnary is set to true', function () {
    const optimizedUnary = optimizeCallback(unaryCallback, arrayOfNumbers, name, true)
    assert.strictEqual(optimizedUnary.isUnary, true)
    const optimizedTernary = optimizeCallback(ternaryCallback, arrayOfNumbers, name, true)
    assert.strictEqual(optimizedTernary.isUnary, true)
    const optimizedTypedUnary = optimizeCallback(typedUnaryCallback, arrayOfNumbers, name, true)
    assert.strictEqual(optimizedTypedUnary.isUnary, true)
    const optimizedTypedTernary = optimizeCallback(typedTernaryCallback, arrayOfNumbers, name, true)
    assert.strictEqual(optimizedTypedTernary.isUnary, true)
  })
  
}
)
