"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const NodeStatus = require('./NodeStatus');
const NodeCreator = require('./NodeCreator');
const MathChangeTypes = require('./MathChangeTypes');

// If we can do a simplify step (e.g. adding two terms, performing some
// arithmetic). Returns a NodeStatus object.
function simplifyOperationsDFS(node) {
  switch (node.type) {
      case 'ParenthesisNode':
        // The content has to be an OperatorNode(because of removeUncessaryParens)
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
        else {
          // recurse on each child of this node
          for (let i = 0; i < node.args.length; i++) {
            let argNodeStatus = simplifyOperationsDFS(node.args[i]);
            if (argNodeStatus.hasChanged) {
              node.args[i] = argNodeStatus.node;
              return new NodeStatus(node, true, argNodeStatus.changeType);
            }
          }
          return new NodeStatus(node);
        }

      case 'SymbolNode':
      case 'ConstantNode':
        // we can't simplify any further
        return new NodeStatus(node);

      default:
        throw Error("Unsupported node type: " + node.type);
  }
}

// Looks for a single step to perform on an operator node. If no steps can be
// taken, returns a NO_CHANGE NodeStatus object. Otherwise returns the updated
// node in a NodeStatus object.
function simplifyOperations(node) {
  const simplificationFunctions = [
    // Check if we can perform arithmetic on the operands
    performArithmetic,
    // If this is a * node and one of the operands is 1, get rid of the 1
    removeMultiplicationByOne,
    PolynomialTerm.combinePolynomialTerms,
    // If we have a constant times a polynomial term we can multiply them
    // together e.g. y * 3 -> 3y
    PolynomialTerm.multiplyConstantByPolynomialTerm,
    // Check if we can simplify division in a polynomial term e.g. 2x/4 -> x/2
    PolynomialTerm.simplifyPolynomialFraction,
    // Check for x^1 which should be reduced to x
    removeExponentByOne,
  ];

  for (let i = 0; i < simplificationFunctions.length; i++) {
    let nodeStatus = simplificationFunctions[i](node);
    if (nodeStatus.hasChanged) {
      return nodeStatus;
    }
  }

  return new NodeStatus(node);
}

// Performs arithmetic (e.g. 2+2 or 3*5*2) on an operation node.
// Returns a NodeStatus object.
function performArithmetic(node) {
  if (node.args && node.args.every(child => child.type === 'ConstantNode')) {
    let evaluatedValue = manualEval(node);
    // trim floating points
    // TODO: in the future, fractions might be better left as fractions
    // and not evaluated into floats, but that'll take a lot of support
    let trimmedEvaluatedValue = parseFloat(evaluatedValue.toFixed(5));
    let newNode = NodeCreator.constant(trimmedEvaluatedValue);
    return new NodeStatus(newNode, true, MathChangeTypes.SIMPLIFY_ARITHMETIC);
  }
  else {
    return new NodeStatus(node);
  }
}

// If `node` is a multiplication node with 1 as one of its operands,
// remove 1 from the operands list. Returns a NodeStatus object.
function removeMultiplicationByOne(node) {
  if (node.op === "*") {
    const i = node.args.findIndex(
      arg => arg.type === 'ConstantNode' && arg.value === "1");
    if (i >= 0) {
      // remove the 1 node
      node.args.splice(i, 1);
      // if there's only one operand left, move it up the tree
      if (node.args.length === 1) {
        node = node.args[0];
      }
      return new NodeStatus(node, true, MathChangeTypes.SIMPLIFY_ARITHMETIC);
    }
  }
  return new NodeStatus(node);
}

// If `node` is of the form x^1, reduces it to a node of the form x.
// Returns a NodeStatus object.
function removeExponentByOne(node) {
  if (node.op === "^" &&                      // exponent of
      node.args[0].type === 'SymbolNode' &&   // a symbol
      node.args[1].type === 'ConstantNode' && // to a constant
      node.args[1].value === "1") {           // of value 1
    let simplifiedNode = node.args[0];
    // Note: this is the only change type that gives insight into the exact
    // thing that changed instead of a general rule.
    // TODO: consider doing this for more of them.
    let changeType = node.args[0].name + "^1 -> " + node.args[0].name;
    return new NodeStatus(simplifiedNode, true, changeType);
  }
  return new NodeStatus(node);
}

// Evaluates a math expression to a constant, e.g. 3+4 -> 7
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

module.exports = simplifyOperationsDFS;
