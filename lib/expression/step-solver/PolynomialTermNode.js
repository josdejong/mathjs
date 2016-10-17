'use strict';

const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');

// For storing polynomial terms.
// Has a symbol (e.g. x), maybe an exponent, and maybe a coefficient.
// These expressions are of the form of a PolynomialTermNode: x^2, 2y, z, 3x/5
// These expressions are not: 4, x^(3+4), 2+x, 3*7, x-z
/* Fields:
 - coeff: either a constant node or a fraction of two constant nodes
   (might be null if no coefficient)
 - symbol: the node with the symbol (e.g. in x^2, the node x)
 - exponent: a node that can take any form, e.g. x^(2+x^2)
   (might be null if no exponent)
*/
class PolynomialTermNode {
  constructor(node) {
    if (NodeType.isOperator(node)) {
      if (node.op === '^') {
        const symbolNode = node.args[0];
        if (!NodeType.isSymbol(symbolNode)) {
          throw Error('Expected symbol term, got ' + symbolNode.toString());
        }
        this.symbol = symbolNode;
        this.exponent = node.args[1];
      }
      // it's '*' ie it has a coefficient
      else if (node.op === '*') {
        const coeffNode = node.args[0];
        if (!NodeType.isConstantOrConstantFraction(coeffNode)) {
          throw Error('Expected coefficient to be constant or fraction of ' +
            'constants term, got ' + coeffNode.toString());
        }
        this.coeff = coeffNode;
        const nonCoefficientTerm = new PolynomialTermNode(node.args[1]);
        if (nonCoefficientTerm.hasCoeff()) {
          throw Error('Cannot have two coefficients ' + coeffNode.toString() +
            ' and ' + nonCoefficientTerm.coeffNode().toString());
        }
        this.symbol = nonCoefficientTerm.symbolNode();
        this.exponent = nonCoefficientTerm.exponentNode();
      }
      // this means there's a fraction coefficient
      else if (node.op === '/') {
        const denominatorNode = node.args[1];
        if (!NodeType.isConstant(denominatorNode)) {
          throw Error('denominator must be constant node, instead of ' +
            denominatorNode.toString());
        }
        const numeratorNode = new PolynomialTermNode(node.args[0]);
        if (numeratorNode.hasFractionCoeff()) {
          throw Error('Polynomial terms cannot have nested fractions');
        }
        this.exponent = numeratorNode.exponentNode();
        this.symbol = numeratorNode.symbolNode();
        const numeratorConstantNode = numeratorNode.coeffNode(true);
        this.coeff = NodeCreator.operator(
          '/', [numeratorConstantNode, denominatorNode])
      }
      else {
        throw Error('Unsupported operatation for polynomial node: ' + node.op);
      }
    }
    else if (NodeType.isUnaryMinus(node)) {
      const polyNode = new PolynomialTermNode(node.args[0]);
      this.exponent = polyNode.exponentNode();
      this.symbol = polyNode.symbolNode();
      if (!polyNode.hasCoeff()) {
        this.coeff = NodeCreator.constant(-1);
      }
      else {
        this.coeff = negativeCoefficient(polyNode.coeffNode());
      }
    }
    else if (NodeType.isSymbol(node)) {
      this.symbol = node;
    }
    else {
      throw Error('Unsupported node type: ' + node.type);
    }
  }

  /* GETTER FUNCTIONS */
  symbolNode() {
    return this.symbol;
  }

  symbolName() {
    return this.symbol.name;
  }

  coeffNode(defaultOne=false) {
    if (!this.coeff && defaultOne) {
      return NodeCreator.constant(1);
    }
    else {
      return this.coeff;
    }
  }

  coeffValue() {
    if (this.coeff) {
      return this.coeff.eval();
    }
    else {
      return 1; // no coefficient is like a coeff of 1
    }
  }

  exponentNode(defaultOne=false) {
    if (!this.exponent && defaultOne) {
      return NodeCreator.constant(1);
    }
    else {
      return this.exponent;
    }
  }

  rootNode() {
    return NodeCreator.polynomialTerm(
      this.symbol, this.exponent, this.coeff);
  }

  // note: there is no exponent value getter function because the exponent
  // can be any expresion and not necessarily a number.

  /* CHECKER FUNCTIONS (returns true / false for certain conditions) */

  // Returns true if the coefficient is a fraction
  hasFractionCoeff() {
    // coeffNode is either a constant or a division operation.
    return this.coeff && NodeType.isOperator(this.coeff);
  }

  hasCoeff() {
    return !!this.coeff;
  }
}

// Returns if the node represents an expression that can be considered a term.
// e.g. x^2, 2y, z, 3x/5 are all terms. 4, 2+x, 3*7, x-z are all not terms.
// See the tests for some more thorough examples of exactly what counts and
// what does not.
PolynomialTermNode.isPolynomialTerm = function(node, debug=false) {
  try {
    new PolynomialTermNode(node); // will throw error if node isn't poly term
    return true;
  }
  catch (err) {
    if (debug) {
      console.log(err.message);
    }
    return false;
  }
}

// Multiplies `node`, a constant or fraction of two constant nodes, by -1
// Returns a node
function negativeCoefficient(node) {
  if (NodeType.isConstant(node)) {
    node = NodeCreator.constant(0 - parseFloat(node.value));
  }
  else {
    const numeratorValue = 0 - parseFloat(node.args[0].value);
    const numeratorNode = NodeCreator.constant(numeratorValue);
  }
  return node;
}

module.exports = PolynomialTermNode;
