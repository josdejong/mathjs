"use strict"

const assert = require('assert');
const math = require('../../../index');
const stepper = require('../../../lib/expression/step-solver/stepper.js');
const step = stepper.step;
const simplify = stepper.simplify;
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');
const print = require('./../../../lib/expression/step-solver/Util');
const NodeCreator = require('../../../lib/expression/step-solver/NodeCreator.js');

// to create nodes, for testing
let opNode = NodeCreator.operator;
let constNode = NodeCreator.constant;
let symbolNode = NodeCreator.symbol;
let parenNode = NodeCreator.parenthesis;

function testStep(exprString, debug=false) {
  let expr = math.parse(exprString);
  let nodeStatus = step(expr);
  if (debug) {
    if (!nodeStatus.changeType) {
      throw Error("missing or bad change type");
    }
    console.log(nodeStatus.changeType);
    console.log(print(nodeStatus.node));
  }
  return nodeStatus.node;
}

describe('arithmetic stepping', function () {
  it('(2+2) -> 4', function () {
    assert.deepEqual(
      testStep('(2+2)'),
      math.parse('4'));
  });
  it('(2+2)*5 -> 4*5', function () {
    assert.deepEqual(
      testStep('(2+2)*5'),
      math.parse('4*5'));
  });
  it('5*(2+2) -> 5*4', function () {
    assert.deepEqual(
      testStep('5*(2+2)'),
      math.parse('5*4'));
  });
  it('2*(2+2) + 2^3 -> 2*4 + 2^3', function () {
    assert.deepEqual(
      testStep('2*(2+2) + 2^3'),
      math.parse('2*4 + 2^3'));
  });
});

describe('remove unnecessary parens at root level', function() {
  it('(2+(2)) -> 2+2', function () {
    assert.deepEqual(
      testStep('(2+(2))'),
      math.parse('2+2'));
  });
  it('((2+2) + ((2^3))) -> (2+2) + 2^3 ', function () {
    assert.deepEqual(
      testStep('((2+2) + ((2^3)))'),
      math.parse('(2+2) + 2^3'));
  });
});

describe('simplify (arithmetic)', function () {
  it('(2+2)*5 = 20', function () {
    assert.deepEqual(
      simplify(math.parse('(2+2)*5')),
      math.parse('20'));
  });
  it('(8+(-4))*5 = 20', function () {
    assert.deepEqual(
      simplify(math.parse('(8+(-4))*5')),
      math.parse('20'));
  });
  it('5*(2+2)*10 = 200', function () {
    assert.deepEqual(
      simplify(math.parse('5*(2+2)*10')),
      math.parse('200'));
  });
  it('(2+(2)+7) = 11', function () {
    assert.deepEqual(
      simplify(math.parse('(2+(2)+7)')),
      math.parse('11'));
  });
  it('(8-2) * 2^2 * (1+1) / (4 / 2) / 5 = 4.8', function () {
    assert.deepEqual(
      math.parse('4.8'),
      simplify(math.parse('(8-2) * 2^2 * (1+1) / (4 /2) / 5')));
  });
});

describe('adding symbols without breaking things', function() {
  // nothing old breaks
  it('2+x no change', function () {
    assert.deepEqual(
      testStep('2+x'),
      math.parse('2+x'));
  });
  it('(2+2)*x = 4*x', function () {
    assert.deepEqual(
      testStep('(2+2)*x'),
      math.parse('4*x'));
  });
  it('(2+2)*x+3 = 4*x+3', function () {
    assert.deepEqual(
      testStep('(2+2)*x+3'),
      math.parse('4*x+3'));
  });
});

describe('collecting like terms within the context of the stepper', function() {
  it('(2+x+7) -> x + (2+7)', function () {
    assert.deepEqual(
      testStep('2+x+7'),
      math.parse('x+(2+7)'));
  });
  it('((2x^2)) * y * x * y^3 -> 2 * (x^2 * x) * (y * y^3)', function () {
    assert.deepEqual(
      testStep('2x^2 * y * x * y^3'),
      flatten(math.parse('2 * (x^2 * x) * (y * y^3)')));
  });
  it('will still simplify first for y * 5 * (2+3) * y^2 ', function () {
      assert.deepEqual(
        testStep('y * 5 * (2+3) * y^2'),
        flatten(math.parse('y * 5 * 5 * y^2')));
  });
});

