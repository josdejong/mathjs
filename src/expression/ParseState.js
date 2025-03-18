/**
 * @class ParseState
 * ParseState records an expression being parsed, and the current
 * tokenization state of that parse (position in the expression, current
 * token, etc).
 **/
export class ParseState {
  #expression = ''
  extraNodes = {} // Custom node definitions, do not mutate!
  comment = '' // last parsed comment
  index = 0 // current index in expression
  token = '' // current token
  tokenType = -1 // type of current token (index into the parse.tokenTypes)
  nestingLevel = 0 // level of nesting inside parameters; can be used, e.g,
  // ... to ignore newline characters in the arguments to a function call
  conditionalLevel = null // when a ternary conditional is being parsed,
  // ... holds the nesting level it occurs at, to disambiguate `:`
  // ... from a range until the conditional is complete.

  constructor (expression, extraNodes) {
    this.#expression = expression
    this.extraNodes = extraNodes
  }

  /**
   * View up to `length` characters of the expression starting at the
   * current character.
   * @param {number} [length=1]  Number of characters to view
   * @returns {string} upcoming _length_ characters
   */
  character (length = 1) {
    return this.#expression.substr(this.index, length)
  }

  /**
   * Advance the parsing position in the current expression, by
   * `length` characters, without otherwise changing state.
   * In essence, "consumes" these characters.
   * @param {number} [length=1] Number of characters to consume
   * @returns {string} the consumed character(s)
   **/
  next (length = 1) {
    try {
      return this.character(length)
    } finally {
      this.index += length
    }
  }

  /**
   * View the last consumed character from the expression (the one
   * preceding the current character).
   * @returns {string} the prior character
   */
  prevCharacter () {
    return this.#expression.charAt(this.index - 1)
  }

  /**
   * Preview the character _after_ the current one; shorthand for
   * this.character(2)[1]
   * @returns {string} the character after the current
   **/
  nextCharacter () {
    return this.#expression.charAt(this.index + 1)
  }

  /**
   * Add all of the immediately upcoming characters for which the given
   * `predicate` is true to the current token, consuming them.
   * @param {string => boolean} predicate  Test to include character
   * @returns {number} the number of characters added
   */
  addCharactersThat (predicate) {
    let i = 0
    while (predicate(this.#expression.charAt(this.index + i))) ++i
    this.token += this.next(i)
    return i
  }

  /**
   * Open a new level of parameters
   */
  openParams () {
    this.nestingLevel++
  }

  /**
   * Close the current level of parameters
   */
  closeParams () {
    if (--this.nestingLevel < 0) {
      throw new Error(
        'Parser error: closed parameters with no open at character ' +
        `${this.index} of "${this.expression}"`
      )
    }
  }
}
