// test eval
var assert = require('assert'),
    approx = require('../../../tools/approx'),
    error = require('../../../lib/error/index'),
    math = require('../../../index')(),
    Complex = math.type.Complex,
    Matrix = math.type.Matrix,
    Unit = math.type.Unit;

describe('eval', function() {

  it('should evaluate expressions', function() {
    approx.equal(math.eval('(2+3)/4'), 1.25);
    assert.deepEqual(math.eval('sqrt(-4)'), new Complex(0, 2));
  });

  it('should eval a list of expressions', function() {
    assert.deepEqual(math.eval(['1+2', '3+4', '5+6']), [3, 7, 11]);
    assert.deepEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12]);
    assert.deepEqual(math.eval(new Matrix(['a=3', 'b=4', 'a*b'])), new Matrix([3, 4, 12]));
    assert.deepEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12]);
  });

  it('should eval a series of expressions', function() {
    assert.deepEqual(math.eval('a=3\nb=4\na*b'), [3, 4, 12]);
    assert.deepEqual(math.eval('f(x) = a * x; a=2; f(4)'), [8]);
    assert.deepEqual(math.eval('b = 43; b * 4'), [172]);
  });

  it('should throw an error if wrong number of arguments', function() {
    assert.throws(function () {math.eval()},  error.ArgumentsError);
    assert.throws(function () {math.eval(1,2,3)}, error.ArgumentsError);
  });

  it('should throw an error with a number', function() {
    assert.throws(function () {math.eval(23)}, TypeError);
  });

  it('should throw an error with a unit', function() {
    assert.throws(function () {math.eval(new Unit(5, 'cm'))}, TypeError);
  });

  it('should throw an error with a complex number', function() {
    assert.throws(function () {math.eval(new Complex(2,3))}, TypeError);
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
    assert.deepEqual(math.format(math.eval('f(x) = x^a', scope)), 'f(x)');

    assert.deepEqual(Object.keys(scope).length, 5);
    assert.deepEqual(scope.a, 3);
    assert.deepEqual(scope.b, 4);
    assert.deepEqual(scope.c, 5);
    assert.deepEqual(typeof scope.f, 'function');
    assert.deepEqual(typeof scope.ans, 'function');
    assert.strictEqual(scope.ans, scope.f);

    assert.equal(scope.f(3), 27);
    scope.a = 2;
    assert.equal(scope.f(3), 9);
    scope.hello = function (name) {
      return 'hello, ' + name + '!';
    };
    assert.deepEqual(math.eval('hello("jos")', scope), 'hello, jos!');
  });

});
