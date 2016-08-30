"use strict"

const assert = require('assert');
const math = require('../../../index');
const stepper = require('../../../lib/expression/step-solver/stepper.js');
const step = stepper.step;
const simplify = stepper.simplify;

function testStep(exp) {
  return step(new stepper.RootNode(exp)).expr;
}

// to create nodes, for testing
function opNode(op, args) {
  switch (op) {
    case '+':
      return new math.expression.node.OperatorNode('+', 'add', args);
    case '*':
      return new math.expression.node.OperatorNode('*', 'multiply', args);
    case '^':
      return new math.expression.node.OperatorNode('^', 'pow', args);
    default:
      throw Error("Unsupported operation: " + op);
  }
}

function constNode(val) {
  return new math.expression.node.ConstantNode(val);
}

function symbolNode(name) {
  return new math.expression.node.SymbolNode(name);
}

function parenNode(content) {
  return new math.expression.node.ParenthesisNode(content);
}

describe('arithmetic stepping', function () {
  it('2+2 -> 4', function () {
    assert.deepEqual(math.parse('4'), testStep(math.parse('2+2')));
  });
  it('(2+2) -> 4', function () {
    assert.deepEqual(math.parse('4'), testStep(math.parse('(2+2)')));
  });
  it('(2+2)*5 -> 4*5', function () {
    assert.deepEqual(math.parse('4*5'), testStep(math.parse('(2+2)*5')));
  });
  it('5*(2+2) -> 5*4', function () {
    assert.deepEqual(math.parse('5*4'), testStep(math.parse('5*(2+2)')));
  });
  it('(((5))) -> 5', function () {
    assert.deepEqual(math.parse('5'), testStep(math.parse('(((5)))')));
  });
  it('(2+(2)) -> 4', function () {
    assert.deepEqual(math.parse('4'), testStep(math.parse('(2+(2))')));
  });
  it('(2+(2)+7) -> 11', function () {
    assert.deepEqual(math.parse('11'), testStep(math.parse('(2+(2)+7)')));
  });
  it('((2+2) + ((2^3))) -> 4 + 2^3', function () {
    assert.deepEqual(math.parse('4 + 2^3'), testStep(math.parse('((2+2) + ((2^3)))')));
  });
});

describe('arithmetic simplify', function () {
  it('2+2 = 4', function () {
    assert.deepEqual(math.parse('4'), simplify(math.parse('2+2')));
  });
  it('(2+2)*5 = 20', function () {
    assert.deepEqual(math.parse('20'), simplify(math.parse('(2+2)*5')));
  });
  it('5*(2+2)*10 = 200', function () {
    assert.deepEqual(math.parse('200'), simplify(math.parse('5*(2+2)*10')));
  });
  it('(2+(2)+7) = 11', function () {
    assert.deepEqual(math.parse('11'), simplify(math.parse('(2+(2)+7)')));
  });
  it('(8-2) * 2^2 * (1+1) / (4 / 2) / 5 = 4.8', function () {
    assert.deepEqual(math.parse('4.8'), simplify(math.parse('(8-2) * 2^2 * (1+1) / (4 /2) / 5')));
  });
});

describe('flatten ops', function () {
  let flatten = stepper.flattenOps;

  it('2+2', function () {
    assert.deepEqual(math.parse('2+2'), flatten(math.parse('2+2')));
  });
  it('2+2+7', function () {
    assert.deepEqual(opNode('+', [constNode(2), constNode(2), constNode(7)]),
      flatten(math.parse('2+2+7')));
  });
  it('9*8*6+3+4', function () {
    assert.deepEqual(opNode('+', [
        opNode('*', [constNode(9), constNode(8), constNode(6)]),
        constNode(3),
        constNode(4)]),
      flatten(math.parse('9*8*6+3+4')));
  });
  it('5*(2+(((3))+2))*10', function () {
    assert.deepEqual(opNode('*', [
        constNode(5),
        parenNode(opNode('+', [constNode(2), constNode(3),constNode(2)])),
        constNode(10)]),
      flatten(math.parse('5*(2+3+2)*10')));
  });
});

describe('adding symbols without breaking things', function() {
  // nothing old breaks
  it('2+x no change', function () {
    assert.deepEqual(math.parse('2+x'), testStep(math.parse('2+x')));
  });
  it('(2+2)*x = 4*x', function () {
    assert.deepEqual(math.parse('4*x'), testStep(math.parse('(2+2)*x')));
  });
  it('(2+2)*x+3 = 4*x+3', function () {
    assert.deepEqual(math.parse('4*x+3'), testStep(math.parse('(2+2)*x+3')));
  });
});

