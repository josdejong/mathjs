"use strict"

const assert = require('assert');
const math = require('../../../index');
const stepper = require('../../../lib/expression/step-solver/stepper.js');
const step = stepper.step;
const simplify = stepper.simplify;

function testStep(exp, debug=false) {
  let ret = step(new stepper.RootNode(exp));
  if (debug) {
    console.log(ret.rule);
    console.log(ret.expr.toString(/*{parenthesis: 'all'}*/));
  }
  return ret.expr;
}

// to create nodes, for testing
// TODO: put these in a file that can be used by other files and also all the test files
function opNode(op, args) {
  switch (op) {
    case '+':
      return new math.expression.node.OperatorNode('+', 'add', args);
    case '*':
      return new math.expression.node.OperatorNode('*', 'multiply', args);
    case '^':
      return new math.expression.node.OperatorNode('^', 'pow', args);
    default:
      throw Error("Unsupported operation: " + op);
  }
}

function constNode(val) {
  return new math.expression.node.ConstantNode(val);
}

function symbolNode(name) {
  return new math.expression.node.SymbolNode(name);
}

function parenNode(content) {
  return new math.expression.node.ParenthesisNode(content);
}

describe('arithmetic stepping', function () {
  it('2+2 -> 4', function () {
    assert.deepEqual(math.parse('4'), testStep(math.parse('2+2')));
  });
  it('(2+2) -> 4', function () {
    assert.deepEqual(math.parse('4'), testStep(math.parse('(2+2)')));
  });
  it('(2+2)*5 -> 4*5', function () {
    assert.deepEqual(math.parse('4*5'), testStep(math.parse('(2+2)*5')));
  });
  it('5*(2+2) -> 5*4', function () {
    assert.deepEqual(math.parse('5*4'), testStep(math.parse('5*(2+2)')));
  });
  it('(((5))) -> 5', function () {
    assert.deepEqual(math.parse('5'), testStep(math.parse('(((5)))')));
  });
  it('2*(2+2) + 2^3 -> 2*4 + 2^3', function () {
    assert.deepEqual(math.parse('2*4 + 2^3'), testStep(math.parse('2*(2+2) + 2^3 ')));
  });
});

describe('remove uncessary parens', function() {
  it('(2+(2)) -> 2+2', function () {
    assert.deepEqual(math.parse('2+2'), testStep(math.parse('(2+(2))')));
  });
  it('(2+(2)+7) -> 2+2+7', function () {
    assert.deepEqual(math.parse('2+2+7'), testStep(math.parse('(2+(2)+7)')));
  });
  it('((2+2) + ((2^3))) -> (2+2) + 2^3 ', function () {
    assert.deepEqual(math.parse('(2+2) + 2^3'), testStep(math.parse('((2+2) + ((2^3)))')));
  });
});

describe('arithmetic simplify', function () {
  it('2+2 = 4', function () {
    assert.deepEqual(math.parse('4'), simplify(math.parse('2+2')));
  });
  it('(2+2)*5 = 20', function () {
    assert.deepEqual(math.parse('20'), simplify(math.parse('(2+2)*5')));
  });
  it('5*(2+2)*10 = 200', function () {
    assert.deepEqual(math.parse('200'), simplify(math.parse('5*(2+2)*10')));
  });
  it('(2+(2)+7) = 11', function () {
    assert.deepEqual(math.parse('11'), simplify(math.parse('(2+(2)+7)')));
  });
  it('(8-2) * 2^2 * (1+1) / (4 / 2) / 5 = 4.8', function () {
    assert.deepEqual(math.parse('4.8'), simplify(math.parse('(8-2) * 2^2 * (1+1) / (4 /2) / 5')));
  });
});

describe('adding symbols without breaking things', function() {
  // nothing old breaks
  it('2+x no change', function () {
    assert.deepEqual(math.parse('2+x'), testStep(math.parse('2+x')));
  });
  it('(2+2)*x = 4*x', function () {
    assert.deepEqual(math.parse('4*x'), testStep(math.parse('(2+2)*x')));
  });
  it('(2+2)*x+3 = 4*x+3', function () {
    assert.deepEqual(math.parse('4*x+3'), testStep(math.parse('(2+2)*x+3')));
  });
});

