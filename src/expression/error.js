/**
 * Shortcut for getting the current col value (one based)
 * Returns the column (position) where the last state.token starts
 * @param {Object} state
 * @return {number}
 * @private
 */
export function col (state) {
  return state.index - state.token.length + 1
}

/**
 * Create a syntax error with the message:
 *     'Syntax error in part "<part>" (char <char>)'
 * @param {Object} state
 * @param {string} message
 * @return {SyntaxError} instantiated error
 * @private
 */
export function createSyntaxError (state, message) {
  const c = col(state)
  const error = new SyntaxError(message + ' (char ' + c + ')')
  error.char = c
  return error
}

/**
 * Create an error with the message:
 *     '<message> (char <char>)'
 * @param {Object} state
 * @param {string} message
 * @return {Error} instantiated error
 * @private
 */
export function createError (state, message) {
  const c = col(state)
  const error = new Error(message + ' (char ' + c + ')') // Changed to regular Error as per original type, can be SyntaxError if preferred
  error.char = c
  return error
}
