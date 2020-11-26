import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const Parser = math.Parser

describe('parser', function () {
  it('should create a parser', function () {
    const parser = math.parser()

    assert(parser instanceof Parser)
  })

  it('should LaTeX parser', function () { // This doesn't really make sense in a way
    const expression = math.parse('parser()')
    assert.strictEqual(expression.toTex(), '\\mathrm{parser}\\left(\\right)')
  })
})
