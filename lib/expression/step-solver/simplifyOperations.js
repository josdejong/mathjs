"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const NodeStatus = require('./NodeStatus');
const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');
const MathChangeTypes = require('./MathChangeTypes');

// If we can do a simplify step (e.g. adding two terms, performing some
// arithmetic). Returns a NodeStatus object.
function simplifyOperationsDFS(node) {
  if (NodeType.parenthesis(node)) {
    // Start with recursing, so we simplify deeper nodes first
    let contentNodeStatus = simplifyOperationsDFS(node.content);
    node.content = contentNodeStatus.node;
    return new NodeStatus(
      node, contentNodeStatus.hasChanged, contentNodeStatus.changeType);
  }
  else if (NodeType.unaryMinus(node)) {
    // Start with recursing, so we simplify deeper nodes first
    let contentNodeStatus = simplifyOperationsDFS(node.args[0]);
    node.args[0] = contentNodeStatus.node;
    return new NodeStatus(
      node, contentNodeStatus.hasChanged, contentNodeStatus.changeType);
  }
  else if (NodeType.operator(node)) {
    // Start with recursing on each child of this node, so we simplify
    // deeper nodes first.
    for (let i = 0; i < node.args.length; i++) {
      let argNodeStatus = simplifyOperationsDFS(node.args[i]);
      if (argNodeStatus.hasChanged) {
        node.args[i] = argNodeStatus.node;
        return new NodeStatus(node, true, argNodeStatus.changeType);
      }
    }
    // then try at this level
    return simplifyOperations(node);
  }
  else if (NodeType.symbol(node) || NodeType.constant(node)) {
    // we can't simplify any further
    return new NodeStatus(node);
  }
  else {
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
    // In some cases, remove multiplying by -1
    removeMultiplicationByMinusOne,
    // multiplication by 0 yields 0
    reduceMultiplicationByZero,
    PolynomialTerm.combinePolynomialTerms,
    // If we have a constant times a polynomial term we can multiply them
    // together e.g. y * 3 -> 3y
    PolynomialTerm.multiplyConstantAndPolynomialTerm,
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
  if (node.args && node.args.every(child => NodeType.constant(child))) {
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
      arg => NodeType.constant(arg) && arg.value === "1");
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

function reduceMultiplicationByZero(node) {
  if (node.op === "*") {
    const i = node.args.findIndex(
      arg => NodeType.constant(arg) && arg.value === "0");
    if (i >= 0) {
      // reduce to just the 0 node
      node = NodeCreator.constant(0)
      return new NodeStatus(node, true, MathChangeTypes.SIMPLIFY_ARITHMETIC);
    }
  }
  return new NodeStatus(node);
}

// If `node` is a multiplication node with -1 as one of its operands,
// and a non constant as the next operand, remove -1 from the operands
// list and make the next term have a unary minus.
// Returns a NodeStatus object.
function removeMultiplicationByMinusOne(node) {
  if (node.op === "*") {
    const i = node.args.findIndex(
      arg => NodeType.constant(arg) && arg.value === "-1");
    if (i < 0) {
      return new NodeStatus(node);
    }

    // the minus one might be added to this node
    let nodeToCombineIndex;

    // If it's the last term, maybe combine with the term before
    if (i + 1 === node.args.length) {
      nodeToCombineIndex = i-1;
    } else {
      nodeToCombineIndex = i+1;
    }

    let nodeToCombine = node.args[nodeToCombineIndex];

    // If it's a constant, those terms can be combined later.
    if (NodeType.constant(nodeToCombine)) {
      return new NodeStatus(node);
    }
    // Get rid of the -1
    else {
      // 2 unary minuses cancel out
      if (NodeType.unaryMinus(nodeToCombine)) {
        nodeToCombine = nodeToCombine.args[0];
      }
      else {
        nodeToCombine = NodeCreator.unaryMinus(nodeToCombine);
      }
      // replace the node next to -1 and remove -1
      node.args[nodeToCombineIndex] = nodeToCombine;
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
  if (node.op === "^" &&                 // exponent of
      NodeType.symbol(node.args[0]) &&   // a symbol
      NodeType.constant(node.args[1]) && // to a constant
      node.args[1].value === "1") {      // of value 1
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
  if (NodeType.parenthesis(node)) {
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
