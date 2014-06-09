// test error messages for deprecated functions
var assert = require('assert'),
    mathjs = require('../index'),
    number = require('../lib/util/number');

describe('deprecated stuff', function() {

  it ('should throw an error when using deprecated setting number.defaultType', function () {
    assert.throws(function () {
      mathjs({
        number: {
          defaultType: 'number'
        }
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated setting number.precision', function () {
    assert.throws(function () {
      mathjs({
        number: {
          precision: 14
        }
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated setting decimals', function () {
    assert.throws(function () {
      mathjs({
        decimals: 100
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated setting matrix.defaultType', function () {
    assert.throws(function () {
      mathjs({
        matrix: {
          defaultType: 'array'
        }
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated setting matrix.default', function () {
    assert.throws(function () {
      mathjs({
        matrix: {
          'default': 'array'
        }
      })
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated Node.eval', function () {
    var math = mathjs();
    assert.throws(function () {
      new math.expression.node.Node().eval();
    }, /is deprecated/);
  });

  it ('should throw an error when using deprecated function assignment', function () {
    var math = mathjs();
    assert.throws(function () {
      new math.parse('function f(x) = x^2');
    }, /Deprecated keyword "function"/);
  });

  it ('should throw an error when using deprecated function unary', function () {
    var math = mathjs();
    assert.throws(function () {
      new math.unary(2);
    }, /deprecated/);
  });

  it ('should throw an error when using deprecated function epow', function () {
    var math = mathjs();
    assert.throws(function () {
      new math.epow(2, 3);
    }, /is renamed/);
  });

  it ('should throw an error when using deprecated function edivide', function () {
    var math = mathjs();
    assert.throws(function () {
      new math.edivide(2, 3);
    }, /is renamed/);
  });

  it ('should throw an error when using deprecated function emultiply', function () {
    var math = mathjs();
    assert.throws(function () {
      new math.emultiply(2, 3);
    }, /is renamed/);
  });

  it ('should throw an error when using deprecated function smallereq', function () {
    var math = mathjs();
    assert.throws(function () {
      new math.smallereq(2, 3);
    }, /is renamed/);
  });

  it ('should throw an error when using deprecated function largereq', function () {
    var math = mathjs();
    assert.throws(function () {
      new math.largereq(2, 3);
    }, /is renamed/);
  });

});
