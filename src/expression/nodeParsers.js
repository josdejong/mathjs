import { TOKENTYPE, NAMED_DELIMITERS, CONSTANTS, NUMERIC_CONSTANTS, ESCAPE_CHARACTERS, getToken, getTokenSkipNewline, currentCharacter, next, currentString } from './lexer.js'
import { initialState, openParams, closeParams } from './parserState.js'
import { createSyntaxError, createError } from './error.js'
import { isAccessorNode, isConstantNode, isFunctionNode, isOperatorNode, isSymbolNode, rule2Node } from '../utils/is.js'
import { hasOwnProperty } from '../utils/object.js'
import { safeNumberType } from '../utils/number.js'

// These will be injected by the factory function createParse
let numeric, config
let AccessorNode, ArrayNode, AssignmentNode, BlockNode, ConditionalNode, ConstantNode, FunctionAssignmentNode, FunctionNode, IndexNode, ObjectNode, OperatorNode, ParenthesisNode, RangeNode, RelationalNode, SymbolNode

export function setDependencies (dependencies) {
  numeric = dependencies.numeric
  config = dependencies.config
  AccessorNode = dependencies.AccessorNode
  ArrayNode = dependencies.ArrayNode
  AssignmentNode = dependencies.AssignmentNode
  BlockNode = dependencies.BlockNode
  ConditionalNode = dependencies.ConditionalNode
  ConstantNode = dependencies.ConstantNode
  FunctionAssignmentNode = dependencies.FunctionAssignmentNode
  FunctionNode = dependencies.FunctionNode
  IndexNode = dependencies.IndexNode
  ObjectNode = dependencies.ObjectNode
  OperatorNode = dependencies.OperatorNode
  ParenthesisNode = dependencies.ParenthesisNode
  RangeNode = dependencies.RangeNode
  RelationalNode = dependencies.RelationalNode
  SymbolNode = dependencies.SymbolNode
}

/**
 * Start of the parse levels below, in order of precedence
 * @return {Node} node
 * @private
 */
export function parseStart (expression, extraNodes) {
  const state = initialState()
  Object.assign(state, { expression, extraNodes })
  try {
    getToken(state)
  } catch (err) {
    throw createSyntaxError(state, err.message)
  }

  const node = parseBlock(state)

  if (state.token !== '') {
    if (state.tokenType === TOKENTYPE.DELIMITER) {
      throw createError(state, 'Unexpected operator ' + state.token)
    } else {
      throw createSyntaxError(state, 'Unexpected part "' + state.token + '"')
    }
  }

  return node
}

/**
 * Parse a block with expressions. Expressions can be separated by a newline
 * character '\n', or by a semicolon ';'. In case of a semicolon, no output
 * of the preceding line is returned.
 * @return {Node} node
 * @private
 */
function parseBlock (state) {
  let node
  const blocks = []
  let visible

  if (state.token !== '' && state.token !== '\n' && state.token !== ';') {
    node = parseAssignment(state)
    if (state.comment) {
      node.comment = state.comment
    }
  }

  while (state.token === '\n' || state.token === ';') {
    if (blocks.length === 0 && node) {
      visible = (state.token !== ';')
      blocks.push({ node, visible })
    }

    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    if (state.token !== '\n' && state.token !== ';' && state.token !== '') {
      node = parseAssignment(state)
      if (state.comment) {
        node.comment = state.comment
      }

      visible = (state.token !== ';')
      blocks.push({ node, visible })
    }
  }

  if (blocks.length > 0) {
    return new BlockNode(blocks)
  } else {
    if (!node) {
      node = new ConstantNode(undefined)
      if (state.comment) {
        node.comment = state.comment
      }
    }
    return node
  }
}

/**
 * Assignment of a function or variable,
 * - can be a variable like 'a=2.3'
 * - or a updating an existing variable like 'matrix(2,3:5)=[6,7,8]'
 * - defining a function like 'f(x) = x^2'
 * @return {Node} node
 * @private
 */
