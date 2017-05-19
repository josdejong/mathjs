'use strict';

const assert = require('assert');
const math = require('../../../index');
const flattenOperands = require('../../../lib/expression/step-solver/flattenOperands.js');
const NodeCreator = require('../../../lib/expression/step-solver/NodeCreator.js');

function flatten(node, debug=false) {
  let flattened = flattenOperands(node);
  if (debug) {
    console.log(flattened.toString());
  }
  return flattened;
}

// to create nodes, for testing
let opNode = NodeCreator.operator;
let constNode = NodeCreator.constant;
let symbolNode = NodeCreator.symbol;
let parenNode = NodeCreator.parenthesis;

describe('flattens + and *', function () {
  it('2+2', function () {
    assert.deepEqual(
      flatten(math.parse('2+2')),
      math.parse('2+2'));
  });
  it('2+2+7', function () {
    assert.deepEqual(
      flatten(math.parse('2+2+7')),
      opNode('+', [constNode(2), constNode(2), constNode(7)]));
  });
  it('9*8*6+3+4', function () {
    assert.deepEqual(
      flatten(math.parse('9*8*6+3+4')),
      opNode('+', [
        opNode('*', [constNode(9), constNode(8), constNode(6)]),
        constNode(3),
        constNode(4)]));
  });
  it('5*(2+3+2))*10', function () {
    assert.deepEqual(
      flatten(math.parse('5*(2+3+2)*10')),
      opNode('*', [
        constNode(5),
        parenNode(opNode('+', [constNode(2), constNode(3),constNode(2)])),
        constNode(10)]));
  });
  it('9x*8*6+3+4 keeps the polynomial term', function () {
    assert.deepEqual(
      flatten(math.parse('9x*8*6+3+4')),
      opNode('+', [
        opNode('*', [math.parse('9x'), constNode(8), constNode(6)]),
        constNode(3),
        constNode(4)]));
  });
  it('9x*8*6+3y^2+4 keeps the polynomial terms', function () {
    assert.deepEqual(
      flatten(math.parse('9x*8*6+3y^2+4')),
      opNode('+', [
        opNode('*', [math.parse('9x'), constNode(8), constNode(6)]),
        math.parse('3y^2'),
        constNode(4)]));
  });
  it('2x ^ (2 + 1) * y not flattened', function () {
    assert.deepEqual(
      flatten(math.parse('2 x ^ (2 + 1) * y')),
      math.parse('2 x ^ (2 + 1) * y'));
  });
  it('2x ^ (2 + 1 + 2) * y flattens the addition', function () {
    assert.deepEqual(
      flatten(math.parse('2 x ^ (2 + 1 + 2) * y')),
      opNode('*', [
        opNode('*', [constNode(2),
          opNode('^', [symbolNode('x'), parenNode(
            opNode('+', [constNode(2), constNode(1), constNode(2)]))]),
          ], true),
        symbolNode('y')]));
  });
  it('3x*4x -> 3x * 4x', function () {
    assert.deepEqual(
      flatten(math.parse('3x*4x')),
      opNode('*', [math.parse('3x'), math.parse('4x')]));
  });
});

describe('flattens division', function () {
  it('2 * x / 4 * 6 groups x/4 and continues to flatten *', function () {
    assert.deepEqual(
      flatten(math.parse('2 * x / 4 * 6')),
      opNode('*', [constNode(2), math.parse('x/4'), constNode(6)]));
  });
  it('2*3/4/5*6 --> 2 * 3/4/5 * 6', function () {
    assert.deepEqual(
      flatten(math.parse('2*3/4/5*6')),
      opNode('*', [constNode(2), math.parse('3/4/5'), constNode(6)]));
  });
  it('no change for x / (4 * x) / 8', function () {
    assert.deepEqual(
      flatten(math.parse('x / (4 * x) / 8')),
      math.parse('x / (4 * x) / 8'));
  });
  it('2 x * 4 x / 8', function () {
    assert.deepEqual(
      flatten(math.parse('2 x * 4 x / 8')),
      opNode('*', [math.parse('2x'), opNode(
        '/', [math.parse('4x'), constNode(8)])]));
  });
});

describe('subtraction!', function () {
  it('1 + 2 - 3 - 4 + 5', function () {
    assert.deepEqual(
      flatten(math.parse('1 + 2 - 3 - 4 + 5')),
      opNode('+', [
        constNode(1), constNode(2), constNode(-3), constNode(-4), constNode(5)]));
  });
  it('x - 3', function () {
    assert.deepEqual(
      flatten(math.parse('x - 3')),
      opNode('+', [symbolNode('x'), constNode(-3)]));
  });
  it('x + 4 - (y+4)', function () {
    assert.deepEqual(
      flatten(math.parse('x + 4 - (y+4)')),
      opNode('+', [
        symbolNode('x'), constNode(4), math.parse('-(y+4)')]));
  });
});
