// test keywords
import assert from 'assert'

import { keywords } from '../../../src/expression/keywords.js'

describe('keywords', function () {
  it('should return a map with reserved keywords', function () {
    assert.deepStrictEqual([...keywords].sort(), ['end'].sort())
  })
})
