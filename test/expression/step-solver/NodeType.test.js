'use strict';

const assert = require('assert');
const math = require('../../../index');

const NodeType = require('../../../lib/expression/step-solver/NodeType.js');
const NodeCreator = require('../../../lib/expression/step-solver/NodeCreator.js');
let constNode = NodeCreator.constant;

describe('NodeType works', function () {
  it('(2+2) parenthesis', function () {
    assert.deepEqual(
      NodeType.isParenthesis(math.parse('(2+2)')),
      true);
  });
  it('10 constant', function () {
    assert.deepEqual(
      NodeType.isConstant(math.parse(10)),
      true);
  });
  it('-2 constant', function () {
    assert.deepEqual(
      NodeType.isConstant(constNode(-2)),
      true);
  });
  it('2+2 operator', function () {
    assert.deepEqual(
      NodeType.isOperator(math.parse('2+2')),
      true);
  });
  it('-x not operator', function () {
    assert.deepEqual(
      NodeType.isOperator(math.parse('-x')),
      false);
  });
  it('-x symbol', function () {
    assert.deepEqual(
      NodeType.isSymbol(math.parse('-x')),
      true);
  });
  it('y symbol', function () {
    assert.deepEqual(
      NodeType.isSymbol(math.parse('y')),
      true);
  });
});
