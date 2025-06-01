import assert from 'assert'
import {
  col,
  createSyntaxError,
  createError
} from '../../../src/expression/error.js'

describe('error.js', () => {
  describe('col', () => {
    it('should calculate the correct column number', () => {
      const state1 = { index: 10, token: 'abc' } // 10 - 3 + 1 = 8
      assert.strictEqual(col(state1), 8)

      const state2 = { index: 5, token: 'xy' } // 5 - 2 + 1 = 4
      assert.strictEqual(col(state2), 4)

      const state3 = { index: 0, token: '' } // 0 - 0 + 1 = 1
      assert.strictEqual(col(state3), 1)

      const state4 = { index: 7, token: 'longtok' } // 7 - 7 + 1 = 1
      assert.strictEqual(col(state4), 1)
    })
  })

  describe('createSyntaxError', () => {
    it('should create a SyntaxError with correct message and properties', () => {
      const state = { index: 10, token: 'test' } // col = 10 - 4 + 1 = 7
      const message = 'Something went wrong'
      const error = createSyntaxError(state, message)

      assert.ok(error instanceof SyntaxError)
      assert.strictEqual(error.message, 'Something went wrong (char 7)')
      assert.strictEqual(error.char, 7)
    })

    it('should handle empty token string for column calculation', () => {
      const state = { index: 5, token: '' } // col = 5 - 0 + 1 = 6
      const message = 'Empty token issue'
      const error = createSyntaxError(state, message)

      assert.ok(error instanceof SyntaxError)
      assert.strictEqual(error.message, 'Empty token issue (char 6)')
      assert.strictEqual(error.char, 6)
    })
  })

  describe('createError', () => {
    it('should create an Error (currently SyntaxError) with correct message and properties', () => {
      const state = { index: 12, token: 'operator' } // col = 12 - 8 + 1 = 5
      const message = 'Invalid operator'
      const error = createError(state, message)

      // The current implementation of createError in error.js returns an Error.
      assert.ok(error instanceof Error)
      assert.ok(!(error instanceof SyntaxError)) // Ensure it's not a SyntaxError
      assert.strictEqual(error.message, 'Invalid operator (char 5)')
      assert.strictEqual(error.char, 5)
    })

    it('should handle different message for createError', () => {
      const state = { index: 3, token: 'a' } // col = 3 - 1 + 1 = 3
      const message = 'Custom error'
      const error = createError(state, message)

      assert.ok(error instanceof Error)
      assert.ok(!(error instanceof SyntaxError)) // Ensure it's not a SyntaxError
      assert.strictEqual(error.message, 'Custom error (char 3)')
      assert.strictEqual(error.char, 3)
    })
  })
})
