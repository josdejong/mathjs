"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const likeTermCollector = require('./LikeTermCollector');
const MathResolveChecks = require('./MathResolveChecks');

// Remove parens around constant nodes
function removeUnnecessaryParens(nodeContext) {
  let node = nodeContext.expr;

  switch (node.type) {
    case 'OperatorNode':
      nodeContext.getContextsForChildren().forEach(
        child => removeUnnecessaryParens(child));
      // Sometimes, parens are around expressions that have been simplified
      // all they can be. If that expression is part of an addition
      // operation, we can remove the parenthesis.
      // e.g. (x+4) + (12+7) -> x+4 + 12+7
      if (node.op === '+') {
        node.args.forEach((child, i) => {
          if (child.type === 'ParenthesisNode' &&
              child.content.type === 'OperatorNode' &&
              !likeTermCollector.canCollectLikeTerms(child.content) &&
              !MathResolveChecks.resolvesToConstant(child.content) &&
              !PolynomialTerm.canCombinePolynomialTerms(child.content)) {
            // get rid of the parens
            node.args[i] = child.content;
          }
        });
      }
      break;
    // Parenthesis are uncessary when the content is a constant or also
    // a parenthesis node. Note that this means that the type of the content
    // of a ParenthesisNode should now always be an OperatorNode. If that
    // changes, things might break!
    case 'ParenthesisNode':
      switch (node.content.type) {
        // If there is an operation within the parens, then the parens are
        // likely needed. So, recurse.
        case 'OperatorNode':
          // [0] because nodeContext (a paren node) has only one child
          removeUnnecessaryParens(nodeContext.getContextsForChildren()[0]);
          // exponent nodes don't need parens around them
          if (node.content.op === "^") {
            nodeContext.replaceNode(node.content);
          }
          break;
        // If the content is also parens, we have doubly nested parens. First
        // recurse on the child node, then set the current node equal to its child
        // to get rid of the extra parens.
        case 'ParenthesisNode':
          // [0] because nodeContext (a paren node) has only one child
          removeUnnecessaryParens(nodeContext.getContextsForChildren()[0]);
          nodeContext.replaceNode(node.content);
          break;
        // If the content is just one symbol or constant, the parens are not
        // needed.
        case 'ConstantNode':
        case 'SymbolNode':
          nodeContext.replaceNode(node.content);
          break;
        default:
          throw Error("Unsupported node type: " + node.type);
      }
      break;
    case 'ConstantNode':
    case 'SymbolNode':
      break;
    default:
      throw Error("Unsupported node type: " + node.type);
  }
}

module.exports = removeUnnecessaryParens;