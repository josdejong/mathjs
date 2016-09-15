"use strict"

const assert = require('assert');
const math = require('../../../index');
const flatten = require('../../../lib/expression/step-solver/flattenOps.js');
const NodeCreator = require('../../../lib/expression/step-solver/NodeCreator.js');


// to create nodes, for testing
let opNode = NodeCreator.operator;
let constNode = NodeCreator.constant;
let symbolNode = NodeCreator.symbol;
let parenNode = NodeCreator.parenthesis;

describe('flattens + and *', function () {
  it('2+2', function () {
    assert.deepEqual(math.parse('2+2'), flatten(math.parse('2+2')));
  });
  it('2+2+7', function () {
    assert.deepEqual(opNode('+', [constNode(2), constNode(2), constNode(7)]),
      flatten(math.parse('2+2+7')));
  });
  it('9*8*6+3+4', function () {
    assert.deepEqual(opNode('+', [
        opNode('*', [constNode(9), constNode(8), constNode(6)]),
        constNode(3),
        constNode(4)]),
      flatten(math.parse('9*8*6+3+4')));
  });
  it('5*(2+3+2))*10', function () {
    assert.deepEqual(opNode('*', [
        constNode(5),
        parenNode(opNode('+', [constNode(2), constNode(3),constNode(2)])),
        constNode(10)]),
      flatten(math.parse('5*(2+3+2)*10')));
  });
  it('9x*8*6+3+4 keeps the polynomial term', function () {
    assert.deepEqual(opNode('+', [
        opNode('*', [math.parse('9x'), constNode(8), constNode(6)]),
        constNode(3),
        constNode(4)]),
      flatten(math.parse('9x*8*6+3+4')));
  });
  it('9x*8*6+3y^2+4 keeps the polynomial terms', function () {
    assert.deepEqual(opNode('+', [
        opNode('*', [math.parse('9x'), constNode(8), constNode(6)]),
        math.parse('3y^2'),
        constNode(4)]),
      flatten(math.parse('9x*8*6+3y^2+4')));
  });
  it('2x ^ (2 + 1) * y not flattened', function () {
    assert.deepEqual(math.parse('2 x ^ (2 + 1) * y'),
      flatten(math.parse('2 x ^ (2 + 1) * y')));
  });
  it('2x ^ (2 + 1 + 2) * y flattens the addition', function () {
    assert.deepEqual(
      opNode('*', [
        opNode('*', [constNode(2),
          opNode('^', [symbolNode('x'), parenNode(opNode('+', [constNode(2), constNode(1), constNode(2)]))]),
          ], true),
        symbolNode('y')]),
     flatten(math.parse('2 x ^ (2 + 1 + 2) * y')));
  });
  it('3x*4x -> 3x * 4x', function () {
    assert.deepEqual(opNode('*', [
      math.parse('3x'), math.parse('4x')]),
      flatten(math.parse('3x*4x')));
  });
});

describe('flattens division', function () {
  it('2/3/4/5 --> 2/(3*4*5)', function () {
    assert.deepEqual(
      opNode('/', [constNode(2), opNode('*', [constNode(3), constNode(4), constNode(5)])]),
      flatten(math.parse('2/3/4/5')));
  });
  it('2 * x / 4 * 6 groups x/4 and continues to flatten *', function () {
    assert.deepEqual(
      opNode('*', [constNode(2), math.parse('x/4'), constNode(6)]),
      flatten(math.parse('2 * x / 4 * 6')));
  });
  it('2 x * 4 x / 8', function () {
    assert.deepEqual(
      opNode('*', [math.parse('2x'), opNode('/', [math.parse('4x'), constNode(8)])]),
      flatten(math.parse('2 x * 4 x / 8')));
  });


});
