'use strict';

const assert = require('assert');
const math = require('../../../index');

const removeUnnecessaryParens = require('../../../lib/expression/step-solver/removeUnnecessaryParens.js');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');
const NodeCreator = require('../../../lib/expression/step-solver/NodeCreator.js');

// to create nodes, for testing
let opNode = NodeCreator.operator;

describe('removeUnnecessaryParens', function () {
  it('(x+4) + 12 -> x + 4 + 12', function () {
    assert.deepEqual(
      removeUnnecessaryParens(math.parse('(x+4) + 12')).node,
      opNode('+', [math.parse('x+4'), math.parse('12')]));
  });
  it('-(x+4x) + 12 no change', function () {
    assert.deepEqual(
      removeUnnecessaryParens(math.parse('-(x+4x) + 12')).node,
      math.parse('-(x+4x) + 12'));
  });
  it('x + (12) -> x + 12', function () {
    assert.deepEqual(
      removeUnnecessaryParens(math.parse('x + (12)')).node,
      math.parse('x + 12'));
  });
  it('x + (y) -> x + y', function () {
    assert.deepEqual(
      removeUnnecessaryParens(math.parse('x + (y)')).node,
      math.parse('x + y'));
  });
  it('x + -(y) -> x + y', function () {
    assert.deepEqual(
      removeUnnecessaryParens(math.parse('x + -(y)')).node,
      flatten(math.parse('x + -y')));
  });
  it('((3 - 5)) * x -> (3 - 5) * x', function () {
    assert.deepEqual(
      removeUnnecessaryParens(math.parse('((3 - 5)) * x')).node,
      math.parse('(3 - 5) * x'));
  });
  it('((3 - 5)) * x -> (3 - 5) * x', function () {
    assert.deepEqual(
      removeUnnecessaryParens(math.parse('((3 - 5)) * x')).node,
      math.parse('(3 - 5) * x'));
  });
  it('(((-5))) -> -5', function () {
    assert.deepEqual(
      removeUnnecessaryParens(flatten(math.parse('(((-5)))'))).node,
      flatten(math.parse('-5')));
  });
  it('((4+5)) + ((2^3)) -> (4+5) + 2^3 ', function () {
    assert.deepEqual(
      removeUnnecessaryParens(math.parse('((4+5)) + ((2^3))')).node,
      math.parse('(4+5) + 2^3'));
  });
});
