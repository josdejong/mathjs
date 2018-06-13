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
    extraNodes = (options && options.nodes) ? options.nodes : {}

    if (typeof expr === 'string') {
      // parse a single expression
      expression = expr
      return parseStart()
    } else if (Array.isArray(expr) || expr instanceof type.Matrix) {
      // parse an array or matrix with expressions
      return deepMap(expr, function (elem) {
        if (typeof elem !== 'string') throw new TypeError('String expected')

        expression = elem
        return parseStart()
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
    '\'': true,
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

  let extraNodes = {} // current extra nodes
  let expression = '' // current expression
  let comment = '' // last parsed comment
  let index = 0 // current index in expr
  let c = '' // current token character in expr
  let token = '' // current token
  let tokenType = TOKENTYPE.NULL // type of the token
  let nestingLevel = 0 // level of nesting inside parameters, used to ignore newline characters
  let conditionalLevel = null // when a conditional is being parsed, the level of the conditional is stored here
  const tokenStates = [] // holds saved token states

  /**
   * Get the first character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function first () {
    index = 0
    c = expression.charAt(0)
    nestingLevel = 0
    conditionalLevel = null
  }

  /**
   * Get the next character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function next () {
    index++
    c = expression.charAt(index)
  }

  /**
   * Preview the previous character from the expression.
   * @return {string} cNext
   * @private
   */
  function prevPreview () {
    return expression.charAt(index - 1)
  }

  /**
   * Preview the next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextPreview () {
    return expression.charAt(index + 1)
  }

  /**
   * Preview the second next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextNextPreview () {
    return expression.charAt(index + 2)
  }

  /**
   * Save the current token state so we can rewind later if necessary.
   * @private
   */
  function pushTokenState () {
    tokenStates.push({
      tokenType: tokenType,
      token: token,
      comment: comment,
      index: index,
      c: c
    })
  }

  /**
   * Rewind the parser by one token by restoring the last saved token state
   * @private
   */
  function popTokenState () {
    const restoredState = tokenStates.pop()
    tokenType = restoredState.tokenType
    token = restoredState.token
    comment = restoredState.comment
    index = restoredState.index
    c = restoredState.c
  }

  /**
   * Discard the most recent token state without restoring it
   * @private
   */
  function discardTokenState () {
    tokenStates.pop()
  }

  /**
   * Get next token in the current string expr.
   * The token and token type are available as token and tokenType
   * @private
   */
  function getToken () {
    tokenType = TOKENTYPE.NULL
    token = ''
    comment = ''

    // skip over whitespaces
    // space, tab, and newline when inside parameters
    while (parse.isWhitespace(c, nestingLevel)) {
      next()
    }

    // skip comment
    if (c === '#') {
      while (c !== '\n' && c !== '') {
        comment += c
        next()
      }
    }

    // check for end of expression
    if (c === '') {
      // token is still empty
      tokenType = TOKENTYPE.DELIMITER
      return
    }

    // check for new line character
    if (c === '\n' && !nestingLevel) {
      tokenType = TOKENTYPE.DELIMITER
      token = c
      next()
      return
    }

    // check for delimiters consisting of 3 characters
    let c2 = c + nextPreview()
    const c3 = c2 + nextNextPreview()
    if (c3.length === 3 && DELIMITERS[c3]) {
      tokenType = TOKENTYPE.DELIMITER
      token = c3
      next()
      next()
      next()
      return
    }

    // check for delimiters consisting of 2 characters
    if (c2.length === 2 && DELIMITERS[c2]) {
      tokenType = TOKENTYPE.DELIMITER
      token = c2
      next()
      next()
      return
    }

    // check for delimiters consisting of 1 character
    if (DELIMITERS[c]) {
      tokenType = TOKENTYPE.DELIMITER
      token = c
      next()
      return
    }

    // check for a number
    if (parse.isDigitDot(c)) {
      tokenType = TOKENTYPE.NUMBER

      // get number, can have a single dot
      if (c === '.') {
        token += c
        next()

        if (!parse.isDigit(c)) {
          // this is no number, it is just a dot (can be dot notation)
          tokenType = TOKENTYPE.DELIMITER
        }
      } else {
        while (parse.isDigit(c)) {
          token += c
          next()
        }
        if (parse.isDecimalMark(c, nextPreview())) {
          token += c
          next()
        }
      }
      while (parse.isDigit(c)) {
        token += c
        next()
      }

      // check for exponential notation like "2.3e-4", "1.23e50" or "2e+4"
      c2 = nextPreview()
      if (c === 'E' || c === 'e') {
        if (parse.isDigit(c2) || c2 === '-' || c2 === '+') {
          token += c
          next()

          if (c === '+' || c === '-') {
            token += c
            next()
          }

          // Scientific notation MUST be followed by an exponent
          if (!parse.isDigit(c)) {
            throw createSyntaxError('Digit expected, got "' + c + '"')
          }

          while (parse.isDigit(c)) {
            token += c
            next()
          }

          if (parse.isDecimalMark(c, nextPreview())) {
            throw createSyntaxError('Digit expected, got "' + c + '"')
          }
        } else if (c2 === '.') {
          next()
          throw createSyntaxError('Digit expected, got "' + c + '"')
        }
      }

      return
    }

    // check for variables, functions, named operators
    if (parse.isAlpha(c, prevPreview(), nextPreview())) {
      while (parse.isAlpha(c, prevPreview(), nextPreview()) || parse.isDigit(c)) {
        token += c
        next()
      }

      if (NAMED_DELIMITERS.hasOwnProperty(token)) {
        tokenType = TOKENTYPE.DELIMITER
      } else {
        tokenType = TOKENTYPE.SYMBOL
      }

      return
    }

    // something unknown is found, wrong characters -> a syntax error
    tokenType = TOKENTYPE.UNKNOWN
    while (c !== '') {
      token += c
      next()
    }
    throw createSyntaxError('Syntax error in part "' + token + '"')
  }

  /**
   * Get next token and skip newline tokens
   */
  function getTokenSkipNewline () {
    do {
      getToken()
    }
    while (token === '\n') // eslint-disable-line no-unmodified-loop-condition
  }

  /**
   * Open parameters.
   * New line characters will be ignored until closeParams() is called
   */
  function openParams () {
    nestingLevel++
  }

  /**
   * Close parameters.
   * New line characters will no longer be ignored
   */
  function closeParams () {
    nestingLevel--
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
  function parseStart () {
    // get the first character in expression
    first()

    getToken()

    const node = parseBlock()

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and tokenType DELIMITER
    if (token !== '') {
      if (tokenType === TOKENTYPE.DELIMITER) {
        // user entered a not existing operator like "//"

        // TODO: give hints for aliases, for example with "<>" give as hint " did you mean !== ?"
        throw createError('Unexpected operator ' + token)
      } else {
        throw createSyntaxError('Unexpected part "' + token + '"')
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
  function parseBlock () {
    let node
    const blocks = []
    let visible

    if (token !== '' && token !== '\n' && token !== ';') {
      node = parseAssignment()
      node.comment = comment
    }

    // TODO: simplify this loop
    while (token === '\n' || token === ';') { // eslint-disable-line no-unmodified-loop-condition
      if (blocks.length === 0 && node) {
        visible = (token !== ';')
        blocks.push({
          node: node,
          visible: visible
        })
      }

      getToken()
      if (token !== '\n' && token !== ';' && token !== '') {
        node = parseAssignment()
        node.comment = comment

        visible = (token !== ';')
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
        node.comment = comment
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
  function parseAssignment () {
    let name, args, value, valid

    const node = parseConditional()

    if (token === '=') {
      if (type.isSymbolNode(node)) {
        // parse a variable assignment like 'a = 2/3'
        name = node.name
        getTokenSkipNewline()
        value = parseAssignment()
        return new AssignmentNode(new SymbolNode(name), value)
      } else if (type.isAccessorNode(node)) {
        // parse a matrix subset assignment like 'A[1,2] = 4'
        getTokenSkipNewline()
        value = parseAssignment()
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
          getTokenSkipNewline()
          value = parseAssignment()
          return new FunctionAssignmentNode(name, args, value)
        }
      }

      throw createSyntaxError('Invalid left hand side of assignment operator =')
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
  function parseConditional () {
    let node = parseLogicalOr()

    while (token === '?') { // eslint-disable-line no-unmodified-loop-condition
      // set a conditional level, the range operator will be ignored as long
      // as conditionalLevel === nestingLevel.
      const prev = conditionalLevel
      conditionalLevel = nestingLevel
      getTokenSkipNewline()

      const condition = node
      const trueExpr = parseAssignment()

      if (token !== ':') throw createSyntaxError('False part of conditional expression expected')

      conditionalLevel = null
      getTokenSkipNewline()

      const falseExpr = parseAssignment() // Note: check for conditional operator again, right associativity

      node = new ConditionalNode(condition, trueExpr, falseExpr)

      // restore the previous conditional level
      conditionalLevel = prev
    }

    return node
  }

  /**
   * logical or, 'x or y'
   * @return {Node} node
   * @private
   */
  function parseLogicalOr () {
    let node = parseLogicalXor()

    while (token === 'or') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline()
      node = new OperatorNode('or', 'or', [node, parseLogicalXor()])
    }

    return node
  }

  /**
   * logical exclusive or, 'x xor y'
   * @return {Node} node
   * @private
   */
  function parseLogicalXor () {
    let node = parseLogicalAnd()

    while (token === 'xor') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline()
      node = new OperatorNode('xor', 'xor', [node, parseLogicalAnd()])
    }

    return node
  }

  /**
   * logical and, 'x and y'
   * @return {Node} node
   * @private
   */
  function parseLogicalAnd () {
    let node = parseBitwiseOr()

    while (token === 'and') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline()
      node = new OperatorNode('and', 'and', [node, parseBitwiseOr()])
    }

    return node
  }

  /**
   * bitwise or, 'x | y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseOr () {
    let node = parseBitwiseXor()

    while (token === '|') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline()
      node = new OperatorNode('|', 'bitOr', [node, parseBitwiseXor()])
    }

    return node
  }

  /**
   * bitwise exclusive or (xor), 'x ^| y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseXor () {
    let node = parseBitwiseAnd()

    while (token === '^|') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline()
      node = new OperatorNode('^|', 'bitXor', [node, parseBitwiseAnd()])
    }

    return node
  }

  /**
   * bitwise and, 'x & y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseAnd () {
    let node = parseRelational()

    while (token === '&') { // eslint-disable-line no-unmodified-loop-condition
      getTokenSkipNewline()
      node = new OperatorNode('&', 'bitAnd', [node, parseRelational()])
    }

    return node
  }

  /**
   * relational operators
   * @return {Node} node
   * @private
   */
  function parseRelational () {
    let node, operators, name, fn, params

    node = parseShift()

    operators = {
      '==': 'equal',
      '!=': 'unequal',
      '<': 'smaller',
      '>': 'larger',
      '<=': 'smallerEq',
      '>=': 'largerEq'
    }
    while (operators.hasOwnProperty(token)) {
      name = token
      fn = operators[name]

      getTokenSkipNewline()
      params = [node, parseShift()]
      node = new OperatorNode(name, fn, params)
    }

    return node
  }

  /**
   * Bitwise left shift, bitwise right arithmetic shift, bitwise right logical shift
   * @return {Node} node
   * @private
   */
  function parseShift () {
    let node, operators, name, fn, params

    node = parseConversion()

    operators = {
      '<<': 'leftShift',
      '>>': 'rightArithShift',
      '>>>': 'rightLogShift'
    }

    while (operators.hasOwnProperty(token)) {
      name = token
      fn = operators[name]

      getTokenSkipNewline()
      params = [node, parseConversion()]
      node = new OperatorNode(name, fn, params)
    }

    return node
  }

  /**
   * conversion operators 'to' and 'in'
   * @return {Node} node
   * @private
   */
  function parseConversion () {
    let node, operators, name, fn, params

    node = parseRange()

    operators = {
      'to': 'to',
      'in': 'to' // alias of 'to'
    }

    while (operators.hasOwnProperty(token)) {
      name = token
      fn = operators[name]

      getTokenSkipNewline()

      if (name === 'in' && token === '') {
        // end of expression -> this is the unit 'in' ('inch')
        node = new OperatorNode('*', 'multiply', [node, new SymbolNode('in')], true)
      } else {
        // operator 'a to b' or 'a in b'
        params = [node, parseRange()]
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
  function parseRange () {
    let node
    const params = []

    if (token === ':') {
      // implicit start=1 (one-based)
      node = new ConstantNode(1)
    } else {
      // explicit start
      node = parseAddSubtract()
    }

    if (token === ':' && (conditionalLevel !== nestingLevel)) {
      // we ignore the range operator when a conditional operator is being processed on the same level
      params.push(node)

      // parse step and end
      while (token === ':' && params.length < 3) { // eslint-disable-line no-unmodified-loop-condition
        getTokenSkipNewline()

        if (token === ')' || token === ']' || token === ',' || token === '') {
          // implicit end
          params.push(new SymbolNode('end'))
        } else {
          // explicit end
          params.push(parseAddSubtract())
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
  function parseAddSubtract () {
    let node, operators, name, fn, params

    node = parseMultiplyDivide()

    operators = {
      '+': 'add',
      '-': 'subtract'
    }
    while (operators.hasOwnProperty(token)) {
      name = token
      fn = operators[name]

      getTokenSkipNewline()
      params = [node, parseMultiplyDivide()]
      node = new OperatorNode(name, fn, params)
    }

    return node
  }

  /**
   * multiply, divide, modulus
   * @return {Node} node
   * @private
   */
  function parseMultiplyDivide () {
    let node, last, operators, name, fn

    node = parseImplicitMultiplication()
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
      if (operators.hasOwnProperty(token)) {
        // explicit operators
        name = token
        fn = operators[name]

        getTokenSkipNewline()

        last = parseImplicitMultiplication()
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
  function parseImplicitMultiplication () {
    let node, last

    node = parseRule2()
    last = node

    while (true) {
      if ((tokenType === TOKENTYPE.SYMBOL) ||
          (token === 'in' && type.isConstantNode(node)) ||
          (tokenType === TOKENTYPE.NUMBER &&
              !type.isConstantNode(last) &&
              (!type.isOperatorNode(last) || last.op === '!')) ||
          (token === '(')) {
        // parse implicit multiplication
        //
        // symbol:      implicit multiplication like '2a', '(2+3)a', 'a b'
        // number:      implicit multiplication like '(2+3)2'
        // parenthesis: implicit multiplication like '2(3+4)', '(3+4)(1+2)'
        last = parseRule2()
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
  function parseRule2 () {
    let node, last

    node = parseUnary()
    last = node

    while (true) {
      // Match the "number /" part of the pattern "number / number symbol"
      if (token === '/' && type.isConstantNode(last)) {
        // Look ahead to see if the next token is a number
        pushTokenState()
        getTokenSkipNewline()

        // Match the "number / number" part of the pattern
        if (tokenType === TOKENTYPE.NUMBER) {
          // Look ahead again
          pushTokenState()
          getTokenSkipNewline()

          // Match the "symbol" part of the pattern, or a left parenthesis
          if (tokenType === TOKENTYPE.SYMBOL || token === '(') {
            // We've matched the pattern "number / number symbol".
            // Rewind once and build the "number / number" node; the symbol will be consumed later
            popTokenState()
            discardTokenState()
            last = parseUnary()
            node = new OperatorNode('/', 'divide', [node, last])
          } else {
            // Not a match, so rewind
            popTokenState()
            popTokenState()
            break
          }
        } else {
          // Not a match, so rewind
          popTokenState()
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
  function parseUnary () {
    let name, params, fn
    const operators = {
      '-': 'unaryMinus',
      '+': 'unaryPlus',
      '~': 'bitNot',
      'not': 'not'
    }

    if (operators.hasOwnProperty(token)) {
      fn = operators[token]
      name = token

      getTokenSkipNewline()
      params = [parseUnary()]

      return new OperatorNode(name, fn, params)
    }

    return parsePow()
  }

  /**
   * power
   * Note: power operator is right associative
   * @return {Node} node
   * @private
   */
  function parsePow () {
    let node, name, fn, params

    node = parseLeftHandOperators()

    if (token === '^' || token === '.^') {
      name = token
      fn = (name === '^') ? 'pow' : 'dotPow'

      getTokenSkipNewline()
      params = [node, parseUnary()] // Go back to unary, we can have '2^-3'
      node = new OperatorNode(name, fn, params)
    }

    return node
  }

  /**
   * Left hand operators: factorial x!, ctranspose x'
   * @return {Node} node
   * @private
   */
  function parseLeftHandOperators () {
    let node, operators, name, fn, params

    node = parseCustomNodes()

    operators = {
      '!': 'factorial',
      '\'': 'ctranspose'
    }

    while (operators.hasOwnProperty(token)) {
      name = token
      fn = operators[name]

      getToken()
      params = [node]

      node = new OperatorNode(name, fn, params)
      node = parseAccessors(node)
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
  function parseCustomNodes () {
    let params = []

    if (tokenType === TOKENTYPE.SYMBOL && extraNodes.hasOwnProperty(token)) {
      const CustomNode = extraNodes[token]

      getToken()

      // parse parameters
      if (token === '(') {
        params = []

        openParams()
        getToken()

        if (token !== ')') {
          params.push(parseAssignment())

          // parse a list with parameters
          while (token === ',') { // eslint-disable-line no-unmodified-loop-condition
            getToken()
            params.push(parseAssignment())
          }
        }

        if (token !== ')') {
          throw createSyntaxError('Parenthesis ) expected')
        }
        closeParams()
        getToken()
      }

      // create a new custom node
      // noinspection JSValidateTypes
      return new CustomNode(params)
    }

    return parseSymbol()
  }

  /**
   * parse symbols: functions, variables, constants, units
   * @return {Node} node
   * @private
   */
  function parseSymbol () {
    let node, name

    if (tokenType === TOKENTYPE.SYMBOL ||
        (tokenType === TOKENTYPE.DELIMITER && token in NAMED_DELIMITERS)) {
      name = token

      getToken()

      if (CONSTANTS.hasOwnProperty(name)) { // true, false, null, ...
        node = new ConstantNode(CONSTANTS[name])
      } else if (NUMERIC_CONSTANTS.indexOf(name) !== -1) { // NaN, Infinity
        node = new ConstantNode(numeric(name))
      } else {
        node = new SymbolNode(name)
      }

      // parse function parameters and matrix index
      node = parseAccessors(node)
      return node
    }

    return parseString()
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
  function parseAccessors (node, types) {
    let params

    while ((token === '(' || token === '[' || token === '.') &&
        (!types || types.indexOf(token) !== -1)) { // eslint-disable-line no-unmodified-loop-condition
      params = []

      if (token === '(') {
        if (type.isSymbolNode(node) || type.isAccessorNode(node)) {
          // function invocation like fn(2, 3) or obj.fn(2, 3)
          openParams()
          getToken()

          if (token !== ')') {
            params.push(parseAssignment())

            // parse a list with parameters
            while (token === ',') { // eslint-disable-line no-unmodified-loop-condition
              getToken()
              params.push(parseAssignment())
            }
          }

          if (token !== ')') {
            throw createSyntaxError('Parenthesis ) expected')
          }
          closeParams()
          getToken()

          node = new FunctionNode(node, params)
        } else {
          // implicit multiplication like (2+3)(4+5) or sqrt(2)(1+2)
          // don't parse it here but let it be handled by parseImplicitMultiplication
          // with correct precedence
          return node
        }
      } else if (token === '[') {
        // index notation like variable[2, 3]
        openParams()
        getToken()

        if (token !== ']') {
          params.push(parseAssignment())

          // parse a list with parameters
          while (token === ',') { // eslint-disable-line no-unmodified-loop-condition
            getToken()
            params.push(parseAssignment())
          }
        }

        if (token !== ']') {
          throw createSyntaxError('Parenthesis ] expected')
        }
        closeParams()
        getToken()

        node = new AccessorNode(node, new IndexNode(params))
      } else {
        // dot notation like variable.prop
        getToken()

        if (tokenType !== TOKENTYPE.SYMBOL) {
          throw createSyntaxError('Property name expected after dot')
        }
        params.push(new ConstantNode(token))
        getToken()

        const dotNotation = true
        node = new AccessorNode(node, new IndexNode(params, dotNotation))
      }
    }

    return node
  }

  /**
   * parse a string.
   * A string is enclosed by double quotes
   * @return {Node} node
   * @private
   */
  function parseString () {
    let node, str

    if (token === '"') {
      str = parseStringToken()

      // create constant
      node = new ConstantNode(str)

      // parse index parameters
      node = parseAccessors(node)

      return node
    }

    return parseMatrix()
  }

  /**
   * Parse a string surrounded by double quotes "..."
   * @return {string}
   */
  function parseStringToken () {
    let str = ''

    while (c !== '' && c !== '"') {
      if (c === '\\') {
        // escape character, immediately process the next
        // character to prevent stopping at a next '\"'
        str += c
        next()
      }

      str += c
      next()
    }

    getToken()
    if (token !== '"') {
      throw createSyntaxError('End of string " expected')
    }
    getToken()

    return JSON.parse('"' + str + '"') // unescape escaped characters
  }

  /**
   * parse the matrix
   * @return {Node} node
   * @private
   */
  function parseMatrix () {
    let array, params, rows, cols

    if (token === '[') {
      // matrix [...]
      openParams()
      getToken()

      if (token !== ']') {
        // this is a non-empty matrix
        const row = parseRow()

        if (token === ';') {
          // 2 dimensional array
          rows = 1
          params = [row]

          // the rows of the matrix are separated by dot-comma's
          while (token === ';') { // eslint-disable-line no-unmodified-loop-condition
            getToken()

            params[rows] = parseRow()
            rows++
          }

          if (token !== ']') {
            throw createSyntaxError('End of matrix ] expected')
          }
          closeParams()
          getToken()

          // check if the number of columns matches in all rows
          cols = params[0].items.length
          for (let r = 1; r < rows; r++) {
            if (params[r].items.length !== cols) {
              throw createError('Column dimensions mismatch ' +
                  '(' + params[r].items.length + ' !== ' + cols + ')')
            }
          }

          array = new ArrayNode(params)
        } else {
          // 1 dimensional vector
          if (token !== ']') {
            throw createSyntaxError('End of matrix ] expected')
          }
          closeParams()
          getToken()

          array = row
        }
      } else {
        // this is an empty matrix "[ ]"
        closeParams()
        getToken()
        array = new ArrayNode([])
      }

      return parseAccessors(array)
    }

    return parseObject()
  }

  /**
   * Parse a single comma-separated row from a matrix, like 'a, b, c'
   * @return {ArrayNode} node
   */
  function parseRow () {
    const params = [parseAssignment()]
    let len = 1

    while (token === ',') { // eslint-disable-line no-unmodified-loop-condition
      getToken()

      // parse expression
      params[len] = parseAssignment()
      len++
    }

    return new ArrayNode(params)
  }

  /**
   * parse an object, enclosed in angle brackets{...}, for example {value: 2}
   * @return {Node} node
   * @private
   */
  function parseObject () {
    if (token === '{') {
      let key

      const properties = {}
      do {
        getToken()

        if (token !== '}') {
          // parse key
          if (token === '"') {
            key = parseStringToken()
          } else if (tokenType === TOKENTYPE.SYMBOL) {
            key = token
            getToken()
          } else {
            throw createSyntaxError('Symbol or string expected as object key')
          }

          // parse key/value separator
          if (token !== ':') {
            throw createSyntaxError('Colon : expected after object key')
          }
          getToken()

          // parse key
          properties[key] = parseAssignment()
        }
      }
      while (token === ',') // eslint-disable-line no-unmodified-loop-condition

      if (token !== '}') {
        throw createSyntaxError('Comma , or bracket } expected after object value')
      }
      getToken()

      let node = new ObjectNode(properties)

      // parse index parameters
      node = parseAccessors(node)

      return node
    }

    return parseNumber()
  }

  /**
   * parse a number
   * @return {Node} node
   * @private
   */
  function parseNumber () {
    let numberStr

    if (tokenType === TOKENTYPE.NUMBER) {
      // this is a number
      numberStr = token
      getToken()

      return new ConstantNode(numeric(numberStr, config.number))
    }

    return parseParentheses()
  }

  /**
   * parentheses
   * @return {Node} node
   * @private
   */
  function parseParentheses () {
    let node

    // check if it is a parenthesized expression
    if (token === '(') {
      // parentheses (...)
      openParams()
      getToken()

      node = parseAssignment() // start again

      if (token !== ')') {
        throw createSyntaxError('Parenthesis ) expected')
      }
      closeParams()
      getToken()

      node = new ParenthesisNode(node)
      node = parseAccessors(node)
      return node
    }

    return parseEnd()
  }

  /**
   * Evaluated when the expression is not yet ended but expected to end
   * @return {Node} res
   * @private
   */
  function parseEnd () {
    if (token === '') {
      // syntax error or unexpected end of expression
      throw createSyntaxError('Unexpected end of expression')
    } else if (token === "'") {
      throw createSyntaxError('Value expected. Note: strings must be enclosed by double quotes')
    } else {
      throw createSyntaxError('Value expected')
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
   * Returns the column (position) where the last token starts
   * @private
   */
  function col () {
    return index - token.length + 1
  }

  /**
   * Create an error
   * @param {string} message
   * @return {SyntaxError} instantiated error
   * @private
   */
  function createSyntaxError (message) {
    const c = col()
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
  function createError (message) {
    const c = col()
    const error = new SyntaxError(message + ' (char ' + c + ')')
    error['char'] = c

    return error
  }

  return parse
}

exports.name = 'parse'
exports.path = 'expression'
exports.factory = factory
