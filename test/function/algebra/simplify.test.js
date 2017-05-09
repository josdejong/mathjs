// test simplify
var assert = require('assert');
var math = require('../../../index');

describe('simplify', function() {

  function simplifyAndCompare(left, right) {
    assert.equal(math.simplify(left).toString(), math.parse(right).toString());
  }

  function simplifyAndCompareEval (left, right, scope) {
    scope = scope || {};
    assert.equal(math.simplify(left).eval(scope), math.parse(right).eval(scope));
  }

  it('should not change the value of the function', function() {
    simplifyAndCompareEval('3+2/4+2*8', '39/2');
    simplifyAndCompareEval('x+1+x', '2x+1', {x:7});
    simplifyAndCompareEval('x+1+2x', '3x+1', {x:7});
    simplifyAndCompareEval('x^2+x-3+x^2', '2x^2+x-3', {x:7});
  });

  it('should simplify rational expressions with no symbols to fraction', function() {
    simplifyAndCompare('3*4', '12');
    simplifyAndCompare('3+2/4', '7/2');
  });

  it('should preserve the value of BigNumbers', function() {
    var bigmath = math.create({number: 'BigNumber', precision: 64});
    assert.deepEqual(bigmath.simplify('111111111111111111 + 111111111111111111').eval(), bigmath.eval('222222222222222222'));
    assert.deepEqual(bigmath.simplify('1 + 111111111111111111').eval(), bigmath.eval('111111111111111112'));
    assert.deepEqual(bigmath.simplify('1/2 + 11111111111111111111').eval(), bigmath.eval('11111111111111111111.5'));
    assert.deepEqual(bigmath.simplify('1/3 + 11111111111111111111').eval(), bigmath.eval('11111111111111111111.33333333333333333333333333333333333333333333'));
    assert.deepEqual(bigmath.simplify('3 + 1 / 11111111111111111111').eval(), bigmath.eval('3 + 1 / 11111111111111111111'));
  });

  it('should not change the value of numbers when converting to fractions (1)', function() {
    simplifyAndCompareEval('1e-10', '1e-10');
  });

  it('should not change the value of numbers when converting to fractions (2)', function() {
    simplifyAndCompareEval('0.2 * 1e-14', '2e-15');
  });

  it.skip('should not change the value of numbers when converting to fractions (3)', function() {
    // TODO this requires that all operators and functions have the correct logic in their 'Fraction' typed-functions.
    //      Ideally they should convert parameters to Fractions if they can all be expressed exactly,
    //      otherwise convert all parameters to the 'number' type.
    simplifyAndCompareEval('1 - 1e-10', '1 - 1e-10');
    simplifyAndCompareEval('1 + 1e-10', '1 + 1e-10');
    simplifyAndCompareEval('1e-10 / 2', '1e-10 / 2');
    simplifyAndCompareEval('(1e-5)^2', '(1e-5)^2');
    simplifyAndCompareEval('min(1, -1e-10)', '-1e-10');
    simplifyAndCompareEval('max(1e-10, -1)', '1e-10');
  });

  it('should simplify non-rational expressions with no symbols to number', function() {
    simplifyAndCompare('3+sin(4)', '2.2431975046920716');
  });

  it('should collect like terms', function() {
    simplifyAndCompare('x+x', '2*x');
    simplifyAndCompare('2x+x', '3*x');
    simplifyAndCompare('2(x+1)+(x+1)', '3*(x + 1)');
    simplifyAndCompare('y*x^2+2*x^2', '(y+2)*x^2');
  });

  it('should collect separated like terms', function() {
    simplifyAndCompare('x+1+x', '2*x+1');
    simplifyAndCompare('x^2+x+3+x^2', '2*x^2+x+3');
    simplifyAndCompare('x+1+2x', '3*x+1');
    simplifyAndCompare('x-1+x', '2*x-1');
    simplifyAndCompare('x-1-2x+2', '1-x');
  });

  it('should collect separated like factors', function() {
    simplifyAndCompare('x/2*x', 'x^2/2');
    simplifyAndCompare('x*2*x', '2*x^2');
    simplifyAndCompare('x*y*-x/(x^2)', '-y');
  });

  it('should handle non-existing functions like a pro', function() {
    simplifyAndCompare('foo(x)', 'foo(x)');
  });

  it('should handle valid built-in constant symbols in rules', function() {
    assert.equal(math.simplify('true', ['true -> 1']).toString(), '1');
    assert.equal(math.simplify('false', ['false -> 0']).toString(), '0');
    assert.equal(math.simplify('log(e)', ['log(e) -> 1']).toString(), '1');
    assert.equal(math.simplify('sin(pi * x)', ['sin(pi * n) -> 0']).toString(), '0');
    assert.equal(math.simplify('i', ['i -> 1']).toString(), '1');
    assert.equal(math.simplify('Infinity', ['Infinity -> 1']).toString(), '1');
    assert.equal(math.simplify('LN2', ['LN2 -> 1']).toString(), '1');
    assert.equal(math.simplify('LN10', ['LN10 -> 1']).toString(), '1');
    assert.equal(math.simplify('LOG2E', ['LOG2E -> 1']).toString(), '1');
    assert.equal(math.simplify('LOG10E', ['LOG10E -> 1']).toString(), '1');
    assert.equal(math.simplify('NaN', ['NaN -> 1']).toString(), '1');
    assert.equal(math.simplify('phi', ['phi -> 1']).toString(), '1');
    assert.equal(math.simplify('SQRT1_2', ['SQRT1_2 -> 1']).toString(), '1');
    assert.equal(math.simplify('SQRT2', ['SQRT2 -> 1']).toString(), '1');
    assert.equal(math.simplify('tau', ['tau -> 1']).toString(), '1');
  });

  it('should throw an error for invalid built-in constant symbols in rules', function() {
    assert.throws(function(){ math.simplify('null', ['null -> 1']).toString(); });
    assert.throws(function(){ math.simplify('uninitialized', ['uninitialized -> 1']).toString(); });
    assert.throws(function(){ math.simplify('version', ['version -> 1']).toString(); });
  });

  it('should remove addition of 0', function() {
    simplifyAndCompare('x+0', 'x');
    simplifyAndCompare('x-0', 'x');
  });

  describe('expression parser' ,function () {

    it('should evaluate simplify containing string value', function() {
      var res = math.eval('simplify("2x + 3x")');
      assert.ok(res && res.isNode)
      assert.equal(res.toString(), '5 * x');
    });

    it('should evaluate simplify containing nodes', function() {
      var res = math.eval('simplify(parse("2x + 3x"))');
      assert.ok(res && res.isNode)
      assert.equal(res.toString(), '5 * x');
    });

    it('should compute and simplify derivatives', function() {
      var res = math.eval('derivative("5x*3x", "x")');
      assert.ok(res && res.isNode)
      assert.equal(res.toString(), '30 * x');
    });

    it('should compute and simplify derivatives (2)', function() {
      var scope = {}
      math.eval('a = derivative("5x*3x", "x")', scope)
      var res = math.eval('simplify(a)', scope);
      assert.ok(res && res.isNode)
      assert.equal(res.toString(), '30 * x');
    });

    it.skip('should compute and simplify derivatives (3)', function() {
      // TODO: this requires the + operator to support Nodes,
      //       i.e.   math.add(5, math.parse('2')) => return an OperatorNode
      var res = math.eval('simplify(5+derivative(5/(3x), x))');
      assert.ok(res && res.isNode)
      assert.equal(res.toString(), '5 - 15 / (3 * x) ^ 2');
    });

  });

});
