const assert = require('assert')
const math = require('../../../src/main')
const Parser = math.expression.Parser

describe('parser', function () {
  it('should create a parser', function () {
    const parser = math.parser()

    assert(parser instanceof Parser)
  })

  it('should LaTeX parser', function () { // This doesn't really make sense in a way
    const expression = math.parse('parser()')
    assert.equal(expression.toTex(), '\\mathrm{parser}\\left(\\right)')
  })
})
