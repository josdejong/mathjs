'use strict'

const ArgumentsError = require('../error/ArgumentsError')
const deepMap = require('../utils/collection/deepMap')

function factory (type, config, load, typed) {
  const numeric = load(require('../type/numeric'))

  const AccessorNode = load(require('./node/AccessorNode'))
  const ArrayNode = load(require('./node/ArrayNode'))
  const AssignmentNode = load(require('./node/AssignmentNode'))
  const BlockNode = load(require('./node/BlockNode'))
  const ConditionalNode = load(require('./node/ConditionalNode'))
  const ConstantNode = load(require('./node/ConstantNode'))
  const FunctionAssignmentNode = load(require('./node/FunctionAssignmentNode'))
  const IndexNode = load(require('./node/IndexNode'))
  const ObjectNode = load(require('./node/ObjectNode'))
  const OperatorNode = load(require('./node/OperatorNode'))
  const ParenthesisNode = load(require('./node/ParenthesisNode'))
  const FunctionNode = load(require('./node/FunctionNode'))
  const RangeNode = load(require('./node/RangeNode'))
  const RelationalNode = load(require('./node/RelationalNode'))
  const SymbolNode = load(require('./node/SymbolNode'))

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.eval().
   *
   * Syntax:
   *
   *     parse(expr)
   *     parse(expr, options)
   *     parse([expr1, expr2, expr3, ...])
   *     parse([expr1, expr2, expr3, ...], options)
   *
   * Example:
   *
   *     const node = parse('sqrt(3^2 + 4^2)')
   *     node.compile(math).eval() // 5
   *
   *     let scope = {a:3, b:4}
   *     const node = parse('a * b') // 12
   *     const code = node.compile(math)
   *     code.eval(scope) // 12
   *     scope.a = 5
   *     code.eval(scope) // 20
   *
   *     const nodes = math.parse(['a = 3', 'b = 4', 'a * b'])
   *     nodes[2].compile(math).eval() // 12
   *
   * @param {string | string[] | Matrix} expr
   * @param {{nodes: Object<string, Node>}} [options]  Available options:
   *                                                   - `nodes` a set of custom nodes
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  function parse (expr, options) {
    if (arguments.length !== 1 && arguments.length !== 2) {
      throw new ArgumentsError('parse', arguments.length, 1, 2)
    }

    // pass extra nodes
    let extraNodes = (options && options.nodes) ? options.nodes : {}

    if (typeof expr === 'string') {
      // parse a single expression

      return parseStart(expr, extraNodes)
    } else if (Array.isArray(expr) || expr instanceof type.Matrix) {
      // parse an array or matrix with expressions
      return deepMap(expr, function (elem) {
        if (typeof elem !== 'string') throw new TypeError('String expected')

        return parseStart(elem, extraNodes)
      })
    } else {
      // oops
      throw new TypeError('String or matrix expected')
    }
  }

  // token types enumeration
  const TOKENTYPE = {
    NULL: 0,
    DELIMITER: 1,
    NUMBER: 2,
    SYMBOL: 3,
    UNKNOWN: 4
  }

  // map with all delimiters
  const DELIMITERS = {
    ',': true,
    '(': true,
    ')': true,
    '[': true,
    ']': true,
    '{': true,
    '}': true,
    '"': true,
    '\'': true,
    ';': true,

    '+': true,
    '-': true,
    '*': true,
    '.*': true,
    '/': true,
    './': true,
    '%': true,
    '^': true,
    '.^': true,
    '~': true,
    '!': true,
    '&': true,
    '|': true,
    '^|': true,
    '=': true,
    ':': true,
    '?': true,

    '==': true,
    '!=': true,
    '<': true,
    '>': true,
    '<=': true,
    '>=': true,

    '<<': true,
    '>>': true,
    '>>>': true
  }

  // map with all named delimiters
  const NAMED_DELIMITERS = {
    'mod': true,
    'to': true,
    'in': true,
    'and': true,
    'xor': true,
    'or': true,
    'not': true
  }

  const CONSTANTS = {
    'true': true,
    'false': false,
    'null': null,
    'undefined': undefined
  }

  const NUMERIC_CONSTANTS = [
    'NaN',
    'Infinity'
  ]

  function initialState () {
    return {
      extraNodes: {}, // current extra nodes, must be careful not to mutate
      expression: '', // current expression
      comment: '', // last parsed comment
      index: 0, // current index in expr
      token: '', // current token
      tokenType: TOKENTYPE.NULL, // type of the token
      nestingLevel: 0, // level of nesting inside parameters, used to ignore newline characters
      conditionalLevel: null // when a conditional is being parsed, the level of the conditional is stored here
    }
  }

  /**
   * View upto `length` characters of the expression starting at the current character.
   *
   * @param {State} state
   * @param {number} [length=1] Number of characters to view
   * @returns {string}
   * @private
   */
  function currentString (state, length) {
    return state.expression.substr(state.index, length)
  }

  /**
   * View the current character. Returns '' if end of expression is reached.
   *
   * @param {State} state
   * @returns {string}
   * @private
   */
  function currentCharacter (state) {
    return currentString(state, 1)
  }

  /**
   * Get the next character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function next (state) {
    state.index++
  }

  /**
   * Preview the previous character from the expression.
   * @return {string} cNext
   * @private
   */
  function prevCharacter (state) {
    return state.expression.charAt(state.index - 1)
  }

  /**
   * Preview the next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextCharacter (state) {
    return state.expression.charAt(state.index + 1)
  }

  /**
   * Get next token in the current string expr.
   * The token and token type are available as token and tokenType
   * @private
   */
  function getToken (state) {
    state.tokenType = TOKENTYPE.NULL
    state.token = ''
    state.comment = ''

    // skip over whitespaces
    // space, tab, and newline when inside parameters
    while (parse.isWhitespace(currentCharacter(state), state.nestingLevel)) {
      next(state)
    }

    // skip comment
    if (currentCharacter(state) === '#') {
      while (currentCharacter(state) !== '\n' && currentCharacter(state) !== '') {
        state.comment += currentCharacter(state)
        next(state)
      }
    }

    // check for end of expression
    if (currentCharacter(state) === '') {
      // token is still empty
      state.tokenType = TOKENTYPE.DELIMITER
      return
    }

    // check for new line character
    if (currentCharacter(state) === '\n' && !state.nestingLevel) {
      state.tokenType = TOKENTYPE.DELIMITER
      state.token = currentCharacter(state)
      next(state)
      return
    }

    const c1 = currentCharacter(state)
    const c2 = currentString(state, 2)
    const c3 = currentString(state, 3)
    if (c3.length === 3 && DELIMITERS[c3]) {
      state.tokenType = TOKENTYPE.DELIMITER
      state.token = c3
      next(state)
      next(state)
      next(state)
      return
    }

    // check for delimiters consisting of 2 characters
    if (c2.length === 2 && DELIMITERS[c2]) {
      state.tokenType = TOKENTYPE.DELIMITER
      state.token = c2
      next(state)
      next(state)
      return
    }

    // check for delimiters consisting of 1 character
    if (DELIMITERS[c1]) {
      state.tokenType = TOKENTYPE.DELIMITER
      state.token = c1
      next(state)
      return
    }

    // check for a number
    if (parse.isDigitDot(c1)) {
      state.tokenType = TOKENTYPE.NUMBER

      // get number, can have a single dot
      if (currentCharacter(state) === '.') {
        state.token += currentCharacter(state)
        next(state)

        if (!parse.isDigit(currentCharacter(state))) {
          // this is no number, it is just a dot (can be dot notation)
          state.tokenType = TOKENTYPE.DELIMITER
        }
      } else {
        while (parse.isDigit(currentCharacter(state))) {
          state.token += currentCharacter(state)
          next(state)
        }
        if (parse.isDecimalMark(currentCharacter(state), nextCharacter(state))) {
          state.token += currentCharacter(state)
          next(state)
        }
      }

      while (parse.isDigit(currentCharacter(state))) {
        state.token += currentCharacter(state)
        next(state)
      }
      // check for exponential notation like "2.3e-4", "1.23e50" or "2e+4"
      if (currentCharacter(state) === 'E' || currentCharacter(state) === 'e') {
        if (parse.isDigit(nextCharacter(state)) || nextCharacter(state) === '-' || nextCharacter(state) === '+') {
          state.token += currentCharacter(state)
          next(state)

          if (currentCharacter(state) === '+' || currentCharacter(state) === '-') {
            state.token += currentCharacter(state)
            next(state)
          }
          // Scientific notation MUST be followed by an exponent
          if (!parse.isDigit(currentCharacter(state))) {
            throw createSyntaxError(state, 'Digit expected, got "' + currentCharacter(state) + '"')
          }

          while (parse.isDigit(currentCharacter(state))) {
            state.token += currentCharacter(state)
            next(state)
          }

          if (parse.isDecimalMark(currentCharacter(state), nextCharacter(state))) {
            throw createSyntaxError(state, 'Digit expected, got "' + currentCharacter(state) + '"')
          }
        } else if (nextCharacter(state) === '.') {
          next(state)
          throw createSyntaxError(state, 'Digit expected, got "' + currentCharacter(state) + '"')
        }
      }

      return
    }

    // check for variables, functions, named operators
    if (parse.isAlpha(currentCharacter(state), prevCharacter(state), nextCharacter(state))) {
      while (parse.isAlpha(currentCharacter(state), prevCharacter(state), nextCharacter(state)) || parse.isDigit(currentCharacter(state))) {
        state.token += currentCharacter(state)
        next(state)
      }

      if (NAMED_DELIMITERS.hasOwnProperty(state.token)) {
        state.tokenType = TOKENTYPE.DELIMITER
      } else {
        state.tokenType = TOKENTYPE.SYMBOL
      }

      return
    }

    // something unknown is found, wrong characters -> a syntax error
    state.tokenType = TOKENTYPE.UNKNOWN
    while (currentCharacter(state) !== '') {
      state.token += currentCharacter(state)
      next(state)
    }
    throw createSyntaxError(state, 'Syntax error in part "' + state.token + '"')
  }

  /**
   * Get next token and skip newline tokens
   */
  function getTokenSkipNewline (state) {
    do {
      getToken(state)
    }
    while (state.token === '\n') // eslint-disable-line no-unmodified-loop-condition
  }

  /**
   * Open parameters.
   * New line characters will be ignored until closeParams(state) is called
   */
  function openParams (state) {
    state.nestingLevel++
  }

  /**
   * Close parameters.
   * New line characters will no longer be ignored
   */
  function closeParams (state) {
    state.nestingLevel--
  }

  /**
   * Checks whether the current character `c` is a valid alpha character:
   *
   * - A latin letter (upper or lower case) Ascii: a-z, A-Z
   * - An underscore                        Ascii: _
   * - A dollar sign                        Ascii: $
   * - A latin letter with accents          Unicode: \u00C0 - \u02AF
   * - A greek letter                       Unicode: \u0370 - \u03FF
   * - A mathematical alphanumeric symbol   Unicode: \u{1D400} - \u{1D7FF} excluding invalid code points
   *
   * The previous and next characters are needed to determine whether
   * this character is part of a unicode surrogate pair.
   *
   * @param {string} c      Current character in the expression
   * @param {string} cPrev  Previous character
   * @param {string} cNext  Next character
   * @return {boolean}
   */
  parse.isAlpha = function isAlpha (c, cPrev, cNext) {
    return parse.isValidLatinOrGreek(c) ||
        parse.isValidMathSymbol(c, cNext) ||
        parse.isValidMathSymbol(cPrev, c)
  }

  /**
   * Test whether a character is a valid latin, greek, or letter-like character
   * @param {string} c
   * @return {boolean}
   */
  parse.isValidLatinOrGreek = function isValidLatinOrGreek (c) {
    return /^[a-zA-Z_$\u00C0-\u02AF\u0370-\u03FF\u2100-\u214F]$/.test(c)
  }

  /**
   * Test whether two given 16 bit characters form a surrogate pair of a
   * unicode math symbol.
   *
   * http://unicode-table.com/en/
   * http://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
   *
   * Note: In ES6 will be unicode aware:
   * http://stackoverflow.com/questions/280712/javascript-unicode-regexes
   * https://mathiasbynens.be/notes/es6-unicode-regex
   *
   * @param {string} high
   * @param {string} low
   * @return {boolean}
   */
  parse.isValidMathSymbol = function isValidMathSymbol (high, low) {
    return /^[\uD835]$/.test(high) &&
        /^[\uDC00-\uDFFF]$/.test(low) &&
        /^[^\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]$/.test(low)
  }

  /**
   * Check whether given character c is a white space character: space, tab, or enter
   * @param {string} c
   * @param {number} nestingLevel
   * @return {boolean}
   */
  parse.isWhitespace = function isWhitespace (c, nestingLevel) {
    // TODO: also take '\r' carriage return as newline? Or does that give problems on mac?
    return c === ' ' || c === '\t' || (c === '\n' && nestingLevel > 0)
  }

  /**
   * Test whether the character c is a decimal mark (dot).
   * This is the case when it's not the start of a delimiter '.*', './', or '.^'
   * @param {string} c
   * @param {string} cNext
   * @return {boolean}
   */
  parse.isDecimalMark = function isDecimalMark (c, cNext) {
    return c === '.' && cNext !== '/' && cNext !== '*' && cNext !== '^'
  }

  /**
   * checks if the given char c is a digit or dot
   * @param {string} c   a string with one character
   * @return {boolean}
   */
  parse.isDigitDot = function isDigitDot (c) {
    return ((c >= '0' && c <= '9') || c === '.')
  }

  /**
   * checks if the given char c is a digit
   * @param {string} c   a string with one character
   * @return {boolean}
   */
  parse.isDigit = function isDigit (c) {
    return (c >= '0' && c <= '9')
  }

  /**
   * Start of the parse levels below, in order of precedence
   * @return {Node} node
   * @private
   */
  function parseStart (expression, extraNodes) {
    const state = initialState()
    Object.assign(state, { expression, extraNodes })
    getToken(state)

    const node = parseBlock(state)

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and tokenType DELIMITER
    if (state.token !== '') {
      if (state.tokenType === TOKENTYPE.DELIMITER) {
        // user entered a not existing operator like "//"

        // TODO: give hints for aliases, for example with "<>" give as hint " did you mean !== ?"
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
      node.comment = state.comment
    }

    // TODO: simplify this loop
    while (state.token === '\n' || state.token === ';') { // eslint-disable-line no-unmodified-loop-condition
      if (blocks.length === 0 && node) {
        visible = (state.token !== ';')
        blocks.push({
          node: node,
          visible: visible
        })
      }

      getToken(state)
      if (state.token !== '\n' && state.token !== ';' && state.token !== '') {
        node = parseAssignment(state)
        node.comment = state.comment

        visible = (state.token !== ';')
        blocks.push({
          node: node,
          visible: visible
        })
      }
    }

    if (blocks.length > 0) {
      return new BlockNode(blocks)
    } else {
      if (!node) {
        node = new ConstantNode(undefined)
        node.comment = state.comment
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
      if (type.isSymbolNode(node)) {
        // parse a variable assignment like 'a = 2/3'
        name = node.name
        getTokenSkipNewline(state)
        value = parseAssignment(state)
        return new AssignmentNode(new SymbolNode(name), value)
      } else if (type.isAccessorNode(node)) {
        // parse a matrix subset assignment like 'A[1,2] = 4'
        getTokenSkipNewline(state)
        value = parseAssignment(state)
        return new AssignmentNode(node.object, node.index, value)
      } else if (type.isFunctionNode(node) && type.isSymbolNode(node.fn)) {
        // parse function assignment like 'f(x) = x^2'
        valid = true
        args = []

        name = node.name
        node.args.forEach(function (arg, index) {
          if (type.isSymbolNode(arg)) {
            args[index] = arg.name
          } else {
            valid = false
          }
        })

        if (valid) {
          getTokenSkipNewline(state)
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
   *
   *     condition ? truePart : falsePart
   *
   * Note: conditional operator is right-associative
   *
   * @return {Node} node
   * @private
   */
  function parseConditional (state) {
    let node = parseLogicalOr(state)

    while (state.token === '?') { // eslint-disable-line no-unmodified-loop-condition
      // set a conditional level, the range operator will be ignored as long
      // as conditionalLevel === state.nestingLevel.
      const prev = state.conditionalLevel
      state.conditionalLevel = state.nestingLevel
      getTokenSkipNewline(state)

      const condition = node
      const trueExpr = parseAssignment(state)

      if (state.token !== ':') throw createSyntaxError(state, 'False part of conditional expression expected')

      state.conditionalLevel = null
      getTokenSkipNewline(state)

      const falseExpr = parseAssignment(state) // Note: check for conditional operator again, right associativity

      node = new ConditionalNode(condition, trueExpr, falseExpr)

      // restore the previous conditional level
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

    while (state.token === 'or') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline(state)
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

    while (state.token === 'xor') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline(state)
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

    while (state.token === 'and') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline(state)
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

    while (state.token === '|') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline(state)
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

    while (state.token === '^|') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline(state)
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

    while (state.token === '&') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline(state)
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

    while (operators.hasOwnProperty(state.token)) { // eslint-disable-line no-unmodified-loop-condition
      const cond = { name: state.token, fn: operators[state.token] }
      conditionals.push(cond)
      getTokenSkipNewline(state)
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
    let node, operators, name, fn, params

    node = parseConversion(state)

    operators = {
      '<<': 'leftShift',
      '>>': 'rightArithShift',
      '>>>': 'rightLogShift'
    }

    while (operators.hasOwnProperty(state.token)) {
      name = state.token
      fn = operators[name]

      getTokenSkipNewline(state)
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
    let node, operators, name, fn, params

    node = parseRange(state)

    operators = {
      'to': 'to',
      'in': 'to' // alias of 'to'
    }

    while (operators.hasOwnProperty(state.token)) {
      name = state.token
      fn = operators[name]

      getTokenSkipNewline(state)

      if (name === 'in' && state.token === '') {
        // end of expression -> this is the unit 'in' ('inch')
        node = new OperatorNode('*', 'multiply', [node, new SymbolNode('in')], true)
      } else {
        // operator 'a to b' or 'a in b'
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
      // implicit start=1 (one-based)
      node = new ConstantNode(1)
    } else {
      // explicit start
      node = parseAddSubtract(state)
    }

    if (state.token === ':' && (state.conditionalLevel !== state.nestingLevel)) {
      // we ignore the range operator when a conditional operator is being processed on the same level
      params.push(node)

      // parse step and end
      while (state.token === ':' && params.length < 3) { // eslint-disable-line no-unmodified-loop-condition
        getTokenSkipNewline(state)

        if (state.token === ')' || state.token === ']' || state.token === ',' || state.token === '') {
          // implicit end
          params.push(new SymbolNode('end'))
        } else {
          // explicit end
          params.push(parseAddSubtract(state))
        }
      }

      if (params.length === 3) {
        // params = [start, step, end]
        node = new RangeNode(params[0], params[2], params[1]) // start, end, step
      } else { // length === 2
        // params = [start, end]
        node = new RangeNode(params[0], params[1]) // start, end
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
    let node, operators, name, fn, params

    node = parseMultiplyDivide(state)

    operators = {
      '+': 'add',
      '-': 'subtract'
    }
    while (operators.hasOwnProperty(state.token)) {
      name = state.token
      fn = operators[name]

      getTokenSkipNewline(state)
      params = [node, parseMultiplyDivide(state)]
      node = new OperatorNode(name, fn, params)
    }

    return node
  }

  /**
   * multiply, divide, modulus
   * @return {Node} node
   * @private
   */
  function parseMultiplyDivide (state) {
    let node, last, operators, name, fn

    node = parseImplicitMultiplication(state)
    last = node

    operators = {
      '*': 'multiply',
      '.*': 'dotMultiply',
      '/': 'divide',
      './': 'dotDivide',
      '%': 'mod',
      'mod': 'mod'
    }

    while (true) {
      if (operators.hasOwnProperty(state.token)) {
        // explicit operators
        name = state.token
        fn = operators[name]

        getTokenSkipNewline(state)

        last = parseImplicitMultiplication(state)
        node = new OperatorNode(name, fn, [node, last])
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
          (state.token === 'in' && type.isConstantNode(node)) ||
          (state.tokenType === TOKENTYPE.NUMBER &&
              !type.isConstantNode(last) &&
              (!type.isOperatorNode(last) || last.op === '!')) ||
          (state.token === '(')) {
        // parse implicit multiplication
        //
        // symbol:      implicit multiplication like '2a', '(2+3)a', 'a b'
        // number:      implicit multiplication like '(2+3)2'
        // parenthesis: implicit multiplication like '2(3+4)', '(3+4)(1+2)'
        last = parseRule2(state)
        node = new OperatorNode('*', 'multiply', [node, last], true /* implicit */)
      } else {
        break
      }
    }

    return node
  }

  /**
   * Infamous "rule 2" as described in https://github.com/josdejong/mathjs/issues/792#issuecomment-361065370
   * Explicit division gets higher precedence than implicit multiplication
   * when the division matches this pattern: [number] / [number] [symbol]
   * @return {Node} node
   * @private
   */
  function parseRule2 (state) {
    let node = parseUnary(state)
    let last = node
    let tokenStates = []

    while (true) {
      // Match the "number /" part of the pattern "number / number symbol"
      if (state.token === '/' && type.isConstantNode(last)) {
        // Look ahead to see if the next token is a number
        tokenStates.push(Object.assign({}, state))
        getTokenSkipNewline(state)

        // Match the "number / number" part of the pattern
        if (state.tokenType === TOKENTYPE.NUMBER) {
          // Look ahead again
          tokenStates.push(Object.assign({}, state))
          getTokenSkipNewline(state)

          // Match the "symbol" part of the pattern, or a left parenthesis
          if (state.tokenType === TOKENTYPE.SYMBOL || state.token === '(') {
            // We've matched the pattern "number / number symbol".
            // Rewind once and build the "number / number" node; the symbol will be consumed later
            Object.assign(state, tokenStates.pop())
            tokenStates.pop()
            last = parseUnary(state)
            node = new OperatorNode('/', 'divide', [node, last])
          } else {
            // Not a match, so rewind
            tokenStates.pop()
            Object.assign(state, tokenStates.pop())
            break
          }
        } else {
          // Not a match, so rewind
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
      'not': 'not'
    }

    if (operators.hasOwnProperty(state.token)) {
      fn = operators[state.token]
      name = state.token

      getTokenSkipNewline(state)
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

      getTokenSkipNewline(state)
      params = [node, parseUnary(state)] // Go back to unary, we can have '2^-3'
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
    let node, operators, name, fn, params

    node = parseCustomNodes(state)

    operators = {
      '!': 'factorial',
      '\'': 'ctranspose'
    }

    while (operators.hasOwnProperty(state.token)) {
      name = state.token
      fn = operators[name]

      getToken(state)
      params = [node]

      node = new OperatorNode(name, fn, params)
      node = parseAccessors(state, node)
    }

    return node
  }

  /**
   * Parse a custom node handler. A node handler can be used to process
   * nodes in a custom way, for example for handling a plot.
   *
   * A handler must be passed as second argument of the parse function.
   * - must extend math.expression.node.Node
   * - must contain a function _compile(defs: Object) : string
   * - must contain a function find(filter: Object) : Node[]
   * - must contain a function toString() : string
   * - the constructor is called with a single argument containing all parameters
   *
   * For example:
   *
   *     nodes = {
   *       'plot': PlotHandler
   *     }
   *
   * The constructor of the handler is called as:
   *
   *     node = new PlotHandler(params)
   *
   * The handler will be invoked when evaluating an expression like:
   *
   *     node = math.parse('plot(sin(x), x)', nodes)
   *
   * @return {Node} node
   * @private
   */
  function parseCustomNodes (state) {
    let params = []

    if (state.tokenType === TOKENTYPE.SYMBOL && state.extraNodes.hasOwnProperty(state.token)) {
      const CustomNode = state.extraNodes[state.token]

      getToken(state)

      // parse parameters
      if (state.token === '(') {
        params = []

        openParams(state)
        getToken(state)

        if (state.token !== ')') {
          params.push(parseAssignment(state))

          // parse a list with parameters
          while (state.token === ',') { // eslint-disable-line no-unmodified-loop-condition
            getToken(state)
            params.push(parseAssignment(state))
          }
        }

        if (state.token !== ')') {
          throw createSyntaxError(state, 'Parenthesis ) expected')
        }
        closeParams(state)
        getToken(state)
      }

      // create a new custom node
      // noinspection JSValidateTypes
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

      getToken(state)

      if (CONSTANTS.hasOwnProperty(name)) { // true, false, null, ...
        node = new ConstantNode(CONSTANTS[name])
      } else if (NUMERIC_CONSTANTS.indexOf(name) !== -1) { // NaN, Infinity
        node = new ConstantNode(numeric(name, 'number'))
      } else {
        node = new SymbolNode(name)
      }

      // parse function parameters and matrix index
      node = parseAccessors(state, node)
      return node
    }

    return parseDoubleQuotesString(state)
  }

  /**
   * parse accessors:
   * - function invocation in round brackets (...), for example sqrt(2)
   * - index enclosed in square brackets [...], for example A[2,3]
   * - dot notation for properties, like foo.bar
   * @param {Node} node    Node on which to apply the parameters. If there
   *                       are no parameters in the expression, the node
   *                       itself is returned
   * @param {string[]} [types]  Filter the types of notations
   *                            can be ['(', '[', '.']
   * @return {Node} node
   * @private
   */
  function parseAccessors (state, node, types) {
    let params

    while ((state.token === '(' || state.token === '[' || state.token === '.') &&
        (!types || types.indexOf(state.token) !== -1)) { // eslint-disable-line no-unmodified-loop-condition
      params = []

      if (state.token === '(') {
        if (type.isSymbolNode(node) || type.isAccessorNode(node)) {
          // function invocation like fn(2, 3) or obj.fn(2, 3)
          openParams(state)
          getToken(state)

          if (state.token !== ')') {
            params.push(parseAssignment(state))

            // parse a list with parameters
            while (state.token === ',') { // eslint-disable-line no-unmodified-loop-condition
              getToken(state)
              params.push(parseAssignment(state))
            }
          }

          if (state.token !== ')') {
            throw createSyntaxError(state, 'Parenthesis ) expected')
          }
          closeParams(state)
          getToken(state)

          node = new FunctionNode(node, params)
        } else {
          // implicit multiplication like (2+3)(4+5) or sqrt(2)(1+2)
          // don't parse it here but let it be handled by parseImplicitMultiplication
          // with correct precedence
          return node
        }
      } else if (state.token === '[') {
        // index notation like variable[2, 3]
        openParams(state)
        getToken(state)

        if (state.token !== ']') {
          params.push(parseAssignment(state))

          // parse a list with parameters
          while (state.token === ',') { // eslint-disable-line no-unmodified-loop-condition
            getToken(state)
            params.push(parseAssignment(state))
          }
        }

        if (state.token !== ']') {
          throw createSyntaxError(state, 'Parenthesis ] expected')
        }
        closeParams(state)
        getToken(state)

        node = new AccessorNode(node, new IndexNode(params))
      } else {
        // dot notation like variable.prop
        getToken(state)

        if (state.tokenType !== TOKENTYPE.SYMBOL) {
          throw createSyntaxError(state, 'Property name expected after dot')
        }
        params.push(new ConstantNode(state.token))
        getToken(state)

        const dotNotation = true
        node = new AccessorNode(node, new IndexNode(params, dotNotation))
      }
    }

    return node
  }

  /**
   * Parse a double quotes string.
   * @return {Node} node
   * @private
   */
  function parseDoubleQuotesString (state) {
    let node, str

    if (state.token === '"') {
      str = parseDoubleQuotesStringToken(state)

      // create constant
      node = new ConstantNode(str)

      // parse index parameters
      node = parseAccessors(state, node)

      return node
    }

    return parseSingleQuotesString(state)
  }

  /**
   * Parse a string surrounded by double quotes "..."
   * @return {string}
   */
  function parseDoubleQuotesStringToken (state) {
    let str = ''

    while (currentCharacter(state) !== '' && currentCharacter(state) !== '"') {
      if (currentCharacter(state) === '\\') {
        // escape character, immediately process the next
        // character to prevent stopping at a next '\"'
        str += currentCharacter(state)
        next(state)
      }

      str += currentCharacter(state)
      next(state)
    }

    getToken(state)
    if (state.token !== '"') {
      throw createSyntaxError(state, 'End of string " expected')
    }
    getToken(state)

    return JSON.parse('"' + str + '"') // unescape escaped characters
  }

  /**
   * Parse a single quotes string.
   * @return {Node} node
   * @private
   */
  function parseSingleQuotesString (state) {
    let node, str

    if (state.token === '\'') {
      str = parseSingleQuotesStringToken(state)

      // create constant
      node = new ConstantNode(str)

      // parse index parameters
      node = parseAccessors(state, node)

      return node
    }

    return parseMatrix(state)
  }

  /**
   * Parse a string surrounded by single quotes '...'
   * @return {string}
   */
  function parseSingleQuotesStringToken (state) {
    let str = ''

    while (currentCharacter(state) !== '' && currentCharacter(state) !== '\'') {
      if (currentCharacter(state) === '\\') {
        // escape character, immediately process the next
        // character to prevent stopping at a next '\''
        str += currentCharacter(state)
        next(state)
      }

      str += currentCharacter(state)
      next(state)
    }

    getToken(state)
    if (state.token !== '\'') {
      throw createSyntaxError(state, 'End of string \' expected')
    }
    getToken(state)

    return JSON.parse('"' + str + '"') // unescape escaped characters
  }

  /**
   * parse the matrix
   * @return {Node} node
   * @private
   */
  function parseMatrix (state) {
    let array, params, rows, cols

    if (state.token === '[') {
      // matrix [...]
      openParams(state)
      getToken(state)

      if (state.token !== ']') {
        // this is a non-empty matrix
        const row = parseRow(state)

        if (state.token === ';') {
          // 2 dimensional array
          rows = 1
          params = [row]

          // the rows of the matrix are separated by dot-comma's
          while (state.token === ';') { // eslint-disable-line no-unmodified-loop-condition
            getToken(state)

            params[rows] = parseRow(state)
            rows++
          }

          if (state.token !== ']') {
            throw createSyntaxError(state, 'End of matrix ] expected')
          }
          closeParams(state)
          getToken(state)

          // check if the number of columns matches in all rows
          cols = params[0].items.length
          for (let r = 1; r < rows; r++) {
            if (params[r].items.length !== cols) {
              throw createError(state, 'Column dimensions mismatch ' +
                  '(' + params[r].items.length + ' !== ' + cols + ')')
            }
          }

          array = new ArrayNode(params)
        } else {
          // 1 dimensional vector
          if (state.token !== ']') {
            throw createSyntaxError(state, 'End of matrix ] expected')
          }
          closeParams(state)
          getToken(state)

          array = row
        }
      } else {
        // this is an empty matrix "[ ]"
        closeParams(state)
        getToken(state)
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

    while (state.token === ',') { // eslint-disable-line no-unmodified-loop-condition
      getToken(state)

      // parse expression
      params[len] = parseAssignment(state)
      len++
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
      let key

      const properties = {}
      do {
        getToken(state)

        if (state.token !== '}') {
          // parse key
          if (state.token === '"') {
            key = parseDoubleQuotesStringToken(state)
          } else if (state.token === '\'') {
            key = parseSingleQuotesStringToken(state)
          } else if (state.tokenType === TOKENTYPE.SYMBOL) {
            key = state.token
            getToken(state)
          } else {
            throw createSyntaxError(state, 'Symbol or string expected as object key')
          }

          // parse key/value separator
          if (state.token !== ':') {
            throw createSyntaxError(state, 'Colon : expected after object key')
          }
          getToken(state)

          // parse key
          properties[key] = parseAssignment(state)
        }
      }
      while (state.token === ',') // eslint-disable-line no-unmodified-loop-condition

      if (state.token !== '}') {
        throw createSyntaxError(state, 'Comma , or bracket } expected after object value')
      }
      getToken(state)

      let node = new ObjectNode(properties)

      // parse index parameters
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
      // this is a number
      numberStr = state.token
      getToken(state)

      return new ConstantNode(numeric(numberStr, config.number))
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

    // check if it is a parenthesized expression
    if (state.token === '(') {
      // parentheses (...)
      openParams(state)
      getToken(state)

      node = parseAssignment(state) // start again

      if (state.token !== ')') {
        throw createSyntaxError(state, 'Parenthesis ) expected')
      }
      closeParams(state)
      getToken(state)

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
      // syntax error or unexpected end of expression
      throw createSyntaxError(state, 'Unexpected end of expression')
    } else {
      throw createSyntaxError(state, 'Value expected')
    }
  }

  /**
   * Shortcut for getting the current row value (one based)
   * Returns the line of the currently handled expression
   * @private
   */
  /* TODO: implement keeping track on the row number
  function row () {
    return null
  }
  */

  /**
   * Shortcut for getting the current col value (one based)
   * Returns the column (position) where the last state.token starts
   * @private
   */
  function col (state) {
    return state.index - state.token.length + 1
  }

  /**
   * Create an error
   * @param {string} message
   * @return {SyntaxError} instantiated error
   * @private
   */
  function createSyntaxError (state, message) {
    const c = col(state)
    const error = new SyntaxError(message + ' (char ' + c + ')')
    error['char'] = c

    return error
  }

  /**
   * Create an error
   * @param {string} message
   * @return {Error} instantiated error
   * @private
   */
  function createError (state, message) {
    const c = col(state)
    const error = new SyntaxError(message + ' (char ' + c + ')')
    error['char'] = c

    return error
  }

  return parse
}

exports.name = 'parse'
exports.path = 'expression'
exports.factory = factory
