var assert = require('assert'),
    math = require('../../../index'),
    Selector = math.chaining.Selector;

describe('select', function() {

  it ('should construct a selector', function () {
    assert.ok(math.select(45) instanceof Selector);
    assert.ok(math.select(math.complex(2,3)) instanceof Selector);
    assert.ok(math.select() instanceof Selector);
  });

});