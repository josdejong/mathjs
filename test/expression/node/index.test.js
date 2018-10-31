// test the contents of index.js
import assert from 'assert';

import index from '../../../src/expression/node/index';

describe('node/index', function () {
  it('should contain all nodes', function () {
    assert.strictEqual(index.length, 17)
  })
})
