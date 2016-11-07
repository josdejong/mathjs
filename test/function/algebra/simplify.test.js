// test derivative
var assert = require('assert');
var math = require('../../../index');
var parse = math.parse;
var simplify = math.simplify;

describe('simplify', function() {

  var simplifyAndCompare = function(left, right) {
    assert.equal(simplify(left).toString(), parse(right).toString());
  };

  var simplifyAndCompareEval = function(left, right, scope) {
    scope = scope || {};
    assert.equal(simplify(left).eval(scope), parse(right).eval(scope));
  };

  it('should not change the value of the function', function() {
    simplifyAndCompareEval('3+2/4+2*8', '7/2+16');
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

  it('should collect seperated like terms', function() {
    simplifyAndCompare('x+1+x', '2*x+1');
    simplifyAndCompare('x^2+x+3+x^2', '2*x^2+x+3');
    simplifyAndCompare('x+1+2x', '3*x+1');
    simplifyAndCompare('x-1+x', '2*x-1');
    simplifyAndCompare('x-1-2x+2', '1-x');
  });

  it('should collect seperated like factors', function() {
    simplifyAndCompare('x/2*x', 'x^2/2');
    simplifyAndCompare('x*2*x', '2*x^2');
    simplifyAndCompare('x*y*-x/(x^2)', '-y');
  });

  it('should compute and simplify derivatives', function() {
    simplifyAndCompare('derivative(5x*3x, x)', '30*x');
    simplifyAndCompare('5+derivative(5/(3x), x)', '5-15/(3*x)^2');
  });
});
