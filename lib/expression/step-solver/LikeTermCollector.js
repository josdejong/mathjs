"use strict"

const math = require('../../../index');
const PolynomialTerm = require('./PolynomialTerm');
const NodeCreator = require('./NodeCreator');
const MathChangeTypes = require('./MathChangeTypes');

const CONSTANT = 'constant';
const OTHER = 'other';

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

// Collects like terms in an expression tree into their categories.
// Returns a dictionary of termname to lists of nodes with that name
// e.g. 2x + 4 + 5x would return {'x': [2x, 5x], CONSTANT: [4]}
function getTermsForCollecting(node) {
  const op = node.op;
  let terms = {};

  for(let i=0; i < node.args.length; i++) {
    let child = node.args[i];

    if (PolynomialTerm.isPolynomialTerm(child)) {
      const termName = getTermName(child, op);
      if (terms[termName]) {
        terms[termName].push(child);
      } else {
        terms[termName] = [child];
      }
    } else {
      switch(child.type) {
        case 'ConstantNode':
          if (terms[CONSTANT]) {
            terms[CONSTANT].push(child);
          } else terms[CONSTANT] = [child];
          break;
        case 'OperatorNode':
        case 'ParenthesisNode':
          if (terms[OTHER]) {
            terms[OTHER].push(child);
          } else {
            terms[OTHER] = [child];
          }
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

// Sort function for termnames. Sort first by symbol name, and then by exponent
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

// Mutates node by collecting like terms, doesn't return anything.
function collectLikeTerms(node) {
  if (!canCollectLikeTerms(node)) {
    throw Error("Cant collect like terms");
  }
  const op = node.op;
  const terms = getTermsForCollecting(node);

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
}

// Given an expression tree, returns true iff there are terms that can be
// collected
function canCollectLikeTerms(node) {
  // we can collect like terms through + or through *
  // TODO: allow - as well as +
  if (node.type !== 'OperatorNode' || (node.op !== "+" && node.op !== "*")) {
    return false;
  }

  const terms = getTermsForCollecting(node);

  // Conditions we need to meet to decide to to reorganize (collect) the terms:
  // - more than 1 term type (not including other)
  // - more than 1 of at least one type (not including other)
  // (note that this means x^2 + x + x + 2 -> x^2 + (x + x) + 2)
  const termTypes = Object.keys(terms).filter(x => x !== OTHER);
  return (termTypes.length > 1 && termTypes.some(x => terms[x].length > 1));
}

// Iterates through the tree looking for like terms to collect. Will prioritize
// deeper expressions. Returns a RootNode object.
function collectLikeTermsDFS(rootNodeObj, node) {
  switch (node.type) {
      case 'OperatorNode':
        // Try reducing any of the sub-expressions
        for(let i=0; i < node.args.length; i++) {
          let ret = collectLikeTermsDFS(rootNodeObj, node.args[i]);
          if (ret.hasChanged) {
            return ret;
          }
        }

        // If they're all fully reduced, maybe this node can be simplified
        if (canCollectLikeTerms(node)) {
          collectLikeTerms(node);
          rootNodeObj.hasChanged = true;
          rootNodeObj.changeType = MathChangeTypes.COLLECT_LIKE_TERMS;
        }
        return rootNodeObj;
      case 'ParenthesisNode':
        return collectLikeTermsDFS(rootNodeObj, node.content);
      case 'SymbolNode':
      case 'ConstantNode':
        // we can't simplify this any further
        break;
      default:
        throw Error("Unsupported node type: " + node.type);
  }

  rootNodeObj.hasChanged = false;
  return rootNodeObj;
}

module.exports = {
  canCollectLikeTerms,
  collectLikeTermsDFS,
}
