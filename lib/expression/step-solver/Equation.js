'use strict';

const math = require('../../../index');

const flatten = require('./flattenOperands.js');
const prettyPrint = require('./prettyPrint');

// This represents an equation, made up of the leftNode (LHS), the rightNode (RHS)
// and a comparator (most often =)
class Equation {
  constructor(leftNode, rightNode, comparator) {
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.comparator = comparator;
  }
};

// given an equation string, splits the string on the give comparator and
// returns a new Equation object from the left and right hand sides
Equation.createEquationFromString = function(str, comparator) {
  const nodes = str.split(comparator);
  if (nodes.length !== 2) {
    throw Error("Expected two sides of an equation using comparator: " + comparator)
  }
  const leftNode = flatten(math.parse(nodes[0]));
  const rightNode = flatten(math.parse(nodes[1]));

  return new Equation(leftNode, rightNode, comparator);
}

// Prints an Equation properly using the prettyPrint module
Equation.prettyPrintEquation = function(equation, showPlusMinus=false) {
  let leftSide = prettyPrint(equation.leftNode, showPlusMinus);
  let rightSide = prettyPrint(equation.rightNode, showPlusMinus);
  return leftSide + ' ' + equation.comparator + ' ' + rightSide;
}

module.exports = Equation;
