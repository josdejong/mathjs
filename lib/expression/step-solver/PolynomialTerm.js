'use strict'

const math = require('../../../index');
const MathResolveChecks = require('./MathResolveChecks');
const NodeCreator = require('./NodeCreator');
const NodeStatus = require('./NodeStatus');
const NodeType = require('./NodeType');
const MathChangeTypes = require('./MathChangeTypes');

// For storing polynomial terms and performing operations on them.
// Has a name, an exponent, and a coefficient. Note that this doesn't include
// constants.
// These expressions can be translated into a PolynomialTerm: x^2, 2y, z, 3x/5
// These expressions would not: 4, x^(3+4), 2+x, 3*7, x-z
class PolynomialTerm {
  constructor(node) {
    if (!PolynomialTerm.isPolynomialTerm(node)) {
     throw Error('PolynomialTerm constructor called with a node that is not' +
                 ' a polynomial term.');
    }

    // Default values
    this.numeratorCoeff = 0;   // for fraction coefficients, the value on top
    this.denominatorCoeff = 0; // for fraction coefficients, the bottom value
    this.coeff = 1;            // the coefficient (might not be an integer)
    this.exp = 1;              // the exponent

    if (NodeType.isOperator(node)) {
      if (node.op === '^') {
        const symbolTerm = node.args[0];
        const exponentTerm = node.args[1];
        // TODO: support exponents that aren't constants, too
        this.name = symbolTerm.name;
        this.exp = parseFloat(exponentTerm.value);
      }
      // it's '*' ie it has a coefficient
      else if (node.op === '*') {
        this.coeff = parseFloat(node.args[0].value);
        const nonCoefficientTerm = new PolynomialTerm(node.args[1]);
        this.name = nonCoefficientTerm.name;
        this.exp = nonCoefficientTerm.exp;
      }
      // this means there's a fraction coefficient
      else if (node.op === '/') {
        this.denominatorCoeff = parseFloat(node.args[1].value);
        const numeratorTerm = new PolynomialTerm(node.args[0]);
        this.exp = numeratorTerm.exp;
        this.name = numeratorTerm.name;
        this.numeratorCoeff = numeratorTerm.coeff;
        this.coeff = this.numeratorCoeff/this.denominatorCoeff;
      }
      else {
        throw Error('Unsupported operatation for polynomial term: ' + node.op);
      }
    }
    else if (NodeType.isUnaryMinus(node) &&
             PolynomialTerm.isPolynomialTerm(node.args[0], false)) {
      const polyTerm = new PolynomialTerm(node.args[0]);
      this.coeff = -1;
      this.exp = polyTerm.exp;
      this.name = polyTerm.name;
    }
    else if (NodeType.isSymbol(node)) {
      this.name = node.name;
    }
    else {
      throw Error('Unsupported node type: ' + node.type);
    }
  }
  hasFractionCoeff() {
    return this.numeratorCoeff && this.denominatorCoeff;
  }
}

// Returns if the node represents an expression that can be considered a term.
// e.g. x^2, 2y, z, 3x/5 are all terms. 4, 2+x, 3*7, x-z are all not terms.
// If allowCoeff is false, 2y or 2z^2 would return false
PolynomialTerm.isPolynomialTerm = function(node, allowCoeff = true,
                                                 onlyConstantExponent = true) {
  if (NodeType.isOperator(node)) {
    if (node.op === '^') {
      if (!NodeType.isSymbol(node.args[0])) {
        return false;
      }
      const exponentNode = node.args[1];
      if (onlyConstantExponent) {
        return NodeType.isConstant(exponentNode);
      }
      else {
        return MathResolveChecks.resolvesToConstant(exponentNode);
      }
    }
    if (node.op === '*') {
      return (allowCoeff &&
              node.implicit &&
              NodeType.isConstant(node.args[0]) && // the coefficient
              PolynomialTerm.isPolynomialTerm(node.args[1], false));
    }
    else if (node.op === '/') {
      return (allowCoeff &&
              NodeType.isConstant(node.args[1]) && // the denominator
              PolynomialTerm.isPolynomialTerm(node.args[0]));
    }
    return false;
  }
  // this like a coefficient of -1
  else if (NodeType.isUnaryMinus(node)) {
    return (allowCoeff &&
      PolynomialTerm.isPolynomialTerm(node.args[0], false));
  }
  else if (NodeType.isParenthesis(node) || NodeType.isConstant(node)) {
    return false;
  }
  else if (NodeType.isSymbol(node)) {
    return true;
  }
  else {
    throw Error('Unsupported node type: ' + node.type);
  }
}

