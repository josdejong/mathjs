import assert from 'assert'
import mathjs from '../../../src/defaultInstance.js'
import { approxEqual } from '../../../tools/approx.js'
import { factory } from '../../../src/utils/factory.js'
import { create } from '../../../src/core/create.js'
import { hasOwnProperty } from '../../../src/utils/object.js'

const multiplyTestFactory = factory('multiplyTest', [], () => {
  return function multiply (a, b) {
    return a * b
  }
})

const cubeTestFactory = factory('cubeTest', ['multiplyTest'], ({ multiplyTest }) => {
  return function cube (a) {
    return multiplyTest(a, multiplyTest(a, a))
  }
})

const nestedFactory = factory('tools.misc.nested', [], () => {
  return function nested () {
    return 'nested'
  }
})

describe('import', function () {
  let math = null

  beforeEach(function () {
    math = mathjs.create()
    math.import({
      myvalue: 42,
      hello: function (name) {
        return 'hello, ' + name + '!'
      }
    }, { override: true })
  })

  afterEach(function () {
    math = null
  })

  it('should import a custom member', function () {
    assert.strictEqual(math.myvalue * 2, 84)
    assert.strictEqual(math.hello('user'), 'hello, user!')
  })

  it('should not override existing functions', function () {
    assert.throws(function () { math.import({ myvalue: 10 }) },
      /Error: Cannot import "myvalue": already exists/)
    assert.strictEqual(math.myvalue, 42)
  })

  it('should not override existing units', function () {
    assert.throws(function () { math.import({ meter: 10 }) },
      /Error: Cannot import "meter": already exists/)
    assert.deepStrictEqual(math.evaluate('1 meter'), math.unit('1 meter'))
  })

  it('should allow importing the same function twice if it is strictly equal', function () {
    function foo () { return 'bar' }

    math.import({
      object1: {
        foo
      },
      object2: {
        foo
      }
    })

    assert.strictEqual(math.foo(), 'bar')
  })

  it('should not allow importing the same function twice if it is not strictly equal', function () {
    function foo1 () { return 'bar' }
    function foo2 () { return 'bar' }

    assert.throws(function () {
      math.import({
        object1: {
          foo: foo1
        },
        object2: {
          foo: foo2
        }
      })
    }, /Error: Cannot import "foo" twice/)
  })

  it('should throw no errors when silent:true', function () {
    math.import({ myvalue: 10 }, { silent: true })
    assert.strictEqual(math.myvalue, 42)
  })

  it('should override existing functions if forced', function () {
    math.import({ myvalue: 10 }, { override: true })
    assert.strictEqual(math.myvalue, 10)
  })

  it('should override existing units if forced', function () {
    math.import({ meter: 10 }, { override: true })
    assert.strictEqual(math.evaluate('meter'), 10)
  })

  it('should parse the user defined members', function () {
    if (math.parser) {
      const parser = math.parser()
      math.add(math.myvalue, 10)
      parser.evaluate('myvalue + 10') // 52
      parser.evaluate('hello("user")') // 'hello, user!'
    }
  })

  const getSize = function (array) {
    return array.length
  }

  it('shouldn\'t wrap custom functions by default', function () {
    math.import({ getSizeNotWrapped: getSize })
    assert.strictEqual(math.getSizeNotWrapped([1, 2, 3]), 3)
    assert.strictEqual(math.getSizeNotWrapped(math.matrix([1, 2, 3])), undefined)
  })

  it('should wrap custom functions if wrap = true', function () {
    math.import({ getSizeWrapped: getSize }, { wrap: true })
    assert.strictEqual(math.getSizeWrapped([1, 2, 3]), 3)
    assert.strictEqual(math.getSizeWrapped(math.matrix([1, 2, 3])), 3)
  })

  it('wrapped imported functions should accept undefined and null', function () {
    math.import({
      testIsNull: function (obj) {
        return obj === null
      }
    }, { wrap: true })
    assert.strictEqual(math.testIsNull(null), true)
    assert.strictEqual(math.testIsNull(0), false)

    math.import({
      testIsUndefined: function (obj) {
        return obj === undefined
      }
    }, { wrap: true })
    assert.strictEqual(math.testIsUndefined(undefined), true)
    assert.strictEqual(math.testIsUndefined(0), false)
    assert.strictEqual(math.testIsUndefined(null), false)
  })

  it('should throw an error in case of wrong number of arguments', function () {
    assert.throws(function () { math.import() }, /ArgumentsError/)
    assert.throws(function () { math.import('', {}, 3) }, /ArgumentsError/)
  })

  it('should throw an error in case of wrong type of arguments', function () {
    assert.throws(function () { math.import(2) }, /TypeError: Factory, Object, or Array expected/)
    assert.throws(function () { math.import(function () {}) }, /TypeError: Factory, Object, or Array expected/)
  })

  it('should ignore properties on Object', function () {
    Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native

    math.import({ baz: 456 })

    assert(!hasOwnProperty(math, 'foo'))
    assert(hasOwnProperty(math, 'baz'))

    delete Object.prototype.foo
  })

  it('should return the imported object', function () {
    math.import({ a: 24 })
    assert.deepStrictEqual(math.a, 24)

    math.import({ pi: 24 }, { silent: true })
    approxEqual(math.pi, Math.PI) // pi was ignored
  })

  it('should import a boolean', function () {
    math.import({ a: true })
    assert.strictEqual(math.a, true)
  })

  it('should merge typed functions with the same name', function () {
    math.import({
      foo: math.typed('foo', {
        number: function (x) {
          return 'foo(number)'
        }
      })
    })

    math.import({
      foo: math.typed('foo', {
        string: function (x) {
          return 'foo(string)'
        }
      })
    })

    assert.deepStrictEqual(Object.keys(math.foo.signatures).sort(), ['number', 'string'])
    assert.strictEqual(math.foo(2), 'foo(number)')
    assert.strictEqual(math.foo('bar'), 'foo(string)')
    assert.throws(function () {
      math.foo(new Date())
    }, /TypeError: Unexpected type of argument in function foo/)
  })

  it('should override existing typed functions', function () {
    math.import({
      foo: math.typed('foo', {
        Date: function (x) {
          return 'foo(Date)'
        }
      })
    })

    assert.strictEqual(math.foo(new Date()), 'foo(Date)')

    math.import({
      foo: math.typed('foo', {
        string: function (x) {
          return 'foo(string)'
        }
      })
    }, { override: true })

    assert.deepStrictEqual(Object.keys(math.foo.signatures).sort(), ['string'])
    assert.strictEqual(math.foo('bar'), 'foo(string)')
    assert.throws(function () {
      math.foo(new Date())
    }, /TypeError: Unexpected type of argument in function foo/)
    assert.throws(function () {
      math.foo(new Date())
    }, /TypeError: Unexpected type of argument in function foo/)
  })

  it('should import a boolean', function () {
    math.import({ a: true })
    assert.strictEqual(math.a, true)
  })

  it('should import a function with transform', function () {
    function foo (text) {
      return text.toLowerCase()
    }

    foo.transform = function foo (text) {
      return text.toUpperCase()
    }

    math.import({ foo })

    assert(hasOwnProperty(math, 'foo'))
    assert.strictEqual(math.foo, foo)
    assert(hasOwnProperty(math.expression.transform, 'foo'))
    assert.strictEqual(math.expression.transform.foo, foo.transform)
  })

  it('should override a function with transform for one without', function () {
    function mean () {
      return 'test'
    }

    math.import({ mean }, { override: true })

    assert(hasOwnProperty(math, 'mean'))
    assert.strictEqual(math.mean, mean)
    assert.strictEqual(math.expression.transform.mean, undefined)
    assert.strictEqual(math.expression.mathWithTransform.mean, mean)
  })

  it('should import a constant with a Complex value', function () {
    const myComplexConst = math.complex(2, 3)

    math.import({
      myComplexConst
    })

    assert.strictEqual(math.myComplexConst, myComplexConst)
  })

  describe('factory', function () {
    it('should import a factory function', function () {
      const math2 = create()

      assert.strictEqual(math2.multiplyTest, undefined)
      assert.strictEqual(math2.cubeTest, undefined)

      math2.import(multiplyTestFactory)
      math2.import(cubeTestFactory)

      assert.strictEqual(math2.multiplyTest(2, 3), 6)
      assert.strictEqual(math2.cubeTest(3), 27)
    })

    it('should import an array with factory functions', function () {
      const math2 = create()

      assert.strictEqual(math2.multiplyTest, undefined)
      assert.strictEqual(math2.cubeTest, undefined)

      math2.import([multiplyTestFactory, cubeTestFactory])

      assert.strictEqual(math2.multiplyTest(2, 3), 6)
      assert.strictEqual(math2.cubeTest(3), 27)
    })

    it('should not allow nested nested paths in a factory', function () {
      const math2 = create()

      assert.strictEqual(math2.tools, undefined)

      assert.throws(() => {
        math2.import([nestedFactory])
      }, /Factory name should not contain a nested path/)
    })

    it('should import an array with factory functions in the correct order, resolving dependencies', function () {
      const math2 = create()

      assert.strictEqual(math2.multiplyTest, undefined)
      assert.strictEqual(math2.cubeTest, undefined)

      // note that this depends on lazy loading
      math2.import([cubeTestFactory, multiplyTestFactory])

      assert.strictEqual(math2.multiplyTest(2, 3), 6)
      assert.strictEqual(math2.cubeTest(3), 27)
    })

    it('should NOT import factory functions with custom name', function () {
      // changed since v6
      const math2 = create()

      assert.strictEqual(math2.multiplyTest, undefined)
      assert.strictEqual(math2.cubeTest, undefined)

      math2.import({
        multiplyTest: multiplyTestFactory
      })
      math2.import({
        cubeTest3: cubeTestFactory
      })

      assert.strictEqual(math2.cubeTest3, undefined)

      assert.strictEqual(math2.multiplyTest(2, 3), 6)
      assert.strictEqual(math2.cubeTest(3), 27)
    })

    it('should throw an error when a dependency is missing with import factory', function () {
      const math2 = create()

      assert.throws(() => {
        math2.import(cubeTestFactory)
        assert.strictEqual(typeof math2.cubeTest, 'function') // force loading
      }, /Cannot create function "cubeTest", some dependencies are missing: "multiplyTest"/)
    })
  })

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should import a factory with name', function () {
    // TODO: unit test importing a factory
  })

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should import a factory with path', function () {
    // TODO: unit test importing a factory
  })

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should import a factory without name', function () {
    // TODO: unit test importing a factory
  })

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should pass the namespace to a factory function', function () {
    // TODO: unit test importing a factory
  })

  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should import an Array', function () {
    // TODO: unit test importing an Array containing stuff
  })

  it('should LaTeX import', function () {
    const expression = math.parse('import(object)')
    assert.strictEqual(expression.toTex(), '\\mathrm{import}\\left( object\\right)')
  })
})
