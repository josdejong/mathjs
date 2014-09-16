var assert = require('assert'),
    error = require('../../../lib/error/index'),
    Parser = require('../../../lib/expression/Parser'),
    math = require('../../../index');

describe('parser', function() {

  it('should create a parser', function() {
    var parser = math.parser();

    assert(parser instanceof Parser);
  });

});

