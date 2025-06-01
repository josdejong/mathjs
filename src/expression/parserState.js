import { TOKENTYPE } from '../expression/lexer.js'

export function initialState () {
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
 * Open parameters.
 * New line characters will be ignored until closeParams(state) is called
 */
export function openParams (state) {
  state.nestingLevel++
}

/**
 * Close parameters.
 * New line characters will no longer be ignored
 */
export function closeParams (state) {
  state.nestingLevel--
}
