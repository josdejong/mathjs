// test derivative
var assert = require('assert');
var math = require('../../../index');
var ConstantNode = math.expression.node.ConstantNode;
var OperatorNode = math.expression.node.OperatorNode;
var FunctionNode = math.expression.node.FunctionNode;
var ParenthesisNode = math.expression.node.ParenthesisNode;
var SymbolNode = math.expression.node.SymbolNode;
var parse = math.parse;
var eval = math.eval;

describe('derivative', function() {

  it('should take the derivative of a constant', function() {
    assert.deepEqual(eval('derivative(1, x)'), new ConstantNode(0));
    assert.deepEqual(eval('derivative(10000000, x)'), new ConstantNode(0));
  });

  it('should take the derivative of a SymbolNodes', function() {
    assert.deepEqual(eval('derivative(x, x)'), new ConstantNode(1));
  });

  it('should maintain parenthesis of ParenthesisNodes', function() {
    assert.deepEqual(eval('derivative((1), x)'), parse('(0)'));
    assert.deepEqual(eval('derivative((x), x)'), parse('(1)'));
  });

  it('should take the derivative of FunctionAssignmentNodes', function() {
    assert.deepEqual(math.derivative(parse('f(x) = 5x + x + 2'), new SymbolNode('x')),
                     parse('5*1 + 1 + 0'));
    assert.deepEqual(math.derivative(parse('f(x) = 5 + 2'), new SymbolNode('x')),
                     new ConstantNode(0));
    assert.deepEqual(math.derivative(parse('f(y) = 5y + 2'), new SymbolNode('x')),
                     new ConstantNode(0));
  });

  it('should take the derivative of a OperatorNodes with ConstantNodes', function() {
    assert.deepEqual(eval('derivative(1 + 2, x)'), new ConstantNode(0));
    assert.deepEqual(eval('derivative(-100^2 + 3*3/2 - 12, x)'), new ConstantNode(0));
  });

  it('should take the derivative of a OperatorNodes with SymbolNodes', function() {
    // d/dx(-4x) = -4*1 = -4
    assert.deepEqual(eval('derivative(-4x, x)'), parse('-4*1'));
    // d/dx(+4x) = +4*1 = +4
    assert.deepEqual(eval('derivative(+4x, x)'), parse('+4*1'));


    // Linearity of differentiation
    // With '+': d/dx(5x + x + 2) = 5*1 + 1 + 0 = 6
    assert.deepEqual(eval('derivative(5x + x + 2, x)'), parse('5*1 + 1 + 0'));
    // With '-': d/dx(5x - x - 2) = 5*1 - 1 - 0 = 4
    assert.deepEqual(eval('derivative(5x - x - 2, x)'), parse('5*1 - 1 - 0'));


    // d/dx(2*(x + x)) = 2*(1 + 1)
    assert.deepEqual(eval('derivative(2(x + x), x)'), parse('2*(1 + 1)'));
    assert.deepEqual(eval('derivative((x + x)*2, x)'), parse('2*(1 + 1)'));


    // Product Rule, d/dx(5x*3x) = 5*(3*1*x + x*3*1) = 30x
    assert.deepEqual(eval('derivative(5x*3x, x)'), new OperatorNode('*', 'multiply', [
                                                     new ConstantNode(5),
                                                     parse('3*1*x + x*3*1')
                                                   ]));


    // Basic division, d/dx(7x / 2) = 7 * 1 / 2 = 7 / 2
    assert.deepEqual(eval('derivative(7x / 2, x)'), new OperatorNode('*', 'multiply', [
                                                      new ConstantNode(7),
                                                      new OperatorNode('/', 'divide', [
                                                        new ConstantNode(1),
                                                        new ConstantNode(2)
                                                      ])
                                                    ]));
    // Reciprocal Rule, d/dx(5 / (3x)) = -5 * (3 * 1) / (3 * x) ^ 2 = -5 / 3x^2
    assert.deepEqual(eval('derivative(5 / (3x), x)'), new OperatorNode('*', 'multiply', [
                                                        new OperatorNode('-', 'unaryMinus', [new ConstantNode(5)]),
                                                        parse('(3*1) / (3*x)^2')
                                                      ]));
    // Quotient rule, d/dx((2x) / (3x + 2)) = ((2*1)(3x + 2) - (2x)(3*1 + 0)) / (3x + 2)^2 = 4 / (3x + 2)^2
    assert.deepEqual(eval('derivative((2x) / (3x + 2), x)'), new OperatorNode('/', 'divide', [
                                                               parse('(2*1)(3x + 2) - (2x)(3*1 + 0)'),
                                                               parse('(3x + 2)^2')
                                                             ]));


    // Secret constant; 0^f(x) = 1 (in JS), 1^f(x) = 1, d/dx(1) = 0
    assert.deepEqual(eval('derivative(0^(2^x + x^3 + 2), x)'), new ConstantNode(0));
    assert.deepEqual(eval('derivative(1^(2^x + x^3 + 2), x)'), new ConstantNode(0));
    // d/dx(10^(2x + 2)) = 10^(2x + 2)*ln(10)*(2*1 + 0)
    assert.deepEqual(eval('derivative(10^(2x + 2), x)'), new OperatorNode('*', 'multiply', [
                                                           parse('10^(2x + 2)'),
                                                           parse('log(10)*(2*1 + 0)')
                                                         ]));
    // Secret constant, f(x)^0 = 1 -> d/dx(f(x)^0) = 1
    assert.deepEqual(eval('derivative((x^x^x^x)^0, x)'), new ConstantNode(0));
    // Ignore powers of 1, d/dx((x + 2)^1) -> d/dx(x+2) = (1 + 0) = 1
    assert.deepEqual(eval('derivative((x+2)^1, x)'), parse('(1 + 0)'));
    // Elementary Power Rule, d/dx(2x^2) = 2*2*1*x^(2-1) = 4x
    assert.deepEqual(eval('derivative(2x^2, x)'), new OperatorNode('*', 'multiply', [
                                                    new ConstantNode(2),
                                                    new OperatorNode('*', 'multiply', [
                                                      new ConstantNode(2),
                                                      new OperatorNode('*', 'multiply', [
                                                        new ConstantNode(1),
                                                        new OperatorNode('^', 'pow', [
                                                          new SymbolNode('x'),
                                                          parse('2 - 1')
                                                        ])
                                                      ])
                                                    ])
                                                  ]));
    // Elementary Power Rule, d/dx(2x^-2) = 2*-2*1*x^(-2-1) = -4x^-3
    assert.deepEqual(eval('derivative(2x^-2, x)'), new OperatorNode('*', 'multiply', [
                                                     new ConstantNode(2),
                                                     new OperatorNode('*', 'multiply', [
                                                       new OperatorNode('-', 'unaryMinus', [new ConstantNode(2)]),
                                                       new OperatorNode('*', 'multiply', [
                                                         new ConstantNode(1),
                                                         new OperatorNode('^', 'pow', [
                                                           new SymbolNode('x'),
                                                           parse('-2 - 1')
                                                         ])
                                                       ])
                                                     ])
                                                   ]));

    // Functional Power Rule, d/dx((x^3 + x)^(5x + 2)) = (x^3 + x)^(5x + 2) * [(((3*1*x)^(3-1)+1) * ((5x + 2) / (x^3 + x))) + (5*1 + 0)log((x^3 + x))]
    //                                                 = (x^3 + x)^(5x + 2) * [((3x^2 + 1)*(5x + 2) / (x^3 + x)) + 5log(x^3 + x)]
    assert.deepEqual(eval('derivative((x^3 + x)^(5x + 2), x)'), new OperatorNode('*', 'multiply', [
                                                                  parse('(x^3 + x)^(5x + 2)'),
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
                                                                                parse('3-1')
                                                                              ])
                                                                            ])
                                                                          ]),
                                                                          new ConstantNode(1)
                                                                        ])
                                                                      ),
                                                                      parse('(5x + 2) / (x^3 + x)')
                                                                    ]),
                                                                    parse('(5*1 + 0)log((x^3 + x))')
                                                                  ])
                                                                ]));
  });

  it('should properly take the derivative of mathematical functions', function() {
    assert.deepEqual(eval('derivative(sqrt(6x), x)'), new OperatorNode('/', 'divide', [
                                                        parse('6*1'),
                                                        parse('2*sqrt(6x)')
                                                      ]));
    assert.deepEqual(eval('derivative(nthRoot(6x), x)'), new OperatorNode('/', 'divide', [
                                                           parse('6*1'),
                                                           parse('2*sqrt(6x)')
                                                         ]));
    assert.deepEqual(eval('derivative(nthRoot(6x, 3), x)'), new OperatorNode('*', 'multiply', [
                                                              parse('1/3'),
                                                              new OperatorNode('*', 'multiply', [
                                                                parse('6*1'),
                                                                new OperatorNode('^', 'pow', [
                                                                  parse('6x'),
                                                                  parse('1/3 - 1')
                                                                ])
                                                              ])
                                                            ]));
    // (6 * x) ^ (1 / (2 * x)) * (((6*1)*((1/(2x))/(6x))) + ((((0*2x)-(1*(2*1)))/(2x)^2)*log(6x)))
    assert.deepEqual(eval('derivative(nthRoot((6x), (2x)), x)'), new OperatorNode('*', 'multiply', [
                                                                   new OperatorNode('^', 'pow', [
                                                                     parse('(6x)'),
                                                                     parse('1 / (2x)')
                                                                   ]),
                                                                   new OperatorNode('+', 'add', [
                                                                     new OperatorNode('*', 'multiply', [
                                                                       parse('(6*1)'),
                                                                       parse('1 / (2x) / (6x)')
                                                                     ]),
                                                                     new OperatorNode('*', 'multiply', [
                                                                       new OperatorNode('/', 'divide', [
                                                                         parse('0*(2x) - 1*(2*1)'),
                                                                         parse('(2x)^2')
                                                                       ]),
                                                                       parse('log((6x))')
                                                                     ])
                                                                   ])
                                                                 ]));
    assert.deepEqual(eval('derivative(log((6x)), x)'), parse('(6*1)/(6*x)'));
    assert.deepEqual(eval('derivative(log10((6x)), x)'), new OperatorNode('/', 'divide', [
                                                           parse('(6*1)'),
                                                           parse('(6x)log(10)')
                                                         ]));
    assert.deepEqual(eval('derivative(log((6x), 10), x)'), new OperatorNode('/', 'divide', [
                                                             parse('(6*1)'),
                                                             parse('(6x)log(10)')
                                                           ]));
    // d/dx(log(2x, 3x)) = ((2 * 1) / (2 * x) * log(3 * x) - log(2 * x) * (3 * 1) / (3 * x)) / log(3 * x) ^ 2 = (log(3x) - log(2x)) / (xlog(3x)^2)
    assert.deepEqual(eval('derivative(log((2x), (3x)), x)'), new OperatorNode('/', 'divide', [
                                                               new OperatorNode('-', 'subtract', [
                                                                 new OperatorNode('*', 'multiply', [
                                                                   parse('(2*1) / (2x)'),    
                                                                   new FunctionNode('log', [parse('(3x)')])
                                                                 ]),
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new FunctionNode('log', [parse('(2x)')]),
                                                                   parse('(3*1) / (3x)')
                                                                 ])
                                                               ]),
                                                               parse('log((3x))^2')
                                                             ]));

    assert.deepEqual(eval('derivative(sin(2x), x)'), parse('2*1*cos(2x)'));
    assert.deepEqual(eval('derivative(cos(2x), x)'), parse('2*1*-sin(2x)'));
    assert.deepEqual(eval('derivative(tan(2x), x)'), parse('2*1*sec(2x)^2'));
    assert.deepEqual(eval('derivative(sec(2x), x)'), new OperatorNode('*', 'multiply', [
                                                       parse('2*1'),
                                                       parse('sec(2x)*tan(2x)')
                                                     ]));
    assert.deepEqual(eval('derivative(csc(2x), x)'), new OperatorNode('*', 'multiply', [
                                                       new OperatorNode('-', 'unaryMinus', [parse('2*1')]),
                                                       parse('csc(2x)cot(2x)')
                                                     ]));
    assert.deepEqual(eval('derivative(cot((2x)), x)'), parse('-(2*1)csc((2x))^2'));
    assert.deepEqual(eval('derivative(asin((2x)), x)'), parse('(2*1) / sqrt(1 - (2x)^2)'));
    assert.deepEqual(eval('derivative(acos((2x)), x)'), parse('-(2*1) / sqrt(1 - (2x)^2)'));
    assert.deepEqual(eval('derivative(atan((2x)), x)'), new OperatorNode('/', 'divide', [
                                                          parse('(2*1)'),
                                                          parse('(2x)^2 + 1')
                                                        ]));
    assert.deepEqual(eval('derivative(asec((2x)), x)'), new OperatorNode('/', 'divide', [
                                                          parse('(2*1)'),
                                                          parse('abs((2x))*sqrt((2x)^2 - 1)')
                                                        ]));
    assert.deepEqual(eval('derivative(acsc((2x)), x)'), new OperatorNode('/', 'divide', [
                                                          new OperatorNode('-', 'unaryMinus', [parse('(2*1)')]),
                                                          parse('abs((2x))*sqrt((2x)^2 - 1)')
                                                        ]));
    assert.deepEqual(eval('derivative(acot((2x)), x)'), new OperatorNode('/', 'divide', [
                                                          new OperatorNode('-', 'unaryMinus', [parse('(2*1)')]),
                                                          parse('(2x)^2 + 1')
                                                        ]));
    assert.deepEqual(eval('derivative(sinh(2x), x)'), parse('2*1*cosh(2x)'));
    assert.deepEqual(eval('derivative(cosh(2x), x)'), parse('2*1*sinh(2x)'));
    assert.deepEqual(eval('derivative(tanh(2x), x)'), parse('2*1*sech(2x)^2'));
    assert.deepEqual(eval('derivative(sech(2x), x)'), new OperatorNode('*', 'multiply', [
                                                        new OperatorNode('-', 'unaryMinus', [parse('2*1')]),
                                                        parse('sech(2x)tanh(2x)')
                                                      ]));
    assert.deepEqual(eval('derivative(csch(2x), x)'), new OperatorNode('*', 'multiply', [
                                                        new OperatorNode('-', 'unaryMinus', [parse('2*1')]),
                                                        parse('csch(2x)coth(2x)')
                                                      ]));
    assert.deepEqual(eval('derivative(coth(2x), x)'), new OperatorNode('*', 'multiply', [
                                                        new OperatorNode('-', 'unaryMinus', [parse('2*1')]),
                                                        parse('csch(2x)^2')
                                                      ]));
    assert.deepEqual(eval('derivative(asinh((2x)), x)'), parse('(2*1) / sqrt((2x)^2 + 1)'));
    assert.deepEqual(eval('derivative(acosh((2x)), x)'), parse('(2*1) / sqrt((2x)^2 - 1)'));
    assert.deepEqual(eval('derivative(atanh((2x)), x)'), new OperatorNode('/', 'divide', [
                                                           parse('(2*1)'),
                                                           parse('1 - (2x)^2')
                                                         ]));
    assert.deepEqual(eval('derivative(asech((2x)), x)'), new OperatorNode('/', 'divide', [
                                                           new OperatorNode('-', 'unaryMinus', [parse('(2*1)')]),
                                                           parse('(2x)*sqrt(1 - (2x)^2)')
                                                         ]));
    assert.deepEqual(eval('derivative(acsch((2x)), x)'), new OperatorNode('/', 'divide', [
                                                           new OperatorNode('-', 'unaryMinus', [parse('(2*1)')]),
                                                           parse('abs((2x))sqrt((2x)^2 + 1)')
                                                         ]));
    assert.deepEqual(eval('derivative(acoth((2x)), x)'), new OperatorNode('/', 'divide', [
                                                           new OperatorNode('-', 'unaryMinus', [parse('(2*1)')]),
                                                           parse('1 - (2x)^2')
                                                         ]));
  });

  it('should take the partial derivative of an expression', function() {
    assert.deepEqual(eval('derivative(x + y, x)'), parse('1 + 0'));
    assert.deepEqual(eval('derivative(x + log(y)*y, x)'), parse('1 + 0'));

    assert.deepEqual(eval('derivative(x + y + z, x)'), parse('1 + 0 + 0'));
    assert.deepEqual(eval('derivative(x + log(y)*z, x)'), parse('1 + 0'));

    assert.deepEqual(eval('derivative(x + log(y)*x, x)'), parse('1 + log(y)*1'));

    // 2 * 1 * x ^ (2 - 1) + y * 1 + 0 = 2x + y
    assert.deepEqual(eval('derivative(x^2 + x*y + y^2, x)'), new OperatorNode('+', 'add', [
                                                               new OperatorNode('+', 'add', [
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new ConstantNode(2),
                                                                   new OperatorNode('*', 'multiply', [
                                                                     new ConstantNode(1),
                                                                     new OperatorNode('^', 'pow', [
                                                                       new SymbolNode('x'),
                                                                       parse('2-1')
                                                                     ])
                                                                   ])
                                                                 ]),
                                                                 parse('y*1')
                                                               ]),
                                                               new ConstantNode(0)
                                                             ]));
  });

  it('should function properly even without being called within an eval', function() {
    var f = parse('2x^3');

    // 2*3*1*x^(3-1) = 6x^2
    assert.deepEqual(math.derivative(f, new SymbolNode('x')), new OperatorNode('*', 'multiply', [
                                                                new ConstantNode(2),
                                                                new OperatorNode('*', 'multiply', [
                                                                  new ConstantNode(3),
                                                                  new OperatorNode('*', 'multiply', [
                                                                    new ConstantNode(1),
                                                                    new OperatorNode('^', 'pow', [
                                                                      new SymbolNode('x'),
                                                                      parse('3-1')
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
    }, /TypeError: Too few arguments in function sqrt \(expected: number or Complex or BigNumber or Array or Matrix, index: 0\)/);
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
    }, /TypeError: Too many arguments in function derivative \(expected: 2, actual: 5\)/);
  });

});
