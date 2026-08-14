import assert from 'assert'
import { mixin } from '../../../src/utils/emitter.js'

describe('emitter', function () {
  it('should add on/off/once/emit to an object', function () {
    const obj = mixin({})
    assert.strictEqual(typeof obj.on, 'function')
    assert.strictEqual(typeof obj.off, 'function')
    assert.strictEqual(typeof obj.once, 'function')
    assert.strictEqual(typeof obj.emit, 'function')
  })

  it('should subscribe to an event and emit it', function () {
    const obj = mixin({})
    let called = false
    obj.on('test', function () { called = true })
    obj.emit('test')
    assert.strictEqual(called, true)
  })

  it('should pass arguments to event listener', function () {
    const obj = mixin({})
    let receivedArgs
    obj.on('test', function (a, b) { receivedArgs = [a, b] })
    obj.emit('test', 'arg1', 'arg2')
    assert.deepStrictEqual(receivedArgs, ['arg1', 'arg2'])
  })

  it('should subscribe with context', function () {
    const obj = mixin({})
    const ctx = { value: 42 }
    let receivedValue
    obj.on('test', function () { receivedValue = this.value }, ctx)
    obj.emit('test')
    assert.strictEqual(receivedValue, 42)
  })

  it('should support multiple listeners', function () {
    const obj = mixin({})
    let calls = 0
    obj.on('test', function () { calls++ })
    obj.on('test', function () { calls++ })
    obj.emit('test')
    assert.strictEqual(calls, 2)
  })

  it('should subscribe only once with once()', function () {
    const obj = mixin({})
    let calls = 0
    obj.once('test', function () { calls++ })
    obj.emit('test')
    obj.emit('test')
    assert.strictEqual(calls, 1)
  })

  it('should keep context with once()', function () {
    const obj = mixin({})
    const ctx = { value: 99 }
    let receivedValue
    obj.once('test', function () { receivedValue = this.value }, ctx)
    obj.emit('test')
    assert.strictEqual(receivedValue, 99)
  })

  it('should unsubscribe all listeners with off(name)', function () {
    const obj = mixin({})
    let called = false
    obj.on('test', function () { called = true })
    obj.off('test')
    obj.emit('test')
    assert.strictEqual(called, false)
  })

  it('should unsubscribe a specific listener with off(name, fn)', function () {
    const obj = mixin({})
    let calls = 0
    const fn = function () { calls++ }
    obj.on('test', fn)
    obj.on('test', function () { calls += 10 })
    obj.off('test', fn)
    obj.emit('test')
    assert.strictEqual(calls, 10)
  })

  it('should unsubscribe duplicate listeners', function () {
    const obj = mixin({})
    let calls = 0
    const fn = function () { calls++ }
    obj.on('test', fn)
    obj.on('test', fn)
    obj.off('test', fn)
    obj.emit('test')
    assert.strictEqual(calls, 0)
  })

  it('should unsubscribe a once() listener via off()', function () {
    const obj = mixin({})
    let called = false
    const fn = function () { called = true }
    obj.once('test', fn)
    obj.off('test', fn)
    obj.emit('test')
    assert.strictEqual(called, false)
  })

  it('should handle off() before any events are added', function () {
    const obj = mixin({})
    // Should not throw
    obj.off('test', function () {})
  })

  it('should handle emit for non-subscribed events', function () {
    const obj = mixin({})
    // Should not throw
    obj.emit('nonexistent', 'data')
  })

  it('should emit all listeners even if one unsubscribes during emit', function () {
    const obj = mixin({})
    let calls = 0
    const fn = function () {
      calls++
      obj.off('test', fn)
    }
    obj.on('test', fn)
    obj.on('test', function () { calls++ })
    obj.on('test', function () { calls++ })
    obj.emit('test')
    assert.strictEqual(calls, 3)
  })

  it('should allow removing an event inside its own callback', function () {
    const obj = mixin({})
    let called = false
    obj.on('test', function () {
      obj.off('test')
      called = true
    })
    obj.emit('test')
    assert.strictEqual(called, true)
    // Second emit should do nothing
    let calledAgain = false
    obj.on('test', function () { calledAgain = true })
    obj.off('test')
    obj.emit('test')
    assert.strictEqual(calledAgain, false)
  })

  it('should return the object for chaining from on/off/once/emit', function () {
    const obj = mixin({})
    assert.strictEqual(obj.on('test', function () {}), obj)
    assert.strictEqual(obj.off('test'), obj)
    assert.strictEqual(obj.once('test', function () {}), obj)
    assert.strictEqual(obj.emit('test'), obj)
  })
})
