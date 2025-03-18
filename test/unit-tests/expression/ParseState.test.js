import assert from 'assert'

import { ParseState } from '../../../src/expression/ParseState.js'

describe('ParseState', function () {
  let state = null

  beforeEach(function () {
    state = new ParseState('(a+b) / 2 # Just an average formula\nx+3', {})
  })

  afterEach(function () {
    state = null
  })

  it('returns the current character(s)', function () {
    assert.strictEqual(state.character(), '(')
    assert.strictEqual(state.next(3), '(a+')
    assert.strictEqual(state.character(2), 'b)')
  })

  it('lets you peek at the previous and next characters', function () {
    assert.strictEqual(state.prevCharacter(), '')
    assert.strictEqual(state.nextCharacter(), 'a')
    state.next()
    assert.strictEqual(state.prevCharacter(), '(')
    assert.strictEqual(state.nextCharacter(), '+')
  })

  it('lets you skip characters satisfying a predicate', function () {
    assert.strictEqual(state.skipCharactersThat(c => c < '0' || c > '9'), 8)
    assert.strictEqual(state.character(), '2')
  })

  it('lets you add characters satisfying predicate to token', function () {
    assert.strictEqual(state.addCharactersThat(c => c < 'a' || c > 'z'), 1)
    assert.strictEqual(state.token, '(')
  })

  it('lets you read a comment defined by delimiters', function () {
    assert.strictEqual(state.skipCharactersThat(c => c !== '#'), 10)
    assert(!state.readComment('#', '\n'))
    assert.strictEqual(state.character(), '\n')
    assert.strictEqual(state.comment, '# Just an average formula')
    assert(state.readComment('', '*/')) // still open at end of expression
    assert.strictEqual(state.character(), '')
  })

  it('lets you open and close params', function () {
    state.openParams()
    assert.strictEqual(state.nestingLevel, 1)
    state.closeParams()
    assert.strictEqual(state.nestingLevel, 0)
    assert.throws(() => state.closeParams(), /error: closed/)
  })
})
