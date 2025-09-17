// list of identifiers of nodes in order of their precedence
// also contains information about left/right associativity
// and which other operator the operator is associative with
// Example:
// addition is associative with addition and subtraction, because:
// (a+b)+c=a+(b+c)
// (a+b)-c=a+(b-c)
//
// postfix operators are left associative, prefix operators
// are right associative
//
// It's also possible to set the following properties:
// latexParens: if set to false, this node doesn't need to be enclosed
//              in parentheses when using LaTeX
// latexLeftParens: if set to false, this !OperatorNode's!
//                  left argument doesn't need to be enclosed
//                  in parentheses
// latexRightParens: the same for the right argument
import { hasOwnProperty } from '../utils/object.js'
import { isConstantNode, isParenthesisNode, rule2Node } from '../utils/is.js'

export const properties = [
  { // assignment
    AssignmentNode: {},
    FunctionAssignmentNode: {}
  },
  { // conditional expression
    ConditionalNode: {
      latexLeftParens: false,
      latexRightParens: false,
      latexParens: false
      // conditionals don't need parentheses in LaTeX because
      // they are 2 dimensional
    }
  },
  { // logical or
    'OperatorNode:or': {
      op: 'or',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // logical xor
    'OperatorNode:xor': {
      op: 'xor',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // logical and
    'OperatorNode:and': {
      op: 'and',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // bitwise or
    'OperatorNode:bitOr': {
      op: '|',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // bitwise xor
    'OperatorNode:bitXor': {
      op: '^|',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // bitwise and
    'OperatorNode:bitAnd': {
      op: '&',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // relational operators
    'OperatorNode:equal': {
      op: '==',
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:unequal': {
      op: '!=',
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:smaller': {
      op: '<',
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:larger': {
      op: '>',
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:smallerEq': {
      op: '<=',
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:largerEq': {
      op: '>=',
      associativity: 'left',
      associativeWith: []
    },
    RelationalNode: {
      associativity: 'left',
      associativeWith: []
    }
  },
  { // bitshift operators
    'OperatorNode:leftShift': {
      op: '<<',
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:rightArithShift': {
      op: '>>',
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:rightLogShift': {
      op: '>>>',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // unit conversion
    'OperatorNode:to': {
      op: 'to',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // range
    RangeNode: {}
  },
  { // addition, subtraction
    'OperatorNode:add': {
      op: '+',
      associativity: 'left',
      associativeWith: ['OperatorNode:add', 'OperatorNode:subtract']
    },
    'OperatorNode:subtract': {
      op: '-',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // multiply, divide, modulus
    'OperatorNode:multiply': {
      op: '*',
      associativity: 'left',
      associativeWith: [
        'OperatorNode:multiply',
        'OperatorNode:divide',
        'Operator:dotMultiply',
        'Operator:dotDivide'
      ]
    },
    'OperatorNode:divide': {
      op: '/',
      associativity: 'left',
      associativeWith: [],
      latexLeftParens: false,
      latexRightParens: false,
      latexParens: false
      // fractions don't require parentheses because
      // they're 2 dimensional, so parens aren't needed
      // in LaTeX
    },
    'OperatorNode:dotMultiply': {
      op: '.*',
      associativity: 'left',
      associativeWith: [
        'OperatorNode:multiply',
        'OperatorNode:divide',
        'OperatorNode:dotMultiply',
        'OperatorNode:doDivide'
      ]
    },
    'OperatorNode:dotDivide': {
      op: './',
      associativity: 'left',
      associativeWith: []
    },
    'OperatorNode:mod': {
      op: 'mod',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // Repeat multiplication for implicit multiplication
    'OperatorNode:multiply': {
      associativity: 'left',
      associativeWith: [
        'OperatorNode:multiply',
        'OperatorNode:divide',
        'Operator:dotMultiply',
        'Operator:dotDivide'
      ]
    }
  },
  { // unary prefix operators
    'OperatorNode:unaryPlus': {
      op: '+',
      associativity: 'right'
    },
    'OperatorNode:unaryMinus': {
      op: '-',
      associativity: 'right'
    },
    'OperatorNode:bitNot': {
      op: '~',
      associativity: 'right'
    },
    'OperatorNode:not': {
      op: 'not',
      associativity: 'right'
    }
  },
  { // exponentiation
    'OperatorNode:pow': {
      op: '^',
      associativity: 'right',
      associativeWith: [],
      latexRightParens: false
      // the exponent doesn't need parentheses in
      // LaTeX because it's 2 dimensional
      // (it's on top)
    },
    'OperatorNode:dotPow': {
      op: '.^',
      associativity: 'right',
      associativeWith: []
    }
  },
  { // nullish coalescing
    'OperatorNode:nullish': {
      op: '??',
      associativity: 'left',
      associativeWith: []
    }
  },
  { // factorial
    'OperatorNode:factorial': {
      op: '!',
      associativity: 'left'
    }
  },
  { // matrix transpose
    'OperatorNode:ctranspose': {
      op: "'",
      associativity: 'left'
    }
  }
]

/**
 * Returns the first non-parenthesis internal node, but only
 * when the 'parenthesis' option is unset or auto.
 * @param {Node} _node
 * @param {string} parenthesis
 * @return {Node}
 */
function unwrapParen (_node, parenthesis) {
  if (!parenthesis || parenthesis !== 'auto') return _node
  let node = _node
  while (isParenthesisNode(node)) node = node.content
  return node
}

/**
 * Get the precedence of a Node.
 * Higher number for higher precedence, starting with 0.
 * Returns null if the precedence is undefined.
 *
 * @param {Node} _node
 * @param {string} parenthesis
 * @param {string} implicit
 * @param {Node} parent (for determining context for implicit multiplication)
 * @return {number | null}
 */
export function getPrecedence (_node, parenthesis, implicit, parent) {
  let node = _node
  if (parenthesis !== 'keep') {
    // ParenthesisNodes are only ignored when not in 'keep' mode
    node = _node.getContent()
  }
  const identifier = node.getIdentifier()
  let precedence = null
  for (let i = 0; i < properties.length; i++) {
    if (identifier in properties[i]) {
      precedence = i
      break
    }
  }
  // Bump up precedence of implicit multiplication, except when preceded
  // by a "Rule 2" fraction ( [unaryOp]constant / constant )
  if (identifier === 'OperatorNode:multiply' && node.implicit &&
      implicit !== 'show') {
    const leftArg = unwrapParen(node.args[0], parenthesis)
    if (!(isConstantNode(leftArg) && parent &&
          parent.getIdentifier() === 'OperatorNode:divide' &&
          rule2Node(unwrapParen(parent.args[0], parenthesis))) &&
        !(leftArg.getIdentifier() === 'OperatorNode:divide' &&
          rule2Node(unwrapParen(leftArg.args[0], parenthesis)) &&
          isConstantNode(unwrapParen(leftArg.args[1])))
    ) {
      precedence += 1
    }
  }
  return precedence
}

/**
 * Get the associativity of an operator (left or right).
 * Returns a string containing 'left' or 'right' or null if
 * the associativity is not defined.
 *
 * @param {Node} _node
 * @param {string} parenthesis
 * @return {string|null}
 * @throws {Error}
 */
export function getAssociativity (_node, parenthesis) {
  let node = _node
  if (parenthesis !== 'keep') {
    // ParenthesisNodes are only ignored when not in 'keep' mode
    node = _node.getContent()
  }
  const identifier = node.getIdentifier()
  const index = getPrecedence(node, parenthesis)
  if (index === null) {
    // node isn't in the list
    return null
  }
  const property = properties[index][identifier]

  if (hasOwnProperty(property, 'associativity')) {
    if (property.associativity === 'left') {
      return 'left'
    }
    if (property.associativity === 'right') {
      return 'right'
    }
    // associativity is invalid
    throw Error('\'' + identifier + '\' has the invalid associativity \'' +
                property.associativity + '\'.')
  }

  // associativity is undefined
  return null
}

/**
 * Check if an operator is associative with another operator.
 * Returns either true or false or null if not defined.
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @param {string} parenthesis
 * @return {boolean | null}
 */
export function isAssociativeWith (nodeA, nodeB, parenthesis) {
  // ParenthesisNodes are only ignored when not in 'keep' mode
  const a = (parenthesis !== 'keep') ? nodeA.getContent() : nodeA
  const b = (parenthesis !== 'keep') ? nodeA.getContent() : nodeB
  const identifierA = a.getIdentifier()
  const identifierB = b.getIdentifier()
  const index = getPrecedence(a, parenthesis)
  if (index === null) {
    // node isn't in the list
    return null
  }
  const property = properties[index][identifierA]

  if (hasOwnProperty(property, 'associativeWith') &&
      (property.associativeWith instanceof Array)) {
    for (let i = 0; i < property.associativeWith.length; i++) {
      if (property.associativeWith[i] === identifierB) {
        return true
      }
    }
    return false
  }

  // associativeWith is not defined
  return null
}

/**
 * Get the operator associated with a function name.
 * Returns a string with the operator symbol, or null if the
 * input is not the name of a function associated with an
 * operator.
 *
 * @param {string} Function name
 * @return {string | null} Associated operator symbol, if any
 */
export function getOperator (fn) {
  const identifier = 'OperatorNode:' + fn
  for (const group of properties) {
    if (identifier in group) {
      return group[identifier].op
    }
  }
  return null
}
