// test resolve
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

import { simplifyAndCompare } from './simplify.test.js'

describe('resolve', function () {
  it('should substitute scoped constants', function () {
    const sumxy = math.parse('x+y')
    const collapsingScope = { x: math.parse('y'), y: math.parse('z') }
    assert.strictEqual(
      math.resolve(sumxy, { x: 1 }).toString(),
      '1 + y'
    ) // direct
    assert.strictEqual(
      math.resolve(sumxy, collapsingScope).toString(),
      'z + z'
    )
    assert.strictEqual(
      math.resolve(
        math.parse('[x,y,1,w]'), collapsingScope).toString(),
      '[z, z, 1, w]'
    )
    assert.strictEqual(
      math.resolve('[x,y,1,w]', collapsingScope).toString(),
      '[z, z, 1, w]'
    )
    simplifyAndCompare('x+y', 'x+y', {}) // operator
    simplifyAndCompare('x+y', 'y+1', { x: 1 })
    simplifyAndCompare('x+y', 'y+1', { x: math.parse('1') })
    simplifyAndCompare('x+y', '3', { x: 1, y: 2 })
    simplifyAndCompare('x+x+x', '3*x')
    simplifyAndCompare('y', 'x+1', { y: math.parse('1+x') })
    simplifyAndCompare('y', '3', { x: 2, y: math.parse('1+x') })
    simplifyAndCompare('x+y', '3*x', { y: math.parse('x+x') })
    simplifyAndCompare('x+y', '6', { x: 2, y: math.parse('x+x') })
    simplifyAndCompare('x+(y+2-1-1)', '6', { x: 2, y: math.parse('x+x') }) // parentheses
    simplifyAndCompare('log(x+y)', String(Math.log(6)), { x: 2, y: math.parse('x+x') }) // function
    simplifyAndCompare('combinations( ceil(abs(sin(x)) * (y+3)), abs(x) )',
      'combinations(ceil(0.9092974268256817 * (y + 3) ), 2)', { x: -2 })

    simplifyAndCompare('size(text)[1]', '11', { text: 'hello world' })
  })

  it('should substitute scoped constants from Map like scopes', function () {
    assert.strictEqual(
      math.resolve(math.parse('x+y'), new Map([['x', 1]])).toString(), '1 + y'
    ) // direct
    simplifyAndCompare('x+y', 'x+y', new Map()) // operator
    simplifyAndCompare('x+y', 'y+1', new Map([['x', 1]]))
    simplifyAndCompare('x+y', 'y+1', new Map([['x', math.parse('1')]]))
  })

  it('should resolve multiple nodes', function () {
    const scope = { x: 1, y: 2 }

    assert.deepStrictEqual(
      math.resolve([
        math.parse('x+z'),
        math.parse('y+z')
      ], scope),
      [
        math.resolve(math.parse('x+z'), scope),
        math.resolve(math.parse('y+z'), scope)
      ]
    )
  })

  it('should throw an error in case of reference loop', function () {
    const sumxy = math.parse('x+y')
    assert.throws(
      () => math.resolve(sumxy, { x: math.parse('x') }),
      /ReferenceError.*\{x\}/)
    assert.throws(
      () => math.resolve(sumxy, {
        y: math.parse('3z'),
        z: math.parse('1-x'),
        x: math.parse('cos(y)')
      }),
      /ReferenceError.*\{x, y, z\}/)
  })
})
