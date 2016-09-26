"use strict"

const assert = require('assert');
const math = require('../../../index');

const LikeTermCollector = require('../../../lib/expression/step-solver/LikeTermCollector.js');
const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');

function collectLikeTerms(expression, debug=false) {
  const exprTree = flatten(math.parse(expression));
  const collected = LikeTermCollector.collectLikeTermsDFS(exprTree).node;
  if (debug) {
    console.log(collected.toString());
  }
  return collected;
}

function canCollectLikeTerms(expression) {
    const exprTree = flatten(math.parse(expression));
    return LikeTermCollector.canCollectLikeTerms(exprTree);
}

describe('can collect like terms for addition', function () {
  it('2+2 --> false (only one type)', function () {
    assert.deepEqual(
      canCollectLikeTerms('2+2'),
      false);
  });
  it('x^2 + x^2 --> false (only one type)', function () {
    assert.deepEqual(
      canCollectLikeTerms('x^2+x^2'),
      false);
  });
  it('x+2 --> false (all types have only one)', function () {
    assert.deepEqual(
      canCollectLikeTerms('x+2'),
      false);
  });
  it('x+2+x --> true', function () {
    assert.deepEqual(
      canCollectLikeTerms('x+2+x'),
      true);
  });
  it('(x+2+x) --> false, because parenthesis', function () {
    assert.deepEqual(
      canCollectLikeTerms('(x+2+x)'),
      false);
  });
  it('x^2 + 5 + x + x^2 --> true', function () {
    assert.deepEqual(
      canCollectLikeTerms('x^2 + 5 + x + x^2'),
      true);
  });

});

describe('can collect like terms for multiplication', function () {
  it('2*2 --> false (only one type)', function () {
    assert.deepEqual(
      canCollectLikeTerms('2*2'),
      false);
  });
  it('x^2 * 2x^2 --> true', function () {
    assert.deepEqual(
      canCollectLikeTerms('x^2 * 2x^2'),
      true);
  });
  it('x * 2 --> false (all types have only one)', function () {
    assert.deepEqual(
      canCollectLikeTerms('x * 2'),
      false);
  });
  it('((2x^2)) * y * x * y^3 --> true', function () {
    assert.deepEqual(
      canCollectLikeTerms('((2x^2)) * y * x * y^3'),
      true);
  });
});

describe('basic addition collect like terms, no exponents or coefficients',
  function() {
    it('2+x+7 -> x + (2+7)', function () {
      assert.deepEqual(
        collectLikeTerms('2+x+7'),
        math.parse('x+(2+7)'));
    });
    it('x + 4 + x + 5 -> (x + x) + (4 + 5)', function () {
      assert.deepEqual(
        collectLikeTerms('x + 4 + x + 5'),
        math.parse('(x + x) + (4 + 5)'));
    });
    it('no change for x + 4 + y', function () {
      assert.deepEqual(
        collectLikeTerms('x + 4 + y'),
        flatten(math.parse('x + 4 + y')));
    });
    it('x + 4 + x + y + 5 -> (x + x) + y + (4 + 5)', function () {
      assert.deepEqual(
        collectLikeTerms('x + 4 + x + y + 5'),
        flatten(math.parse('(x + x) + y + (4 + 5)')));
    });
    // 2^x is an 'other'
    it('x + 4 + x + 2^x + 5 -> (x + x) + (4 + 5) + 2^x', function () {
      assert.deepEqual(
        collectLikeTerms('x + 4 + x + 2^x + 5'),
        flatten(math.parse('(x + x) + (4 + 5) + 2^x')));
    });
    // 2*(y + x) is an 'other' cause it has parens
    it('z + 2*(y + x) + 4 + z  -> (z + z) + 4 + (2(y+x))', function () {
      assert.deepEqual(
        collectLikeTerms('z + 2*(y + x) + 4 + z'),
        flatten(math.parse('(z + z) + 4 + 2*(y+x)')));
    });
  }
);

describe('collect like terms with exponents and coefficients', function() {
  it('x^2 + x + x^2 + x -> (x^2 + x^2) + (x + x)', function () {
    assert.deepEqual(
      collectLikeTerms('x^2 + x + x^2 + x'),
      flatten(math.parse('(x^2 + x^2) + (x + x)')));
  });
  it('y^2 + 5 + y^2 + 5 -> (y^2 + y^2) + (5 + 5)', function () {
    assert.deepEqual(
      collectLikeTerms('y^2 + 5 + y^2 + 5'),
      flatten(math.parse('(y^2 + y^2) + (5 + 5)')));
  });
  it('y + 5 + z^2 no change', function () {
    assert.deepEqual(
      collectLikeTerms('y + 5 + z^2'),
      flatten(math.parse('y + 5 + z^2')));
  });
  it('2x^2 + x + x^2 + 3x -> (2x^2 + x^2) + (x + 3x)', function () {
    assert.deepEqual(
      collectLikeTerms('2x^2 + x + x^2 + 3x'),
      flatten(math.parse('(2x^2 + x^2) + (x + 3x)')));
  });
});

describe('collect like terms for multiplication', function() {
  it('2x^2 * y * x * y^3 -> 2 * (x^2 * x) * (y * y^3)', function () {
    assert.deepEqual(
      collectLikeTerms('2x^2 * y * x * y^3'),
      flatten(math.parse('2 * (x^2 * x) * (y * y^3)')));
  });
  it('y^2 * 5 * y * 9 -> (5 * 9)*(y^2 * y)', function () {
    assert.deepEqual(
      collectLikeTerms('y^2 * 5 * y * 9'),
      flatten(math.parse('(5 * 9)*(y^2 * y)')));
  });
  it('5y^2 * -4y * 9 -> (5 * -4 * 9)*(y^2 * y)', function () {
    assert.deepEqual(
      collectLikeTerms('5y^2 * -4y * 9'),
      flatten(math.parse('(5 * -4 * 9)*(y^2 * y)')));
  });
  it('5y^2 * -y * 9 -> (5 * -1 * 9)*(y^2 * y)', function () {
    assert.deepEqual(
      collectLikeTerms('5y^2 * -y * 9'),
      flatten(math.parse('(5 * -1 * 9)*(y^2 * y)')));
  });
  it('y * 5 * z^2 no change', function () {
    assert.deepEqual(
      collectLikeTerms('y * 5 * z^2'),
      flatten(math.parse('y * 5 * z^2')));
  });
  it('y * 5 * (2+x) * y^2 -> 5 * (y*y^2) * (2+x)', function () {
    assert.deepEqual(
      collectLikeTerms('y * 5 * (2+x) * y^2'),
      flatten(math.parse('5 * (y*y^2) * (2+x)')));
  });
});
