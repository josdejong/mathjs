// test parse
var assert = require('assert');
var math = require('../../../index.js');

describe('parse', function() {

  it('should parse constants', function() {
    assert.ok(math.parse('pi') instanceof math.expr.node.Node);
    assert.equal(math.parse('pi').eval(), Math.PI);
  });

  it('should parse arithmetic operations', function() {
    assert.equal(math.parse('(2+3)/4').eval(), 1.25);
    assert.equal(math.parse('0 + 2').toString(), 'ans = 0 + 2');
  });

  it('should parse functions', function() {
    assert.equal(math.parse('sqrt(-4)').eval().toString(), '2i');
  });

  it('should parse a series of expressions', function() {
    assert.deepEqual(math.parse(['a=3', 'b=4', 'a*b']).map(function (node) {
      return node.eval();
    }), [3, 4, 12]);

    assert.deepEqual(math.parse(math.matrix(['a=3', 'b=4', 'a*b'])).map(function (node) {
      return node.eval();
    }), math.matrix([3, 4, 12]));
  });

  it('should parse multiple expressions', function() {
    assert.deepEqual(math.parse('a=3\nb=4\na*b').eval(), [3, 4, 12]);
    assert.deepEqual(math.parse('b = 43; b * 4').eval(), [172]);
  });

  it('should parse a custom function', function() {
    assert.deepEqual(math.parse('function f(x) = a * x; a=2; f(4)').eval(), [8]);
  });

  it('should throw an error if called with wrong number of arguments', function() {
    assert.throws(function () {math.parse()}, SyntaxError);
    assert.throws(function () {math.parse(1,2,3)}, SyntaxError);
  });

  it('should throw an error if called with a number', function() {
    assert.throws(function () {math.parse(23)}, TypeError);
  });

  it('should throw an error if called with a unit', function() {
    assert.throws(function () {math.parse(math.unit('5cm'))}, TypeError);
  });

  it('should throw an error if called with a complex number', function() {
    assert.throws(function () {math.parse(math.complex(2,3))}, TypeError);
  });

  it('should throw an error if called with a boolean', function() {
    assert.throws(function () {math.parse(true)}, TypeError);
  });

  it('should handle the given scope', function() {
    var scope = {
      a: 3,
      b: 4
    };
    assert.deepEqual(math.parse('a*b', scope).eval(), 12);
    assert.deepEqual(math.parse('c=5', scope).eval(), 5);
    assert.deepEqual(math.parse('function f(x) = x^a', scope).eval(), 'f(x)');
    assert.deepEqual(scope, {
      a: 3,
      b: 4,
      c: 5,
      f: 'f(x)',
      ans: 'f(x)'
    });
    assert.equal(scope.f(3), 27);
    scope.a = 2;
    assert.equal(scope.f(3), 9);
    scope.hello = function (name) {
      return 'hello, ' + name + '!';
    };
    assert.deepEqual(math.parse('hello("jos")', scope).eval(), 'hello, jos!');
  });

  it('should parse zero', function() {
    assert.equal(math.parse('0').toString(), 'ans = 0');
  });

  it('should parse a string', function() {
    assert.equal(math.parse('"hello"').toString(), 'ans = "hello"');
  });

  it('should parse a matrix', function() {
    assert.equal(math.parse('[1, 2 + 3i, 4]').toString(), 'ans = [[1, 2 + 3i, 4]]');
  });

  it('shouldn\'t break with multiple unary minuses', function() {
    assert.equal(math.eval('5-3'), 2);
    assert.equal(math.eval('5--3'), 8);
    assert.equal(math.eval('5---3'), 2);
    assert.equal(math.eval('5+---3'), 2);
    assert.equal(math.eval('5----3'), 8);
    assert.equal(math.eval('5+--(2+1)'), 8);
  });

});