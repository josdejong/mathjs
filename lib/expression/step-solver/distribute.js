'use strict'

const MathChangeTypes = require('./MathChangeTypes');
const NodeCreator = require('./NodeCreator');
const NodeStatus = require('./NodeStatus');
const NodeType = require('./NodeType');
const PolynomialTermNode = require('./PolynomialTermNode');
const PolynomialTermOperations = require('./PolynomialTermOperations');

// Distributes through parenthesis.
// e.g. 2(x+3) -> (2*x + 2*3)
// e.g. -(x+5) -> (-x + -5)
// Returns a NodeStatus object.
function distributeDFS(node) {
  if (NodeType.isConstant(node) || NodeType.isSymbol(node)) {
    return new NodeStatus(node);
  }
  else if (NodeType.isUnaryMinus(node)) {
    // recurse on the content first, to prioritize changes deeper in the tree
    const status = distributeDFS(node.args[0]);
    node.args[0] = status.node;
    if (status.hasChanged) {
      return new NodeStatus(node, status.hasChanged, status.changeType);
    }
    else {
      return distributeUnaryMinus(node);
    }
  }
  else if (NodeType.isOperator(node)) {
    // recurse on the children first, to prioritize changes deeper in the tree
    for (let i = 0; i < node.args.length; i++) {
      const child = node.args[i];
      const childNodeStatus = distributeDFS(child);
      if (childNodeStatus.hasChanged) {
        node.args[i] = childNodeStatus.node;
        return new NodeStatus(node, true, childNodeStatus.changeType);
      }
    }
    return distributeOperation(node);
  }
  else if (NodeType.isParenthesis(node)) {
    const contentNodeStatus = distributeDFS(node.content);
    node.content = contentNodeStatus.node;
    return new NodeStatus(
      node, contentNodeStatus.hasChanged, contentNodeStatus.changeType);
  }
  else {
    throw Error('Unsupported node type for : ' + node);
  }
}

// Distributes unary minus into a parenthesis node.
// e.g. -(4*9*x^2) --> (-4 * 9  * x^2)
// e.g. -(x + y - 5) --> (-x + -y + 5)
// Returns a NodeStatus object.
function distributeUnaryMinus(node) {
  if (!NodeType.isUnaryMinus(node)) {
    return new NodeStatus(node);
  }
  const unaryContent = node.args[0];
  if (!NodeType.isParenthesis(unaryContent)) {
    return new NodeStatus(node);
  }
  const content = unaryContent.content;
  if (!NodeType.isOperator(content)) {
    return new NodeStatus(node);
  }
  // For multiplication and division, we can push the unary minus in to
  // the first argument.
  // e.g. -(2/3) -> (-2/3)    -(4*9*x^2) --> (-4 * 9  * x^2)
  if (content.op === '*' || content.op === '/') {
    content.args[0] = multiplyByMinusOne(content.args[0]);
    const newNode = NodeCreator.parenthesis(content);
    return new NodeStatus(newNode, true, MathChangeTypes.DISTRIBUTE_NEG_ONE);
  }
  else if (content.op === '+') {
    // Now we know `node` is of the form -(x + y + ...).
    // We want to now return (-x + -y + ....)
    const newArgs = content.args.map(multiplyByMinusOne);
    content.args = newArgs;
    const newNode = NodeCreator.parenthesis(content);
    return new NodeStatus(newNode, true, MathChangeTypes.DISTRIBUTE_NEG_ONE);
  }
  else {
    return new NodeStatus(node);
  }
}

// Distributes a pair of terms in a multiplication operation, if a pair
// can be distributed. To be distributed, there must be two terms beside
// each other, and at least one of them must be a parenthesis node.
// e.g. 2*(3+x) or (4+x^2+x^3)*(x+3)
// Returns a NodeStatus object.
function distributeOperation(node) {
  if (!NodeType.isOperator(node) || node.op !== '*') {
    return new NodeStatus(node);
  }
  for (let i = 0; i+1 < node.args.length; i++) {
    const firstArg = node.args[i];
    const secondArg = node.args[i+1];
    if (isParenthesisOfAddition(firstArg) ||
        isParenthesisOfAddition(secondArg)) {
      const combinedNode = distributeTwoNodes(firstArg, secondArg);
      if (node.args.length > 2) {
        let newArgs = node.args;
        // remove the two args that were combined and replace with the new arg
        newArgs.splice(i, 2, combinedNode);
        node.args = newArgs;
      }
      else {
        node = combinedNode;
      }
      return new NodeStatus(node, true, MathChangeTypes.DISTRIBUTE);
    }
  }
  return new NodeStatus(node);
}

// Distributes two nodes together. At least one node must be parenthesis node
// e.g. 2*(x+3) -> (2*x + 2*3)       (5+x)*x -> 5*x + x*x
// e.g. (5+x)*(x+3) -> (5*x + 5*3 + x*x + x*3)
function distributeTwoNodes(firstNode, secondNode) {
  // lists of terms we'll be multiplying together from each node
  let firstArgs, secondArgs;
  if (isParenthesisOfAddition(firstNode)) {
    firstArgs = firstNode.content.args;
  }
  else {
    firstArgs = [firstNode];
  }

  if (isParenthesisOfAddition(secondNode)) {
    secondArgs = secondNode.content.args;
  }
  else {
    secondArgs = [secondNode];
  }
  // the new operands under addition, now products of terms
  let newArgs = [];

  // e.g. (4+x)(x+y+z) will become 4(x+y+z) + x(x+y+z) as an intermediate
  // step.
  if (firstArgs.length > 1 && secondArgs.length > 1) {
    firstArgs.forEach(leftArg => {
      newArgs.push(NodeCreator.operator('*', [leftArg, secondNode]));
    });
  }
  else {
    // a list of all pairs of nodes between the two arg lists
    firstArgs.forEach(leftArg => {
      secondArgs.forEach(rightArg => {
        newArgs.push(NodeCreator.operator('*', [leftArg, rightArg]));
      });
    });
  }
  return NodeCreator.parenthesis(NodeCreator.operator('+', newArgs));
}

// returns true if `node` is of the type (node + node + ...)
function isParenthesisOfAddition(node) {
  if (!NodeType.isParenthesis(node)) {
    return false;
  }
  const content = node.content;
  return NodeType.isOperator(content) && content.op === '+';
}

// Negates a node and returns the new node.
function multiplyByMinusOne(node) {
  if (PolynomialTermNode.isPolynomialTerm(node)) {
    return PolynomialTermOperations.negatePolynomialTerm(node);
  }
  else if (NodeType.isConstant(node)) {
    return NodeCreator.constant(0 - parseFloat(node.value));
  }
  else if (NodeType.isUnaryMinus(node)) {
    return node.args[0];
  }
  else {
    return NodeCreator.unaryMinus(node);
  }
}

module.exports = distributeDFS;
