"use strict"
/*
  For determining the type of a mathJS node.
 */

const NodeType = {}

NodeType.operator = function(node) {
  return node.type === "OperatorNode" && node.fn !== "unaryMinus";
}

NodeType.parenthesis = function(node) {
  return node.type === "ParenthesisNode";
}

NodeType.unaryMinus = function(node) {
  return node.type === "OperatorNode" && node.fn === "unaryMinus";
}

NodeType.symbol = function(node, allowUnaryMinus=true) {
  if (node.type === "SymbolNode") {
    return true;
  }
  else if (allowUnaryMinus && NodeType.unaryMinus(node)) {
    return NodeType.symbol(node.args[0], false);
  }
  else {
    return false;
  }
}

NodeType.constant = function(node, allowUnaryMinus=false) {
  if (node.type === "ConstantNode") {
    return true;
  }
  else if (allowUnaryMinus && NodeType.unaryMinus(node)) {
    return NodeType.constant(node.args[0], false);
  }
  else {
    return false;
  }
}

module.exports = NodeType;
