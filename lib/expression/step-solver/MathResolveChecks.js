"use strict"

const math = require('../../../index');
const NodeType = require('./NodeType');

const MathResolveChecks = {}

// Returns true if the node is a constant or can eventually be resolved to
// a constant.
// e.g. 2, 2+4, (2+4)^2 would all return true. x + 4 would return false
MathResolveChecks.resolvesToConstant = function(node) {
  if (NodeType.operator(node)) {
    return node.args.every(
      (child) => MathResolveChecks.resolvesToConstant(child));
  }
  else if (NodeType.parenthesis(node)) {
    return MathResolveChecks.resolvesToConstant(node.content);
  }
  else if (NodeType.constant(node)) {
    return true;
  }
  else if (NodeType.symbol(node)) {
    return false;
  }
  else if (NodeType.unaryMinus(node)) {
    return MathResolveChecks.resolvesToConstant(node.args[0]);
  }
  else {
    throw Error("Unsupported node type: " + node.type);
  }
  return false;
}

module.exports = MathResolveChecks;