describe('basic addition collect like terms, no exponents or coefficients',
  function() {
    it('(2+x+7) -> x + (2+7)', function () {
      assert.deepEqual(math.parse('x+(2+7)'), testStep(math.parse('2+x+7')));
    });
    it('x + 4 + x + 5 -> (x + x) + (4 + 5)', function () {
      assert.deepEqual(math.parse('(x + x) + (4 + 5)'),
        testStep(math.parse('x + 4 + x + 5')));
    });
    it('no change for x + 4 + y', function () {
      assert.deepEqual(opNode('+', [
          symbolNode('x'), constNode(4), symbolNode('y')]),
        testStep(math.parse('x + 4 + y')));
    });
    it('x + 4 + x + y + 5 -> (x + x) + y + (4 + 5)', function () {
      assert.deepEqual(opNode('+', [
          math.parse('(x+x)'), symbolNode('y'), math.parse('(4+5)')]),
        testStep(math.parse('x + 4 + x + y + 5')));
    });
    // 2^x is an 'other'
    it('x + 4 + x + 2^x + 5 -> (x + x) + (4 + 5) + 2^x', function () {
      assert.deepEqual(opNode('+', [
          math.parse('(x+x)'), math.parse('(4+5)'), math.parse('2^x')]),
        testStep(math.parse('x + 4 + x + 2^x + 5')));
    });
    // 2*(y + x) is an 'other' cause it has parens
    it('z + 2*(y + x) + 4 + z  -> (z + z) + 4 + (2(y+x))', function () {
      assert.deepEqual(opNode('+', [
          math.parse('(z+z)'), math.parse('4'), math.parse('2*(y+x)')]),
        testStep(math.parse('z + 2*(y + x) + 4 + z')));
    });
  }
);

describe('collect like terms with exponents and coefficients', function() {
  it('x^2 + x + x^2 + x -> (x^2 + x^2) + (x + x)', function () {
    assert.deepEqual(math.parse('(x^2 + x^2) + (x + x)'),
      testStep(math.parse('x^2 + x + x^2 + x')));
  });
  it('y^2 + 5 + y^2 + 5 -> (y^2 + y^2) + (5 + 5)', function () {
    assert.deepEqual(math.parse('(y^2 + y^2) + (5 + 5)'),
      testStep(math.parse('y^2 + 5 + y^2 + 5')));
  });
  it('y + 5 + z^2 no change', function () {
    assert.deepEqual(opNode('+', [
          math.parse('y'), math.parse('5'), math.parse('z^2')]),
      testStep(math.parse('y + 5 + z^2')));
  });
  it('2x^2 + x + x^2 + 3x -> (2x^2 + x^2) + (x + 3x)', function () {
    assert.deepEqual(math.parse('(2x^2 + x^2) + (x + 3x)'),
      testStep(math.parse('2x^2 + x + x^2 + 3x')));
  });
});

describe('collect like terms for multiplication', function() {
  it('((2x^2)) * y * x * y^3 -> (2x^2 * x) * (y * y^3)', function () {
    assert.deepEqual(opNode('*', [
        parenNode(opNode('*', [math.parse('2x^2'), symbolNode('x')])),
        math.parse('(y*y^3)')]),
      testStep(math.parse('2x^2 * y * x * y^3')));
  });
  it('y^2 * 5 * y * 9 -> (5 * 9)*(y^2 * y)', function () {
    assert.deepEqual(math.parse('(5 * 9)*(y^2 * y)'),
      testStep(math.parse('y^2 * 5 * y * 9')));
  });
  it('y * 5 * z^2 no change', function () {
    assert.deepEqual(opNode('*', [
          math.parse('y'), math.parse('5'), math.parse('z^2')]),
      testStep(math.parse('y * 5 * z^2')));
  });
  it('y * 5 * (2+x) * y^2 puts the parens at the end', function () {
      assert.deepEqual(opNode('*', [
            math.parse('5'), math.parse('(y*y^2)'), math.parse('(2+x)')]),
        testStep(math.parse('y * 5 * (2+x) * y^2')));
    });
  it('will still simplify first for y * 5 * (2+3) * y^2 ', function () {
      assert.deepEqual(opNode('*', [
            math.parse('y'), math.parse('5'), math.parse('5'), math.parse('y^2')]),
        testStep(math.parse('y * 5 * (2+3) * y^2')));
    });
});

