// test derivative
var assert = require('assert');
var math = require('../../../index');
var ConstantNode = math.expression.node.ConstantNode;
var OperatorNode = math.expression.node.OperatorNode;
var FunctionNode = math.expression.node.FunctionNode;
var ParenthesisNode = math.expression.node.ParenthesisNode;
var SymbolNode = math.expression.node.SymbolNode;
var simplifyDerivative = math.algebra.simplify.simplifyDerivative;
var derivative = math.derivative;
var parse = math.parse;
var eval = math.eval;

describe('derivative', function() {
  var OP = function(op, args) {
    var ops = {
      '+':'add',
      '-':'subtract',
      '/':'divide',
      '*':'multiply'
    };
    args = args.map(function(v) {
      if (typeof v === 'number') {
        return new ConstantNode(v);
      }
      else if (typeof v === 'string') {
        return parseNoComment(v);
      }
      return v;
    });
    return new OperatorNode(op, ops[op], args)
  }

  var computeDerivative = function(str) {
    var expr = parseNoComment(str);
    return simplifyDerivative(expr);
  };

  var parseNoComment = function(str) {
    var expr = parse(str);
    expr.traverse(function(node) {
      if (node.isOperatorNode && node.fn === 'multiply') {
        node.implicit = false;
      }
      delete node.comment;
    });
    return expr;
  }

  it('should take the derivative of a constant', function() {
    assert.deepEqual(computeDerivative('derivative(1, x)'), new ConstantNode(0));
    assert.deepEqual(computeDerivative('derivative(10000000, x)'), new ConstantNode(0));
  });

  it('should take the derivative of a SymbolNodes', function() {
    assert.deepEqual(computeDerivative('derivative(x, x)'), new ConstantNode(1));
  });

  it('should maintain parenthesis of ParenthesisNodes', function() {
    assert.deepEqual(computeDerivative('derivative((1), x)'), parseNoComment('(0)'));
    assert.deepEqual(computeDerivative('derivative((x), x)'), parseNoComment('(1)'));
  });

  it('should take the derivative of FunctionAssignmentNodes', function() {
    assert.deepEqual(derivative(parseNoComment('f(x) = 5x + x + 2'), new SymbolNode('x')),
                     parseNoComment('5*1 + 1 + 0'));
    assert.deepEqual(derivative(parseNoComment('f(x) = 5 + 2'), new SymbolNode('x')),
                     new ConstantNode(0));
    assert.deepEqual(derivative(parseNoComment('f(y) = 5y + 2'), new SymbolNode('x')),
                     new ConstantNode(0));

    // non-embedded example
    var f_of_x = parseNoComment('f(x) = x + 2');
    var newFunc = new OperatorNode('+', 'add', [parseNoComment('5x'), f_of_x]);
    assert.deepEqual(derivative(newFunc, new SymbolNode('x')), new OperatorNode('+', 'add', [
                                                                 parseNoComment('5*1'),
                                                                 parseNoComment('1 + 0')
                                                               ]));
  });

  it('should take the derivative of a OperatorNodes with ConstantNodes', function() {
    assert.deepEqual(computeDerivative('derivative(1 + 2, x)'), new ConstantNode(0));
    assert.deepEqual(computeDerivative('derivative(-100^2 + 3*3/2 - 12, x)'), new ConstantNode(0));
  });

  it('should take the derivative of a OperatorNodes with SymbolNodes', function() {
    // d/dx(-4x) = -4*1 = -4
    assert.deepEqual(computeDerivative('derivative(-4x, x)'), parseNoComment('-4*1'));
    // d/dx(+4x) = +4*1 = +4
    assert.deepEqual(computeDerivative('derivative(+4x, x)'), parseNoComment('+4*1'));


    // Linearity of differentiation
    // With '+': d/dx(5x + x + 2) = 5*1 + 1 + 0 = 6
    assert.deepEqual(computeDerivative('derivative(5x + x + 2, x)'), parseNoComment('5*1 + 1 + 0'));
    // With '-': d/dx(5x - x - 2) = 5*1 - 1 - 0 = 4
    assert.deepEqual(computeDerivative('derivative(5x - x - 2, x)'), parseNoComment('5*1 - 1 - 0'));


    // d/dx(2*(x + x)) = 2*(1 + 1)
    assert.deepEqual(computeDerivative('derivative(2(x + x), x)'), parseNoComment('2*(1 + 1)'));
    assert.deepEqual(computeDerivative('derivative((x + x)*2, x)'), parseNoComment('2*(1 + 1)'));


    // Product Rule, d/dx(5x*3x) = 5*(3*1*x + x*3*1) = 30x
    assert.deepEqual(computeDerivative('derivative(5x*3x, x)'), OP('+', [
                                                                  OP('*', [
                                                                    OP('*', [3, '5*1']),
                                                                    'x']),
                                                                  '5*x*3*1']));


    // Basic division, d/dx(7x / 2) = 7 * 1 / 2 = 7 / 2
    assert.deepEqual(computeDerivative('derivative(7x / 2, x)'), parseNoComment('7*1/2'));

    // Reciprocal Rule, d/dx(5 / (3x)) = -5 * (3 * 1) / (3 * x) ^ 2 = -5 / 3x^2
    assert.deepEqual(computeDerivative('derivative(5 / (3x), x)'), new OperatorNode('*', 'multiply', [
                                                        new OperatorNode('-', 'unaryMinus', [new ConstantNode(5)]),
                                                        parseNoComment('(3*1) / (3*x)^2')
                                                      ]));
    // Quotient rule, d/dx((2x) / (3x + 2)) = ((2*1)(3x + 2) - (2x)(3*1 + 0)) / (3x + 2)^2 = 4 / (3x + 2)^2
    assert.deepEqual(computeDerivative('derivative((2x) / (3x + 2), x)'), new OperatorNode('/', 'divide', [
                                                               parseNoComment('(2*1)(3x + 2) - (2x)(3*1 + 0)'),
                                                               parseNoComment('(3x + 2)^2')
                                                             ]));


    // Secret constant; 0^f(x) = 1 (in JS), 1^f(x) = 1, d/dx(1) = 0
    assert.deepEqual(computeDerivative('derivative(0^(2^x + x^3 + 2), x)'), new ConstantNode(0));
    assert.deepEqual(computeDerivative('derivative(1^(2^x + x^3 + 2), x)'), new ConstantNode(0));
    // d/dx(10^(2x + 2)) = 10^(2x + 2)*ln(10)*(2*1 + 0)
    assert.deepEqual(computeDerivative('derivative(10^(2x + 2), x)'), new OperatorNode('*', 'multiply', [
                                                           parseNoComment('10^(2x + 2)'),
                                                           parseNoComment('log(10)*(2*1 + 0)')
                                                         ]));
    // Secret constant, f(x)^0 = 1 -> d/dx(f(x)^0) = 1
    assert.deepEqual(computeDerivative('derivative((x^x^x^x)^0, x)'), new ConstantNode(0));
    // Ignore powers of 1, d/dx((x + 2)^1) -> d/dx(x+2) = (1 + 0) = 1
    assert.deepEqual(computeDerivative('derivative((x+2)^1, x)'), parseNoComment('(1 + 0)'));
    // Elementary Power Rule, d/dx(2x^2) = 2*2*1*x^(2-1) = 4x
    assert.deepEqual(computeDerivative('derivative(2x^2, x)'), new OperatorNode('*', 'multiply', [
                                                    new ConstantNode(2),
                                                    new OperatorNode('*', 'multiply', [
                                                      new ConstantNode(2),
                                                      new OperatorNode('*', 'multiply', [
                                                        new ConstantNode(1),
                                                        new OperatorNode('^', 'pow', [
                                                          new SymbolNode('x'),
                                                          parseNoComment('2 - 1')
                                                        ])
                                                      ])
                                                    ])
                                                  ]));
    // Elementary Power Rule, d/dx(2x^-2) = 2*-2*1*x^(-2-1) = -4x^-3
    assert.deepEqual(computeDerivative('derivative(2x^-2, x)'), new OperatorNode('*', 'multiply', [
                                                     new ConstantNode(2),
                                                     new OperatorNode('*', 'multiply', [
                                                       new OperatorNode('-', 'unaryMinus', [new ConstantNode(2)]),
                                                       new OperatorNode('*', 'multiply', [
                                                         new ConstantNode(1),
                                                         new OperatorNode('^', 'pow', [
                                                           new SymbolNode('x'),
                                                           parseNoComment('-2 - 1')
                                                         ])
                                                       ])
                                                     ])
                                                   ]));

    // Functional Power Rule, d/dx((x^3 + x)^(5x + 2)) = (x^3 + x)^(5x + 2) * [(((3*1*x)^(3-1)+1) * ((5x + 2) / (x^3 + x))) + (5*1 + 0)log((x^3 + x))]
    //                                                 = (x^3 + x)^(5x + 2) * [((3x^2 + 1)*(5x + 2) / (x^3 + x)) + 5log(x^3 + x)]
    assert.deepEqual(computeDerivative('derivative((x^3 + x)^(5x + 2), x)'), new OperatorNode('*', 'multiply', [
                                                                  parseNoComment('(x^3 + x)^(5x + 2)'),
                                                                  new OperatorNode('+', 'add', [
                                                                    new OperatorNode('*', 'multiply', [
                                                                      new ParenthesisNode(
                                                                        new OperatorNode('+', 'add', [
                                                                          new OperatorNode('*', 'multiply', [
                                                                            new ConstantNode(3),
                                                                            new OperatorNode('*', 'multiply', [
                                                                              new ConstantNode(1),
                                                                              new OperatorNode('^', 'pow', [
                                                                                new SymbolNode('x'),
                                                                                parseNoComment('3-1')
                                                                              ])
                                                                            ])
                                                                          ]),
                                                                          new ConstantNode(1)
                                                                        ])
                                                                      ),
                                                                      parseNoComment('(5x + 2) / (x^3 + x)')
                                                                    ]),
                                                                    parseNoComment('(5*1 + 0)log((x^3 + x))')
                                                                  ])
                                                                ]));
  });

  it('should properly take the derivative of mathematical functions', function() {
    assert.deepEqual(computeDerivative('derivative(cbrt(6x), x)'), new OperatorNode('/', 'divide', [
                                                        parseNoComment('6*1'),
                                                        new OperatorNode('*', 'multiply', [
                                                          new ConstantNode(3),
                                                          new OperatorNode('^', 'pow', [
                                                            parseNoComment('6x'),
                                                            parseNoComment('2/3')
                                                          ])
                                                        ])
                                                      ]));
    assert.deepEqual(computeDerivative('derivative(sqrt(6x), x)'), new OperatorNode('/', 'divide', [
                                                        parseNoComment('6*1'),
                                                        parseNoComment('2*sqrt(6x)')
                                                      ]));
    assert.deepEqual(computeDerivative('derivative(nthRoot(6x), x)'), new OperatorNode('/', 'divide', [
                                                           parseNoComment('6*1'),
                                                           parseNoComment('2*sqrt(6x)')
                                                         ]));
    assert.deepEqual(computeDerivative('derivative(nthRoot(6x, 3), x)'), new OperatorNode('*', 'multiply', [
                                                              parseNoComment('1/3'),
                                                              new OperatorNode('*', 'multiply', [
                                                                parseNoComment('6*1'),
                                                                new OperatorNode('^', 'pow', [
                                                                  parseNoComment('6x'),
                                                                  parseNoComment('1/3 - 1')
                                                                ])
                                                              ])
                                                            ]));
    // (6 * x) ^ (1 / (2 * x)) * (((6*1)*((1/(2x))/(6x))) + ((((0*2x)-(1*(2*1)))/(2x)^2)*log(6x)))
    assert.deepEqual(computeDerivative('derivative(nthRoot((6x), (2x)), x)'), new OperatorNode('*', 'multiply', [
                                                                   new OperatorNode('^', 'pow', [
                                                                     parseNoComment('(6x)'),
                                                                     parseNoComment('1 / (2x)')
                                                                   ]),
                                                                   new OperatorNode('+', 'add', [
                                                                     new OperatorNode('*', 'multiply', [
                                                                       parseNoComment('(6*1)'),
                                                                       parseNoComment('1 / (2x) / (6x)')
                                                                     ]),
                                                                     new OperatorNode('*', 'multiply', [
                                                                       new OperatorNode('/', 'divide', [
                                                                         parseNoComment('0*(2x) - 1*(2*1)'),
                                                                         parseNoComment('(2x)^2')
                                                                       ]),
                                                                       parseNoComment('log((6x))')
                                                                     ])
                                                                   ])
                                                                 ]));
    assert.deepEqual(computeDerivative('derivative(log((6x)), x)'), parseNoComment('(6*1)/(6*x)'));
    assert.deepEqual(computeDerivative('derivative(log10((6x)), x)'), new OperatorNode('/', 'divide', [
                                                           parseNoComment('(6*1)'),
                                                           parseNoComment('(6x)log(10)')
                                                         ]));
    assert.deepEqual(computeDerivative('derivative(log((6x), 10), x)'), new OperatorNode('/', 'divide', [
                                                             parseNoComment('(6*1)'),
                                                             parseNoComment('(6x)log(10)')
                                                           ]));
    // d/dx(log(2x, 3x)) = ((2 * 1) / (2 * x) * log(3 * x) - log(2 * x) * (3 * 1) / (3 * x)) / log(3 * x) ^ 2 = (log(3x) - log(2x)) / (xlog(3x)^2)
    assert.deepEqual(computeDerivative('derivative(log((2x), (3x)), x)'), new OperatorNode('/', 'divide', [
                                                               new OperatorNode('-', 'subtract', [
                                                                 new OperatorNode('*', 'multiply', [
                                                                   parseNoComment('(2*1) / (2x)'),    
                                                                   new FunctionNode('log', [parseNoComment('(3x)')])
                                                                 ]),
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new FunctionNode('log', [parseNoComment('(2x)')]),
                                                                   parseNoComment('(3*1) / (3x)')
                                                                 ])
                                                               ]),
                                                               parseNoComment('log((3x))^2')
                                                             ]));

    assert.deepEqual(computeDerivative('derivative(sin(2x), x)'), parseNoComment('2*1*cos(2x)'));
    assert.deepEqual(computeDerivative('derivative(cos(2x), x)'), parseNoComment('2*1*-sin(2x)'));
    assert.deepEqual(computeDerivative('derivative(tan(2x), x)'), parseNoComment('2*1*sec(2x)^2'));
    assert.deepEqual(computeDerivative('derivative(sec(2x), x)'), new OperatorNode('*', 'multiply', [
                                                       parseNoComment('2*1'),
                                                       parseNoComment('sec(2x)*tan(2x)')
                                                     ]));
    assert.deepEqual(computeDerivative('derivative(csc(2x), x)'), new OperatorNode('*', 'multiply', [
                                                       new OperatorNode('-', 'unaryMinus', [parseNoComment('2*1')]),
                                                       parseNoComment('csc(2x)cot(2x)')
                                                     ]));
    assert.deepEqual(computeDerivative('derivative(cot((2x)), x)'), parseNoComment('-(2*1)csc((2x))^2'));
    assert.deepEqual(computeDerivative('derivative(asin((2x)), x)'), parseNoComment('(2*1) / sqrt(1 - (2x)^2)'));
    assert.deepEqual(computeDerivative('derivative(acos((2x)), x)'), parseNoComment('-(2*1) / sqrt(1 - (2x)^2)'));
    assert.deepEqual(computeDerivative('derivative(atan((2x)), x)'), new OperatorNode('/', 'divide', [
                                                          parseNoComment('(2*1)'),
                                                          parseNoComment('(2x)^2 + 1')
                                                        ]));
    assert.deepEqual(computeDerivative('derivative(asec((2x)), x)'), new OperatorNode('/', 'divide', [
                                                          parseNoComment('(2*1)'),
                                                          parseNoComment('abs((2x))*sqrt((2x)^2 - 1)')
                                                        ]));
    assert.deepEqual(computeDerivative('derivative(acsc((2x)), x)'), new OperatorNode('/', 'divide', [
                                                          new OperatorNode('-', 'unaryMinus', [parseNoComment('(2*1)')]),
                                                          parseNoComment('abs((2x))*sqrt((2x)^2 - 1)')
                                                        ]));
    assert.deepEqual(computeDerivative('derivative(acot((2x)), x)'), new OperatorNode('/', 'divide', [
                                                          new OperatorNode('-', 'unaryMinus', [parseNoComment('(2*1)')]),
                                                          parseNoComment('(2x)^2 + 1')
                                                        ]));
    assert.deepEqual(computeDerivative('derivative(sinh(2x), x)'), parseNoComment('2*1*cosh(2x)'));
    assert.deepEqual(computeDerivative('derivative(cosh(2x), x)'), parseNoComment('2*1*sinh(2x)'));
    assert.deepEqual(computeDerivative('derivative(tanh(2x), x)'), parseNoComment('2*1*sech(2x)^2'));
    assert.deepEqual(computeDerivative('derivative(sech(2x), x)'), new OperatorNode('*', 'multiply', [
                                                        new OperatorNode('-', 'unaryMinus', [parseNoComment('2*1')]),
                                                        parseNoComment('sech(2x)tanh(2x)')
                                                      ]));
    assert.deepEqual(computeDerivative('derivative(csch(2x), x)'), new OperatorNode('*', 'multiply', [
                                                        new OperatorNode('-', 'unaryMinus', [parseNoComment('2*1')]),
                                                        parseNoComment('csch(2x)coth(2x)')
                                                      ]));
    assert.deepEqual(computeDerivative('derivative(coth(2x), x)'), new OperatorNode('*', 'multiply', [
                                                        new OperatorNode('-', 'unaryMinus', [parseNoComment('2*1')]),
                                                        parseNoComment('csch(2x)^2')
                                                      ]));
    assert.deepEqual(computeDerivative('derivative(asinh((2x)), x)'), parseNoComment('(2*1) / sqrt((2x)^2 + 1)'));
    assert.deepEqual(computeDerivative('derivative(acosh((2x)), x)'), parseNoComment('(2*1) / sqrt((2x)^2 - 1)'));
    assert.deepEqual(computeDerivative('derivative(atanh((2x)), x)'), new OperatorNode('/', 'divide', [
                                                           parseNoComment('(2*1)'),
                                                           parseNoComment('1 - (2x)^2')
                                                         ]));
    assert.deepEqual(computeDerivative('derivative(asech((2x)), x)'), new OperatorNode('/', 'divide', [
                                                           new OperatorNode('-', 'unaryMinus', [parseNoComment('(2*1)')]),
                                                           parseNoComment('(2x)*sqrt(1 - (2x)^2)')
                                                         ]));
    assert.deepEqual(computeDerivative('derivative(acsch((2x)), x)'), new OperatorNode('/', 'divide', [
                                                           new OperatorNode('-', 'unaryMinus', [parseNoComment('(2*1)')]),
                                                           parseNoComment('abs((2x))sqrt((2x)^2 + 1)')
                                                         ]));
    assert.deepEqual(computeDerivative('derivative(acoth((2x)), x)'), new OperatorNode('/', 'divide', [
                                                           new OperatorNode('-', 'unaryMinus', [parseNoComment('(2*1)')]),
                                                           parseNoComment('1 - (2x)^2')
                                                         ]));
  });

  it('should take the partial derivative of an expression', function() {
    assert.deepEqual(computeDerivative('derivative(x + y, x)'), parseNoComment('1 + 0'));
    assert.deepEqual(computeDerivative('derivative(x + log(y)*y, x)'), parseNoComment('1 + 0'));

    assert.deepEqual(computeDerivative('derivative(x + y + z, x)'), parseNoComment('1 + 0 + 0'));
    assert.deepEqual(computeDerivative('derivative(x + log(y)*z, x)'), parseNoComment('1 + 0'));

    assert.deepEqual(computeDerivative('derivative(x + log(y)*x, x)'), parseNoComment('1 + log(y)*1'));

    // 2 * 1 * x ^ (2 - 1) + y * 1 + 0 = 2x + y
    assert.deepEqual(computeDerivative('derivative(x^2 + x*y + y^2, x)'), new OperatorNode('+', 'add', [
                                                               new OperatorNode('+', 'add', [
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new ConstantNode(2),
                                                                   new OperatorNode('*', 'multiply', [
                                                                     new ConstantNode(1),
                                                                     new OperatorNode('^', 'pow', [
                                                                       new SymbolNode('x'),
                                                                       parseNoComment('2-1')
                                                                     ])
                                                                   ])
                                                                 ]),
                                                                 parseNoComment('y*1')
                                                               ]),
                                                               new ConstantNode(0)
                                                             ]));
  });

  it('should function properly even without being called within an eval', function() {
    var f = parseNoComment('2x^3');

    // 2*3*1*x^(3-1) = 6x^2
    assert.deepEqual(derivative(f, new SymbolNode('x')), new OperatorNode('*', 'multiply', [
                                                           new ConstantNode(2),
                                                           new OperatorNode('*', 'multiply', [
                                                             new ConstantNode(3),
                                                             new OperatorNode('*', 'multiply', [
                                                               new ConstantNode(1),
                                                               new OperatorNode('^', 'pow', [
                                                                 new SymbolNode('x'),
                                                                 parseNoComment('3-1')
                                                               ])
                                                             ])
                                                           ])
                                                         ]));
  });

  it('should throw error if expressions contain unsupported operators or functions', function() {
    assert.throws(function () { eval('derivative(x << 2, x)'); }, /Error: Operator "<<" not supported by derivative/);
    assert.throws(function () { eval('derivative(subset(x), x)'); }, /Error: Function "subset" not supported by derivative/);
  });

  it('should have controlled behavior on arguments errors', function() {
    assert.throws(function() {
      eval('derivative(sqrt(), x)');
    }, /TypeError: Too few arguments in function sqrt \(expected: number or Complex or BigNumber or Unit or Array or Matrix, index: 0\)/);
    assert.throws(function() {
      eval('derivative(sqrt(12, 2x), x)');
    }, /TypeError: Too many arguments in function sqrt \(expected: 1, actual: 2\)/);
  });

  it('should throw error for incorrect argument types', function() {
    assert.throws(function () {
      eval('derivative(42, 42)');
    }, /TypeError: Unexpected type of argument in function derivative \(expected: SymbolNode, actual: ConstantNode, index: 1\)/);

    assert.throws(function () {
      eval('derivative([1, 2; 3, 4], x)');
    }, /TypeError: Unexpected type of argument in function constTag \(expected: OperatorNode or ConstantNode or SymbolNode or ParenthesisNode or FunctionNode or FunctionAssignmentNode, actual: ArrayNode, index: 1\)/);

    assert.throws(function () {
      eval('derivative(x + [1, 2; 3, 4], x)');
    }, /TypeError: Unexpected type of argument in function constTag \(expected: OperatorNode or ConstantNode or SymbolNode or ParenthesisNode or FunctionNode or FunctionAssignmentNode, actual: ArrayNode, index: 1\)/);
  });

  it('should throw error if incorrect number of arguments', function() {
    assert.throws(function () {
      eval('derivative(x + 2)');
    }, /TypeError: Too few arguments in function derivative \(expected: SymbolNode, index: 1\)/);

    assert.throws(function () {
      eval('derivative(x + 2, x, "stuff", true, 42)');
    }, /TypeError: Too many arguments in function derivative \(expected: 3, actual: 5\)/);
  });

});
