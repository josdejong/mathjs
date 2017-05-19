'use strict';

const NodeType = require('./NodeType');

function hasUnsupportedNodes(node) {
  if (NodeType.isParenthesis(node)) {
    return hasUnsupportedNodes(node.content);
  }
  else if (NodeType.isUnaryMinus(node)) {
    return hasUnsupportedNodes(node.args[0]);
  }
  else if (NodeType.isOperator(node)) {
    return node.args.some(hasUnsupportedNodes);
  }
  else if (NodeType.isSymbol(node) || NodeType.isConstant(node)) {
    return false;
  }
  else {
    return true;
  }
}

module.exports = hasUnsupportedNodes;
