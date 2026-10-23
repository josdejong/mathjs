// test boolean utils
import assert from 'assert'
import math from '../../../src/defaultInstance.js'

import {
  getSafeMethod,
  getSafeProperty,
  isPlainObject,
  isSafeArrayProperty,
  isSafeMethod,
  isSafeObjectProperty,
  setSafeProperty
} from '../../../src/utils/customs.js'

describe('customs', function () {
  describe('isSafeMethod', function () {
    it('plain objects', function () {
      const object = {
        fn: function () {}
      }
      assert.strictEqual(isSafeMethod(object, 'fn'), true)
      assert.strictEqual(isSafeMethod(object, 'toString'), true)
      assert.strictEqual(isSafeMethod(object, 'toLocaleString'), true)
      assert.strictEqual(isSafeMethod(object, 'valueOf'), true)

      assert.strictEqual(isSafeMethod(object, 'constructor'), false)
      assert.strictEqual(isSafeMethod(object, 'hasOwnProperty'), false)
      assert.strictEqual(isSafeMethod(object, 'isPrototypeOf'), false)
      assert.strictEqual(isSafeMethod(object, 'propertyIsEnumerable'), false)
      assert.strictEqual(isSafeMethod(object, '__defineGetter__'), false)
      assert.strictEqual(isSafeMethod(object, '__defineSetter__'), false)
      assert.strictEqual(isSafeMethod(object, '__lookupGetter__'), false)
      assert.strictEqual(isSafeMethod(object, '__lookupSetter__'), false)

      // non existing method
      assert.strictEqual(isSafeMethod(object, 'foo'), false)

      // custom inherited method
      const object1 = {
        foo: function () {}
      }
      const object2 = Object.create(object1)
      assert.strictEqual(isSafeMethod(object2, 'foo'), true)

      // ghosted native method
      const object3 = {}
      object3.toString = function () {}
      assert.strictEqual(isSafeMethod(object3, 'toString'), false)
    })

    it('functions', function () {
      const f = function () {}

      assert.strictEqual(isSafeMethod(f, 'call'), false)
      assert.strictEqual(isSafeMethod(f, 'bind'), false)
      assert.strictEqual(isSafeMethod(f, 'constructor'), false)
    })

    it('classes', function () {
      const matrix = math.matrix()
      assert.strictEqual(isSafeMethod(matrix, 'get'), true)
      assert.strictEqual(isSafeMethod(matrix, 'toString'), true)

      const complex = math.complex()
      assert.strictEqual(isSafeMethod(complex, 'sqrt'), true)
      assert.strictEqual(isSafeMethod(complex, 'toString'), true)

      const unit = math.unit('5cm')
      assert.strictEqual(isSafeMethod(unit, 'toNumeric'), true)
      assert.strictEqual(isSafeMethod(unit, 'toString'), true)

      // extend the class instance with a custom method
      const object = math.matrix()
      object.foo = function () {}
      assert.strictEqual(isSafeMethod(object, 'foo'), true)

      // extend the class instance with a ghosted method
      const object2 = math.matrix()
      object2.toJSON = function () {}
      assert.strictEqual(isSafeMethod(object2, 'toJSON'), false)

      // unsafe native methods
      assert.strictEqual(isSafeMethod(matrix, 'constructor'), false)
      assert.strictEqual(isSafeMethod(matrix, 'hasOwnProperty'), false)
      assert.strictEqual(isSafeMethod(matrix, 'isPrototypeOf'), false)
      assert.strictEqual(isSafeMethod(matrix, 'propertyIsEnumerable'), false)
      assert.strictEqual(isSafeMethod(matrix, '__defineGetter__'), false)
      assert.strictEqual(isSafeMethod(matrix, '__defineSetter__'), false)
      assert.strictEqual(isSafeMethod(matrix, '__lookupGetter__'), false)
      assert.strictEqual(isSafeMethod(matrix, '__lookupSetter__'), false)

      // non existing method
      assert.strictEqual(isSafeMethod(matrix, 'nonExistingMethod'), false)

      // method with unicode chars
      assert.strictEqual(isSafeMethod(matrix, 'co\u006Estructor'), false)
    })

    it('strings', function () {
      assert.strictEqual(isSafeMethod('abc', 'toUpperCase'), true)
      assert.strictEqual(isSafeMethod('', 'toUpperCase'), true)
      assert.strictEqual(isSafeMethod('abc', 'constructor'), false)
      assert.strictEqual(isSafeMethod('abc', '__proto__'), false)
    })

    it('numbers', function () {
      assert.strictEqual(isSafeMethod(3.14, 'toFixed'), true)
      assert.strictEqual(isSafeMethod(0, 'toFixed'), true)
      assert.strictEqual(isSafeMethod(3.14, 'constructor'), false)
      assert.strictEqual(isSafeMethod(3.14, '__proto__'), false)
    })

    it('dates', function () {
      assert.strictEqual(isSafeMethod(new Date(), 'getTime'), true)
      assert.strictEqual(isSafeMethod(new Date(0), 'getTime'), true)
      assert.strictEqual(isSafeMethod(new Date(), 'constructor'), false)
      assert.strictEqual(isSafeMethod(new Date(), '__proto__'), false)
    })
  })

  describe('getSafeMethod', function () {
    it('should return a method when safe', function () {
      const obj = { getName: () => 'Joe' }

      assert.strictEqual(getSafeMethod(obj, 'getName'), obj.getName)
    })

    it('should throw an exception when a method is unsafe', function () {
      assert.throws(() => {
        getSafeMethod(Function, 'constructor')
      }, /Error: No access to method "constructor"/)
    })
  })

  describe('isSafeObjectProperty', function () {
    it('should test properties on plain objects', function () {
      const object = {}

      /* From Object.prototype:
        Object.getOwnPropertyNames(Object.prototype).forEach(
          key => typeof ({})[key] !== 'function' && console.log(key))
      */
      assert.strictEqual(isSafeObjectProperty(object, '__proto__'), false)
      assert.strictEqual(isSafeObjectProperty(object, 'constructor'), false)

      /* From Function.prototype:
        Object.getOwnPropertyNames(Function.prototype).forEach(
          key => typeof (function () {})[key] !== 'function' && console.log(key))
      */
      assert.strictEqual(isSafeObjectProperty(object, 'length'), true)
      assert.strictEqual(isSafeObjectProperty(object, 'name'), true)
      // assert.strictEqual(isSafeObjectProperty(object, 'arguments'), false)
      // assert.strictEqual(isSafeObjectProperty(object, 'caller'), false)

      // non-existing property
      assert.strictEqual(isSafeObjectProperty(object, 'bar'), true)

      // property with unicode chars
      assert.strictEqual(
        isSafeObjectProperty(object, 'co\u006Estructor'),
        false
      )
    })

    it('should test inherited properties on plain objects', function () {
      const object1 = {}
      const object2 = Object.create(object1)
      object1.foo = true
      object2.bar = true
      assert.strictEqual(isSafeObjectProperty(object2, 'foo'), true)
      assert.strictEqual(isSafeObjectProperty(object2, 'bar'), true)
      assert.strictEqual(isSafeObjectProperty(object2, '__proto__'), false)
      assert.strictEqual(isSafeObjectProperty(object2, 'constructor'), false)

      object2.foo = true // override "foo" of object1
      assert.strictEqual(isSafeObjectProperty(object2, 'foo'), true)
      assert.strictEqual(isSafeObjectProperty(object2, 'constructor'), false)
    })
  })

  describe('isSafeArrayProperty', function () {
    it('should test properties on an array', function () {
      const array = [3, 2, 1]
      assert.strictEqual(isSafeArrayProperty(array, 'length'), true)
      assert.strictEqual(isSafeArrayProperty(array, 42), true)
      assert.strictEqual(isSafeArrayProperty(array, '24'), true)

      assert.strictEqual(isSafeArrayProperty(array, 'foo'), false)
      assert.strictEqual(isSafeArrayProperty(array, 'sort'), false)
      assert.strictEqual(isSafeArrayProperty(array, '__proto__'), false)
      assert.strictEqual(isSafeArrayProperty(array, 'constructor'), false)
    })
  })

  describe('getSafeProperty', function () {
    it('should return a method when safe', function () {
      const obj = { getName: () => 'Joe' }

      assert.strictEqual(getSafeProperty(obj, 'getName'), obj.getName)
    })

    it('should return a property when safe', function () {
      const obj = { username: 'Joe' }

      assert.strictEqual(getSafeProperty(obj, 'username'), 'Joe')
    })

    it('should return a property from an array when safe', function () {
      const array = [3, 2, 1]
      array.foo = 42
      assert.strictEqual(getSafeProperty(array, 'length'), 3)
      assert.throws(() => getSafeProperty(array, 'foo'), /No access to property/)
      assert.throws(
        () => getSafeProperty(array, 'sort'),
        /Error: Cannot access method "sort" as a property/
      )
      assert.throws(() => getSafeProperty(array, '__proto__'), /No access to property/)
      assert.throws(() => getSafeProperty(array, 'constructor'), /No access to property "constructor"/)
    })

    it('should throw an exception when a method is unsafe', function () {
      assert.throws(() => {
        getSafeProperty(Function, 'constructor')
      }, /Error: No access to property "constructor"/)
    })

    it('should throw an exception when a property is unsafe', function () {
      assert.throws(() => {
        getSafeProperty({ constructor: 'test' }, 'constructor')
      }, /Error: No access to property "constructor"/)
    })
  })

  describe('setSafeProperty', function () {
    it('should set a property on an object when safe', function () {
      const obj = {}
      setSafeProperty(obj, 'foo', 42)
      assert.deepStrictEqual(obj, { foo: 42 })

      assert.throws(() => {
        setSafeProperty(obj, 'constructor', 42)
      }, /No access to property "constructor"/)
    })

    it('should set a property on an object when safe (2)', function () {
      const obj = {}
      setSafeProperty(obj, '42', 'fortytwo')
      assert.deepStrictEqual(obj, { 42: 'fortytwo' })
    })

    it('should set a property on an array when safe', function () {
      const arr = []
      setSafeProperty(arr, 0, 'zero')
      setSafeProperty(arr, '1', 'one')
      setSafeProperty(arr, '2', 'two')
      assert.deepStrictEqual(arr, ['zero', 'one', 'two'])

      setSafeProperty(arr, 'length', 10)
      assert.deepStrictEqual(arr.length, 10)
    })

    it('should not allow setting a non-numeric property on an array', function () {
      assert.throws(() => {
        setSafeProperty([], 'map', () => {})
      }, /No access to property "map"/)
    })
  })

  it('should distinguish plain objects', function () {
    const a = {}
    const b = Object.create(a)
    assert.strictEqual(isPlainObject(a), true)
    assert.strictEqual(isPlainObject(b), true)

    assert.strictEqual(isPlainObject(math.unit('5cm')), false)
    assert.strictEqual(isPlainObject(math.unit('5cm')), false)
    assert.strictEqual(isPlainObject([]), false)
    // assert.strictEqual(isPlainObject (math.complex()), false); // FIXME: shouldn't treat Complex as a plain object (it is a plain object which has __proto__ overridden)
    assert.strictEqual(isPlainObject(math.matrix()), false)
  })
})
