"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const likeTermCollector = require('./LikeTermCollector');
const MathResolveChecks = require('./MathResolveChecks');

// Returns true if any of the collect or combine steps can be applied to the
// expression tree `node`.
function canCollectOrCombine(node) {
  return likeTermCollector.canCollectLikeTerms(node) ||
    MathResolveChecks.resolvesToConstant(node) ||
    PolynomialTerm.canCombinePolynomialTerms(node);
}

// Removes unncessary parens for each operator in an operator node, and removes
// unncessary parens around operators that can't be simplified further.
function removeUnnecessaryParensOperatorNode(nodeContext) {
  nodeContext.getContextsForChildren().forEach(
    child => removeUnnecessaryParens(child));
  // Sometimes, parens are around expressions that have been simplified
  // all they can be. If that expression is part of an addition
  // operation, we can remove the parenthesis.
  // e.g. (x+4) + (12+7) -> x+4 + 12+7
  if (nodeContext.expr.op === '+') {
    nodeContext.getContextsForChildren().forEach((child, i) => {
      if (child.expr.type === 'ParenthesisNode' &&
          child.expr.content.type === 'OperatorNode' &&
          !canCollectOrCombine(child.expr.content)) {
        // get rid of the parens by replacing the node with its content
        child.replaceNode(child.expr.content);
      }
    });
  }
}

// Parenthesis are uncessary when the content is a constant or also
// a parenthesis node. Note that this means that the type of the content
// of a ParenthesisNode after this step should now always be an OperatorNode.
// If that changes, things might break!
function removeUnnecessaryParensParenthesisNode(nodeContext) {
  const content = nodeContext.expr.content;
  switch (content.type) {
    // If there is an operation within the parens, then the parens are
    // likely needed. So, recurse.
    case 'OperatorNode':
      // [0] because nodeContext (a paren node) has only one child
      removeUnnecessaryParens(nodeContext.getContextsForChildren()[0]);
      // exponent nodes don't need parens around them
      if (content.op === "^") {
        nodeContext.replaceNode(content);
      }
      break;
    // If the content is also parens, we have doubly nested parens. First
    // recurse on the child node, then set the current node equal to its child
    // to get rid of the extra parens.
    case 'ParenthesisNode':
      // [0] because nodeContext (a paren node) has only one child
      removeUnnecessaryParens(nodeContext.getContextsForChildren()[0]);
      nodeContext.replaceNode(nodeContext.expr.content);
      break;
    // If the content is just one symbol or constant, the parens are not
    // needed.
    case 'ConstantNode':
    case 'SymbolNode':
      nodeContext.replaceNode(content);
      break;
    default:
      throw Error("Unsupported node type: " + nodeContext.expr.type);
  }
}


// Removes any parenthesis around nodes that can't be resolved further, if
// it doesn't change the value of the expression.
// Doesn't return anything. Mutates the expression tree passed in through its
// context. NOTE: after this function is called, every parenthesis node in the
// tree should always have an operator node as its child.
function removeUnnecessaryParens(nodeContext) {
  let node = nodeContext.expr;

  switch (node.type) {
    case 'OperatorNode':
      removeUnnecessaryParensOperatorNode(nodeContext);
      break;
    case 'ParenthesisNode':
      removeUnnecessaryParensParenthesisNode(nodeContext);
      break;
    case 'ConstantNode':
    case 'SymbolNode':
      break;
    default:
      throw Error("Unsupported node type: " + node.type);
  }
}

module.exports = removeUnnecessaryParens;