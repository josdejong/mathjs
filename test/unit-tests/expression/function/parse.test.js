// test parse
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Node = math.Node
const ArrayNode = math.ArrayNode
const AccessorNode = math.AccessorNode
const ConstantNode = math.ConstantNode
const ObjectNode = math.ObjectNode
const FunctionNode = math.FunctionNode
const OperatorNode = math.OperatorNode
const parse = math.parse

describe('parse', function () {
  it('should parse an expression', function () {
    const node = parse('(5+3)/4')
    assert.ok(node instanceof Node)
    assert.strictEqual(node.compile().evaluate(), 2)
  })

  it('should parse multiple expressions', function () {
    const nodes = parse(['2+3', '4+5'])
    assert.ok(Array.isArray(nodes))
    assert.strictEqual(nodes.length, 2)

    assert.ok(nodes[0] instanceof Node)
    assert.ok(nodes[1] instanceof Node)
    assert.strictEqual(nodes[0].compile().evaluate(), 5)
    assert.strictEqual(nodes[1].compile().evaluate(), 9)
  })

  it('should parse expressions with internal newlines', function () {
    assert.ok(parse('[1,\n2]') instanceof ArrayNode)
    assert.ok(parse('{x:1,\n y:2}') instanceof ObjectNode)
    assert.ok(parse('f(x,\n y)') instanceof FunctionNode)
    assert.ok(parse('3+\n7') instanceof OperatorNode)
  })

  it('should parse expressions with internal newlines and comments', function () {
    assert.ok(parse('[1, # One\n2]') instanceof ArrayNode)
    assert.ok(parse('{x:1, # x-coordinate\n y:2}') instanceof ObjectNode)
    assert.ok(parse('f(x, # first argument\n y)') instanceof FunctionNode)
    assert.ok(parse('3+#ignored terms\n7') instanceof OperatorNode)
  })

  it('should LaTeX parse', function () {
    const expression = parse('parse(expr,options)')
    assert.strictEqual(expression.toTex(), '\\mathrm{parse}\\left( expr, options\\right)')
  })

  it('should allow custom token types', function () {
    const newTokens = {
      COLOR: state => {
        while (parse.isWhitespace(state.character(), state.nestingLevel) ||
          state.character() === '#'
        ) {
          state.skipCharactersThat(c => parse.isWhitespace(c, state.nestingLevel))
          switch (state.addCharactersThat(c => c === '#')) {
            case 0: continue
            case 1: {
              const hexes = state.addCharactersThat(parse.isHexDigit)
              if (hexes > 2 && (hexes % 3 === 0 || hexes % 4 === 0)) {
                return true
              }
            }
            /* FALL THROUGH */
            default: // eslint-disable-line no-fallthrough
              state.comment = state.token
              state.token = ''
              state.readComment('', '\n')
          }
        }
        return false
      }
    }
    for (const tokenType in parse.tokens) {
      if (tokenType !== 'SKIP_IGNORED') { // already handled above
        newTokens[tokenType] = parse.tokens[tokenType]
      }
    }
    parse.tokens = newTokens
    const colorHandler = {
      nodes: {
        COLOR: state => {
          const hex = state.token.slice(1)
          const pieces = hex.length % 3 ? 4 : 3
          const piece = hex.length / pieces
          const coords = []
          for (let start = 0; start < hex.length; start += piece) {
            coords.push(parseInt(hex.substr(start, piece), 16))
          }
          return new ArrayNode(coords.map(c => new ConstantNode(c)))
        }
      }
    }
    const expr = parse('#FF8000', colorHandler)
    assert(expr instanceof ArrayNode)
    assert.deepStrictEqual(expr.evaluate(), math.matrix([255, 128, 0]))
    const access = parse('#00BB3311[4]', colorHandler)
    assert(access instanceof AccessorNode)
    assert.strictEqual(access.evaluate(), 17)
    const still = parse('#Can it still do comments?\n17', colorHandler).evaluate()
    assert.deepStrictEqual(still, new math.ResultSet([17]))
  })
})