describe('combines like terms', function() {
  it('(x + x) + (x^2 + x^2) -> 2x + 2x^2', function () {
    assert.deepEqual(math.parse('2x + (x^2 + x^2)'),
      testStep(math.parse('(x + x) + (x^2 + x^2)')));
  });
  it('10 + (y^2 + y^2) -> 10 + 2y^2', function () {
    assert.deepEqual(math.parse('10 + 2y^2'),
      testStep(math.parse('10 + (y^2 + y^2)')));
  });
  it('x + y + y^2 no change', function () {
    assert.deepEqual(opNode('+', [
      math.parse('x'), math.parse('y'), math.parse('y^2')]),
      testStep(math.parse('x + y + y^2')));
  });
  it('(2x^2 * x) * (y * y^3) -> 2x^(2+1) * (y * y^3)', function () {
    assert.deepEqual(math.parse('2x^(2+1) * (y * y^3)'),
      testStep(opNode('*', [
        parenNode(opNode('*', [math.parse('2x^2'), symbolNode('x')])),
        math.parse('(y*y^3)')])));
  });
  it('2x^(2+1) -> 2x^3', function () {
    assert.deepEqual(math.parse('2x^3'),
      testStep(math.parse('2x^(2+1)')));
  });
  it('y * y^3 -> y^(1+3)', function () {
    assert.deepEqual(math.parse('y^4'),
      testStep(math.parse('y^(1+3)')));
  });
});

describe('overall simplify combining like terms', function () {
  it('2x^2 * y * x * y^3 = 2x^3 * y^4', function () {
    assert.deepEqual(math.parse('2x^3 * y^4'),
      simplify(math.parse('2x^2 * y * x * y^3')));
  });
  it('x^2 + 3x*4x + 5x^3 + 3x^2 + 6 = 5x^3 + 16x^2 + 6', function () {
    assert.deepEqual(opNode('+', [
        math.parse('5x^3'), math.parse('16x^2'), math.parse('6')]),
      simplify(math.parse('x^2 + 3x * 4x + 5x^3 + 3x^2 + 6')));
  });
  it('4y * 3 * 5 -> 60y', function () {
    assert.deepEqual(math.parse('60y'),
      simplify(math.parse('4y*3*5')));
  });
  it('(2x^2 + 4) + (4x^2 + 3) -> 6x^2 + 7', function () {
    assert.deepEqual(math.parse('6x^2 + 7'),
      simplify(math.parse('(2x^2 + 4) + (4x^2 + 3)')));
  });
  it('(2x^1 + 4) + (4x^2 + 3) -> 4x^2 + 2x + 7', function () {
    assert.deepEqual(opNode('+', [
      math.parse('4x^2'), math.parse('2x'), math.parse('7')]),
      simplify(math.parse('(2x^1 + 4) + (4x^2 + 3)')));
  });
});


/* distribution test ideas

    // PREREQ FUNCTIONS
    // x*x -> x^(1+1)
    // x*x^3 -> x^(1+3)
    // x^2*x -> x^(2+1)
    // x^2 * x^5 -> x^(2+5)
    // 2x*x -> 2x^(1+1) 
    // 2x*4x -> 2*4*x^(1+1)
    // ---- mrahhh math.parse('x * 2x') gives x*2 on the left..
    // ---- probably still fine


    // case 1 has one in parens and one not, only addition
    // 2x * (3x + 4)
    // (2x + 4) * 3x
    // case 2 with subtraction
    // (2x - 4) * 3x
    // case 3 unary minus
    // -2x * (3x - 4)
    // (2x + 3)*(4x+7)
    // 2x^2 * (3x + 4)
*/
