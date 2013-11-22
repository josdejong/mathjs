// test printing

var assert = require('assert'),
    approx = require('../../tools/approx'),
    math = require('../../index')();

describe('pretty printer', function() {

  it ('should be a method', function () {
    assert.ok(typeof(math.prettyprint) === "function");
  });


  it ('should return a string', function () {
    var pretty = math.prettyprint('sqrt(x^a)');
    assert.ok(typeof(pretty) === "string");
  });

  it ('should prettyprint expressions', function () {

    var pretty = math.prettyprint('a + b * (c + 1)');
    assert.equal(pretty, "a + b * (c + 1)");

    pretty = math.prettyprint('x^x^(x+1)');
    assert.equal(pretty, "x^x^(x + 1)");

    pretty = math.prettyprint('sin(x-1) / x * x^(3-x)');
    assert.equal(pretty, "sin(x - 1) / x * x^(3 - x)");

    pretty = math.prettyprint('(1-y) * b * 3/(1+y)');
    assert.equal(pretty, '((1 - y) * b * 3) / (1 + y)');

  });

  it ('should substitute scope variables', function () {
    var scope = {
      a: 1
    };
    var pretty = math.prettyprint('a', scope);
    assert.equal(pretty, "1");

    pretty = math.prettyprint('a + b*x', scope);
    assert.equal(pretty, "1 + b * x");

  });

  it ("should remove unnecessary multiplication operators", function () {

    var scope = {
      a: 3
    };
    var pretty = math.prettyprint('a * x', scope);
    assert.equal(pretty, "3x");

    pretty = math.prettyprint('x * a', scope);
    assert.equal(pretty, "3x");

    pretty = math.prettyprint('a * a', scope);
    assert.equal(pretty, "3 * 3");

    pretty = math.prettyprint('x * x', scope);
    assert.equal(pretty, "x * x");

  })


  it ("should cleanup unnecessary 1's and 0's", function () {
    var scope = {
      a: 1
    };
    var pretty = math.prettyprint('a * x', scope);
    assert.equal(pretty, "x");

    scope = {
      a: 1
    , b: 0
    };
    pretty = math.prettyprint('a * x + b * x', scope);
    assert.equal(pretty, "x");

    scope = {
      a: 0
    };
    pretty = math.prettyprint('a * x', scope);
    assert.equal(pretty, "0");

    pretty = math.prettyprint('sin(x) * a', scope);
    assert.equal(pretty, "0");

  });


});
