const assert = require('assert')
const latex = require('../../src/utils/latex')

describe('util.latex', function () {
  it('should convert symbols with underscores', function () {
    assert.strictEqual(latex.toSymbol('alpha_1'), 'alpha\\_1')
  })

  it('should convert special units', function () {
    assert.strictEqual(latex.toSymbol('deg', true), '^\\circ')
  })

  it('should convert normal units', function () {
    assert.strictEqual(latex.toSymbol('cm', true), '\\mathrm{cm}')
  })

  it('should escape strings', function () {
    const string = 'space tab\tunderscore_bla$/'

    assert.strictEqual(latex.toSymbol(string), 'space~tab\\qquad{}underscore\\_bla\\$/')
  })
})
