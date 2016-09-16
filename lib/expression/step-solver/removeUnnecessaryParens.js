"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const likeTermCollector = require('./LikeTermCollector');
const MathResolveChecks = require('./MathResolveChecks');
const MathChangeTypes = require('./MathChangeTypes');
const NodeStatus = require('./NodeStatus');

// Removes any parenthesis around nodes that can't be resolved further, if
// it doesn't change the value of the expression. Returns a NodeStatus object
// NOTE: after this function is called, every parenthesis node in the
// tree should always have an operator node as its child.
function removeUnnecessaryParens(node) {
  switch (node.type) {
    case 'OperatorNode':
      return removeUnnecessaryParensInOperatorNode(node);
    case 'ParenthesisNode':
      return removeUnnecessaryParensInParenthesisNode(node);
    case 'ConstantNode':
    case 'SymbolNode':
      return new NodeStatus(node);
    default:
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
  // e.g. (x+4) + (12+7) -> x+4 + 12+7
  if (node.op === '+') {
    node.args.forEach((child, i) => {
      if (child.type === 'ParenthesisNode' &&
          child.content.type === 'OperatorNode' &&
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
      node, hasChanged, MathChangeTypes.REMOVE_PARENS_GENERAL);
  } else {
    return new NodeStatus(node);
  }
}

// Parenthesis are uncessary when the content is a constant or also
// a parenthesis node. Note that this means that the type of the content
// of a ParenthesisNode after this step should now always be an OperatorNode.
// If that changes, things might break!
// Returns a NodeStatus object.
function removeUnnecessaryParensInParenthesisNode(node) {
  let nodeStatus = new NodeStatus(node);
  let hasChanged = false;
  switch (node.content.type) {
    // If there is an operation within the parens, then the parens are
    // likely needed. So, recurse.
    case 'OperatorNode':
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
      break;
    // If the content is also parens, we have doubly nested parens. First
    // recurse on the child node, then set the current node equal to its child
    // to get rid of the extra parens.
    case 'ParenthesisNode':
      nodeStatus = removeUnnecessaryParens(node.content);
      node = nodeStatus.node;
      hasChanged = true;
      break;
    // If the content is just one symbol or constant, the parens are not
    // needed.
    case 'ConstantNode':
    case 'SymbolNode':
      node = node.content;
      hasChanged = true;
      break;
    default:
      throw Error("Unsupported node type: " + nodeContext.expr.type);
  }
  if (hasChanged) {
    return new NodeStatus(node, true, MathChangeTypes.REMOVE_PARENS_GENERAL);
  } else {
    return new NodeStatus(node);
  }
}

// Returns true if any of the collect or combine steps can be applied to the
// expression tree `node`.
function canCollectOrCombine(node) {
  return likeTermCollector.canCollectLikeTerms(node) ||
    MathResolveChecks.resolvesToConstant(node) ||
    PolynomialTerm.canCombinePolynomialTerms(node);
}

module.exports = removeUnnecessaryParens;
