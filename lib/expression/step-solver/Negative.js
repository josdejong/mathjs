'use strict';

const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');

const Negative = {};

// Returns if the given node is negative. Treats a unary minus as a negative,
// as well as a negative constant value or a constant fraction that would
// evaluate to a negative number
Negative.isNegative = function(node) {
  if (NodeType.isUnaryMinus(node)) {
    return true;
  }
  else if (NodeType.isConstant(node)) {
    return parseFloat(node.value) < 0;
  }
  else if (NodeType.isConstantFraction(node)) {
    const numeratorValue = parseFloat(node.args[0].value);
    const denominatorValue = parseFloat(node.args[1].value);
    if (numeratorValue < 0 || denominatorValue < 0) {
      return !(numeratorValue < 0 && denominatorValue < 0);
    }
  }
}

Negative.negate = function(node) {
  if (NodeType.isUnaryMinus(node)) {
    return node.args[0];
  }

  return NodeCreator.unaryMinus(node);
}

module.exports = Negative;
