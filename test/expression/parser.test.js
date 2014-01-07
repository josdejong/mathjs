// test parser

var assert = require('assert'),
    approx = require('../../tools/approx'),
    math = require('../../index')();

describe('parser', function() {

  it ('should create a parser', function () {
    var parser = math.parser();
    assert.ok(parser instanceof math.expression.Parser);
  });

  it ('should parse an expression', function () {
    var parser = math.parser();

    var node = parser.parse('2 + 3');
    assert.ok(node instanceof math.expression.node.Node);
    assert.equal(node.compile(math).eval(), 5);
  });

  it ('should evaluate an expression', function () {
    var parser = math.parser();

    var result = parser.eval('2 + 3');
    assert.equal(result, 5);
  });

  it ('should get variables from the parsers namespace ', function () {
    var parser = math.parser();

    parser.eval('a = 3');
    parser.eval('b = a + 2');
    assert.equal(parser.eval('a'), 3);
    assert.equal(parser.eval('b'), 5);
    assert.equal(parser.get('a'), 3);
    assert.equal(parser.get('b'), 5);
  });

  it ('should return null when getting a non existing variable', function () {
    var parser = math.parser();

    assert.equal(parser.get('non_existing_variable'), null);
  });

  it ('should set variables in the parsers namespace ', function () {
    var parser = math.parser();

    assert.equal(parser.set('a', 3), 3);
    assert.equal(parser.eval('a'), 3);
    assert.equal(parser.eval('a + 2'), 5);

    // adjust variable
    assert.equal(parser.eval('a = a + 2'), 5);
    assert.equal(parser.eval('a'), 5);
    assert.equal(parser.get('a'), 5);

    assert.equal(parser.set('a', parser.get('a') - 4), 1);
    assert.equal(parser.eval('a'), 1);
  });

  it ('should remove a variable from the parsers namespace ', function () {
    var parser = math.parser();

    assert.equal(parser.set('qq', 3), 3);
    assert.equal(parser.eval('qq'), 3);
    assert.equal(parser.get('qq'), 3);

    parser.remove('qq');
    assert.equal(parser.get('qq'), null);
    assert.throws(function () {parser.eval('qq')});

    assert.equal(parser.eval('ww = 5'), 5);
    assert.equal(parser.get('ww'), 5);
    parser.remove('ww');
    assert.equal(parser.get('ww'), null);
    assert.throws(function () {parser.eval('ww')});
  });

  it ('should clear the parsers namespace ', function () {
    var parser = math.parser();

    assert.equal(parser.eval('xx = yy = zz = 5'), 5);

    assert.equal(parser.set('pi', 'oops'), 'oops');

    assert.equal(parser.get('xx'), 5);
    assert.equal(parser.get('yy'), 5);
    assert.equal(parser.get('zz'), 5);
    assert.equal(parser.get('pi'), 'oops');

    assert.equal(parser.eval('xx'), 5);
    assert.equal(parser.eval('yy'), 5);
    assert.equal(parser.eval('zz'), 5);
    assert.equal(parser.eval('pi'), 'oops');

    parser.clear();

    assert.equal(parser.get('xx'), null);
    assert.equal(parser.get('yy'), null);
    assert.equal(parser.get('zz'), null);
    approx.equal(parser.get('pi'), null);

    assert.throws(function () {parser.eval('xx')});
    assert.throws(function () {parser.eval('yy')});
    assert.throws(function () {parser.eval('zz')});
    assert.equal(parser.eval('pi'), Math.PI);

  });

});
