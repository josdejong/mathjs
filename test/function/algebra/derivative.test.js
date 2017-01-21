// test derivative
var assert = require('assert');
var math = require('../../../index');
var OperatorNode = math.expression.node.OperatorNode;
var derivative = math.derivative;

// TODO: simplify the unit tests, write the functions as strings instead of writing them on Node level

describe('derivative', function() {

  function compareString(left, right) {
    assert.equal(left.toString(), right.toString());
  }

  it('should take the derivative of a constant', function() {
    compareString(derivative('1', 'x'), '0');
    compareString(derivative('10000000', 'x'), '0');
  });

  it('should take the derivative of a SymbolNodes', function() {
    compareString(derivative('x', 'x'), '1');
  });

  it('should maintain parenthesis of ParenthesisNodes', function() {
    compareString(derivative('(1)', 'x'), '(0)');
    compareString(derivative('(x)', 'x'), '(1)');
  });

  it('should take the derivative of FunctionAssignmentNodes', function() {
    compareString(derivative('f(x) = 5x + x + 2', 'x'), '5 * 1 + 1 + 0');
    compareString(derivative('f(x) = 5 + 2', 'x'), '0');
    compareString(derivative('f(y) = 5y + 2', 'x'), '0');

    // non-embedded example
    var f_of_x = math.parse('f(x) = x + 2');
    var newFunc = new OperatorNode('+', 'add', [math.parse('5x'), f_of_x]);
    assert.equal(derivative(newFunc, 'x'), '5 * 1 + 1 + 0');
  });

  it('should take the derivative of a OperatorNodes with ConstantNodes', function() {
    compareString(derivative('1 + 2', 'x'), '0');
    compareString(derivative('-100^2 + 3*3/2 - 12', 'x'), '0');
  });

  it('should take the derivative of a OperatorNodes with SymbolNodes', function() {
    // d/dx(-4x) = -4*1 = -4
    compareString(derivative('-4x', 'x'), '-4 * 1');
    // d/dx(+4x) = +4*1 = +4
    compareString(derivative('+4x', 'x'), '+4 * 1');


    // Linearity of differentiation
    // With '+': d/dx(5x + x + 2) = 5*1 + 1 + 0 = 6
    compareString(derivative('5x + x + 2', 'x'), '5 * 1 + 1 + 0');
    // With '-': d/dx(5x - x - 2) = 5*1 - 1 - 0 = 4
    compareString(derivative('5x - x - 2', 'x'), '5 * 1 - 1 - 0');


    // d/dx(2*(x + x)) = 2*(1 + 1)
    compareString(derivative('2(x + x)', 'x'), '2 * (1 + 1)');
    compareString(derivative('(x + x)*2', 'x'), '2 * (1 + 1)');

    // Product Rule, d/dx(5x*3x) = 5*(3*1*x + x*3*1) = 30x
    compareString(derivative('5x*3x', 'x'), '3 * 5 * 1 * x + 5 x * 3 * 1');


    // Basic division, d/dx(7x / 2) = 7 * 1 / 2 = 7 / 2
    compareString(derivative('7x / 2', 'x'), '7 * 1 / 2');

    // Reciprocal Rule, d/dx(5 / (3x)) = -5 * (3 * 1) / (3 * x) ^ 2 = -5 / 3x^2
    compareString(derivative('5 / (3x)', 'x'), '-5 * (3 * 1) / (3 x) ^ 2');

    // Quotient rule, d/dx((2x) / (3x + 2)) = ((2*1)(3x + 2) - (2x)(3*1 + 0)) / (3x + 2)^2 = 4 / (3x + 2)^2
    compareString(derivative('(2x) / (3x + 2)', 'x'), '((2 * 1) * (3 x + 2) - (2 x) * (3 * 1 + 0)) / (3 x + 2) ^ 2');

    // Secret constant; 0^f(x) = 1 (in JS), 1^f(x) = 1, d/dx(1) = 0
    compareString(derivative('0^(2^x + x^3 + 2)', 'x'), '0');
    compareString(derivative('1^(2^x + x^3 + 2)', 'x'), '0');
    // d/dx(10^(2x + 2)) = 10^(2x + 2)*ln(10)*(2*1 + 0)
    assert.equal(derivative('10^(2x + 2)', 'x'), '10 ^ (2 x + 2) * log(10) * (2 * 1 + 0)');

    // Secret constant, f(x)^0 = 1 -> d/dx(f(x)^0) = 1
    compareString(derivative('(x^x^x^x)^0', 'x'), '0');
    // Ignore powers of 1, d/dx((x + 2)^1) -> d/dx(x+2) = (1 + 0) = 1
    compareString(derivative('(x+2)^1', 'x'), '(1 + 0)');
    // Elementary Power Rule, d/dx(2x^2) = 2*2*1*x^(2-1) = 4x
    compareString(derivative('2x^2', 'x'), '2 * 2 * 1 * x ^ (2 - 1)');

    // Elementary Power Rule, d/dx(2x^-2) = 2*-2*1*x^(-2-1) = -4x^-3
    compareString(derivative('2x^-2', 'x'), '2 * -2 * 1 * x ^ (-2 - 1)');

    // Functional Power Rule, d/dx((x^3 + x)^(5x + 2)) = (x^3 + x)^(5x + 2) * [(((3*1*x)^(3-1)+1) * ((5x + 2) / (x^3 + x))) + (5*1 + 0)log((x^3 + x))]
    //                                                 = (x^3 + x)^(5x + 2) * [((3x^2 + 1)*(5x + 2) / (x^3 + x)) + 5log(x^3 + x)]
    compareString(derivative('(x^3 + x)^(5x + 2)', 'x'), '(x ^ 3 + x) ^ (5 x + 2) * ((3 * 1 * x ^ (3 - 1) + 1) * (5 x + 2) / (x ^ 3 + x) + (5 * 1 + 0) * log((x ^ 3 + x)))');
  });

  it('should properly take the derivative of mathematical functions', function() {
    compareString(derivative('cbrt(6x)', 'x'), '6 * 1 / (3 * (6 x) ^ (2 / 3))');
    compareString(derivative('sqrt(6x)', 'x'), '6 * 1 / (2 * sqrt(6 x))');
    compareString(derivative('nthRoot(6x)', 'x'), '6 * 1 / (2 * sqrt(6 x))');
    compareString(derivative('nthRoot(6x, 3)', 'x'), '1 / 3 * 6 * 1 * (6 x) ^ (1 / 3 - 1)');

    compareString(derivative('nthRoot((6x), (2x))', 'x'), '(6 x) ^ (1 / (2 x)) * ((6 * 1) * 1 / (2 x) / (6 x) + (0 * (2 x) - 1 * (2 * 1)) / (2 x) ^ 2 * log((6 x)))');
    compareString(derivative('log((6*x))', 'x'), '(6 * 1) / (6 * x)');
    compareString(derivative('log10((6x))', 'x'), '(6 * 1) / ((6 x) * log(10))');
    compareString(derivative('log((6x), 10)', 'x'), '(6 * 1) / ((6 x) * log(10))');
    // d/dx(log(2x, 3x)) = ((2 * 1) / (2 * x) * log(3 * x) - log(2 * x) * (3 * 1) / (3 * x)) / log(3 * x) ^ 2 = (log(3x) - log(2x)) / (xlog(3x)^2)
    compareString(derivative('log((2x), (3x))', 'x'), '((2 * 1) / (2 x) * log((3 x)) - log((2 x)) * (3 * 1) / (3 x)) / log((3 x)) ^ 2');

    compareString(derivative('sin(2x)', 'x'), '2 * 1 * cos(2 x)');
    compareString(derivative('cos(2x)', 'x'), '2 * 1 * -sin(2 x)');
    compareString(derivative('tan(2x)', 'x'), '2 * 1 * sec(2 x) ^ 2');
    compareString(derivative('sec(2x)', 'x'), '2 * 1 * sec(2 x) * tan(2 x)');
    compareString(derivative('csc(2x)', 'x'), '-(2 * 1) * csc(2 x) * cot(2 x)');
    compareString(derivative('cot((2x))', 'x'), '-(2 * 1) * csc((2 x)) ^ 2');
    compareString(derivative('asin((2x))', 'x'), '(2 * 1) / sqrt(1 - (2 x) ^ 2)');
    compareString(derivative('acos((2x))', 'x'), '-(2 * 1) / sqrt(1 - (2 x) ^ 2)');
    compareString(derivative('atan((2x))', 'x'), '(2 * 1) / ((2 x) ^ 2 + 1)');
    compareString(derivative('asec((2x))', 'x'), '(2 * 1) / (abs((2 x)) * sqrt((2 x) ^ 2 - 1))');
    compareString(derivative('acsc((2x))', 'x'), '-(2 * 1) / (abs((2 x)) * sqrt((2 x) ^ 2 - 1))');
    compareString(derivative('acot((2x))', 'x'), '-(2 * 1) / ((2 x) ^ 2 + 1)');
    compareString(derivative('sinh(2x)', 'x'), '2 * 1 * cosh(2 x)');
    compareString(derivative('cosh(2x)', 'x'), '2 * 1 * sinh(2 x)');
    compareString(derivative('tanh(2x)', 'x'), '2 * 1 * sech(2 x) ^ 2');
    compareString(derivative('sech(2x)', 'x'), '-(2 * 1) * sech(2 x) * tanh(2 x)');
    compareString(derivative('csch(2x)', 'x'), '-(2 * 1) * csch(2 x) * coth(2 x)');
    compareString(derivative('coth(2x)', 'x'), '-(2 * 1) * csch(2 x) ^ 2');
    compareString(derivative('asinh((2x))', 'x'), '(2 * 1) / sqrt((2 x) ^ 2 + 1)');
    compareString(derivative('acosh((2x))', 'x'), '(2 * 1) / sqrt((2 x) ^ 2 - 1)');
    compareString(derivative('atanh((2x))', 'x'), '(2 * 1) / (1 - (2 x) ^ 2)');
    compareString(derivative('asech((2x))', 'x'), '-(2 * 1) / ((2 x) * sqrt(1 - (2 x) ^ 2))');
    compareString(derivative('acsch((2x))', 'x'), '-(2 * 1) / (abs((2 x)) * sqrt((2 x) ^ 2 + 1))');
    compareString(derivative('acoth((2x))', 'x'), '-(2 * 1) / (1 - (2 x) ^ 2)');
  });

  it('should take the partial derivative of an expression', function() {
    compareString(derivative('x + y', 'x'), '1 + 0');
    compareString(derivative('x + log(y)*y', 'x'), '1 + 0');

    compareString(derivative('x + y + z', 'x'), '1 + 0 + 0');
    compareString(derivative('x + log(y)*z', 'x'), '1 + 0');

    compareString(derivative('x + log(y)*x', 'x'), '1 + log(y) * 1');

    // 2 * 1 * x ^ (2 - 1) + y * 1 + 0 = 2x + y
    compareString(derivative('x^2 + x*y + y^2', 'x'), '2 * 1 * x ^ (2 - 1) + y * 1 + 0');
  });

  it('should function properly even without being called within an eval', function() {
    var f = math.parse('2x^3');

    // 2*3*1*x^(3-1) = 6x^2
    compareString(derivative(f, 'x').toString(), '2 * 3 * 1 * x ^ (3 - 1)');
  });

  it('should accept string and Node input', function() {
    // TODO: remove .simplify() in the end, should be called by derivative itself
    // NOTE: we use `parse` here on purpose to see whether derivative accepts it
    compareString(derivative('x^2', 'x').simplify(), '2 * x');
    compareString(derivative(math.parse('x^2'), 'x').simplify(), '2 * x');
    compareString(derivative('x^2', math.parse('x')).simplify(), '2 * x');
    compareString(derivative(math.parse('x^2'), math.parse('x')).simplify(), '2 * x');
  });

  describe('expression parser', function() {

    it('should evaluate a derivative containing string value', function() {
      var res = math.eval('derivative("x^2", "x")');
      assert.ok(res && res.isNode)

      assert.equal(res.simplify().toString(), '2 * x');
    });

    it('should evaluate a derivative containing nodes', function() {
      var res = math.eval('derivative(parse("x^2"), parse("x"))');
      assert.ok(res && res.isNode)

      assert.equal(res.simplify().toString(), '2 * x');
    });

  });

  it('should throw error if expressions contain unsupported operators or functions', function() {
    assert.throws(function () { derivative('x << 2', 'x'); }, /Error: Operator "<<" not supported by derivative/);
    assert.throws(function () { derivative('subset(x)', 'x'); }, /Error: Function "subset" not supported by derivative/);
  });

  it('should have controlled behavior on arguments errors', function() {
    assert.throws(function() {
      derivative('sqrt()', 'x');
    }, /TypeError: Too few arguments in function sqrt \(expected: number or Complex or BigNumber or Unit or Array or Matrix, index: 0\)/);
    assert.throws(function() {
      derivative('sqrt(12, 2x)', 'x');
    }, /TypeError: Too many arguments in function sqrt \(expected: 1, actual: 2\)/);
  });

  it('should throw error for incorrect argument types', function() {
    assert.throws(function () {
      derivative('42', '42');
    }, /TypeError: Unexpected type of argument in function derivative \(expected: string or SymbolNode, actual: ConstantNode, index: 1\)/);

    assert.throws(function () {
      derivative('[1, 2; 3, 4]', 'x');
    }, /TypeError: Unexpected type of argument in function constTag \(expected: OperatorNode or ConstantNode or SymbolNode or ParenthesisNode or FunctionNode or FunctionAssignmentNode, actual: ArrayNode, index: 1\)/);

    assert.throws(function () {
      derivative('x + [1, 2; 3, 4]', 'x');
    }, /TypeError: Unexpected type of argument in function constTag \(expected: OperatorNode or ConstantNode or SymbolNode or ParenthesisNode or FunctionNode or FunctionAssignmentNode, actual: ArrayNode, index: 1\)/);
  });

  it('should throw error if incorrect number of arguments', function() {
    assert.throws(function () {
      derivative('x + 2');
    }, /TypeError: Too few arguments in function derivative \(expected: string or SymbolNode, index: 1\)/);

    assert.throws(function () {
      derivative('x + 2', 'x', "stuff", true, 42);
    }, /TypeError: Too many arguments in function derivative \(expected: 2, actual: 5\)/);
  });

});
