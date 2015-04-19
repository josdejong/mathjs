var assert = require('assert'),
    math = require('../../../index'),
    Chain = math.chaining.Chain;

describe('chain', function() {

  it ('should construct a chain', function () {
    assert.ok(math.chain(45) instanceof Chain);
    assert.ok(math.chain(math.complex(2, 3)) instanceof Chain);
    assert.ok(math.chain() instanceof Chain);
  });

  it ('deprecated select function should still be functional', function () {
    assert.ok(math.select(45) instanceof Chain);
    assert.ok(math.select(math.complex(2,3)) instanceof Chain);
    assert.ok(math.select() instanceof Chain);
    assert.strictEqual(math.chaining.Selector, math.chaining.Chain);
  });

  it('should LaTeX chain', function () {
    var expression = math.parse('chain(1)');
    assert.equal(expression.toTex(), '\\mathrm{chain}\\left(1\\right)');
  });

});
