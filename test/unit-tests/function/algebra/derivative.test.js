// test derivative
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const OperatorNode = math.OperatorNode
const ConstantNode = math.ConstantNode
const SymbolNode = math.SymbolNode
const derivative = math.derivative

describe('derivative', function () {
  function derivativeWithoutSimplify (expr, value) {
    return math.derivative(expr, value, { simplify: false })
  }

  function compareString (left, right) {
    assert.strictEqual(left.toString(), right.toString())
  }

  it('should take the derivative of a constant', function () {
    compareString(derivativeWithoutSimplify('1', 'x'), '0')
    compareString(derivativeWithoutSimplify('10000000', 'x'), '0')
  })

  it('should reckon with option simplify', function () {
    compareString(derivative('2x', 'x'), '2') // default of simplify is true
    compareString(derivative('2x', 'x', { simplify: true }), '2')
    compareString(derivative('2x', 'x', { simplify: false }), '2 * 1')
  })

  it('should create a function node', function () {
    compareString(derivative('sin(2x)', 'x'), '2 * cos(2 x)')
  })

  it('should take the derivative of a SymbolNodes', function () {
    compareString(derivativeWithoutSimplify('x', 'x'), '1')
  })

  it('should maintain parenthesis of ParenthesisNodes', function () {
    compareString(derivativeWithoutSimplify('(1)', 'x'), '(0)')
    compareString(derivativeWithoutSimplify('(x)', 'x'), '(1)')
  })

  it('should take the derivative of FunctionAssignmentNodes', function () {
    compareString(derivativeWithoutSimplify('f(x) = 5x + x + 2', 'x'), '5 * 1 + 1 + 0')
    compareString(derivativeWithoutSimplify('f(x) = 5 + 2', 'x'), '0')
    compareString(derivativeWithoutSimplify('f(y) = 5y + 2', 'x'), '0')

    // non-embedded example
    const f = math.parse('f(x) = x + 2')
    const newFunc = new OperatorNode('+', 'add', [math.parse('5x'), f])
    compareString(derivativeWithoutSimplify(newFunc, 'x'), '5 * 1 + 1 + 0')
  })

  it('should take the derivative of a OperatorNodes with ConstantNodes', function () {
    compareString(derivativeWithoutSimplify('1 + 2', 'x'), '0')
    compareString(derivativeWithoutSimplify('-100^2 + 3*3/2 - 12', 'x'), '0')
    const threeArgMultiplyConstant = new OperatorNode('*', 'multiply', [math.parse('3'), math.parse('7^4'), math.parse('123.124')])
    compareString(derivativeWithoutSimplify(threeArgMultiplyConstant, 'x'), 0)
  })

  it('should take the derivative of a OperatorNodes with SymbolNodes', function () {
    // d/dx(-4x) = -4*1 = -4
    compareString(derivativeWithoutSimplify('-4x', 'x'), '-4 * 1')
    // d/dx(+4x) = +4*1 = +4
    compareString(derivativeWithoutSimplify('+4x', 'x'), '+4 * 1')

    const threeArgMultiplyConstant = new OperatorNode('*', 'multiply', [math.parse('3'), math.parse('x'), math.parse('sin(x)')])
    compareString(derivativeWithoutSimplify(threeArgMultiplyConstant, 'x'), '3 * (1 * sin(x) + x * 1 * cos(x))')

    // Linearity of differentiation
    // With '+': d/dx(5x + x + 2) = 5*1 + 1 + 0 = 6
    compareString(derivativeWithoutSimplify('5x + x + 2', 'x'), '5 * 1 + 1 + 0')
    // With '-': d/dx(5x - x - 2) = 5*1 - 1 - 0 = 4
    compareString(derivativeWithoutSimplify('5x - x - 2', 'x'), '5 * 1 - 1 - 0')

    const threeArgAddition = new OperatorNode('+', 'add', [math.parse('x'), math.parse('sin(x)'), math.parse('5x')])
    compareString(derivativeWithoutSimplify(threeArgAddition, 'x'), '1 + 1 * cos(x) + 5 * 1')

    const threeArgMultiplication = new OperatorNode('*', 'multiply', [math.parse('x'), math.parse('sin(x)'), math.parse('5x')])
    compareString(derivativeWithoutSimplify(threeArgMultiplication, 'x'), '1 * sin(x) * 5 x + x * 1 * cos(x) * 5 x + x * sin(x) * 5 * 1')

    // d/dx(2*(x + x)) = 2*(1 + 1)
    compareString(derivativeWithoutSimplify('2(x + x)', 'x'), '2 * (1 + 1)')
    compareString(derivativeWithoutSimplify('(x + x)*2', 'x'), '2 * (1 + 1)')

    // Product Rule, d/dx(5x*3x) = 5 * 1 * 3 x + 5 x * 3 * 1 = 30x
    compareString(derivativeWithoutSimplify('5x*3x', 'x'), '5 * 1 * 3 x + 5 x * 3 * 1')

    // Basic division, d/dx(7x / 2) = 7 * 1 / 2 = 7 / 2
    compareString(derivativeWithoutSimplify('7x / 2', 'x'), '7 * 1 / 2')

    // Reciprocal Rule, d/dx(5 / (3x)) = -5 * (3 * 1) / (3 * x) ^ 2 = -5 / 3x^2
    compareString(derivativeWithoutSimplify('5 / (3x)', 'x'), '-5 * (3 * 1) / (3 x) ^ 2')

    // Quotient rule, d/dx((2x) / (3x + 2)) = ((2*1)(3x + 2) - (2x)(3*1 + 0)) / (3x + 2)^2 = 4 / (3x + 2)^2
    compareString(derivativeWithoutSimplify('(2x) / (3x + 2)', 'x'), '((2 * 1) * (3 x + 2) - (2 x) * (3 * 1 + 0)) / (3 x + 2) ^ 2')

    // Secret constant; 0^f(x) = 1 (in JS), 1^f(x) = 1, d/dx(1) = 0
    compareString(derivativeWithoutSimplify('0^(2^x + x^3 + 2)', 'x'), '0')
    compareString(derivativeWithoutSimplify('1^(2^x + x^3 + 2)', 'x'), '0')
    // d/dx(10^(2x + 2)) = 10^(2x + 2)*ln(10)*(2*1 + 0)
    compareString(derivativeWithoutSimplify('10^(2x + 2)', 'x'), '10 ^ (2 x + 2) * log(10) * (2 * 1 + 0)')

    // Secret constant, f(x)^0 = 1 -> d/dx(f(x)^0) = 1
    compareString(derivativeWithoutSimplify('(x^x^x^x)^0', 'x'), '0')
    // Ignore powers of 1, d/dx((x + 2)^1) -> d/dx(x+2) = (1 + 0) = 1
    compareString(derivativeWithoutSimplify('(x+2)^1', 'x'), '(1 + 0)')
    // Elementary Power Rule, d/dx(2x^2) = 2*2*1*x^(2-1) = 4x
    compareString(derivativeWithoutSimplify('2x^2', 'x'), '2 * 2 * 1 * x ^ (2 - 1)')

    // Elementary Power Rule, d/dx(2x^-2) = 2*-2*1*x^(-2-1) = -4x^-3
    compareString(derivativeWithoutSimplify('2x^-2', 'x'), '2 * -2 * 1 * x ^ (-2 - 1)')

    // Functional Power Rule, d/dx((x^3 + x)^(5x + 2)) = (x^3 + x)^(5x + 2) * [(((3*1*x)^(3-1)+1) * ((5x + 2) / (x^3 + x))) + (5*1 + 0)log((x^3 + x))]
    //                                                 = (x^3 + x)^(5x + 2) * [((3x^2 + 1)*(5x + 2) / (x^3 + x)) + 5log(x^3 + x)]
    compareString(derivativeWithoutSimplify('(x^3 + x)^(5x + 2)', 'x'), '(x ^ 3 + x) ^ (5 x + 2) * ((3 * 1 * x ^ (3 - 1) + 1) * (5 x + 2) / (x ^ 3 + x) + (5 * 1 + 0) * log((x ^ 3 + x)))')

    // https://github.com/josdejong/mathjs/issues/1063
    compareString(derivativeWithoutSimplify('-x', 'x'), '-1')
    compareString(derivativeWithoutSimplify('1 - (-x)', 'x'), '0 - (-1)')
  })

  it('should properly take the derivative of mathematical functions', function () {
    compareString(derivativeWithoutSimplify('cbrt(6x)', 'x'), '6 * 1 / (3 * (6 x) ^ (2 / 3))')
    compareString(derivativeWithoutSimplify('sqrt(6x)', 'x'), '6 * 1 / (2 * sqrt(6 x))')
    compareString(derivativeWithoutSimplify('nthRoot(6x)', 'x'), '6 * 1 / (2 * sqrt(6 x))')
    compareString(derivativeWithoutSimplify('nthRoot(6x, 3)', 'x'), '1 / 3 * 6 * 1 * (6 x) ^ (1 / 3 - 1)')

    compareString(derivativeWithoutSimplify('nthRoot((6x), (2x))', 'x'), '(6 x) ^ (1 / (2 x)) * ((6 * 1) * 1 / (2 x) / (6 x) + (0 * (2 x) - 1 * (2 * 1)) / (2 x) ^ 2 * log((6 x)))')
    compareString(derivativeWithoutSimplify('log((6*x))', 'x'), '(6 * 1) / (6 * x)')
    compareString(derivativeWithoutSimplify('log10((6x))', 'x'), '(6 * 1) / ((6 x) * log(10))')
    compareString(derivativeWithoutSimplify('log((6x), 10)', 'x'), '(6 * 1) / ((6 x) * log(10))')
    // d/dx(log(2x, 3x)) = ((2 * 1) / (2 * x) * log(3 * x) - log(2 * x) * (3 * 1) / (3 * x)) / log(3 * x) ^ 2 = (log(3x) - log(2x)) / (xlog(3x)^2)
    compareString(derivativeWithoutSimplify('log((2x), (3x))', 'x'), '((2 * 1) / (2 x) * log((3 x)) - log((2 x)) * (3 * 1) / (3 x)) / log((3 x)) ^ 2')

    compareString(derivativeWithoutSimplify('log(x)', 'x'), '1 / x')

    compareString(derivativeWithoutSimplify('sin(2x)', 'x'), '2 * 1 * cos(2 x)')
    compareString(derivativeWithoutSimplify('cos(2x)', 'x'), '2 * 1 * -sin(2 x)')
    compareString(derivativeWithoutSimplify('tan(2x)', 'x'), '2 * 1 * sec(2 x) ^ 2')
    compareString(derivativeWithoutSimplify('sec(2x)', 'x'), '2 * 1 * sec(2 x) * tan(2 x)')
    compareString(derivativeWithoutSimplify('csc(2x)', 'x'), '-(2 * 1) * csc(2 x) * cot(2 x)')
    compareString(derivativeWithoutSimplify('cot((2x))', 'x'), '-(2 * 1) * csc((2 x)) ^ 2')
    compareString(derivativeWithoutSimplify('asin((2x))', 'x'), '(2 * 1) / sqrt(1 - (2 x) ^ 2)')
    compareString(derivativeWithoutSimplify('acos((2x))', 'x'), '-(2 * 1) / sqrt(1 - (2 x) ^ 2)')
    compareString(derivativeWithoutSimplify('atan((2x))', 'x'), '(2 * 1) / ((2 x) ^ 2 + 1)')
    compareString(derivativeWithoutSimplify('asec((2x))', 'x'), '(2 * 1) / (abs((2 x)) * sqrt((2 x) ^ 2 - 1))')
    compareString(derivativeWithoutSimplify('acsc((2x))', 'x'), '-(2 * 1) / (abs((2 x)) * sqrt((2 x) ^ 2 - 1))')
    compareString(derivativeWithoutSimplify('acot((2x))', 'x'), '-(2 * 1) / ((2 x) ^ 2 + 1)')
    compareString(derivativeWithoutSimplify('sinh(2x)', 'x'), '2 * 1 * cosh(2 x)')
    compareString(derivativeWithoutSimplify('cosh(2x)', 'x'), '2 * 1 * sinh(2 x)')
    compareString(derivativeWithoutSimplify('tanh(2x)', 'x'), '2 * 1 * sech(2 x) ^ 2')
    compareString(derivativeWithoutSimplify('sech(2x)', 'x'), '-(2 * 1) * sech(2 x) * tanh(2 x)')
    compareString(derivativeWithoutSimplify('csch(2x)', 'x'), '-(2 * 1) * csch(2 x) * coth(2 x)')
    compareString(derivativeWithoutSimplify('coth(2x)', 'x'), '-(2 * 1) * csch(2 x) ^ 2')
    compareString(derivativeWithoutSimplify('asinh((2x))', 'x'), '(2 * 1) / sqrt((2 x) ^ 2 + 1)')
    compareString(derivativeWithoutSimplify('acosh((2x))', 'x'), '(2 * 1) / sqrt((2 x) ^ 2 - 1)')
    compareString(derivativeWithoutSimplify('atanh((2x))', 'x'), '(2 * 1) / (1 - (2 x) ^ 2)')
    compareString(derivativeWithoutSimplify('asech((2x))', 'x'), '-(2 * 1) / ((2 x) * sqrt(1 - (2 x) ^ 2))')
    compareString(derivativeWithoutSimplify('acsch((2x))', 'x'), '-(2 * 1) / (abs((2 x)) * sqrt((2 x) ^ 2 + 1))')
    compareString(derivativeWithoutSimplify('acoth((2x))', 'x'), '-(2 * 1) / (1 - (2 x) ^ 2)')
    compareString(derivativeWithoutSimplify('abs(2x)', 'x'), '2 * 1 * abs(2 x) / 2 x')

    // See power operator tests above
    compareString(derivativeWithoutSimplify('pow(0, 2^x + x^3 + 2)', 'x'), '0')
    compareString(derivativeWithoutSimplify('pow(1, 2^x + x^3 + 2)', 'x'), '0')
    compareString(derivativeWithoutSimplify('pow(10, 2x + 2)', 'x'), '10 ^ (2 x + 2) * log(10) * (2 * 1 + 0)')
    compareString(derivativeWithoutSimplify('pow(x^x^x^x, 0)', 'x'), '0')
    compareString(derivativeWithoutSimplify('pow(x + 2, 1)', 'x'), '1 + 0')
    compareString(derivativeWithoutSimplify('2 * pow(x, 2)', 'x'), '2 * 2 * 1 * x ^ (2 - 1)')
    compareString(derivativeWithoutSimplify('2 * pow(x, -2)', 'x'), '2 * -2 * 1 * x ^ (-2 - 1)')
    compareString(derivativeWithoutSimplify('pow(x^3 + x, 5x + 2)', 'x'), '(x ^ 3 + x) ^ (5 x + 2) * ((3 * 1 * x ^ (3 - 1) + 1) * (5 x + 2) / (x ^ 3 + x) + (5 * 1 + 0) * log(x ^ 3 + x))')

    compareString(derivativeWithoutSimplify('exp(2x)', 'x'), '2 * 1 * exp(2 x)')
  })

  it('should take the partial derivative of an expression', function () {
    compareString(derivativeWithoutSimplify('x + y', 'x'), '1 + 0')
    compareString(derivativeWithoutSimplify('x + log(y)*y', 'x'), '1 + 0')

    compareString(derivativeWithoutSimplify('x + y + z', 'x'), '1 + 0 + 0')
    compareString(derivativeWithoutSimplify('x + log(y)*z', 'x'), '1 + 0')

    compareString(derivativeWithoutSimplify('x + log(y)*x', 'x'), '1 + log(y) * 1')

    // 2 * 1 * x ^ (2 - 1) + y * 1 + 0 = 2x + y
    compareString(derivativeWithoutSimplify('x^2 + x*y + y^2', 'x'), '2 * 1 * x ^ (2 - 1) + y * 1 + 0')
  })

  it('should function properly even without being called within an evaluate', function () {
    const f = math.parse('2x^3')

    // 2*3*1*x^(3-1) = 6x^2
    compareString(derivativeWithoutSimplify(f, 'x').toString(), '2 * 3 * 1 * x ^ (3 - 1)')
  })

  it('should accept string and Node input', function () {
    // NOTE: we use `parse` here on purpose to see whether derivative accepts it
    compareString(derivative('x^2', 'x'), '2 * x')
    compareString(derivative(math.parse('x^2'), 'x'), '2 * x')
    compareString(derivative('x^2', math.parse('x')), '2 * x')
    compareString(derivative(math.parse('x^2'), math.parse('x')), '2 * x')
  })

  describe('expression parser', function () {
    it('should evaluate a derivative containing string value', function () {
      const res = math.evaluate('derivative("x^2", "x")')
      assert.ok(res && res.isNode)

      assert.strictEqual(res.toString(), '2 * x')
    })

    it('should evaluate a derivative containing nodes', function () {
      const res = math.evaluate('derivative(parse("x^2"), parse("x"))')
      assert.ok(res && res.isNode)

      assert.strictEqual(res.toString(), '2 * x')
    })
  })

  it('should not drop any additional operator arguments', function () {
    // This case cannot happen when parsing via the expression parser,
    // but it can when you create your own operator nodes. See #1014

    const c12 = new ConstantNode(12)
    const c4 = new ConstantNode(4)
    const x = new SymbolNode('x')

    assert.throws(function () {
      const node = new OperatorNode('/', 'myDivide', [c12, c4, x])
      derivative(node, 'x')
    }, /Error: Operator "\/" is not supported by derivative, or a wrong number of arguments is passed/)

    assert.throws(function () {
      const node = new OperatorNode('^', 'myPow', [c12, c4, x])
      derivative(node, 'x')
    }, /Error: Operator "\^" is not supported by derivative, or a wrong number of arguments is passed/)
  })

  it('should throw error if expressions contain unsupported operators or functions', function () {
    assert.throws(function () { derivative('x << 2', 'x') }, /Error: Operator "<<" is not supported by derivative/)
    assert.throws(function () { derivative('subset(x)', 'x') }, /Error: Function "subset" is not supported by derivative/)
  })

  it('should have controlled behavior on arguments errors', function () {
    assert.throws(function () {
      derivative('sqrt()', 'x')
    }, /TypeError: Too few arguments in function sqrt \(expected: number or Complex or BigNumber or Unit or Fraction or string or boolean, index: 0\)/)
    assert.throws(function () {
      derivative('sqrt(12, 2x)', 'x')
    }, /TypeError: Too many arguments in function sqrt \(expected: 1, actual: 2\)/)
  })

  it('should throw error for incorrect argument types', function () {
    assert.throws(function () {
      derivative('42', '42')
    }, /TypeError: Unexpected type of argument in function derivative \(expected: SymbolNode or identifier, actual: string, index: 1\)/)

    assert.throws(function () {
      derivative('[1, 2; 3, 4]', 'x')
    }, /TypeError: Unexpected type of argument in function constTag \(expected: ConstantNode or FunctionNode or FunctionAssignmentNode or OperatorNode or ParenthesisNode or SymbolNode, actual:.*ArrayNode.*, index: 1\)/)

    assert.throws(function () {
      derivative('x + [1, 2; 3, 4]', 'x')
    }, /TypeError: Unexpected type of argument in function constTag \(expected: ConstantNode or FunctionNode or FunctionAssignmentNode or OperatorNode or ParenthesisNode or SymbolNode, actual:.*ArrayNode.*, index: 1\)/)
  })

  it('should throw error if incorrect number of arguments', function () {
    assert.throws(function () {
      derivative('x + 2')
    }, /TypeError: Too few arguments in function derivative \(expected: SymbolNode or identifier, index: 1\)/)

    assert.throws(function () {
      derivative('x + 2', 'x', {}, true, 42)
    }, /TypeError: Too many arguments in function derivative \(expected: 3, actual: 5\)/)
  })

  it('should LaTeX expressions involving derivative', function () {
    compareString(math.parse('derivative(x*y,x)').toTex(), '{d\\over dx}\\left[ x\\cdot y\\right]')
    compareString(math.parse('derivative("x*y",x)').toTex(), '{d\\over dx}\\left[x * y\\right]')
    compareString(math.parse('derivative(x*y,"x")').toTex(), '{d\\over dx}\\left[ x\\cdot y\\right]')
    compareString(math.parse('derivative("x*y","x")').toTex(), '{d\\over dx}\\left[x * y\\right]')

    // FIXME: handle toTex of derivative with options as third argument
    // compareString(math.parse('derivative("x*y","x", { simplify: false })').toTex(), '{d\\over dx}\\left[x * y\\right]')
  })
})
