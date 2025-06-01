import assert from 'assert'
import {
  initialState,
  openParams,
  closeParams
} from '../../../src/expression/parserState.js'
import { TOKENTYPE } from '../../../src/expression/lexer.js'

describe('parserState.js', () => {
  describe('initialState', () => {
    it('should return a state object with correct default values', () => {
      const state = initialState()
      assert.deepStrictEqual(state.extraNodes, {})
      assert.strictEqual(state.expression, '')
      assert.strictEqual(state.comment, '')
      assert.strictEqual(state.index, 0)
      assert.strictEqual(state.token, '')
      assert.strictEqual(state.tokenType, TOKENTYPE.NULL)
      assert.strictEqual(state.nestingLevel, 0)
      assert.strictEqual(state.conditionalLevel, null)
    })
  })

  describe('openParams', () => {
    it('should increment nestingLevel by 1', () => {
      const state = { nestingLevel: 0 }
      openParams(state)
      assert.strictEqual(state.nestingLevel, 1)
    })

    it('should increment nestingLevel multiple times', () => {
      const state = { nestingLevel: 1 }
      openParams(state)
      assert.strictEqual(state.nestingLevel, 2)
      openParams(state)
      assert.strictEqual(state.nestingLevel, 3)
    })
  })

  describe('closeParams', () => {
    it('should decrement nestingLevel by 1', () => {
      const state = { nestingLevel: 2 }
      closeParams(state)
      assert.strictEqual(state.nestingLevel, 1)
    })

    it('should decrement nestingLevel multiple times', () => {
      const state = { nestingLevel: 3 }
      closeParams(state)
      assert.strictEqual(state.nestingLevel, 2)
      closeParams(state)
      assert.strictEqual(state.nestingLevel, 1)
    })

    it('should handle decrementing to zero', () => {
      const state = { nestingLevel: 1 }
      closeParams(state)
      assert.strictEqual(state.nestingLevel, 0)
    })

    it('should handle decrementing below zero (though not typical in parsing logic)', () => {
      const state = { nestingLevel: 0 }
      closeParams(state)
      assert.strictEqual(state.nestingLevel, -1) // Behavior is to just decrement
    })
  })
})