describe('collects and combines like terms', function() {
  it('(x + x) + (x^2 + x^2) -> 2x + 2x^2', function () {
    assert.deepEqual(
      testStep('(x + x) + (x^2 + x^2)'),
      math.parse('2x + (x^2 + x^2)'));
  });
  it('10 + (y^2 + y^2) -> 10 + 2y^2', function () {
    assert.deepEqual(
      testStep('10 + (y^2 + y^2)'),
      math.parse('10 + 2y^2'));
  });
  it('x + y + y^2 no change', function () {
    assert.deepEqual(
      testStep('x + y + y^2'),
      flatten(math.parse('x + y + y^2')));
  });
  it('2x^(2+1) -> 2x^3', function () {
    assert.deepEqual(
      testStep('2x^(2+1)'),
      math.parse('2x^3'));
  });
  it('2x^2 * y * x * y^3 = 2 * x^3 * y^4', function () {
    assert.deepEqual(
      simplify(math.parse('2x^2 * y * x * y^3')),
      flatten(math.parse('2 * x^3 * y^4')));
  });
  it('x^2 + 3x*(-4x) + 5x^3 + 3x^2 + 6 = 5x^3 - 8x^2 + 6', function () {
    assert.deepEqual(
      simplify(math.parse('x^2 + 3x * (-4x) + 5x^3 + 3x^2 + 6')),
      opNode('+', [
        math.parse('5x^3'), flatten(math.parse('-8x^2')), constNode(6)]));
  });
  it('4y * 3 * 5 -> 60y', function () {
    assert.deepEqual(
      simplify(math.parse('4y*3*5')),
      math.parse('60y'));
  });
  it('(2x^2 - 4) + (4x^2 + 3) -> 6x^2 - 1', function () {
    assert.deepEqual(
      simplify(math.parse('(2x^2 - 4) + (4x^2 + 3)')),
      flatten(math.parse('6x^2 - 1')));
  });
  it('(2x^1 + 4) + (4x^2 + 3) -> 4x^2 + 2x + 7', function () {
    assert.deepEqual(
      simplify(math.parse('(2x^1 + 4) + (4x^2 + 3)')),
      flatten(math.parse('4x^2 + 2x + 7')));
  });
  it('y * 2x * 10 -> 20 * x * y', function () {
    assert.deepEqual(
      simplify(math.parse('y * 2x * 10')),
      flatten(math.parse('20 * x * y')));
  });
});

describe('can simplify with division', function () {
  it('2 * 4 / 5 * 10 + 3 -> 19', function () {
    assert.deepEqual(
      simplify(math.parse('2 * 4 / 5 * 10 + 3')),
      math.parse('19'));
  });
  it('2x * 5x / 2 -> 5x^2', function () {
    assert.deepEqual(
      simplify(math.parse('2x * 5x / 2')),
      math.parse('5x^2'));
  });
  it('2x * 4x / 5 * 10 + 3 -> 16x^2 + 3', function () {
    assert.deepEqual(
      simplify(math.parse('2x * 4x / 5 * 10 + 3')),
      math.parse('16x^2 + 3'));
  });
  it('2x * 4x / 2 / 4 -> x^2', function () {
    assert.deepEqual(
      simplify(math.parse('2x * 4x / 2 / 4')),
      math.parse('x^2'));
  });
  it('2x * y / z * 10 -> 20 * x * y / z', function () {
    assert.deepEqual(
      simplify(math.parse('2x * y / z * 10')),
      flatten(math.parse('20 * x * y / z')));
  });
  // TODO in the future: "2x * 4x / 5 * 10 + 3" and "2x/x" (division with polynomials)
  // also 2x * 3/x should probably simplify and get rid of the x's
  // and probably a bunch more rules
});

describe('subtraction support', function() {
  it('simplifyDoupleUnaryMinus -(-(2+3)) -> 5', function () {
    assert.deepEqual(
      simplify(math.parse('-(-(2+3))')),
      math.parse('5'));
  });
  it('simplifyDoupleUnaryMinus -(-(2+x)) -> 2+x', function () {
    assert.deepEqual(
      simplify(math.parse('-(-(2+x))')),
      math.parse('2+x'));
  });
  it('simplifyDoupleUnaryMinus -------5 -> -5', function () {
    assert.deepEqual(
      simplify(math.parse('-------5')),
      flatten(math.parse('-5')));
  });
  it('simplifyDoupleUnaryMinus --(-----5) -> -5', function () {
    assert.deepEqual(
      simplify(math.parse('--(-----5)')),
      flatten(math.parse('-5')));
  });
});

/* distribution test ideas

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
