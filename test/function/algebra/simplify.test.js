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
