'use strict'
// Operations on polynomial term nodes

const math = require('../../../index');
const MathResolveChecks = require('./MathResolveChecks');
const MathChangeTypes = require('./MathChangeTypes');
const NodeCreator = require('./NodeCreator');
const NodeStatus = require('./NodeStatus');
const NodeType = require('./NodeType');
const PolynomialTermNode = require('./PolynomialTermNode');

class PolynomialTermOperations {};

// Combines polynomial terms for an operation node of type + or *
// Returns a NodeStatus object.
PolynomialTermOperations.combinePolynomialTerms = function(node) {
  if (node.op === '+' && canAddLikeTermPolynomialNodes(node.args)) {
    const combinedNode = addlikeTermPolynomialNodes(node.args);
    return new NodeStatus(
      combinedNode, true, MathChangeTypes.ADD_POLYNOMIAL_TERMS);
  }
  else if (node.op === '*' && canMultiplyLikeTermPolynomialNodes(node.args)) {
    const combinedNode = multiplyLikeTermPolynomialNodes(node.args);
    return new NodeStatus(
      combinedNode, true, MathChangeTypes.MULT_POLYNOMIAL_TERMS);
  }
  else {
    return new NodeStatus(node);
  }
}

// Multiplies a constant node by a polynomial node and returns the result
// in a NodeStatus object. If the node's arguments aren't a constant and
// polynomial node, returns a NO_CHANGE NodeStatus object.
PolynomialTermOperations.multiplyConstantAndPolynomialTerm = function(node) {
  if (!canMultiplyConstantAndPolynomial(node)) {
    return new NodeStatus(node);
  }

  let constNode, polyNode;
  if (NodeType.isConstant(node.args[0])) {
    constNode = node.args[0];
    polyNode = new PolynomialTermNode(node.args[1]);
  }
  else {
    constNode = node.args[1];
    polyNode = new PolynomialTermNode(node.args[0]);
  }
  const exponentNode = polyNode.exponentNode();

  // If it already has a coefficient, make the coefficient a multiplication
  if (polyNode.hasCoeff()) {
    const oldCoeff = polyNode.coeffNode();
    const newCoeff = NodeCreator.operator('*', [constNode, oldCoeff]);
    const newNode = NodeCreator.polynomialTerm(
      polyNode.symbolNode(), exponentNode, newCoeff)
    return new NodeStatus(newNode, true, MathChangeTypes.MULT_POLY_BY_CONST);
  }
  // If there was no coefficient, the constant becomes the coefficient and
  // this doesn't count as a change.
  else {
    const newNode = NodeCreator.polynomialTerm(
      polyNode.symbolNode(), exponentNode, constNode);
    return new NodeStatus(newNode);
  }
}

