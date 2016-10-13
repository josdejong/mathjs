'use strict';

const math = require('../../../index');

const Fraction = require('./Fraction');
const MathChangeTypes = require('./MathChangeTypes');
const NodeCreator = require('./NodeCreator');
const NodeStatus = require('./NodeStatus');
const NodeType = require('./NodeType');
const PolynomialTermNode = require('./PolynomialTermNode');
const Util = require('./Util');

const CONSTANT = 'constant';
const CONSTANT_FRACTION = 'constantFraction';
const OTHER = 'other';

const LikeTermCollector = {};

// Iterates through the tree looking for like terms to collect. Will prioritize
// deeper expressions. Returns a NodeStatus object.
LikeTermCollector.collectLikeTermsDFS = function(node) {
  let nodeStatus;

  if (NodeType.isOperator(node)) {
    // Try reducing any of the sub-expressions, to prioritize deeper
    // expressions
    for(let i = 0; i < node.args.length; i++) {
      nodeStatus = LikeTermCollector.collectLikeTermsDFS(node.args[i]);
      if (nodeStatus.hasChanged) {
        node.args[i] = nodeStatus.node;
        return new NodeStatus(node, true, nodeStatus.changeType);
      }
    }
    // If they're all fully reduced, maybe this node can be simplified
    return collectLikeTerms(node);
  }
  else if (NodeType.isParenthesis(node)) {
    nodeStatus = LikeTermCollector.collectLikeTermsDFS(node.content);
    node.content = nodeStatus.node;
    return new NodeStatus(
      node,
      nodeStatus.hasChanged,
      nodeStatus.changeType);
  }
  else if (NodeType.isSymbol(node) || NodeType.isConstant(node)) {
    // we can't simplify this any further
    return new NodeStatus(node);
  }
  else if (NodeType.isUnaryMinus(node)) {
    nodeStatus = LikeTermCollector.collectLikeTermsDFS(node.args[0]);
    node.args[0] = nodeStatus.node;
    return new NodeStatus(
      node,
      nodeStatus.hasChanged,
      nodeStatus.changeType);
  }
  else {
    throw Error('Unsupported node type: ' + node.type);
  }
}

// Given an expression tree, returns true if there are terms that can be
// collected
LikeTermCollector.canCollectLikeTerms = function(node) {
  // We can collect like terms through + or through *
  // Note that we never collect like terms with - or /, those expressions will
  // always be manipulated in flattenOperands so that the top level operation is
  // + or *.
  if (!(node.op === '+' || node.op === '*')) {
    return false;
  }

  let terms;
  if (node.op === '+') {
    terms = getTermsForCollectingAddition(node);
  }
  else if (node.op === '*') {
    terms = getTermsForCollectingMultiplication(node);
  }
  else {
    throw Error('Operation not supported: ' + node.op);
  }

  // Conditions we need to meet to decide to to reorganize (collect) the terms:
  // - more than 1 term type
  // - more than 1 of at least one type (not including other)
  // (note that this means x^2 + x + x + 2 -> x^2 + (x + x) + 2,
  // which will be recorded as a step, but doesn't change the order of terms)
  const termTypes = Object.keys(terms)
  const filteredTermTypes = termTypes.filter(x => x !== OTHER);
  return (termTypes.length > 1 &&
    filteredTermTypes.some(x => terms[x].length > 1));
}

// Collects like terms for an operation node and returns a NodeStatus object.
function collectLikeTerms(node) {
  if (!LikeTermCollector.canCollectLikeTerms(node)) {
    return new NodeStatus(node);
  }

  const op = node.op;
  let terms = [];
  if (op === '+') {
    terms = getTermsForCollectingAddition(node);
  }
  else if (op === '*') {
    terms = getTermsForCollectingMultiplication(node);
  }
  else {
    throw Error('Operation not supported: ' + op);
  }

  // List the symbols alphabetically
  let termTypesSorted = Object.keys(terms)
      .filter(x => (x !== CONSTANT && x !== CONSTANT_FRACTION && x !== OTHER))
      .sort(sortTerms);

  // Then add const
  if (terms[CONSTANT]) {
    // at the end for addition (since we'd expect x^2 + (x + x) + 4)
    if (op === '+') {
      termTypesSorted.push(CONSTANT);
    }
    // for multipliation it should be at the front (e.g. (3*4) * x^2)
    if (op === '*') {
      termTypesSorted.unshift(CONSTANT);
    }
  }
  if (terms[CONSTANT_FRACTION]) {
    termTypesSorted.push(CONSTANT_FRACTION);
  }

  // Collect the new operands under op.
  let newOperands = [];
  termTypesSorted.forEach(termType => {
    const termsOfType = terms[termType];
    if (termsOfType.length === 1) {
      newOperands.push(termsOfType[0]);
    }
    // Any like terms should be wrapped in parens.
    else {
      newOperands.push(NodeCreator.parenthesis(
        NodeCreator.operator(op, termsOfType)));
    }
  });

  // then stick anything else (paren nodes, operator nodes) at the end
  if (terms[OTHER]) {
    newOperands = newOperands.concat(terms[OTHER]);
  }

  node.args = newOperands;
  return new NodeStatus(node, true, MathChangeTypes.COLLECT_LIKE_TERMS);
}

// Polyonomial terms are collected by categorizing them by their 'name'
// which is used to separate them into groups that can be combined. getTermName
// returns this group 'name'
function getTermName(node, op) {
  const polyNode = new PolynomialTermNode(node);
  // we 'name' polynomial terms by their symbol name
  let termName = polyNode.symbolName();
  // when adding terms, the exponent matters too (e.g. 2x^2 + 5x^3 can't be combined)
  if (op === '+') {
    const exponent = polyNode.exponentNode(true).toString();
    termName += '^' + exponent;
  }
  return termName;
}

