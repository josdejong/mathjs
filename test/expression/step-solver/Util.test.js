'use strict';

const assert = require('assert');
const math = require('../../../index');
const Util = require('../../../lib/expression/step-solver/Util.js');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');

describe('appendToArrayInObject', function () {
  it('creates empty array', function () {
    let object = {};
    Util.appendToArrayInObject(object, 'key', 'value');
    assert.deepEqual(
      object,
      {'key': ['value']}
     );
  });
  it('appends to array if it exists', function () {
    let object = {'key': ['old_value']};
    Util.appendToArrayInObject(object, 'key', 'new_value');
    assert.deepEqual(
      object,
      {'key': ['old_value', 'new_value']}
     );
  });
});
