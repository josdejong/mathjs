'use strict';

const NodeType = require('./NodeType');

const MathResolveChecks = {};

// Returns true if the node is a constant or can eventually be resolved to
// a constant.
// e.g. 2, 2+4, (2+4)^2 would all return true. x + 4 would return false
MathResolveChecks.resolvesToConstant = function(node) {
  if (NodeType.isOperator(node)) {
    return node.args.every(
      (child) => MathResolveChecks.resolvesToConstant(child));
  }
  else if (NodeType.isParenthesis(node)) {
    return MathResolveChecks.resolvesToConstant(node.content);
  }
  else if (NodeType.isConstant(node, true)) {
    return true;
  }
  else if (NodeType.isSymbol(node)) {
    return false;
  }
  else if (NodeType.isUnaryMinus(node)) {
    return MathResolveChecks.resolvesToConstant(node.args[0]);
  }
  else {
    throw Error('Unsupported node type: ' + node.type);
  }
};

module.exports = MathResolveChecks;
