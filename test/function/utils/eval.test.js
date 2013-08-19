// test eval
var assert = require('assert');
var math = require('../../../index.js');

describe('eval', function() {

  it('should evaluate constants', function() {
    assert.equal(math.eval('pi'), Math.PI);
  });

  it('should arithmetic operations with numbers', function() {
    assert.equal(math.eval('(2+3)/4'), 1.25);
  });

  it('should eval functions', function() {
    assert.equal(math.eval('sqrt(-4)').toString(), '2i');
  });

  it('should eval a list of expressions', function() {
    assert.deepEqual(math.eval(['1+2', '3+4', '5+6']), [3, 7, 11]);
    assert.deepEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12]);
    assert.deepEqual(math.eval(math.matrix(['a=3', 'b=4', 'a*b'])), math.matrix([3, 4, 12]));
    assert.deepEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12]);
  });

  it('should eval a series of expressions', function() {
    assert.deepEqual(math.eval('a=3\nb=4\na*b'), [3, 4, 12]);
    assert.deepEqual(math.eval('function f(x) = a * x; a=2; f(4)'), [8]);
    assert.deepEqual(math.eval('b = 43; b * 4'), [172]);
  });

  it('should throw an error if wrong number of arguments', function() {
    assert.throws(function () {math.eval()}, SyntaxError);
    assert.throws(function () {math.eval(1,2,3)}, SyntaxError);
  });

  it('should throw an error with a number', function() {
    assert.throws(function () {math.eval(23)}, TypeError);
  });

  it('should throw an error with a unit', function() {
    assert.throws(function () {math.eval(math.unit('5cm'))}, TypeError);
  });

  it('should throw an error with a complex number', function() {
    assert.throws(function () {math.eval(math.complex(2,3))}, TypeError);
  });

  it('should throw an error with a boolean', function() {
    assert.throws(function () {math.eval(true)}, TypeError);
  });

  it('should handle the given scope', function() {
    var scope = {
      a: 3,
      b: 4
    };
    assert.deepEqual(math.eval('a*b', scope), 12);
    assert.deepEqual(math.eval('c=5', scope), 5);
    assert.deepEqual(math.eval('function f(x) = x^a', scope), 'f(x)');
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
    assert.deepEqual(math.eval('hello("jos")', scope), 'hello, jos!');
  });

});