function parseAssignment (state) {
  let name, args, value, valid
  const node = parseConditional(state)

  if (state.token === '=') {
    if (isSymbolNode(node)) {
      name = node.name
      try {
        getTokenSkipNewline(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      value = parseAssignment(state)
      return new AssignmentNode(new SymbolNode(name), value)
    } else if (isAccessorNode(node)) {
      try {
        getTokenSkipNewline(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      value = parseAssignment(state)
      return new AssignmentNode(node.object, node.index, value)
    } else if (isFunctionNode(node) && isSymbolNode(node.fn)) {
      valid = true
      args = []
      name = node.name
      node.args.forEach(function (arg, index) {
        if (isSymbolNode(arg)) {
          args[index] = arg.name
        } else {
          valid = false
        }
      })
      if (valid) {
        try {
          getTokenSkipNewline(state)
        } catch (err) {
          throw createSyntaxError(state, err.message)
        }
        value = parseAssignment(state)
        return new FunctionAssignmentNode(name, args, value)
      }
    }
    throw createSyntaxError(state, 'Invalid left hand side of assignment operator =')
  }
  return node
}

/**
 * conditional operation
 *     condition ? truePart : falsePart
 * Note: conditional operator is right-associative
 * @return {Node} node
 * @private
 */
function parseConditional (state) {
  let node = parseLogicalOr(state)
  while (state.token === '?') {
    const prev = state.conditionalLevel
    state.conditionalLevel = state.nestingLevel
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    const condition = node
    const trueExpr = parseAssignment(state)
    if (state.token !== ':') throw createSyntaxError(state, 'False part of conditional expression expected')
    state.conditionalLevel = null
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    const falseExpr = parseAssignment(state)
    node = new ConditionalNode(condition, trueExpr, falseExpr)
    state.conditionalLevel = prev
  }
  return node
}

/**
 * logical or, 'x or y'
 * @return {Node} node
 * @private
 */
function parseLogicalOr (state) {
  let node = parseLogicalXor(state)
  while (state.token === 'or') {
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    node = new OperatorNode('or', 'or', [node, parseLogicalXor(state)])
  }
  return node
}

/**
 * logical exclusive or, 'x xor y'
 * @return {Node} node
 * @private
 */
function parseLogicalXor (state) {
  let node = parseLogicalAnd(state)
  while (state.token === 'xor') {
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    node = new OperatorNode('xor', 'xor', [node, parseLogicalAnd(state)])
  }
  return node
}

/**
 * logical and, 'x and y'
 * @return {Node} node
 * @private
 */
function parseLogicalAnd (state) {
  let node = parseBitwiseOr(state)
  while (state.token === 'and') {
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    node = new OperatorNode('and', 'and', [node, parseBitwiseOr(state)])
  }
  return node
}

/**
 * bitwise or, 'x | y'
 * @return {Node} node
 * @private
 */
function parseBitwiseOr (state) {
  let node = parseBitwiseXor(state)
  while (state.token === '|') {
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    node = new OperatorNode('|', 'bitOr', [node, parseBitwiseXor(state)])
  }
  return node
}

/**
 * bitwise exclusive or (xor), 'x ^| y'
 * @return {Node} node
 * @private
 */
function parseBitwiseXor (state) {
  let node = parseBitwiseAnd(state)
  while (state.token === '^|') {
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    node = new OperatorNode('^|', 'bitXor', [node, parseBitwiseAnd(state)])
  }
  return node
}

/**
 * bitwise and, 'x & y'
 * @return {Node} node
 * @private
 */
function parseBitwiseAnd (state) {
  let node = parseRelational(state)
  while (state.token === '&') {
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    node = new OperatorNode('&', 'bitAnd', [node, parseRelational(state)])
  }
  return node
}

/**
 * Parse a chained conditional, like 'a > b >= c'
 * @return {Node} node
 */
function parseRelational (state) {
  const params = [parseShift(state)]
  const conditionals = []
  const operators = {
    '==': 'equal',
    '!=': 'unequal',
    '<': 'smaller',
    '>': 'larger',
    '<=': 'smallerEq',
    '>=': 'largerEq'
  }
  while (hasOwnProperty(operators, state.token)) {
    const cond = { name: state.token, fn: operators[state.token] }
    conditionals.push(cond)
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    params.push(parseShift(state))
  }
  if (params.length === 1) {
    return params[0]
  } else if (params.length === 2) {
    return new OperatorNode(conditionals[0].name, conditionals[0].fn, params)
  } else {
    return new RelationalNode(conditionals.map(c => c.fn), params)
  }
}

/**
 * Bitwise left shift, bitwise right arithmetic shift, bitwise right logical shift
 * @return {Node} node
 * @private
 */
function parseShift (state) {
  let node, name, fn, params
  node = parseConversion(state)
  const operators = {
    '<<': 'leftShift',
    '>>': 'rightArithShift',
    '>>>': 'rightLogShift'
  }
  while (hasOwnProperty(operators, state.token)) {
    name = state.token
    fn = operators[name]
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    params = [node, parseConversion(state)]
    node = new OperatorNode(name, fn, params)
  }
  return node
}

/**
 * conversion operators 'to' and 'in'
 * @return {Node} node
 * @private
 */
function parseConversion (state) {
  let node, name, fn, params
  node = parseRange(state)
  const operators = {
    to: 'to',
    in: 'to' // alias of 'to'
  }
  while (hasOwnProperty(operators, state.token)) {
    name = state.token
    fn = operators[name]
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    if (name === 'in' && state.token === '') {
      node = new OperatorNode('*', 'multiply', [node, new SymbolNode('in')], true)
    } else {
      params = [node, parseRange(state)]
      node = new OperatorNode(name, fn, params)
    }
  }
  return node
}

/**
 * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
 * @return {Node} node
 * @private
 */
function parseRange (state) {
  let node
  const params = []
  if (state.token === ':') {
    node = new ConstantNode(1)
  } else {
    node = parseAddSubtract(state)
  }
  if (state.token === ':' && (state.conditionalLevel !== state.nestingLevel)) {
    params.push(node)
    while (state.token === ':' && params.length < 3) {
      try {
        getTokenSkipNewline(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      if (state.token === ')' || state.token === ']' || state.token === ',' || state.token === '') {
        params.push(new SymbolNode('end'))
      } else {
        params.push(parseAddSubtract(state))
      }
    }
    if (params.length === 3) {
      node = new RangeNode(params[0], params[2], params[1])
    } else {
      node = new RangeNode(params[0], params[1])
    }
  }
  return node
}

/**
 * add or subtract
 * @return {Node} node
 * @private
 */
function parseAddSubtract (state) {
  let node, name, fn, params
  node = parseMultiplyDivideModulusPercentage(state)
  const operators = {
    '+': 'add',
    '-': 'subtract'
  }
  while (hasOwnProperty(operators, state.token)) {
    name = state.token
    fn = operators[name]
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    const rightNode = parseMultiplyDivideModulusPercentage(state)
    if (rightNode.isPercentage) { // Note: isPercentage is a property not on all nodes
      params = [node, new OperatorNode('*', 'multiply', [node, rightNode])]
    } else {
      params = [node, rightNode]
    }
    node = new OperatorNode(name, fn, params)
  }
  return node
}

/**
 * multiply, divide, modulus, percentage
 * @return {Node} node
 * @private
 */
function parseMultiplyDivideModulusPercentage (state) {
  let node, last, name, fn
  node = parseImplicitMultiplication(state)
  last = node
  const operators = {
    '*': 'multiply',
    '.*': 'dotMultiply',
    '/': 'divide',
    './': 'dotDivide',
    '%': 'mod',
    mod: 'mod'
  }
  while (true) {
    if (hasOwnProperty(operators, state.token)) {
      name = state.token
      fn = operators[name]
      try {
        getTokenSkipNewline(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      if (name === '%' && state.tokenType === TOKENTYPE.DELIMITER && state.token !== '(') {
        if (state.token !== '' && operators[state.token]) {
          const left = new OperatorNode('/', 'divide', [node, new ConstantNode(100)], false, true)
          name = state.token
          fn = operators[name]
          try {
            getTokenSkipNewline(state)
          } catch (err) {
            throw createSyntaxError(state, err.message)
          }
          last = parseImplicitMultiplication(state)
          node = new OperatorNode(name, fn, [left, last])
        } else {
          node = new OperatorNode('/', 'divide', [node, new ConstantNode(100)], false, true)
        }
      } else {
        last = parseImplicitMultiplication(state)
        node = new OperatorNode(name, fn, [node, last])
      }
    } else {
      break
    }
  }
  return node
}

/**
 * implicit multiplication
 * @return {Node} node
 * @private
 */
function parseImplicitMultiplication (state) {
  let node, last
  node = parseRule2(state)
  last = node
  while (true) {
    if ((state.tokenType === TOKENTYPE.SYMBOL) ||
        (state.token === 'in' && isConstantNode(node)) ||
        (state.token === 'in' && isOperatorNode(node) && node.fn === 'unaryMinus' && isConstantNode(node.args[0])) ||
        (state.tokenType === TOKENTYPE.NUMBER &&
            !isConstantNode(last) &&
            (!isOperatorNode(last) || last.op === '!')) ||
        (state.token === '(')) {
      last = parseRule2(state)
      node = new OperatorNode('*', 'multiply', [node, last], true)
    } else {
      break
    }
  }
  return node
}

/**
 * Infamous "rule 2"
 * @return {Node} node
 * @private
 */
function parseRule2 (state) {
  let node = parseUnary(state)
  let last = node
  const tokenStates = []
  while (true) {
    if (state.token === '/' && rule2Node(last)) {
      tokenStates.push(Object.assign({}, state))
      try {
        getTokenSkipNewline(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      if (state.tokenType === TOKENTYPE.NUMBER) {
        tokenStates.push(Object.assign({}, state))
        try {
          getTokenSkipNewline(state)
        } catch (err) {
          throw createSyntaxError(state, err.message)
        }
        if (state.tokenType === TOKENTYPE.SYMBOL || state.token === '(' || state.token === 'in') {
          Object.assign(state, tokenStates.pop())
          tokenStates.pop()
          last = parseUnary(state)
          node = new OperatorNode('/', 'divide', [node, last])
        } else {
          tokenStates.pop()
          Object.assign(state, tokenStates.pop())
          break
        }
      } else {
        Object.assign(state, tokenStates.pop())
        break
      }
    } else {
      break
    }
  }
  return node
}

/**
 * Unary plus and minus, and logical and bitwise not
 * @return {Node} node
 * @private
 */
function parseUnary (state) {
  let name, params, fn
  const operators = {
    '-': 'unaryMinus',
    '+': 'unaryPlus',
    '~': 'bitNot',
    not: 'not'
  }
  if (hasOwnProperty(operators, state.token)) {
    fn = operators[state.token]
    name = state.token
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    params = [parseUnary(state)]
    return new OperatorNode(name, fn, params)
  }
  return parsePow(state)
}

/**
 * power
 * Note: power operator is right associative
 * @return {Node} node
 * @private
 */
function parsePow (state) {
  let node, name, fn, params
  node = parseLeftHandOperators(state)
  if (state.token === '^' || state.token === '.^') {
    name = state.token
    fn = (name === '^') ? 'pow' : 'dotPow'
    try {
      getTokenSkipNewline(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    params = [node, parseUnary(state)]
    node = new OperatorNode(name, fn, params)
  }
  return node
}

/**
 * Left hand operators: factorial x!, ctranspose x'
 * @return {Node} node
 * @private
 */
function parseLeftHandOperators (state) {
  let node, name, fn, params
  node = parseCustomNodes(state)
  const operators = {
    '!': 'factorial',
    '\'': 'ctranspose'
  }
  while (hasOwnProperty(operators, state.token)) {
    name = state.token
    fn = operators[name]
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    params = [node]
    node = new OperatorNode(name, fn, params)
    node = parseAccessors(state, node)
  }
  return node
}

/**
 * Parse a custom node handler.
 * @return {Node} node
 * @private
 */
function parseCustomNodes (state) {
  let params = []
  if (state.tokenType === TOKENTYPE.SYMBOL && hasOwnProperty(state.extraNodes, state.token)) {
    const CustomNode = state.extraNodes[state.token]
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    if (state.token === '(') {
      params = []
      openParams(state)
      try {
        getToken(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      if (state.token !== ')') {
        params.push(parseAssignment(state))
        while (state.token === ',') {
          try {
            getToken(state)
          } catch (err) {
            throw createSyntaxError(state, err.message)
          }
          params.push(parseAssignment(state))
        }
      }
      if (state.token !== ')') {
        throw createSyntaxError(state, 'Parenthesis ) expected')
      }
      closeParams(state)
      try {
        getToken(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
    }
    return new CustomNode(params)
  }
  return parseSymbol(state)
}

/**
 * parse symbols: functions, variables, constants, units
 * @return {Node} node
 * @private
 */
function parseSymbol (state) {
  let node, name
  if (state.tokenType === TOKENTYPE.SYMBOL ||
      (state.tokenType === TOKENTYPE.DELIMITER && state.token in NAMED_DELIMITERS)) {
    name = state.token
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    if (hasOwnProperty(CONSTANTS, name)) {
      node = new ConstantNode(CONSTANTS[name])
    } else if (NUMERIC_CONSTANTS.includes(name)) {
      node = new ConstantNode(numeric(name, 'number'))
    } else {
      node = new SymbolNode(name)
    }
    node = parseAccessors(state, node)
    return node
  }
  return parseString(state)
}

/**
 * parse accessors:
 * - function invocation in round brackets (...), for example sqrt(2)
 * - index enclosed in square brackets [...], for example A[2,3]
 * - dot notation for properties, like foo.bar
 * @param {Node} node    Node on which to apply the parameters.
 * @param {string[]} [types]  Filter the types of notations
 * @return {Node} node
 * @private
 */
function parseAccessors (state, node, types) {
  let params
  while ((state.token === '(' || state.token === '[' || state.token === '.') &&
      (!types || types.includes(state.token))) {
    params = []
    if (state.token === '(') {
      if (isSymbolNode(node) || isAccessorNode(node)) {
        openParams(state)
        try {
          getToken(state)
        } catch (err) {
          throw createSyntaxError(state, err.message)
        }
        if (state.token !== ')') {
          params.push(parseAssignment(state))
          while (state.token === ',') {
            try {
              getToken(state)
            } catch (err) {
              throw createSyntaxError(state, err.message)
            }
            params.push(parseAssignment(state))
          }
        }
        if (state.token !== ')') {
          throw createSyntaxError(state, 'Parenthesis ) expected')
        }
        closeParams(state)
        try {
          getToken(state)
        } catch (err) {
          throw createSyntaxError(state, err.message)
        }
        node = new FunctionNode(node, params)
      } else {
        return node
      }
    } else if (state.token === '[') {
      openParams(state)
      try {
        getToken(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      if (state.token !== ']') {
        params.push(parseAssignment(state))
        while (state.token === ',') {
          try {
            getToken(state)
          } catch (err) {
            throw createSyntaxError(state, err.message)
          }
          params.push(parseAssignment(state))
        }
      }
      if (state.token !== ']') {
        throw createSyntaxError(state, 'Parenthesis ] expected')
      }
      closeParams(state)
      try {
        getToken(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      node = new AccessorNode(node, new IndexNode(params))
    } else { // state.token === '.'
      try {
        getToken(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      const isPropertyName = state.tokenType === TOKENTYPE.SYMBOL ||
        (state.tokenType === TOKENTYPE.DELIMITER && state.token in NAMED_DELIMITERS)
      if (!isPropertyName) {
        throw createSyntaxError(state, 'Property name expected after dot')
      }
      params.push(new ConstantNode(state.token))
      try {
        getToken(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      const dotNotation = true
      node = new AccessorNode(node, new IndexNode(params, dotNotation))
    }
  }
  return node
}

/**
 * Parse a single or double quoted string.
 * @return {Node} node
 * @private
 */
function parseString (state) {
  let node, str
  if (state.token === '"' || state.token === "'") {
    str = parseStringToken(state, state.token)
    node = new ConstantNode(str)
    node = parseAccessors(state, node)
    return node
  }
  return parseMatrix(state)
}

/**
 * Parse a string surrounded by single or double quotes
 * @param {"'" | "\""} quote
 * @return {string}
 */
function parseStringToken (state, quote) {
  let str = ''
  while (currentCharacter(state) !== '' && currentCharacter(state) !== quote) {
    if (currentCharacter(state) === '\\') {
      next(state)
      const char = currentCharacter(state)
      const escapeChar = ESCAPE_CHARACTERS[char]
      if (escapeChar !== undefined) {
        str += escapeChar
        state.index += 1 // Note: next() was already called for the backslash
      } else if (char === 'u') {
        const unicode = currentString(state, 5).substring(1) // expression.slice(index + 1, index + 5)
        if (/^[0-9A-Fa-f]{4}$/.test(unicode)) {
          str += String.fromCharCode(parseInt(unicode, 16))
          state.index += 5 // +1 for 'u' and +4 for hex digits
        } else {
          throw createSyntaxError(state, `Invalid unicode character \\u${unicode}`)
        }
      } else {
        throw createSyntaxError(state, `Bad escape character \\${char}`)
      }
    } else {
      str += currentCharacter(state)
      next(state)
    }
  }
  try {
    getToken(state) // consume quote
  } catch (err) {
    throw createSyntaxError(state, err.message)
  }
  if (state.token !== quote) {
    throw createSyntaxError(state, `End of string ${quote} expected`)
  }
  try {
    getToken(state) // consume next token
  } catch (err) {
    throw createSyntaxError(state, err.message)
  }
  return str
}

/**
 * parse the matrix
 * @return {Node} node
 * @private
 */
function parseMatrix (state) {
  let array, params, rows, cols
  if (state.token === '[') {
    openParams(state)
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    if (state.token !== ']') {
      const row = parseRow(state)
      if (state.token === ';') {
        rows = 1
        params = [row]
        while (state.token === ';') {
          try {
            getToken(state)
          } catch (err) {
            throw createSyntaxError(state, err.message)
          }
          if (state.token !== ']') { // check for empty row
            params[rows] = parseRow(state)
            rows++
          }
        }
        if (state.token !== ']') {
          throw createSyntaxError(state, 'End of matrix ] expected')
        }
        closeParams(state)
        try {
          getToken(state)
        } catch (err) {
          throw createSyntaxError(state, err.message)
        }
        cols = params[0].items.length
        for (let r = 1; r < rows; r++) {
          if (params[r].items.length !== cols) {
            throw createError(state, 'Column dimensions mismatch (' + params[r].items.length + ' !== ' + cols + ')')
          }
        }
        array = new ArrayNode(params)
      } else {
        if (state.token !== ']') {
          throw createSyntaxError(state, 'End of matrix ] expected')
        }
        closeParams(state)
        try {
          getToken(state)
        } catch (err) {
          throw createSyntaxError(state, err.message)
        }
        array = row
      }
    } else {
      closeParams(state)
      try {
        getToken(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      array = new ArrayNode([])
    }
    return parseAccessors(state, array)
  }
  return parseObject(state)
}

/**
 * Parse a single comma-separated row from a matrix, like 'a, b, c'
 * @return {ArrayNode} node
 */
function parseRow (state) {
  const params = [parseAssignment(state)]
  let len = 1
  while (state.token === ',') {
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    if (state.token !== ']' && state.token !== ';') { // check for empty item
      params[len] = parseAssignment(state)
      len++
    }
  }
  return new ArrayNode(params)
}

/**
 * parse an object, enclosed in angle brackets{...}, for example {value: 2}
 * @return {Node} node
 * @private
 */
function parseObject (state) {
  if (state.token === '{') {
    openParams(state)
    let key
    const properties = {}
    do {
      try {
        getToken(state)
      } catch (err) {
        throw createSyntaxError(state, err.message)
      }
      if (state.token !== '}') {
        if (state.token === '"' || state.token === "'") {
          key = parseStringToken(state, state.token)
        } else if (state.tokenType === TOKENTYPE.SYMBOL || (state.tokenType === TOKENTYPE.DELIMITER && state.token in NAMED_DELIMITERS)) {
          key = state.token
          try {
            getToken(state)
          } catch (err) {
            throw createSyntaxError(state, err.message)
          }
        } else {
          throw createSyntaxError(state, 'Symbol or string expected as object key')
        }
        if (state.token !== ':') {
          throw createSyntaxError(state, 'Colon : expected after object key')
        }
        try {
          getToken(state)
        } catch (err) {
          throw createSyntaxError(state, err.message)
        }
        properties[key] = parseAssignment(state)
      }
    }
    while (state.token === ',')
    if (state.token !== '}') {
      throw createSyntaxError(state, 'Comma , or bracket } expected after object value')
    }
    closeParams(state)
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    let node = new ObjectNode(properties)
    node = parseAccessors(state, node)
    return node
  }
  return parseNumber(state)
}

/**
 * parse a number
 * @return {Node} node
 * @private
 */
function parseNumber (state) {
  let numberStr
  if (state.tokenType === TOKENTYPE.NUMBER) {
    numberStr = state.token
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    const numericType = safeNumberType(numberStr, config)
    const value = numeric(numberStr, numericType)
    return new ConstantNode(value)
  }
  return parseParentheses(state)
}

/**
 * parentheses
 * @return {Node} node
 * @private
 */
function parseParentheses (state) {
  let node
  if (state.token === '(') {
    openParams(state)
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    node = parseAssignment(state)
    if (state.token !== ')') {
      throw createSyntaxError(state, 'Parenthesis ) expected')
    }
    closeParams(state)
    try {
      getToken(state)
    } catch (err) {
      throw createSyntaxError(state, err.message)
    }
    node = new ParenthesisNode(node)
    node = parseAccessors(state, node)
    return node
  }
  return parseEnd(state)
}

/**
 * Evaluated when the expression is not yet ended but expected to end
 * @return {Node} res
 * @private
 */
function parseEnd (state) {
  if (state.token === '') {
    throw createSyntaxError(state, 'Unexpected end of expression')
  } else {
    throw createSyntaxError(state, 'Value expected')
  }
}
