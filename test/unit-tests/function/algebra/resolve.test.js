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

  it('should operate directly on strings', function () {
    const collapsingScope = { x: math.parse('y'), y: math.parse('z') }
    assert.deepStrictEqual(math.resolve('x+y', { x: 1 }), math.parse('1 + y'))
    assert.deepStrictEqual(
      math.resolve('x + y', collapsingScope),
      math.parse('z + z'))
    assert.deepStrictEqual(
      math.resolve('[x, y, 1, w]', collapsingScope),
      math.parse('[z, z, 1, w]'))
  })

  it('should substitute scoped constants from Map like scopes', function () {
    assert.strictEqual(
      math.resolve(math.parse('x+y'), new Map([['x', 1]])).toString(), '1 + y'
    ) // direct
    assert.deepStrictEqual(
      math.resolve('x+y', new Map([['x', 1]])), math.parse('1 + y'))
    simplifyAndCompare('x+y', 'x+y', new Map()) // operator
    simplifyAndCompare('x+y', 'y+1', new Map([['x', 1]]))
    simplifyAndCompare('x+y', 'y+1', new Map([['x', math.parse('1')]]))
  })

  it('should resolve multiple nodes', function () {
    const parse = math.parse
    const scope = { x: 1, y: 2 }
    const expressions = [parse('x+z'), 'y+z', 'y-x']
    let results = [parse('x+z'), parse('y+z'), parse('y-x')]
    assert.deepStrictEqual(math.resolve(expressions), results)
    results = [parse('1+z'), parse('2+z'), parse('2-1')]
    assert.deepStrictEqual(math.resolve(expressions, scope), results)
    assert.deepStrictEqual(
      math.resolve(math.matrix(expressions), scope),
      math.matrix(results)
    )
    const nested = ['z/y', ['x+x', 'gcd(x,y)'], '3+x']
    results = [parse('z/2'), [parse('1+1'), parse('gcd(1,2)')], parse('3+1')]
    assert.deepStrictEqual(math.resolve(nested, scope), results)
  })

  it('should throw a readable error if one item is wrong type', function () {
    assert.throws(
      () => math.resolve([math.parse('x'), 'y', 7]),
      /TypeError: Unexpected.*actual: number, index: 0/
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

  it('should allow resolving custom nodes in custom ways', function () {
    const mymath = math.create()
    const Node = mymath.Node
    class IntervalNode extends Node {
      // a node that represents any value in a closed interval
      constructor (left, right) {
        super()
        this.left = left
        this.right = right
      }

      static name = 'IntervalNode'
      get type () { return 'IntervalNode' }
      get isIntervalNode () { return true }
      clone () {
        return new IntervalNode(this.left, this.right)
      }

      _toString (options) {
        return `[|${this.left}, ${this.right}|]`
      }

      midpoint () {
        return (this.left + this.right) / 2
      }
    }

    mymath.typed.addTypes(
      [{
        name: 'IntervalNode',
        test: entity => entity && entity.isIntervalNode
      }],
      'RangeNode') // Insert just before RangeNode in type order

    // IntervalNodes resolve to their midpoint:
    const intervalResolver = node => new mymath.ConstantNode(node.midpoint())
    const resolveInterval = mymath.typed({
      IntervalNode: intervalResolver,
      'IntervalNode, Object|Map|null|undefined': intervalResolver,
      'IntervalNode, Map|null|undefined, Set': intervalResolver
    })
    // Merge with standard resolve:
    mymath.import({ resolve: resolveInterval })

    // And finally test:
    const innerNode = new IntervalNode(1, 3)
    const outerNode = new mymath.OperatorNode(
      '+', 'add', [innerNode, new mymath.ConstantNode(4)])
    assert.strictEqual(mymath.resolve(outerNode).toString(), '2 + 4')
  })
})
