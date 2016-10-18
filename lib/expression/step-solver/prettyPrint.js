'use strict';

const math = require('../../../index');

const Fraction = require('./Fraction');
const PolynomialTermNode = require('./PolynomialTermNode');
const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');

// Prints an expression node properly.
// If latex is true, will return latex, otherwise will return asciimath
// If showPlusMinus is true, print + - (e.g. 2 + -3)
// If it's false (the default) 2 + -3 would print as 2 - 3
// This supports the conversion of subtraction to addition of negative terms,
// which is needed to flatten operands.
function prettyPrint(node, latex=false, showPlusMinus=false) {
  let string = prettyPrintDFS(node);
  if (!showPlusMinus) {
    string = string.replace(/\s*?\+\s*?\-\s*?/g, ' - ');
  }

  if (latex) {
    // we parse our string and use the mathjs node TeX printer to get the latex
    string = math.parse(string).toTex();
    // remove unnecessary spaces created by the toTex function
    string = string.replace(/\s*?~\s*?/g, '');
  }
  return string
}

function prettyPrintDFS(node) {
  if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    // This is so we don't print 2/3 x^2 as 2 / 3x^2
    if (polyTerm.hasFractionCoeff()) {
      const coeffTerm = polyTerm.coeffNode();
      const coeffStr = prettyPrintDFS(coeffTerm);

      const nonCoeffTerm = NodeCreator.polynomialTerm(
        polyTerm.symbol, polyTerm.exponent, null)
      const nonCoeffStr = prettyPrintDFS(nonCoeffTerm);

      return `${coeffStr} ${nonCoeffStr}`;
    }
  }
  if (Fraction.isIntegerFraction(node)) {
    return `${node.args[0]}/${node.args[1]}`
  }
  if (NodeType.isOperator(node)) {
    let str = prettyPrintDFS(node.args[0]);
    for (let i = 1; i < node.args.length; i++) {
      switch (node.op) {
        case '*':
          if (node.implicit) {
            break;
          }
        case '+':
        case '-':
          // add space between operator and operands
          str += ` ${node.op} `;
          break;
        case '/':
          // no space for constant fraction divisions (slightly easier to read)
          if (NodeType.isConstantFraction(node)) {
            str += `${node.op}`;
          }
          else {
            str += ` ${node.op} `;
          }
          break;
        case '^':
          // no space for exponents
          str += `${node.op}`;
          break;
      }
      str += prettyPrintDFS(node.args[i]);
    }
    return str;
  }
  else if (NodeType.isParenthesis(node)) {
    return `(${prettyPrintDFS(node.content)})`;
  }
  else {
    return node.toString();
  }
}

module.exports = prettyPrint;
