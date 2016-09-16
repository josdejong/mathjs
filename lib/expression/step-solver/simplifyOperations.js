"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const NodeStatus = require('./NodeStatus');
const NodeCreator = require('./NodeCreator');
const MathChangeTypes = require('./MathChangeTypes');

// TEMPORARY (hopefully) because apparently operations can only be evaluated
// if they have two arguments?? :(
function manualEval(node) {
  if (node.type === 'ParenthesisNode') {
    node = exp.content;
  }
  switch (node.op) {
    case '*':
      return node.args.map(x => parseFloat(x.value)).reduce(
        (prev, curr) => prev * curr);
    case '+':
      return node.args.map(x => parseFloat(x.value)).reduce(
        (prev, curr) => prev + curr);
    // these operations should only be done with two arguments
    default:
      return node.eval();
  }
}

// If we can do a simplify step (e.g. adding two terms, performing some
// arithmetic). Returns a NodeStatus object.
function simplifyOperationsDFS(node) {
  switch (node.type) {
      case 'ParenthesisNode':
        // The content has to be an OperatorNode
        // (because of removeUncessaryParens)
        let contentNodeStatus = simplifyOperations(node.content);
        if (contentNodeStatus.hasChanged) {
          // Note that we're returning the *content* which means the parens
          // have been removed.
          return contentNodeStatus;
        }
        return simplifyOperationsDFS(node.content);
      case 'OperatorNode':
        let nodeStatus = simplifyOperations(node);
        if (nodeStatus.hasChanged) {
          return nodeStatus;
        }
        for (let i = 0; i < node.args.length; i++) {
          let argNodeStatus = simplifyOperationsDFS(node.args[i]);
          if (argNodeStatus.hasChanged) {
            node.args[i] = argNodeStatus.node;
            return new NodeStatus(
              node,
              true,
              argNodeStatus.changeType);
          }
        }
        return new NodeStatus(node);
      case 'SymbolNode':
      case 'ConstantNode':
        // we can't simplify this any further
        return new NodeStatus(node);
      default:
        throw Error("Unsupported node type: " + node.type);
  }
}

// Looks for a single step to perform on an operator node. If no steps can be
// taken, returns a NO_CHANGE NodeStatus object. Otherwise returns the updated
// node in a NodeStatus object.
function simplifyOperations(node) {
  // Check if we can perform arithmetic on the operands
  if (node.args.every(child => child.type === 'ConstantNode')) {
    let evaluatedValue = manualEval(node);
    // trim floating points
    // TODO: in the future, fractions might be better left as fractions
    // and not evaluated into floats, but that'll take a lot of support
    let trimmedEvaluatedValue = parseFloat(evaluatedValue.toFixed(5));
    let newNode = NodeCreator.constant(trimmedEvaluatedValue);
    return new NodeStatus(newNode, true, MathChangeTypes.SIMPLIFY_ARITHMETIC);
  }

  // If this is a * node and one of the operands is 1, get rid of the 1
  if (node.op === "*") {
    const i = node.args.findIndex(
      arg => arg.type === 'ConstantNode' && arg.value === "1");
    if (i >= 0) {
      // remove the 1 node
      node.args.splice(i, 1);
      // if there's only one argument left, move it up the tree
      if (node.args.length === 1) {
        node = node.args[0];
      }
      return new nodeStatus(node, true, MathChangeTypes.SIMPLIFY_ARITHMETIC);
    }
    // TODO: when I move to its own function, return false here
  }

  let nodeStatus = PolynomialTerm.combinePolynomialTerms(node);
  if (nodeStatus.hasChanged) {
    return nodeStatus;
  }

  // If we have a constant times a polynomial term we can multiply them
  // together e.g. y * 3 -> 3y
  nodeStatus = PolynomialTerm.multiplyConstantByPolynomialTerm(node);
  if (nodeStatus.hasChanged) {
    return nodeStatus;
  }

  // Check if we can simplify division in a polynomial term e.g. 2x/4 -> x/2
  // TODO: do the checks inside the function instead of before calling it
  nodeStatus = PolynomialTerm.simplifyPolynomialFraction(node);
  if (nodeStatus.hasChanged) {
    return nodeStatus;
  }

  // Check for x^1 which should be reduced to x
  if (node.op === "^" &&
      node.args[0].type === 'SymbolNode' &&
      node.args[1].type === 'ConstantNode' &&
      node.args[1].value === "1") {
    let simplifiedNode = node.args[0];
    // Note: this is the only change type that gives insight into the exact
    // thing that changed instead of a general rule.
    // TODO: consider doing this for more of them.
    let changeType = node.args[0].name + "^1 -> " + node.args[0].name;
    return new NodeStatus(simplifiedNode, true, changeType);
  }

  return new NodeStatus(node);
}

module.exports = simplifyOperationsDFS;
