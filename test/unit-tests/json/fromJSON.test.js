import assert from 'assert'
import math from '../../../src/defaultInstance.js'
const fromJSON = math.fromJSON

describe('fromJSON', function () {
  it('output JSON for a node', function () {
    const node = new math.OperatorNode('+', 'add', [
      new math.SymbolNode('x'),
      new math.ConstantNode(2)
    ])

    assert.deepStrictEqual(
      fromJSON({
        args: [
          {
            mathjs: 'SymbolNode',
            name: 'x'
          },
          {
            mathjs: 'ConstantNode',
            value: 2
          }
        ],
        fn: 'add',
        implicit: false,
        isPercentage: false,
        mathjs: 'OperatorNode',
        op: '+'
      }),
      node
    )
  })
})