describe('basic addition collect like terms, no exponents or coefficients',
  function() {
    it('(2+x+7) -> x + (2+7)', function () {
      assert.deepEqual(math.parse('x+(2+7)'), testStep(math.parse('2+x+7')));
    });
    it('x + 4 + x + 5 -> (x + x) + (4 + 5)', function () {
      assert.deepEqual(math.parse('(x + x) + (4 + 5)'),
        testStep(math.parse('x + 4 + x + 5')));
    });
    it('no change for x + 4 + y', function () {
      assert.deepEqual(opNode('+', [
          symbolNode('x'), constNode(4), symbolNode('y')]),
        testStep(math.parse('x + 4 + y')));
    });
    it('no change for x + x + x', function () {
      assert.deepEqual(opNode('+', [
          symbolNode('x'), symbolNode('x'), symbolNode('x')]),
        testStep(math.parse('x + x + x')));
    });
    it('x + 4 + x + y + 5 -> (x + x) + y + (4 + 5)', function () {
      assert.deepEqual(opNode('+', [
          math.parse('(x+x)'), symbolNode('y'), math.parse('(4+5)')]),
        testStep(math.parse('x + 4 + x + y + 5')));
    });
    // 2^x is an 'other'
    it('x + 4 + x + 2^x + 5 -> (x + x) + (4 + 5) + 2^x', function () {
      assert.deepEqual(opNode('+', [
          math.parse('(x+x)'), math.parse('(4+5)'), math.parse('2^x')]),
        testStep(math.parse('x + 4 + x + 2^x + 5')));
    });
    // (2*(y + x)) is an 'other' cause it's in parens
    it('z + (2*(y + x)) + 4 + z  -> (z + z) + 4 + (2(y+x))', function () {
      assert.deepEqual(opNode('+', [
          math.parse('(z+z)'), math.parse('4'), math.parse('(2*(y+x))')]),
        testStep(math.parse('z + (2*(y + x)) + 4 + z')));
    });
  }
);

describe('classifies symbol terms correctly', function() {
  it('x', function () {
    assert.equal(true, stepper.isSymbolicTerm(math.parse('x')));
  });
  it('x^2', function () {
    assert.equal(true, stepper.isSymbolicTerm(math.parse('x^2')));
  });
  it('y^55', function () {
    assert.equal(true, stepper.isSymbolicTerm(math.parse('y^55')));
  });
  it('x^y', function () {
    assert.equal(false, stepper.isSymbolicTerm(math.parse('x^y')));
  });
  it('3', function () {
    assert.equal(false, stepper.isSymbolicTerm(math.parse('3')));
  });
  it('2^5', function () {
    assert.equal(false, stepper.isSymbolicTerm(math.parse('2^5')));
  });
});

describe('collect like terms with exponents', function() {
  it('x^2 + x + x^2 + x -> (x + x) + (x^2 + x^2)', function () {
    assert.deepEqual(math.parse('(x + x) + (x^2 + x^2)'),
      testStep(math.parse('x + x^2 + x + x^2')));
  });
  it('y^2 + 5 + y^2 + 5 -> (y^2 + y^2) + (5 + 5)', function () {
    assert.deepEqual(math.parse('(y^2 + y^2) + (5 + 5)'),
      testStep(math.parse('y^2 + 5 + y^2 + 5')));
  });
  it('y + 5 + z^2 no change', function () {
    assert.deepEqual(opNode('+', [
          math.parse('y'), math.parse('5'), math.parse('z^2')]),
      testStep(math.parse('y + 5 + z^2')));
  });
});


/*

plan:

extend to take exponents (and order by degree)
- make a function that recognizes a variable^smthng and returns the name and degree
- append degree to symbol name when making object in collecting like terms


then extend to take coefficients
 - there's an implicit param in the multiply node!!
 - but can I use that in conjunction with flattening?
 - remove parens around this too

then do the collecting of addition

we'll want to get rid of parens if
- we've fully collected like terms within the parens and there's + before and + or - after
- e.g. x + (x^2 + y+y) + x -> x + (x^2 + 2y) + x -> x + x^2 + 2y + x
- this includes things like (2x^2)

then multiplication:

    // PREREQ FUNCTIONS
    // x*x -> x^(1+1)
    // x*x^3 -> x^(1+3)
    // x^2*x -> x^(2+1)
    // x^2 * x^5 -> x^(2+5)
    // 2x*x -> 2x^(1+1) 
    // 2x*4x -> 2*4*x^(1+1)
    // ---- mrahhh math.parse('x * 2x') gives x*2 on the left..
    // ---- probably still fine


    // case 1 has one in parens and one not, only addition
    // 2x * (3x + 4)
    // (2x + 4) * 3x
    // case 2 with subtraction
    // (2x - 4) * 3x
    // case 3 unary minus
    // -2x * (3x - 4)
    // (2x + 3)*(4x+7)
    // 2x^2 * (3x + 4)


// TODO add tests (and more support) for subtraction and division

*/