// Combines polynomial terms for an operation node of type + or *
// Returns a NodeStatus object.
PolynomialTerm.combinePolynomialTerms = function(node) {
  if (node.op === '+' && canAddLikeTermPolynomialNodes(node.args)) {
    let combinedNode = addlikeTermPolynomialNodes(node.args);
    return new NodeStatus(
      combinedNode, true, MathChangeTypes.ADD_POLYNOMIAL_TERMS);
  }
  else if (node.op === '*' && canMultiplyLikeTermPolynomialNodes(node.args)) {
    let combinedNode = multiplyLikeTermPolynomialNodes(node.args);
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
PolynomialTerm.multiplyConstantAndPolynomialTerm = function(node) {
  if (!canMultiplyConstantAndPolynomial(node)) {
    return new NodeStatus(node);
  }

  let constNode, polyNode, newNode;
  if (NodeType.isConstant(node.args[0])) {
    constNode = node.args[0];
    polyNode = node.args[1];
  }
  else {
    constNode = node.args[1];
    polyNode = node.args[0];
  }

  // If it already has a coefficient, multiply that by the constant
  if (polynomialTermHasCoefficient(polyNode)) {
    const oldCoeffValue = parseFloat(polyNode.args[0].value);
    const symbolNode = polyNode.args[1]; // the term without its coefficient
    const constNodeValue = parseFloat(constNode.value);
    const newCoeffNode = NodeCreator.constant(oldCoeff * constNodeValue);
    newNode = NodeCreator.operator('*', [newCoeffNode, symbolNode], true);
    return new NodeStatus(newNode, true, MathChangeTypes.MULT_POLY_BY_CONST);
  }
  // If there was no coefficient, the constant becomes the coefficient and
  // this doesn't count as a change.
  else {
    newNode = NodeCreator.operator('*', [constNode, polyNode], true);
    return new NodeStatus(newNode);
  }

}

// Simplifies a polynomial term with a fraction as its coefficients.
// e.g. 2x/4 --> x/2    10x/5 --> 2x
// Also simplified negative signs
// e.g. -y/-3 --> y/3   4x/-5 --> -4x/5
// returns the new simplified node in a NodeStatus object
PolynomialTerm.simplifyPolynomialFraction = function(node) {
  if (!canSimplifyPolynomialFraction(node)) {
    return new NodeStatus(node);
  }
  const polyTerm = new PolynomialTerm(node);
  // The gcd is what we're dividing the numerator and denominator by.
  let gcd = math.gcd(polyTerm.numeratorCoeff, polyTerm.denominatorCoeff);
  // A greatest common denominator is technically defined as always positive,
  // but since our goal is to reduce negative signs or move them to the
  // numerator, a negative denominator always means we want to flip signs
  // of both numerator and denominator.
  // e.g. -y/-3 --> y/3   4x/-5 --> -4x/5
  if (polyTerm.denominatorCoeff < 0) {
    gcd *= -1;
  }

  // update the constant in the numerator term
  const newNumeratorCoeff = polyTerm.numeratorCoeff/gcd;
  // the first operand of a division node is what comes before the / symbol
  // ie the numerator (e.g. for 2x/4 the numeratorTerm is 2x)
  let numeratorTerm = node.args[0];
  if (newNumeratorCoeff === 1) {
    // If the new numerator coefficient is 1 and the original numerator term
    // had a unary minus, we can get rid of its coefficient (make it 1) by
    // removing the unary minus.
    if (NodeType.isUnaryMinus(numeratorTerm)) {
      numeratorTerm = numeratorTerm.args[0];
    }
    // otherwise numeratorTerm will have two args. numeratorTerm.args[0] is the
    // coefficient, which is multiplied by numeratorTerm.args[1], the symbol
    // part. This will get rid of the coefficient constant, since it's 1 now.
    // e.g. 2x/4 --> gcd is 2 --> new numerator coefficient is 2/2 = 1
    // --> numerator term is just x (not 1x)
    else {
      numeratorTerm = numeratorTerm.args[1];
    }
  }
  else if (newNumeratorCoeff === -1) {
    // if there was a coefficient before
    if (numeratorTerm.args) {
      numeratorTerm = NodeCreator.unaryMinus(numeratorTerm.args[1]);
    }
    // possible if the term if is just x
    else {
      numeratorTerm = NodeCreator.unaryMinus(numeratorTerm);
    }
  }
  else {
    // If the new coefficient isn't 1, replace the old coefficient
    numeratorTerm.args[0] = NodeCreator.constant(newNumeratorCoeff);
  }
  const newDenominatorCoeff = polyTerm.denominatorCoeff/gcd;

  let simplifiedNode;
  if (newDenominatorCoeff === 1) {
    simplifiedNode = numeratorTerm;
  }
  else {
    simplifiedNode = NodeCreator.operator('/', [
      numeratorTerm,
      NodeCreator.constant(newDenominatorCoeff)
    ]);
  }
  return new NodeStatus(simplifiedNode, true, MathChangeTypes.DIVIDE_POLY_TERM);
}

// Returns true if the node is an operation node with parameters that are
// polynomial terms that can be combined in some way.
PolynomialTerm.canCombinePolynomialTerms = function(node) {
  return ((node.op === '+' && canAddLikeTermPolynomialNodes(node.args)) ||
          (node.op === '*' && canMultiplyLikeTermPolynomialNodes(node.args)) ||
          canMultiplyConstantAndPolynomial(node));
}

// Adds a list of nodes that are polynomial terms. Returns a node.
function addlikeTermPolynomialNodes(nodes) {
  if (!canAddLikeTermPolynomialNodes(nodes)) {
    throw Error("Can't add two polynomial terms of different types");
  }

  // add up the coefficients
  const coefficientList = nodes.map(n => {
    let p = new PolynomialTerm(n);
    return p.coeff;
  });
  const newCoefficient = coefficientList.reduce((a,b) => a+b, 0);

  // Polynomial terms that can be added together must share the same symbol
  // name and exponent. Get that name and exponent from the first term
  const firstTerm = new PolynomialTerm(nodes[0]);
  const exponent = firstTerm.exp;
  const name = firstTerm.name;

  // if the exponent is 1, that means there's no exponent
  if (exponent === 1) {
    return NodeCreator.operator('*',
      [NodeCreator.constant(newCoefficient), NodeCreator.symbol(name)], true);
  }
  else {
    const coefficientNode =  NodeCreator.constant(newCoefficient);
    const symbolNode = NodeCreator.operator('^', [
        NodeCreator.symbol(name),
        NodeCreator.constant(exponent)]);
    return NodeCreator.operator('*', [coefficientNode, symbolNode], true);
  }
}

// Multiplies a list of nodes that are polynomial like terms. Returns a node.
// The polynomial nodes should *not* have coefficients. (multiplying
// coefficients is handled in collecting like terms for multiplication)
function multiplyLikeTermPolynomialNodes(nodes) {
  if (!canMultiplyLikeTermPolynomialNodes(nodes)) {
    throw Error("Can't multiply like terms - terms are not alike");
  }

  // If we're multiplying polynomial nodes together, they all share the same
  // symbol name. Get that name from the first node.
  const termName = new PolynomialTerm(nodes[0]).name;

  // The new exponent will be a sum of exponents (an operation, wrapped in
  // parens) e.g. x^(3+4+5)
  const exponentNodeList = nodes.map(n => { // map exponents to constant nodes
      let p = new PolynomialTerm(n);
      return NodeCreator.constant(p.exp);
    });
  const newExponent = NodeCreator.parenthesis(
    NodeCreator.operator('+', exponentNodeList));
  return NodeCreator.operator('^', [NodeCreator.symbol(termName), newExponent]);
}

// Returns true if the nodes are polynomial terms that can be added together.
function canAddLikeTermPolynomialNodes(nodes) {
  if (!nodes.every(n => PolynomialTerm.isPolynomialTerm(n))) {
    return false;
  }
  if (nodes.length === 1) {
    return false;
  }

  const firstTerm = new PolynomialTerm(nodes[0]);
  const restTerms = nodes.slice(1).map(n => new PolynomialTerm(n));
  // to add terms, they must have the same symbol name *and* exponent degree
  const shareNameAndExponent = restTerms.every(term => {
    return firstTerm.name === term.name && firstTerm.exp === term.exp;
  });
  return shareNameAndExponent;
}

// Returns true if the nodes are symbolic terms with the same symbol
// and no coefficients.
function canMultiplyLikeTermPolynomialNodes(nodes) {
  if (!nodes.every(n => PolynomialTerm.isPolynomialTerm(n))) {
    return false;
  }
  if (nodes.length === 1) {
    return false;
  }
  const polynomialTerms = nodes.map(n => new PolynomialTerm(n));
  // all coefficients must be 1 (ie there's no coefficient term)
  if (!polynomialTerms.every(polyTerm => polyTerm.coeff === 1)) {
    return false;
  }

  const firstTerm = polynomialTerms[0];
  const restTerms = polynomialTerms.slice(1);
  // they're considered like terms if they have the same symbol name
  return restTerms.every(term => firstTerm.name === term.name);
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
  return ((PolynomialTerm.isPolynomialTerm(node.args[0], false) &&
            NodeType.isConstant(node.args[1])) ||
          (PolynomialTerm.isPolynomialTerm(node.args[1], false) &&
            NodeType.isConstant(node.args[0])));
}

// Returns true if polyNode is a node that represents a polynomial term
// and has a coefficent node.
function polynomialTermHasCoefficient(polyNode) {
  return PolynomialTerm.isPolynomialTerm(polyNode) &&
    polyNode.op === '*';
}

// Some polynomial terms have a fraction coefficient e.g. 2x/4
// This returns true if we can simplify that fraction.
// e.g. 2x/4 and 10x/5 return true, 4x/7 would return false
function canSimplifyPolynomialFraction (node) {
  if (!PolynomialTerm.isPolynomialTerm(node)) {
    return false;
  }
  const polyTerm = new PolynomialTerm(node);
  if (!(polyTerm.numeratorCoeff && polyTerm.denominatorCoeff)) {
    return false;
  }
  // simplifying a fraction includes simplifying negative signs.
  // e.g. -y/-3 can be simplified to y/3, 4x/-5 can be simplified to -4x/5
  // Note that -4x/5 doesn't need to be simplified.
  // Note that our goal is for the denominator to always be positive. If it
  // isn't, we can simplify signs.
  if (polyTerm.denominatorCoeff < 0) {
    return true;
  }

  return math.gcd(polyTerm.numeratorCoeff, polyTerm.denominatorCoeff) !== 1;
}

module.exports = PolynomialTerm;
