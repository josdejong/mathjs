const assert = require('assert');
const math = require('../../../index');

const distribute = require('../../../lib/expression/step-solver/distribute.js');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');
const NodeCreator = require('../../../lib/expression/step-solver/NodeCreator.js');

function testDistribute(exprStr) {
  return distribute(flatten(math.parse(exprStr))).node;
}

describe('distribute - into paren with addition', function () {
  it('-(x+3) -> (-x - 3)', function () {
    assert.deepEqual(
      testDistribute('-(x+3)'),
      flatten(math.parse('(-x - 3)')));
  });
  it('-(x-3) -> (-x + 3)', function () {
    assert.deepEqual(
      testDistribute('-(x - 3)'),
      flatten(math.parse('(-x + 3)')));
  });
  it('-(-x^2 + 3y^6) -> (x^2 - 3y^6)', function () {
      assert.deepEqual(
        testDistribute('-(-x^2 + 3y^6)'),
        flatten(math.parse('(x^2 - 3y^6)')));
    });
});

describe('distribute - into paren with multiplication/division', function () {
  it('-(x*3) -> (-x * 3)', function () {
    assert.deepEqual(
      testDistribute('-(x*3)'),
      flatten(math.parse('(-x * 3)')));
  });
  it('-(-x * 3) -> (x * 3)', function () {
    assert.deepEqual(
      testDistribute('-(-x * 3)'),
      flatten(math.parse('(x * 3)')));
  });
  it('-(-x^2 * 3y^6) -> (x^2 * 3y^6)', function () {
      assert.deepEqual(
        testDistribute('-(-x^2 * 3y^6)'),
        flatten(math.parse('(x^2 * 3y^6)')));
    });
});

describe('distribute', function () {
  it('x*(x+2+y) -> (x*x + x*2 + x*y)', function () {
    assert.deepEqual(
      testDistribute('x*(x+2+y)'),
      flatten(math.parse('(x*x + x*2 + x*y)')));
  });
  it('(x+2+y)*x*7 -> (x*x + 2*x + y*x)*x*7', function () {
    assert.deepEqual(
      testDistribute('(x+2+y)*x*7'),
      flatten(math.parse('(x*x + 2*x + y*x)*7')));
  });
  it('(5+x)*(x+3) -> (5*(x+3) + x*(x+3))', function () {
    assert.deepEqual(
      testDistribute('(5+x)*(x+3)'),
      flatten(math.parse('(5*(x+3) + x*(x+3))')));
  });
  it('-2x^2 * (3x - 4) -> (-2x^2 * 3x - 2x^2 * -4)', function () {
    assert.deepEqual(
      testDistribute('-2x^2 * (3x - 4)'),
      flatten(math.parse('(-2x^2 * 3x + -2x^2 * -4)')));
  });
});
