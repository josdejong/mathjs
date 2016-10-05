"use strict"

const math = require('../../../index');

const LikeTermCollector = require('./LikeTermCollector');
const MathResolveChecks = require('./MathResolveChecks');
const MathChangeTypes = require('./MathChangeTypes');
const NodeStatus = require('./NodeStatus');
const NodeType = require('./NodeType');
const PolynomialTermOperations = require('./PolynomialTermOperations');
const PolynomialTermNode = require('./PolynomialTermNode');

// Removes any parenthesis around nodes that can't be resolved further.
// Input must be a top level expression.
// Returns a NodeStatus object.
// TODO: Right now, we don't use the status of this operation and never count
// removing parens as a step. Consider returning a node like flattenOperands.
function removeUnnecessaryParens(node, rootNode=false) {
  // Parens that wrap everything are redundant.
  // NOTE: removeUnnecessaryParensDFS recursively removes parens that aren't
  // needed, while this step only applies to the very top level expression.
  // e.g. (2 + 3) * 4 can't become 2 + 3 * 4, but if (2 + 3) as a top level
  // expression can become 2 + 3
  if (rootNode) {
    while (NodeType.isParenthesis(node)) {
      node = node.content;
    }
  }
  return removeUnnecessaryParensDFS(node);
}

// Recursively moves parenthesis around nodes that can't be resolved further if
// it doesn't change the value of the expression. Returns a NodeStatus object.
// NOTE: after this function is called, every parenthesis node in the
// tree should always have an operator node or unary minus as its child.
function removeUnnecessaryParensDFS(node) {
  if (NodeType.isOperator(node)) {
    return removeUnnecessaryParensInOperatorNode(node);
  }
  else if (NodeType.isParenthesis(node)) {
    return removeUnnecessaryParensInParenthesisNode(node);
  }
  else if (NodeType.isConstant(node, true) || NodeType.isSymbol(node)) {
    return new NodeStatus(node);
  }
  else if (NodeType.isUnaryMinus(node)) {
    const content = node.args[0];
    let status = removeUnnecessaryParensDFS(content);
    node.args[0] = status.node;
    return new NodeStatus(
      node, status.hasChanged, status.changeType);
  }
  else {
      throw Error("Unsupported node type: " + node.type);
  }
}

// Removes unncessary parens for each operator in an operator node, and removes
// unncessary parens around operators that can't be simplified further.
// Returns a NodeStatus object.
function removeUnnecessaryParensInOperatorNode(node) {
  let hasChanged = false;
  let nodeStatus;

  node.args.forEach((child, i) => {
    nodeStatus = removeUnnecessaryParensDFS(child);
    node.args[i] = nodeStatus.node;
    hasChanged = hasChanged || nodeStatus.hasChanged;
  });

  // Sometimes, parens are around expressions that have been simplified
  // all they can be. If that expression is part of an addition
  // operation, we can remove the parenthesis.
  // e.g. (x+4) + 12 -> x+4 + 12
  if (node.op === '+') {
    node.args.forEach((child, i) => {
      if (NodeType.isParenthesis(child) &&         // parenthesis surrounding
          NodeType.isOperator(child.content) &&    // an operation on operands
          !canCollectOrCombine(child.content)) { // that can't be combined
        // remove the parens by replacing the child node (in its args list)
        // with its content
        node.args[i] = child.content;
        hasChanged = true;
      }
    });
  }

  if (hasChanged) {
    return new NodeStatus(node, hasChanged, MathChangeTypes.REMOVE_PARENS);
  }
  else {
    return new NodeStatus(node);
  }
}

// Parentheses are unnecessary when their content is a constant e.g. (2)
// or also a parenthesis node, e.g. ((2+3)) - this removes those parentheses.
// Note that this means that the type of the content of a ParenthesisNode after
// this step should now always be an OperatorNode (including unary minus).
// Returns a NodeStatus object.
function removeUnnecessaryParensInParenthesisNode(node) {
  let nodeStatus;
  let hasChanged = false;

  // polynomials terms can be complex trees (e.g. 3x^2/5) but don't need parens
  // around them
  if (PolynomialTermNode.isPolynomialTerm(node.content)) {
    // also recurse to remove any unnecessary parens within the term
    // (e.g. the exponent might have parens around it)
    if (node.content.args) {
      node.content.args.forEach((arg, i) => {
        node.content.args[i] = removeUnnecessaryParensDFS(arg).node;
      });
    }
    hasChanged = true;
    node = node.content;
  }
  // If there is an operation within the parens, then the parens are
  // likely needed. So, recurse.
  else if (NodeType.isOperator(node.content)) {
    nodeStatus = removeUnnecessaryParensDFS(node.content);
    if (nodeStatus.hasChanged) {
      hasChanged = true;
      node.content = nodeStatus.node;
    }
    // exponent nodes don't need parens around them
    if (node.content.op === "^") {
      hasChanged = true;
      node = node.content;
    }
  }
  // If the content is also parens, we have doubly nested parens. First
  // recurse on the child node, then set the current node equal to its child
  // to get rid of the extra parens.
  else if (NodeType.isParenthesis(node.content)) {
    nodeStatus = removeUnnecessaryParensDFS(node.content);
    node = nodeStatus.node;
    hasChanged = true;
  }
  // If the content is just one symbol or constant, the parens are not
  // needed.
  else if (NodeType.isConstant(node.content, true) ||
           NodeType.isSymbol(node.content)) {
    node = node.content;
    hasChanged = true;
  }
  else if (NodeType.isUnaryMinus(node.content)) {
    nodeStatus = removeUnnecessaryParensDFS(node.content);
    if (nodeStatus.hasChanged) {
      hasChanged = true;
      node.content = nodeStatus.node;
    }
  }
  else {
    throw Error("Unsupported node type: " + node.content.type);
  }

  if (hasChanged) {
    return new NodeStatus(node, true, MathChangeTypes.REMOVE_PARENS);
  }
  else {
    return new NodeStatus(node);
  }
}

// Returns true if any of the collect or combine steps can be applied to the
// expression tree `node`.
function canCollectOrCombine(node) {
  return LikeTermCollector.canCollectLikeTerms(node) ||
    MathResolveChecks.resolvesToConstant(node) ||
    PolynomialTermOperations.canCombinePolynomialTerms(node);
}

module.exports = removeUnnecessaryParens;
