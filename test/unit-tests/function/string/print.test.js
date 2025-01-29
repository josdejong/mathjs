// test print
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('print', function () {
  it('should interpolate values in a template (object template)', function () {
    assert.strictEqual(math.print('hello, $name!', { name: 'user' }), 'hello, user!')
  })

  it('should print a bigint', function () {
    assert.strictEqual(math.print('The count is: $count', { count: 3n }), 'The count is: 3')
  })

  it('should interpolate values from a nested object in a template (object template)', function () {
    assert.strictEqual(math.print('hello, $name.first $name.last!', {
      name: {
        first: 'first',
        last: 'last'
      }
    }), 'hello, first last!')
  })

  it('should interpolate values from a nested object in a template (mixed object/array template)', function () {
    assert.strictEqual(math.print('hello$separator.0 $name.first $name.last!', {
      name: {
        first: 'first',
        last: 'last'
      },
      separator: [',']
    }), 'hello, first last!')
  })

  it('should interpolate values from a nested object in a template (mixed object/matrix template)', function () {
    assert.strictEqual(math.print('hello$separator.0 $name.first $name.last!', {
      name: {
        first: 'first',
        last: 'last'
      },
      separator: math.matrix([','])
    }), 'hello, first last!')
  })

  it('should round interpolate values with provided precision (object template)', function () {
    assert.strictEqual(math.print('pi=$pi', { pi: math.pi }, 3), 'pi=3.14')
  })

  it('should leave unresolved variables untouched (object template)', function () {
    assert.strictEqual(math.print('$a,$b', { b: 2 }), '$a,2')
    assert.strictEqual(math.print('$a.value,$b.value', { a: {}, b: { value: 2 } }), '$a.value,2')
  })

  it('should leave unresolved variables untouched (mixed object/array template)', function () {
    assert.strictEqual(math.print('$a.0,$b.value', { a: [], b: { value: 2 } }), '$a.0,2')
  })

  it('should leave trailing point intact (object template)', function () {
    assert.strictEqual(math.print('Hello $name.', { name: 'user' }), 'Hello user.')
    assert.strictEqual(math.print('Hello $name...', { name: 'user' }), 'Hello user...')
    assert.strictEqual(math.print('Hello $user.name.', { user: { name: 'user' } }), 'Hello user.')
  })

  it('should interpolate values in a template (array template)', function () {
    assert.strictEqual(math.print('hello, $0!', ['user']), 'hello, user!')
  })

  it('should interpolate values from a nested object in a template (array template)', function () {
    assert.strictEqual(math.print('hello, $0.0 $0.1!', [
      ['first', 'last']
    ]), 'hello, first last!')
  })

  it('should interpolate values from a nested object in a template (mixed array/object template)', function () {
    assert.strictEqual(math.print('hello$1.separator $0.0 $0.1!', [
      ['first', 'last'],
      {
        separator: ','
      }
    ]), 'hello, first last!')
  })

  it('should round interpolate values with provided precision (array template)', function () {
    assert.strictEqual(math.print('pi=$0', [math.pi], 3), 'pi=3.14')
  })

  it('should leave unresolved variables untouched (array template)', function () {
    assert.strictEqual(math.print('$1,$0', [2]), '$1,2')
    assert.strictEqual(math.print('$0.0,$1.0', [[], [2]]), '$0.0,2')
  })

  it('should leave unresolved variables untouched (mixed array/object template)', function () {
    assert.strictEqual(math.print('$0.name,$1.0', [{}, [2]]), '$0.name,2')
  })

  it('should leave trailing point intact (array template)', function () {
    assert.strictEqual(math.print('Hello $0.', ['user']), 'Hello user.')
    assert.strictEqual(math.print('Hello $0...', ['user']), 'Hello user...')
    assert.strictEqual(math.print('Hello $0.0.', [['user']]), 'Hello user.')
    assert.strictEqual(math.print('Values: $0, $1', [[1, 2], [3, 4]]), 'Values: [1, 2], [3, 4]')
  })

  it('should leave trailing point intact (matrix)', function () {
    assert.strictEqual(math.print('Hello $0.', math.matrix(['user'])), 'Hello user.')
    assert.strictEqual(math.print('Values: $0, $1', math.matrix([[1, 2], [3, 4]])), 'Values: [1, 2], [3, 4]')
  })

  it('should throw an error on wrong number of arguments', function () {
    assert.throws(function () { math.print() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.print('') }, /TypeError: Too few arguments/)
    assert.throws(function () { math.print('', {}, 6, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error on wrong type of arguments', function () {
    assert.throws(function () { math.print('', 2) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX print', function () {
    const expression = math.parse('print(template,values)')
    assert.strictEqual(expression.toTex(), '\\mathrm{print}\\left( template, values\\right)')
  })

  it('should work one indexed in the parser for all previous combinations', function () {
    assert.deepStrictEqual(math.evaluate("print('I like $food', {food:'pizza'})"), 'I like pizza')
    assert.deepStrictEqual(math.evaluate("print('I like $1', ['pizza'])"), 'I like pizza')
    assert.deepStrictEqual(math.evaluate("print('I like $food.1', {food:['pizza']})"), 'I like pizza')
    assert.deepStrictEqual(math.evaluate("print('I like $1.food', [{food:'pizza'}])"), 'I like pizza')
    assert.deepStrictEqual(math.evaluate("print('I like $food.1 and $food.2', {food:['pizza','tacos']})"), 'I like pizza and tacos')
    assert.deepStrictEqual(math.evaluate("print('Values: $1, $2, $3', [6, 9, 4])"), 'Values: 6, 9, 4')
  })
})
