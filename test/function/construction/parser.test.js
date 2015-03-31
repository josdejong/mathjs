var assert = require('assert'),
    math = require('../../../index'),
    Parser = math.expression.Parser;

describe('parser', function() {

  it('should create a parser', function() {
    var parser = math.parser();

    assert(parser instanceof Parser);
  });

});

