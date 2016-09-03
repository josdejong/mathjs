"use strict"

const assert = require('assert');
const math = require('../../../index');
const flatten = require('../../../lib/expression/step-solver/flattenOps.js');

// to create nodes, for testing
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

describe('flatten ops', function () {
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
  it('3x*4x -> 3x * 4x', function () {
    console.log(flatten(math.parse('3x*4x')).toString());

    assert.deepEqual(opNode('*', [
      math.parse('3x'), math.parse('4x')]),
      flatten(math.parse('3x*4x')));
  });
});
