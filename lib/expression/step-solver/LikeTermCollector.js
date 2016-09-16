"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const NodeCreator = require('./NodeCreator');
const NodeStatus = require('./NodeStatus');
const MathChangeTypes = require('./MathChangeTypes');

const CONSTANT = 'constant';
const OTHER = 'other';

// Iterates through the tree looking for like terms to collect. Will prioritize
// deeper expressions. Returns a NodeStatus object.
function collectLikeTermsDFS(node) {
  let nodeStatus;

  switch (node.type) {
    case 'OperatorNode':
      // Try reducing any of the sub-expressions
      for(let i=0; i < node.args.length; i++) {
        nodeStatus = collectLikeTermsDFS(node.args[i]);
        if (nodeStatus.hasChanged) {
          node.args[i] = nodeStatus.node;
          return new NodeStatus(node, true, nodeStatus.changeType);
        }
      }
      // If they're all fully reduced, maybe this node can be simplified
     return collectLikeTerms(node);
    case 'ParenthesisNode':
      nodeStatus = collectLikeTermsDFS(node.content);
      return new NodeStatus(
        NodeCreator.parenthesis(nodeStatus.node),
        nodeStatus.hasChanged,
        nodeStatus.changeType)
    case 'SymbolNode':
    case 'ConstantNode':
      // we can't simplify this any further
      return new NodeStatus(node);
    default:
      throw Error("Unsupported node type: " + node.type);
  }
}

// Given an expression tree, returns true iff there are terms that can be
// collected
function canCollectLikeTerms(node) {
  // we can collect like terms through + or through *
  // TODO: allow - as well as +
  if (node.type !== 'OperatorNode' || (node.op !== "+" && node.op !== "*")) {
    return false;
  }

  const terms = (node.op === "+") ? getTermsForCollectingAddition(node) :
                                    getTermsForCollectingMultiplication(node);

  // Conditions we need to meet to decide to to reorganize (collect) the terms:
  // - more than 1 term type
  // - more than 1 of at least one type (not including other)
  // (note that this means x^2 + x + x + 2 -> x^2 + (x + x) + 2,
  //  which doesn't change the order of terms at all)
  const termTypes = Object.keys(terms)
  const termTypesMinusOther = termTypes.filter(x => x !== OTHER);
  return (termTypes.length > 1 &&
    termTypesMinusOther.some(x => terms[x].length > 1));
}

// Collects like terms for an operation node and returns a NodeStatus object.
function collectLikeTerms(node) {
  if (!canCollectLikeTerms(node)) {
    return new NodeStatus(node);
  }

  const op = node.op;
  let terms = [];
  if (op === "+") {
    terms = getTermsForCollectingAddition(node);
  } else {
    terms = getTermsForCollectingMultiplication(node);
  }

  // List the symbols alphabetically
  let termTypesSorted = Object.keys(terms).filter(
    x => (x !== CONSTANT && x !== OTHER)).sort(sortTerms);

  // Then add const
  if (terms[CONSTANT]) {
    // at the end for addition
    if (op === "+") {
      termTypesSorted.push(CONSTANT);
    }
    // for multipliation it should be at the front
    if (op === "*") {
      termTypesSorted.unshift(CONSTANT);
    }
  }

  // Collect the new operands under op.
  let newOperands = [];
  termTypesSorted.forEach(t => {
    if (terms[t].length === 1) {
      newOperands.push(terms[t][0]);
    }
    // Any like terms should be wrapped in parens.
    else {
      newOperands.push(NodeCreator.parenthesis(NodeCreator.operator(
        op, terms[t])));
    }
  });

  // then stick anything else (paren nodes, operator nodes) at the end
  if (terms[OTHER]) {
    newOperands = newOperands.concat(terms[OTHER]);
  }
  node.args = newOperands;
  return new NodeStatus(node, true, MathChangeTypes.COLLECT_LIKE_TERMS);
}

