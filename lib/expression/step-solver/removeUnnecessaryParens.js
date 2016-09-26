"use strict"

const math = require('../../../index');

const PolynomialTerm = require('./PolynomialTerm');
const LikeTermCollector = require('./LikeTermCollector');
const MathResolveChecks = require('./MathResolveChecks');
const MathChangeTypes = require('./MathChangeTypes');
const NodeStatus = require('./NodeStatus');
const NodeType = require('./NodeType');

// Removes any parenthesis around nodes that can't be resolved further, if
// it doesn't change the value of the expression. Returns a NodeStatus object.
// NOTE: after this function is called, every parenthesis node in the
// tree should always have an operator node as its child.
function removeUnnecessaryParens(node) {
  if (NodeType.operator(node)) {
    return removeUnnecessaryParensInOperatorNode(node);
  }
  else if (NodeType.parenthesis(node)) {
    return removeUnnecessaryParensInParenthesisNode(node);
  }
  else if (NodeType.constant(node, true) || NodeType.symbol(node)) {
    return new NodeStatus(node);
  }
  else if (NodeType.unaryMinus(node)) {
    const content = node.args[0];
    let status = removeUnnecessaryParens(content);
    node.args[0] = status.node;
    return new NodeStatus(
      node, true, status.changeType);
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
    nodeStatus = removeUnnecessaryParens(child);
    node.args[i] = nodeStatus.node;
    hasChanged = hasChanged || nodeStatus.hasChanged;
  });

  // Sometimes, parens are around expressions that have been simplified
  // all they can be. If that expression is part of an addition
  // operation, we can remove the parenthesis.
  // e.g. (x+4) + 12 -> x+4 + 12
  if (node.op === '+') {
    node.args.forEach((child, i) => {
      if (NodeType.parenthesis(child) &&
          NodeType.operator(child.content) &&
          !canCollectOrCombine(child.content)) {
        // get rid of the parens by replacing the child node (in its args list)
        // with its content
        node.args[i] = child.content;
        hasChanged = true;
      }
    });
  }

  if (hasChanged) {
    return new NodeStatus(
      node, hasChanged, MathChangeTypes.REMOVE_PARENS);
  } else {
    return new NodeStatus(node);
  }
}

// Parentheses are unnecessary when their content is a constant e.g. (2)
// or also a parenthesis node, e.g. ((2+3)) - this removes those parentheses.
// Note that this means that the type of the content of a ParenthesisNode after
// this step should now always be an OperatorNode. If that changes, things
// might break!
// Returns a NodeStatus object.
function removeUnnecessaryParensInParenthesisNode(node) {
  let nodeStatus;
  let hasChanged = false;

  // polynoimals terms can be complex trees (e.g. 3x^2/5) but don't need parens
  // around them
  if (PolynomialTerm.isPolynomialTerm(node.content)) {
    // also remove any unecessary parens within the term (e.g. the exponent
    // might have parens around it)
    if (node.content.args) {
      node.content.args.forEach((arg, i) => {
        node.content.args[i] = removeUnnecessaryParens(arg).node;
      });
    }
    hasChanged = true;
    node = node.content;
  }

  // If there is an operation within the parens, then the parens are
  // likely needed. So, recurse.
  else if (NodeType.operator(node.content)) {
    nodeStatus = removeUnnecessaryParens(node.content);
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
  else if (NodeType.parenthesis(node.content)) {
    nodeStatus = removeUnnecessaryParens(node.content);
    node = nodeStatus.node;
    hasChanged = true;
  }
  // If the content is just one symbol or constant, the parens are not
  // needed.
  else if (NodeType.constant(node.content, true) || NodeType.symbol(node.content)) {
    node = node.content;
    hasChanged = true;
  } else {
    throw Error("Unsupported node type: " + node.type);
  }

  if (hasChanged) {
    return new NodeStatus(node, true, MathChangeTypes.REMOVE_PARENS);
  } else {
    return new NodeStatus(node);
  }
}

// Returns true if any of the collect or combine steps can be applied to the
// expression tree `node`.
function canCollectOrCombine(node) {
  return LikeTermCollector.canCollectLikeTerms(node) ||
    MathResolveChecks.resolvesToConstant(node) ||
    PolynomialTerm.canCombinePolynomialTerms(node);
}

module.exports = removeUnnecessaryParens;