// Collects like terms in an addition expression tree into categories.
// Returns a dictionary of termname to lists of nodes with that name
// e.g. 2x + 4 + 5x would return {'x': [2x, 5x], CONSTANT: [4]}
// (where 2x, 5x, and 4 would actually be expression trees)
function getTermsForCollectingAddition(node) {
  let terms = {};

  for(let i = 0; i < node.args.length; i++) {
    let child = node.args[i];

    if (PolynomialTermNode.isPolynomialTerm(child)) {
      const termName = getTermName(child, '+');
      terms = Util.appendToArrayInObject(terms, termName, child);
    }
    else if (Fraction.isIntegerFraction(child)) {
      terms = Util.appendToArrayInObject(terms, CONSTANT_FRACTION, child);
    }
    else if (NodeType.isConstant(child)) {
      terms = Util.appendToArrayInObject(terms, CONSTANT, child);
    }
    else if (NodeType.isOperator(node) ||
             NodeType.isParenthesis(node) ||
             NodeType.isUnaryMinus(node)) {
      terms = Util.appendToArrayInObject(terms, OTHER, child);
    }
    else {
      // Note that we shouldn't get any symbol nodes in the switch statement
      // since they would have been handled by isPolynomialTerm
      throw Error('Unsupported node type: ' + child.type);
    }
  }
  // If there's exactly one constant and one fraction, we collect them
  // to add them together.
  // e.g. 2 + 1/3 + 5 would collect the constants (2+5) + 1/3
  // but 2 + 1/3 + x would collect (2 + 1/3) + x so we can add them together
  if (terms[CONSTANT] && terms[CONSTANT].length === 1 &&
     terms[CONSTANT_FRACTION] && terms[CONSTANT_FRACTION].length === 1) {
    const fraction = terms[CONSTANT_FRACTION][0];
    terms = Util.appendToArrayInObject(terms, CONSTANT, fraction);
    delete terms[CONSTANT_FRACTION];
  }

  return terms;
}

// Collects like terms in a multiplication expression tree into categories.
// For multiplication, polynomial terms with constants are separated into
// a symbolic term and a constant term.
// Returns a dictionary of termname to lists of nodes with that name
// e.g. 2x + 4 + 5x^2 would return {'x': [x, x^2], CONSTANT: [2, 4, 5]}
// (where x, x^2, 2, 4, and 5 would actually be expression trees)
function getTermsForCollectingMultiplication(node) {
  let terms = {};

  for(let i = 0; i < node.args.length; i++) {
    let child = node.args[i];

    if (NodeType.isUnaryMinus(child)) {
      terms = Util.appendToArrayInObject(
        terms, CONSTANT, NodeCreator.constant(-1));
      child = child.args[0];
    }
    if (PolynomialTermNode.isPolynomialTerm(child)) {
      terms = addToTermsforPolynomialMultiplication(terms, child);
    }
    else if (Fraction.isIntegerFraction(child)) {
      terms = Util.appendToArrayInObject(terms, CONSTANT, child);
    }
    else if (NodeType.isConstant(child)) {
      terms = Util.appendToArrayInObject(terms, CONSTANT, child);
    }
    else if (NodeType.isOperator(node) ||
             NodeType.isParenthesis(node) ||
             NodeType.isUnaryMinus(node)) {
      terms = Util.appendToArrayInObject(terms, OTHER, child);
    }
    else {
      // Note that we shouldn't get any symbol nodes in the switch statement
      // since they would have been handled by isPolynomialTerm
      throw Error('Unsupported node type: ' + child.type);
    }
  }
  return terms;
}

// A helper function for getTermsForCollectingMultiplication
// Polynomial terms need to be divided into their coefficient + symbolic parts.
// e.g. 2x^4 -> 2 (coeffient) and x^4 (symbolic, named after the symbol node)
// Takes the terms list and the polynomial term node, and returns an updated
// terms list.
function addToTermsforPolynomialMultiplication(terms, node) {
  const polyNode = new PolynomialTermNode(node);
  let termName, coeffTerm;

  if (!polyNode.hasCoeff()) {
    termName = getTermName(node, '*');
    terms = Util.appendToArrayInObject(terms, termName, node);
  }
  else {
    const coefficient = polyNode.coeffNode();
    let termWithoutCoefficient = polyNode.symbolNode();
    if (polyNode.exponentNode()) {
      termWithoutCoefficient = NodeCreator.operator(
        '^', [termWithoutCoefficient, polyNode.exponentNode()]);
    }

    terms = Util.appendToArrayInObject(terms, CONSTANT, coefficient);
    termName = getTermName(termWithoutCoefficient, '*');
    terms = Util.appendToArrayInObject(terms, termName, termWithoutCoefficient);
  }
  return terms;
}

// Sort function for termnames. Sort first by symbol name, and then by exponent.
function sortTerms(a, b) {
  if (a === b) {
    return 0;
  }
  // if no exponent, sort alphabetically
  if (a.indexOf('^') === -1) {
    return a < b ? -1 : 1;
  }
  // if exponent: sort by symbol, but then exponent decreasing
  else {
    const symbA = a.split('^')[0];
    const expA = a.split('^')[1];
    const symbB = b.split('^')[0];
    const expB = b.split('^')[1];
    if (symbA !== symbB) {
      return symbA < symbB ? -1 : 1;
    }
    else {
      return expA > expB ? -1 : 1;
    }
  }
}

module.exports = LikeTermCollector;