// Polynonmial terms are collected by categorizing them by their 'name'
// which is used to separate them into groups that can be combined. getTermName
// returns this group 'name'
function getTermName(node, op) {
  // we 'name' polynomial terms by their symbol name
  let termName = new PolynomialTerm(node).name;
  // in addition, the exponent matters too (e.g. 2x^2 + 5x^3 can't be combined)
  if (op === "+") {
    termName += "^" + new PolynomialTerm(node).exp.toString();
  }
  return termName;
}

// Adds `value` to a list in `dict`, creating a new list if the key isn't in
// the dictionary yet. Returns the updated dictionary.
function appendToListInDictionary(dict, key, value) {
  if (dict[key]) {
    dict[key].push(value);
  } else {
    dict[key] = [value];
  }
  return dict;
}

// Collects like terms in an addition expression tree into categories.
// Returns a dictionary of termname to lists of nodes with that name
// e.g. 2x + 4 + 5x would return {'x': [2x, 5x], CONSTANT: [4]}
function getTermsForCollectingAddition(node) {
  let terms = {};

  for(let i=0; i < node.args.length; i++) {
    let child = node.args[i];

    if (PolynomialTerm.isPolynomialTerm(child)) {
      const termName = getTermName(child, '+');
      terms = appendToListInDictionary(terms, termName, child);
    } else {
      switch(child.type) {
        case 'ConstantNode':
          appendToListInDictionary(terms, CONSTANT, child);
          break;
        case 'OperatorNode':
        case 'ParenthesisNode':
          appendToListInDictionary(terms, OTHER, child);
          break;
        default:
          // Note that we shouldn't get any symbol nodes in the switch statement
          // since they would have been handled by isPolynomialTerm
          throw Error("Unsupported node type: " + child.type);
      }
    }
  }
  return terms;
}

// Collects like terms in a multiplication expression tree into categories.
// For multiplication, polynomial terms with constants are separated into
// a symbolic term and a constant term.
// Returns a dictionary of termname to lists of nodes with that name
// e.g. 2x + 4 + 5x would return {'x': [x, x], CONSTANT: [2, 4, 5]}
function getTermsForCollectingMultiplication(node) {
  let terms = {};

  for(let i=0; i < node.args.length; i++) {
    let child = node.args[i];

    if (PolynomialTerm.isPolynomialTerm(child)) {
      const polyTerm = new PolynomialTerm(child);
      let termName = ""
      if (polyTerm.coeff === 1) {
        termName = getTermName(child, '*');
        terms = appendToListInDictionary(terms, termName, child);
      }
      // If there's a denominator, splitting the coeff is different
      else if (polyTerm.denominatorCoeff) {
        const coeffTerm = NodeCreator.constant(polyTerm.coeff);
        terms = appendToListInDictionary(terms, CONSTANT, coeffTerm);
        const numeratorTerm = child.args[0];
        const symbolicTerm = ((polyTerm.numeratorCoeff > 1) ?
          numeratorTerm.args[1] : numeratorTerm);
        termName = getTermName(symbolicTerm, '*');
        terms = appendToListInDictionary(terms, termName, symbolicTerm);
      }
      // otherwise it's just a coefficient > 1 and a symbolic term
      else {
        const coeffTerm = NodeCreator.constant(polyTerm.coeff);
        terms = appendToListInDictionary(terms, CONSTANT, coeffTerm);
        const symbolicTerm = child.args[1];
        termName = getTermName(symbolicTerm, '*');
        terms = appendToListInDictionary(terms, termName, symbolicTerm);
      }
    } else {
      switch(child.type) {
        case 'ConstantNode':
          terms = appendToListInDictionary(terms, CONSTANT, child);
          break;
        case 'OperatorNode':
        case 'ParenthesisNode':
          terms = appendToListInDictionary(terms, OTHER, child);
          break;
        default:
          // Note that we shouldn't get any symbol nodes in the switch statement
          // since they would have been handled by isPolynomialTerm
          throw Error("Unsupported node type: " + child.type);
      }
    }
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
    } else {
      return expA > expB ? -1 : 1;
    }
  }
}


module.exports = {
  canCollectLikeTerms,
  collectLikeTermsDFS,
}
