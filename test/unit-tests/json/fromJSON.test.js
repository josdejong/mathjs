import assert from 'assert'
import math from '../../../src/defaultInstance.js'
const fromJSON = math.fromJSON

describe('toObject', function () {
  it('output JSON for a node', function () {
    const node = new math.OperatorNode('+', 'add', [
      new math.SymbolNode('x'),
      new math.ConstantNode(2)
    ])

    assert.deepStrictEqual(
      fromJSON({
        args: [
          {
            name: 'x'
          },
          {
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
