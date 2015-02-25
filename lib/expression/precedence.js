'use strict'

//list of identifiers of nodes in order of their precedence
//lowest precedence first
//only nodes for which a precedence is defined have to be added
var precedence = [
  {
    'AssignmentNode': null
  },
  {
    'ConditionalNode': null
  },
  {
    'OperatorNode:or': null
  },
  {
    'OperatorNode:xor': null
  },
  {
    'OperatorNode:and': null
  },
  {
    'OperatorNode:bitOr': null
  },
  {
    'OperatorNode:bitXor': null
  },
  {
    'OperatorNode:bitAnd': null
  },
  {
    'OperatorNode:equal': null,
    'OperatorNode:unequal': null,
    'OperatorNode:smaller': null,
    'OperatorNode:larger': null,
    'OperatorNode:smallerEq': null,
    'OperatorNode:largerEq': null
  },
  {
    'OperatorNode:leftShift': null,
    'OperatorNode:rightArithShift': null,
    'OperatorNode:rightLogShift': null
  },
  {
    'OperatorNode:to': null
  },
  {
    'RangeNode': null
  },
  {
    'OperatorNode:add': null,
    'OperatorNode:subtract': null
  },
  {
    'OperatorNode:multiply': null,
    'OperatorNode:divide': null,
    'OperatorNode:dotMultiply': null,
    'OperatorNode:dotDivide': null,
    'OperatorNode:mod': null
  },
  {
    'OperatorNode:unaryPlus': null,
    'OperatorNode:unaryMinus': null,
    'OperatorNode:bitNot': null,
    'OperatorNode:not': null
  },
  {
    'OperatorNode:pow': null,
    'OperatorNode:dotPow': null
  },
  {
    'OperatorNode:factorial': null
  },
  {
    'OperatorNode:transpose': null
  }
];

/**
 * Get the precedence of a current Node.
 * Higher number for higher precedence, starting with 0.
 * Throws an error if no precedence is defined for the given Node.
 *
 * @param {Node}
 * @return {Number} precedence
 */
precedence.getPrecedence = function (node) {
  var identifier = node.getIdentifier();
  for (var i = 0; i < precedence.length; i++) {
    if (identifier in precedence[i]) {
      return i;
    }
  }

  throw new Error('Precedence is not defined for "' + identifier + '".');
};

module.exports = precedence;
