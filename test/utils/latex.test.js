var assert = require('assert'),
    latex = require('../../lib/utils/latex');

describe('util.latex', function() {
  it('should convert symbols with indices', function () {
    assert.equal(latex.toSymbol('alpha_1'), '\\alpha_{1}');
  });

  it('should convert units', function () {
    assert.equal(latex.toSymbol('deg', true), '^\\circ');
  });
});
