// test flattenAssociation
import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { isParenthesisNode } from '../../../../src/utils/is.js'

function removeParens (node) {
  return node.transform(function (node) {
    return isParenthesisNode(node)
      ? removeParens(node.content)
      : node
  })
}

describe('flattenAssociation', function () {
  const parens = { parenthesis: 'all' }
  const deeper = removeParens(math.parse('3 / 4 / (5 + 6 + 7)'))

  it('should remove subtrees of associative operators', function () {
    assert.strictEqual(
      math.flattenAssociation(math.parse('x y z')).toString(parens),
      'x y z')
    // make sure deeper doesn't change
    assert.strictEqual(deeper.toString(parens), '(3 / 4) / ((5 + 6) + 7)')
    assert.strictEqual(math.flattenAssociation(deeper).toString(parens),
      '(3 / 4) / (5 + 6 + 7)')
    assert.strictEqual(deeper.toString(parens), '(3 / 4) / ((5 + 6) + 7)')
  })

  it('should flatten according to context', function () {
    assert.strictEqual(
      math.flattenAssociation(math.parse('x y z'), {
        multiply: { associative: false }
      }).toString(parens),
      '(x y) z')
    assert.strictEqual(
      math.flattenAssociation(deeper, {
        divide: { associative: true }, // crazy but just for testing
        add: { associative: false }
      }).toString(parens),
      'divide(3, 4, (5 + 6) + 7)')
  })
})