// Multiplies a polynomial term by -1 and returns the new node
PolynomialTermOperations.negatePolynomialTerm = function(node) {
  if(!PolynomialTermNode.isPolynomialTerm(node)) {
    throw Error('node isn't a polynomial term');
  }
  const polyNode = new PolynomialTermNode(node);

  let newCoeff;
  if (!polyNode.hasCoeff()) {
    newCoeff = NodeCreator.constant(-1);
  }
  else {
    const oldCoeff = polyNode.coeffNode();
    if (polyNode.hasFractionCoeff()) {
      let numerator = oldCoeff.args[0];
      numerator = NodeCreator.constant(0 - parseFloat(numerator.value));
      const denominator = oldCoeff.args[1];
      newCoeff = NodeCreator.operator('/', [numerator, denominator]);
    }
    else {
      newCoeff = NodeCreator.constant(0 - parseFloat(oldCoeff.value));
    }
  }
  return NodeCreator.polynomialTerm(
    polyNode.symbolNode(), polyNode.exponentNode(), newCoeff);
}

// Simplifies a polynomial term with a fraction as its coefficients.
// e.g. 2x/4 --> x/2    10x/5 --> 2x
// Also simplified negative signs
// e.g. -y/-3 --> y/3   4x/-5 --> -4x/5
// returns the new simplified node in a NodeStatus object
PolynomialTermOperations.simplifyPolynomialFraction = function(node) {
  if (!canSimplifyPolynomialFraction(node)) {
    return new NodeStatus(node);
  }
  const polyNode = new PolynomialTermNode(node);
  const coefficientFraction = polyNode.coeffNode(); // a division node
  const numeratorCoeff = parseFloat(coefficientFraction.args[0].value);
  const denominatorCoeff = parseFloat(coefficientFraction.args[1].value);

  // The gcd is what we're dividing the numerator and denominator by.
  let gcd = math.gcd(numeratorCoeff, denominatorCoeff);
  // A greatest common denominator is technically defined as always positive,
  // but since our goal is to reduce negative signs or move them to the
  // numerator, a negative denominator always means we want to flip signs
  // of both numerator and denominator.
  // e.g. -y/-3 --> y/3   4x/-5 --> -4x/5
  if (denominatorCoeff < 0) {
    gcd *= -1;
  }

  const newNumeratorCoeff = NodeCreator.constant(numeratorCoeff/gcd);
  const newDenominatorCoeff = NodeCreator.constant(denominatorCoeff/gcd);
  let newCoeff;
  if (newDenominatorCoeff.value === '1') {
    if (newNumeratorCoeff.value === '1') {
      newCoeff = null;
    }
    else {
      newCoeff = newNumeratorCoeff;
    }
  }
  else {
    newCoeff = NodeCreator.operator(
      '/', [newNumeratorCoeff, newDenominatorCoeff]);
  }

  const exponentNode = polyNode.exponentNode();
  const simplifiedNode = NodeCreator.polynomialTerm(
      polyNode.symbolNode(), exponentNode, newCoeff);

  return new NodeStatus(simplifiedNode, true, MathChangeTypes.DIVIDE_POLY_TERM);
}

// Returns true if the node is an operation node with parameters that are
// polynomial terms that can be combined in some way.
PolynomialTermOperations.canCombinePolynomialTerms = function(node) {
  return ((node.op === '+' && canAddLikeTermPolynomialNodes(node.args)) ||
          (node.op === '*' && canMultiplyLikeTermPolynomialNodes(node.args)) ||
          canMultiplyConstantAndPolynomial(node));
}

// Adds a list of nodes that are polynomial terms. Returns a node.
function addlikeTermPolynomialNodes(nodes) {
  if (!canAddLikeTermPolynomialNodes(nodes)) {
    throw Error('Cannot add two polynomial terms of different types');
  }

  const polynomialTermList = nodes.map(n => new PolynomialTermNode(n));

  // add up the coefficients
  const coefficientList = polynomialTermList.map(p => p.coeffValue());
  const newCoefficientValue = coefficientList.reduce((a,b) => a+b, 0);
  const newCoefficientNode = NodeCreator.constant(newCoefficientValue);

  // Polynomial terms that can be added together must share the same symbol
  // name and exponent. Get that name and exponent from the first term
  const firstTerm = polynomialTermList[0];
  const exponentNode = firstTerm.exponentNode();
  const symbolNode = firstTerm.symbolNode();

  return NodeCreator.polynomialTerm(
    symbolNode, exponentNode, newCoefficientNode);
}

// Multiplies a list of nodes that are polynomial like terms. Returns a node.
// The polynomial nodes should *not* have coefficients. (multiplying
// coefficients is handled in collecting like terms for multiplication)
function multiplyLikeTermPolynomialNodes(nodes) {
  if (!canMultiplyLikeTermPolynomialNodes(nodes)) {
    throw Error('Cannot multiply like terms - terms are not alike');
  }
  const polynomialTermList = nodes.map(n => new PolynomialTermNode(n));

  // If we're multiplying polynomial nodes together, they all share the same
  // symbol. Get that from the first node.
  const symbolNode = polynomialTermList[0].symbolNode();

  // The new exponent will be a sum of exponents (an operation, wrapped in
  // parens) e.g. x^(3+4+5)
  const exponentNodeList = polynomialTermList.map(p => p.exponentNode(true));
  const newExponent = NodeCreator.parenthesis(
    NodeCreator.operator('+', exponentNodeList));
  return NodeCreator.polynomialTerm(symbolNode, newExponent, null);
}

// Returns true if the nodes are polynomial terms that can be added together.
function canAddLikeTermPolynomialNodes(nodes) {
  if (!nodes.every(n => PolynomialTermNode.isPolynomialTerm(n))) {
    return false;
  }
  if (nodes.length === 1) {
    return false;
  }

  const polynomialTermList = nodes.map(n => new PolynomialTermNode(n));

  // to add terms, they must have the same symbol name *and* exponent
  const firstTerm = polynomialTermList[0];
  const sharedSymbol = firstTerm.symbolName();
  const sharedExponentString = firstTerm.exponentNode(true).toString();

  const restTerms = polynomialTermList.slice(1);
  return restTerms.every(term => (
    sharedSymbol === term.symbolName() &&
    // TODO: how to do a check for equality of nodes?
    sharedExponentString === term.exponentNode(true).toString()));
}


// Returns true if the nodes are symbolic terms with the same symbol
// and no coefficients.
function canMultiplyLikeTermPolynomialNodes(nodes) {
  if (!nodes.every(n => PolynomialTermNode.isPolynomialTerm(n))) {
    return false;
  }
  if (nodes.length === 1) {
    return false;
  }

  const polynomialTermList = nodes.map(n => new PolynomialTermNode(n));
  if (!polynomialTermList.every(polyTerm => !polyTerm.hasCoeff())) {
    return false;
  }

  const firstTerm = polynomialTermList[0];
  const restTerms = polynomialTermList.slice(1);
  // they're considered like terms if they have the same symbol name
  return restTerms.every(term => firstTerm.symbolName() === term.symbolName());
}

// Returns true if the expression is a multiplication between a constant
// and polynomial without a coefficient.
function canMultiplyConstantAndPolynomial(node) {
  // implicit multiplication doesn't count as multiplication here, since it
  // represents a single term.
  if (node.op !== '*' || node.implicit) {
    return false;
  }
  if (node.args.length !== 2) {
    return false;
  }
  if (NodeType.isConstant(node.args[0])) {
    if (!PolynomialTermNode.isPolynomialTerm(node.args[1])) {
      return false;
    }
    else {
      const polyNode = new PolynomialTermNode(node.args[1]);
      return !polyNode.hasCoeff();
    }
  }
  else if (NodeType.isConstant(node.args[1])) {
    if (!PolynomialTermNode.isPolynomialTerm(node.args[0])) {
      return false;
    }
    else {
      const polyNode = new PolynomialTermNode(node.args[0]);
      return !polyNode.hasCoeff();
    }
  }
}

// Some polynomial terms have a fraction coefficient e.g. 2x/4
// This returns true if we can simplify that fraction.
// e.g. 2x/4 and 10x/5 return true, 4x/7 would return false
function canSimplifyPolynomialFraction (node) {
  if (!PolynomialTermNode.isPolynomialTerm(node)) {
    return false;
  }

  const polyNode = new PolynomialTermNode(node);
  if (!polyNode.hasFractionCoeff()) {
    return false;
  }

  const coefficientFraction = polyNode.coeffNode(); // a division node
  const numeratorCoeff = parseFloat(coefficientFraction.args[0].value);
  const denominatorCoeff = parseFloat(coefficientFraction.args[1].value);

  // simplifying a fraction includes simplifying negative signs.
  // e.g. -y/-3 can be simplified to y/3, 4x/-5 can be simplified to -4x/5
  // Note that -4x/5 doesn't need to be simplified.
  // Note that our goal is for the denominator to always be positive. If it
  // isn't, we can simplify signs.
  if (denominatorCoeff < 0) {
    return true;
  }

  return math.gcd(numeratorCoeff, denominatorCoeff) !== 1;
}

module.exports = PolynomialTermOperations;
