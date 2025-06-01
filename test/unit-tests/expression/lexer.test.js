import assert from 'assert'
import {
  TOKENTYPE,
  DELIMITERS,
  NAMED_DELIMITERS,
  CONSTANTS,
  NUMERIC_CONSTANTS,
  ESCAPE_CHARACTERS,
  getToken,
  getTokenSkipNewline,
  isAlpha,
  isValidLatinOrGreek,
  isValidMathSymbol,
  isWhitespace,
  isDecimalMark,
  isDigitDot,
  isDigit,
  isHexDigit,
  currentCharacter,
  next,
  currentString
} from '../../../src/expression/lexer.js'

describe('lexer.js', () => {
  const createInitialState = (expression, index = 0, nestingLevel = 0) => ({
    expression,
    index,
    token: '',
    tokenType: TOKENTYPE.NULL,
    nestingLevel,
    comment: ''
  })

  describe('getToken and getTokenSkipNewline', () => {
    it('should tokenize a simple number', () => {
      const state = createInitialState('123')
      getToken(state)
      assert.strictEqual(state.token, '123')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)
    })

    it('should tokenize a number with decimal', () => {
      const state = createInitialState('3.14')
      getToken(state)
      assert.strictEqual(state.token, '3.14')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)
    })

    it('should tokenize a symbol', () => {
      const state = createInitialState('x')
      getToken(state)
      assert.strictEqual(state.token, 'x')
      assert.strictEqual(state.tokenType, TOKENTYPE.SYMBOL)
    })

    it('should tokenize an operator', () => {
      const state = createInitialState('+')
      getToken(state)
      assert.strictEqual(state.token, '+')
      assert.strictEqual(state.tokenType, TOKENTYPE.DELIMITER)
      assert.ok(DELIMITERS[state.token])
    })

    it('should tokenize a two-character operator', () => {
      const state = createInitialState('>=')
      getToken(state)
      assert.strictEqual(state.token, '>=')
      assert.strictEqual(state.tokenType, TOKENTYPE.DELIMITER)
    })

    it('should tokenize a three-character operator', () => {
      const state = createInitialState('>>>')
      getToken(state)
      assert.strictEqual(state.token, '>>>')
      assert.strictEqual(state.tokenType, TOKENTYPE.DELIMITER)
    })

    it('should skip whitespace', () => {
      const state = createInitialState('   123')
      getToken(state)
      assert.strictEqual(state.token, '123')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)
    })

    it('should skip comments', () => {
      const state = createInitialState('# this is a comment\n42')
      getToken(state)
      assert.strictEqual(state.token, '42')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)
      assert.strictEqual(state.comment, '# this is a comment')
    })

    it('should handle newline as a delimiter when not nested', () => {
      const state = createInitialState('\n', 0, 0)
      getToken(state)
      assert.strictEqual(state.token, '\n')
      assert.strictEqual(state.tokenType, TOKENTYPE.DELIMITER)
    })

    it('should skip newline when nested', () => {
      const state = createInitialState('\n  abc', 0, 1) // nestingLevel = 1
      getToken(state)
      assert.strictEqual(state.token, 'abc')
      assert.strictEqual(state.tokenType, TOKENTYPE.SYMBOL)
    })

    it('getTokenSkipNewline should skip newlines', () => {
      const state = createInitialState('\n\n  xyz')
      getTokenSkipNewline(state)
      assert.strictEqual(state.token, 'xyz')
      assert.strictEqual(state.tokenType, TOKENTYPE.SYMBOL)
    })

    it('should tokenize named delimiters', () => {
      const state = createInitialState('mod')
      getToken(state)
      assert.strictEqual(state.token, 'mod')
      assert.strictEqual(state.tokenType, TOKENTYPE.DELIMITER)
      assert.ok(NAMED_DELIMITERS[state.token])
    })

    it('should tokenize hex numbers', () => {
      const state = createInitialState('0x1A')
      getToken(state)
      assert.strictEqual(state.token, '0x1A')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)
    })

    it('should tokenize octal numbers', () => {
      const state = createInitialState('0o72')
      getToken(state)
      assert.strictEqual(state.token, '0o72')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)
    })

    it('should tokenize binary numbers', () => {
      const state = createInitialState('0b101')
      getToken(state)
      assert.strictEqual(state.token, '0b101')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)
    })

    it('should tokenize numbers with exponent', () => {
      let state = createInitialState('1.2e3')
      getToken(state)
      assert.strictEqual(state.token, '1.2e3')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)

      state = createInitialState('0.5E-2')
      getToken(state)
      assert.strictEqual(state.token, '0.5E-2')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)

      state = createInitialState('4e+4')
      getToken(state)
      assert.strictEqual(state.token, '4e+4')
      assert.strictEqual(state.tokenType, TOKENTYPE.NUMBER)
    })

    it('should throw Error for invalid exponent', () => {
      assert.throws(() => getToken(createInitialState('1.2e')), Error, /Digit expected/)
      assert.throws(() => getToken(createInitialState('1.2eA')), Error, /Digit expected/)
      assert.throws(() => getToken(createInitialState('1.2e.')), Error, /Digit expected/)
    })

    it('should throw Error for unknown character', () => {
      assert.throws(() => getToken(createInitialState('@')), Error, /Syntax error in part "@"/)
    })

    it('should identify end of expression', () => {
      const state = createInitialState('')
      getToken(state)
      assert.strictEqual(state.token, '')
      assert.strictEqual(state.tokenType, TOKENTYPE.DELIMITER)
    })

    it('should tokenize a dot as delimiter if not part of a number', () => {
      const state = createInitialState('.')
      getToken(state)
      assert.strictEqual(state.token, '.')
      assert.strictEqual(state.tokenType, TOKENTYPE.DELIMITER)
    })
  })

  describe('Character Classification Functions', () => {
    it('isAlpha', () => {
      assert.ok(isAlpha('a', '', ''))
      assert.ok(isAlpha('Z', '', ''))
      assert.ok(isAlpha('_', '', ''))
      assert.ok(isAlpha('$', '', ''))
      assert.ok(isAlpha('\u00C0', '', '')) // Latin A with grave
      assert.ok(isAlpha('\u03B1', '', '')) // Greek alpha
      assert.ok(isAlpha('\uD835', '', '\uDC00')) // Math symbol (surrogate pair start)
      assert.ok(isAlpha('\uDC00', '\uD835', '')) // Math symbol (surrogate pair end)
      assert.strictEqual(isAlpha('1', '', ''), false)
      assert.strictEqual(isAlpha('.', '', ''), false)
      assert.strictEqual(isAlpha(' ', '', ''), false)
    })

    it('isValidLatinOrGreek', () => {
      assert.ok(isValidLatinOrGreek('a'))
      assert.ok(isValidLatinOrGreek('Z'))
      assert.ok(isValidLatinOrGreek('_'))
      assert.ok(isValidLatinOrGreek('$'))
      assert.ok(isValidLatinOrGreek('\u00C0'))
      assert.ok(isValidLatinOrGreek('\u02AF'))
      assert.ok(isValidLatinOrGreek('\u0370'))
      assert.ok(isValidLatinOrGreek('\u03FF'))
      assert.ok(isValidLatinOrGreek('\u2100')) // Letterlike symbols block start
      assert.ok(isValidLatinOrGreek('\u214F')) // Letterlike symbols block end
      assert.strictEqual(isValidLatinOrGreek('1'), false)
      assert.strictEqual(isValidLatinOrGreek('\uD835'), false) // Surrogate pair char
    })

    it('isValidMathSymbol', () => {
      assert.ok(isValidMathSymbol('\uD835', '\uDC00')) // Valid start of math symbol block
      assert.ok(isValidMathSymbol('\uD835', '\uDFFF')) // Valid end of math symbol block
      assert.strictEqual(isValidMathSymbol('\uD835', '\uDC55'), false) // Excluded char
      assert.strictEqual(isValidMathSymbol('a', 'b'), false)
      assert.strictEqual(isValidMathSymbol('\uD835', ''), false)
    })

    it('isWhitespace', () => {
      assert.ok(isWhitespace(' ', 0))
      assert.ok(isWhitespace('\t', 0))
      assert.ok(isWhitespace('\n', 1)) // Newline is whitespace if nestingLevel > 0
      assert.strictEqual(isWhitespace('\n', 0), false) // Newline is NOT plain whitespace if nestingLevel == 0
      assert.strictEqual(isWhitespace('a', 0), false)
    })

    it('isDecimalMark', () => {
      assert.ok(isDecimalMark('.', '1'))
      assert.strictEqual(isDecimalMark('.', '*'), false)
      assert.strictEqual(isDecimalMark('.', '/'), false)
      assert.strictEqual(isDecimalMark('.', '^'), false)
      assert.strictEqual(isDecimalMark(',', '1'), false)
    })

    it('isDigitDot', () => {
      assert.ok(isDigitDot('1'))
      assert.ok(isDigitDot('.'))
      assert.strictEqual(isDigitDot('a'), false)
    })

    it('isDigit', () => {
      assert.ok(isDigit('0'))
      assert.ok(isDigit('9'))
      assert.strictEqual(isDigit('.'), false)
      assert.strictEqual(isDigit('a'), false)
    })

    it('isHexDigit', () => {
      assert.ok(isHexDigit('0'))
      assert.ok(isHexDigit('9'))
      assert.ok(isHexDigit('a'))
      assert.ok(isHexDigit('f'))
      assert.ok(isHexDigit('A'))
      assert.ok(isHexDigit('F'))
      assert.strictEqual(isHexDigit('g'), false)
      assert.strictEqual(isHexDigit('G'), false)
      assert.strictEqual(isHexDigit('.'), false)
    })
  })

  describe('Constants', () => {
    it('TOKENTYPE should have correct values', () => {
      assert.strictEqual(TOKENTYPE.NULL, 0)
      assert.strictEqual(TOKENTYPE.DELIMITER, 1)
      assert.strictEqual(TOKENTYPE.NUMBER, 2)
      assert.strictEqual(TOKENTYPE.SYMBOL, 3)
      assert.strictEqual(TOKENTYPE.UNKNOWN, 4)
    })

    it('DELIMITERS should contain common delimiters', () => {
      assert.ok(DELIMITERS[','])
      assert.ok(DELIMITERS['('])
      assert.ok(DELIMITERS['+'])
      assert.ok(DELIMITERS['=='])
    })

    it('NAMED_DELIMITERS should contain named operators', () => {
      assert.ok(NAMED_DELIMITERS.mod)
      assert.ok(NAMED_DELIMITERS.to)
      assert.ok(NAMED_DELIMITERS.in)
      assert.ok(NAMED_DELIMITERS.and)
    })

    it('ESCAPE_CHARACTERS should contain common escapes', () => {
      assert.strictEqual(ESCAPE_CHARACTERS['"'], '"')
      assert.strictEqual(ESCAPE_CHARACTERS.n, '\n')
      assert.strictEqual(ESCAPE_CHARACTERS.t, '\t')
    })

    it('CONSTANTS should be defined', () => {
      assert.strictEqual(CONSTANTS.true, true)
      assert.strictEqual(CONSTANTS.false, false)
      assert.strictEqual(CONSTANTS.null, null)
      assert.strictEqual(CONSTANTS.undefined, undefined)
    })

    it('NUMERIC_CONSTANTS should be defined', () => {
      assert.ok(NUMERIC_CONSTANTS.includes('NaN'))
      assert.ok(NUMERIC_CONSTANTS.includes('Infinity'))
    })
  })

  // Minimal tests for currentCharacter, next, currentString as they are simple helpers
  describe('State Helper Functions (Minimal)', () => {
    it('currentCharacter should return current char', () => {
      const state = createInitialState('abc')
      assert.strictEqual(currentCharacter(state), 'a')
    })
    it('next should advance index', () => {
      const state = createInitialState('abc')
      next(state)
      assert.strictEqual(state.index, 1)
      assert.strictEqual(currentCharacter(state), 'b')
    })
    it('currentString should return substring', () => {
      const state = createInitialState('hello')
      assert.strictEqual(currentString(state, 2), 'he')
    })
  })
})
