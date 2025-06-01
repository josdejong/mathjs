// token types enumeration
export const TOKENTYPE = {
  NULL: 0,
  DELIMITER: 1,
  NUMBER: 2,
  SYMBOL: 3,
  UNKNOWN: 4
}

// map with all delimiters
export const DELIMITERS = {
  ',': true,
  '(': true,
  ')': true,
  '[': true,
  ']': true,
  '{': true,
  '}': true,
  '"': true,
  "'": true,
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
export const NAMED_DELIMITERS = {
  mod: true,
  to: true,
  in: true,
  and: true,
  xor: true,
  or: true,
  not: true
}

export const CONSTANTS = {
  true: true,
  false: false,
  null: null,
  undefined
}

export const NUMERIC_CONSTANTS = [
  'NaN',
  'Infinity'
]

export const ESCAPE_CHARACTERS = {
  '"': '"',
  "'": "'",
  '\\': '\\',
  '/': '/',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t'
  // note that \u is handled separately in parseStringToken()
}

/**
 * View upto `length` characters of the expression starting at the current character.
 *
 * @param {Object} state
 * @param {number} [length=1] Number of characters to view
 * @returns {string}
 * @private
 */
export function currentString (state, length) {
  return state.expression.substr(state.index, length)
}

/**
 * View the current character. Returns '' if end of expression is reached.
 *
 * @param {Object} state
 * @returns {string}
 * @private
 */
export function currentCharacter (state) {
  return currentString(state, 1)
}

/**
 * Get the next character from the expression.
 * The character is stored into the char c. If the end of the expression is
 * reached, the function puts an empty string in c.
 * @private
 */
export function next (state) {
  state.index++
}

/**
 * Preview the previous character from the expression.
 * @return {string} cNext
 * @private
 */
export function prevCharacter (state) {
  return state.expression.charAt(state.index - 1)
}

/**
 * Preview the next character from the expression.
 * @return {string} cNext
 * @private
 */
export function nextCharacter (state) {
  return state.expression.charAt(state.index + 1)
}

/**
 * Get next token in the current string expr.
 * The token and token type are available as token and tokenType
 * @private
 */
export function getToken (state) {
  state.tokenType = TOKENTYPE.NULL
  state.token = ''
  state.comment = ''

  // Skip comments and whitespace
  while (true) {
    const char = currentCharacter(state)
    if (isWhitespace(char, state.nestingLevel)) {
      next(state)
      continue
    }
    if (char === '#') {
      let currentLineComment = ''
      while (currentCharacter(state) !== '\n' && currentCharacter(state) !== '') {
        currentLineComment += currentCharacter(state)
        next(state)
      }
      state.comment = currentLineComment // Store the last encountered comment line

      // If comment ended with a newline and we are not nested, consume it as part of comment skipping
      if (currentCharacter(state) === '\n' && state.nestingLevel === 0) {
        next(state)
      }
      continue // Restart loop to check for more comments/whitespace
    }
    break // No whitespace, no comment, proceed to tokenization
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
  if (isDigitDot(c1)) {
    state.tokenType = TOKENTYPE.NUMBER

    // check for binary, octal, or hex
    const c2 = currentString(state, 2)
    if (c2 === '0b' || c2 === '0o' || c2 === '0x') {
      state.token += currentCharacter(state)
      next(state)
      state.token += currentCharacter(state)
      next(state)
      while (isHexDigit(currentCharacter(state))) {
        state.token += currentCharacter(state)
        next(state)
      }
      if (currentCharacter(state) === '.') {
        // this number has a radix point
        state.token += '.'
        next(state)
        // get the digits after the radix
        while (isHexDigit(currentCharacter(state))) {
          state.token += currentCharacter(state)
          next(state)
        }
      } else if (currentCharacter(state) === 'i') {
        // this number has a word size suffix
        state.token += 'i'
        next(state)
        // get the word size
        while (isDigit(currentCharacter(state))) {
          state.token += currentCharacter(state)
          next(state)
        }
      }
      return
    }

    // get number, can have a single dot
    if (currentCharacter(state) === '.') {
      state.token += currentCharacter(state)
      next(state)

      if (!isDigit(currentCharacter(state))) {
        // this is no number, it is just a dot (can be dot notation)
        state.tokenType = TOKENTYPE.DELIMITER
        return
      }
    } else {
      while (isDigit(currentCharacter(state))) {
        state.token += currentCharacter(state)
        next(state)
      }
      if (isDecimalMark(currentCharacter(state), nextCharacter(state))) {
        state.token += currentCharacter(state)
        next(state)
      }
    }

    while (isDigit(currentCharacter(state))) {
      state.token += currentCharacter(state)
      next(state)
    }
    // check for exponential notation like "2.3e-4", "1.23e50" or "2e+4"
    if (currentCharacter(state) === 'E' || currentCharacter(state) === 'e') {
      if (isDigit(nextCharacter(state)) || nextCharacter(state) === '-' || nextCharacter(state) === '+') {
        state.token += currentCharacter(state)
        next(state)

        if (currentCharacter(state) === '+' || currentCharacter(state) === '-') {
          state.token += currentCharacter(state)
          next(state)
        }
        // Scientific notation MUST be followed by an exponent
        if (!isDigit(currentCharacter(state))) {
          throw new Error('Digit expected, got "' + currentCharacter(state) + '"')
        }

        while (isDigit(currentCharacter(state))) {
          state.token += currentCharacter(state)
          next(state)
        }

        if (isDecimalMark(currentCharacter(state), nextCharacter(state))) {
          throw new Error('Digit expected, got "' + currentCharacter(state) + '"')
        }
      } else if (nextCharacter(state) === '.') {
        // like '1.2e.'
        next(state) // consume 'e'
        // currentCharacter(state) is now '.'
        throw new Error('Digit expected, got "' + currentCharacter(state) + '"')
      } else {
        // like '1.2e' or '1.2eA'
        // The 'e' or 'E' is part of the number, but it's not valid scientific notation
        throw new Error('Digit expected after exponent, got "' + nextCharacter(state) + '"')
      }
    }

    return
  }

  // check for variables, functions, named operators
  if (isAlpha(currentCharacter(state), prevCharacter(state), nextCharacter(state))) {
    while (isAlpha(currentCharacter(state), prevCharacter(state), nextCharacter(state)) || isDigit(currentCharacter(state))) {
      state.token += currentCharacter(state)
      next(state)
    }

    if (NAMED_DELIMITERS[state.token]) { // Check against NAMED_DELIMITERS directly
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
  throw new Error('Syntax error in part "' + state.token + '"')
}

/**
 * Get next token and skip newline tokens
 */
export function getTokenSkipNewline (state) {
  do {
    getToken(state)
  }
  while (state.token === '\n') // eslint-disable-line no-unmodified-loop-condition
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
export function isAlpha (c, cPrev, cNext) {
  return isValidLatinOrGreek(c) ||
      isValidMathSymbol(c, cNext) ||
      isValidMathSymbol(cPrev, c)
}

/**
 * Test whether a character is a valid latin, greek, or letter-like character
 * @param {string} c
 * @return {boolean}
 */
export function isValidLatinOrGreek (c) {
  return /^[a-zA-Z_$\u00C0-\u02AF\u0370-\u03FF\u2100-\u214F]$/.test(c)
}

/**
 * Test whether two given 16 bit characters form a surrogate pair of a
 * unicode math symbol.
 *
 * https://unicode-table.com/en/
 * https://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
 *
 * Note: In ES6 will be unicode aware:
 * https://stackoverflow.com/questions/280712/javascript-unicode-regexes
 * https://mathiasbynens.be/notes/es6-unicode-regex
 *
 * @param {string} high
 * @param {string} low
 * @return {boolean}
 */
export function isValidMathSymbol (high, low) {
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
export function isWhitespace (c, nestingLevel) {
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
export function isDecimalMark (c, cNext) {
  return c === '.' && cNext !== '/' && cNext !== '*' && cNext !== '^'
}

/**
 * checks if the given char c is a digit or dot
 * @param {string} c   a string with one character
 * @return {boolean}
 */
export function isDigitDot (c) {
  return ((c >= '0' && c <= '9') || c === '.')
}

/**
 * checks if the given char c is a digit
 * @param {string} c   a string with one character
 * @return {boolean}
 */
export function isDigit (c) {
  return (c >= '0' && c <= '9')
}

/**
 * checks if the given char c is a hex digit
 * @param {string} c   a string with one character
 * @return {boolean}
 */
export function isHexDigit (c) {
  return ((c >= '0' && c <= '9') ||
          (c >= 'a' && c <= 'f') ||
          (c >= 'A' && c <= 'F'))
}

// The createSyntaxError function is not part of this file yet.
// The createSyntaxError function has been moved to error.js
// It will be imported from there in a later refactoring step
// when parse.js is updated to use the new module structure.
