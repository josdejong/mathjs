var assert = require('assert'),
    latex = require('../../lib/util/latex');

describe('util.latex', function() {
  it('should convert symbols with indices', function () {
    assert.equal(latex.toSymbol('alpha_1'), '\\alpha_{\\mathrm{1}}');
  });

  it('should convert units', function () {
    assert.equal(latex.toSymbol('deg'), '^\\circ');
  });
});
