// test derivative
var assert = require('assert');
var math = require('../../../index');
var ConstantNode = math.expression.node.ConstantNode;
var OperatorNode = math.expression.node.OperatorNode;
var FunctionNode = math.expression.node.FunctionNode;
var ParenthesisNode = math.expression.node.ParenthesisNode;
var SymbolNode = math.expression.node.SymbolNode;

describe('derivative', function() {

  it('should take the derivative of a constant', function() {
    assert.deepEqual(math.eval('derivative(1, x)'), new ConstantNode(0));
    assert.deepEqual(math.eval('derivative(10000000, x)'), new ConstantNode(0));
  });

  it('should take the derivative of a SymbolNodes', function() {
    assert.deepEqual(math.eval('derivative(x, x)'), new ConstantNode(1));
    assert.deepEqual(math.eval('derivative(C, x)'), new ConstantNode(0));
  });

  it('should maintain parenthesis of ParenthesisNodes', function() {
    assert.deepEqual(math.eval('derivative((1), x)'), math.parse('(0)'));
    assert.deepEqual(math.eval('derivative((x), x)'), math.parse('(1)'));
  });

  it('should take the derivative of FunctionAssignmentNodes', function() {
    assert.deepEqual(math.derivative(math.parse('f(x) = 5x + x + 2'), new SymbolNode('x')),
                     math.parse('5*1 + 1 + 0'));
    assert.deepEqual(math.derivative(math.parse('f(x) = 5 + 2'), new SymbolNode('x')),
                     new ConstantNode(0));
    assert.deepEqual(math.derivative(math.parse('f(y) = 5y + 2'), new SymbolNode('x')),
                     new ConstantNode(0));
  });

  it('should take the derivative of a OperatorNodes with ConstantNodes', function() {
    assert.deepEqual(math.eval('derivative(1 + 2, x)'), new ConstantNode(0));
    assert.deepEqual(math.eval('derivative(-100^2 + 3*3/2 - 12, x)'), new ConstantNode(0));
  });

  it('should take the derivative of a OperatorNodes with SymbolNodes', function() {
    // d/dx(-4x) = -4*1 = -4
    assert.deepEqual(math.eval('derivative(-4x, x)'), math.parse('-4*1'));
    // d/dx(+4x) = +4*1 = +4
    assert.deepEqual(math.eval('derivative(+4x, x)'), math.parse('+4*1'));


    // Linearity of differentiation
    // With '+': d/dx(5x + x + 2) = 5*1 + 1 + 0 = 6
    assert.deepEqual(math.eval('derivative(5x + x + 2, x)'), math.parse('5*1 + 1 + 0'));
    // With '-': d/dx(5x - x - 2) = 5*1 - 1 - 0 = 4
    assert.deepEqual(math.eval('derivative(5x - x - 2, x)'), math.parse('5*1 - 1 - 0'));


    // d/dx(2*(x + x)) = 2*(1 + 1)
    assert.deepEqual(math.eval('derivative(2(x + x), x)'), math.parse('2*(1 + 1)'));
    assert.deepEqual(math.eval('derivative((x + x)*2, x)'), math.parse('2*(1 + 1)'));


    // Product Rule, d/dx(5x*3x) = 5*(3*1*x + x*3*1) = 30x
    assert.deepEqual(math.eval('derivative(5x*3x, x)'), new OperatorNode('*', 'multiply', [
                                                          new ConstantNode(5),
                                                          new OperatorNode('+', 'add', [
                                                            new OperatorNode('*', 'multiply', [
                                                              new OperatorNode('*', 'multiply', [
                                                                new ConstantNode(3),
                                                                new ConstantNode(1)
                                                              ]),
                                                              new SymbolNode('x')
                                                            ]),
                                                            new OperatorNode('*', 'multiply', [
                                                              new OperatorNode('*', 'multiply', [
                                                                new SymbolNode('x'),
                                                                new ConstantNode(3)
                                                              ]),
                                                              new ConstantNode(1)
                                                            ])
                                                          ])
                                                        ]));


    // Basic division, d/dx(7x / 2) = 7 * 1 / 2 = 7 / 2
    assert.deepEqual(math.eval('derivative(7x / 2, x)'), new OperatorNode('*', 'multiply', [
                                                           new ConstantNode(7),
                                                           new OperatorNode('/', 'divide', [
                                                             new ConstantNode(1),
                                                             new ConstantNode(2)
                                                           ])
                                                         ]));
    // Reciprocal Rule, d/dx(5 / (3x)) = -5 * (3 * 1) / (3 * x) ^ 2 = -5 / 3x^2
    assert.deepEqual(math.eval('derivative(5 / (3x), x)'), new OperatorNode('*', 'multiply', [
                                                             new OperatorNode('-', 'unaryMinus', [new ConstantNode(5)]),
                                                             new OperatorNode('/', 'divide', [
                                                               new ParenthesisNode(
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new ConstantNode(3),
                                                                   new ConstantNode(1)
                                                                 ])
                                                               ),
                                                               new OperatorNode('^', 'pow', [
                                                                 new ParenthesisNode(
                                                                   new OperatorNode('*', 'multiply', [
                                                                     new ConstantNode(3),
                                                                     new SymbolNode('x')
                                                                   ])
                                                                 ),
                                                                 new ConstantNode(2)
                                                               ])
                                                             ])
                                                           ]));
    // Quotient rule, d/dx((2x) / (3x + 2)) = ((2*1)(3x + 2) - (2x)(3*1 + 0)) / (3x + 2)^2 = 4 / (3x + 2)^2
    assert.deepEqual(math.eval('derivative((2x) / (3x + 2), x)'), new OperatorNode('/', 'divide', [
                                                                    new OperatorNode('-', 'subtract', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ParenthesisNode(
                                                                          new OperatorNode('*', 'multiply', [
                                                                            new ConstantNode(2),
                                                                            new ConstantNode(1)
                                                                          ])
                                                                        ),
                                                                        new ParenthesisNode(
                                                                          new OperatorNode('+', 'add', [
                                                                            new OperatorNode('*', 'multiply', [
                                                                              new ConstantNode(3),
                                                                              new SymbolNode('x')
                                                                            ]),
                                                                            new ConstantNode(2)
                                                                          ])
                                                                        )
                                                                      ]),
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ParenthesisNode(
                                                                          new OperatorNode('*', 'multiply', [
                                                                            new ConstantNode(2),
                                                                            new SymbolNode('x')
                                                                          ])
                                                                        ),
                                                                        new ParenthesisNode(
                                                                          new OperatorNode('+', 'add', [
                                                                            new OperatorNode('*', 'multiply', [
                                                                              new ConstantNode(3),
                                                                              new ConstantNode(1)
                                                                            ]),
                                                                            new ConstantNode(0)
                                                                          ])
                                                                        )
                                                                      ])
                                                                    ]),
                                                                    new OperatorNode('^', 'pow', [
                                                                      new ParenthesisNode(
                                                                        new OperatorNode('+', 'add', [
                                                                          new OperatorNode('*', 'multiply', [
                                                                            new ConstantNode(3),
                                                                            new SymbolNode('x')
                                                                          ]),
                                                                          new ConstantNode(2)
                                                                        ])
                                                                      ),
                                                                      new ConstantNode(2)
                                                                    ])
                                                                  ]));


    // Secret constant; 0^f(x) = 1 (in JS), 1^f(x) = 1
    assert.deepEqual(math.eval('derivative(0^(2^x + x^3 + 2), x)'), new ConstantNode(0));
    assert.deepEqual(math.eval('derivative(1^(2^x + x^3 + 2), x)'), new ConstantNode(0));
    // d/dx(10^(2x + 2)) = 10^(2x + 2)*ln(10)*(2*1 + 0)
    assert.deepEqual(math.eval('derivative(10^(2x + 2), x)'), new OperatorNode('*', 'multiply', [
                                                                new OperatorNode('^', 'pow', [
                                                                  new ConstantNode(10),
                                                                  new ParenthesisNode(
                                                                    new OperatorNode('+', 'add', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(2),
                                                                        new SymbolNode('x')
                                                                      ]),
                                                                      new ConstantNode(2)
                                                                    ])
                                                                  )
                                                                ]),
                                                                new OperatorNode('*', 'multiply', [
                                                                  new FunctionNode('log', [new ConstantNode(10)]),
                                                                  new ParenthesisNode(
                                                                    new OperatorNode('+', 'add', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(2),
                                                                        new ConstantNode(1)
                                                                      ]),
                                                                      new ConstantNode(0)
                                                                    ])
                                                                  )
                                                                ])
                                                              ]));
    // Secret constant, f(x)^0 = 1 -> d/dx(f(x)^0) = 1
    assert.deepEqual(math.eval('derivative((x^x^x^x)^0, x)'), new ConstantNode(0));
    // Ignore powers of 1, d/dx((x + 2)^1) -> d/dx(x+2) = (1 + 0) = 1
    assert.deepEqual(math.eval('derivative((x+2)^1, x)'), math.parse('(1 + 0)'));
    // Elementary Power Rule, d/dx(2x^2) = 2*2*1*x^(2-1) = 4x
    assert.deepEqual(math.eval('derivative(2x^2, x)'), new OperatorNode('*', 'multiply', [
                                                         new ConstantNode(2),
                                                         new OperatorNode('*', 'multiply', [
                                                           new ConstantNode(2),
                                                           new OperatorNode('*', 'multiply', [
                                                             new ConstantNode(1),
                                                             new OperatorNode('^', 'pow', [
                                                               new SymbolNode('x'),
                                                               new OperatorNode('-', 'subtract', [
                                                                 new ConstantNode(2),
                                                                 new ConstantNode(1)
                                                               ])
                                                             ])
                                                           ])
                                                         ])
                                                       ]));
    // Elementary Power Rule, d/dx(2x^-2) = 2*-2*1*x^(-2-1) = -4x^-3
    assert.deepEqual(math.eval('derivative(2x^-2, x)'), new OperatorNode('*', 'multiply', [
                                                          new ConstantNode(2),
                                                          new OperatorNode('*', 'multiply', [
                                                            new OperatorNode('-', 'unaryMinus', [new ConstantNode(2)]),
                                                            new OperatorNode('*', 'multiply', [
                                                              new ConstantNode(1),
                                                              new OperatorNode('^', 'pow', [
                                                                new SymbolNode('x'),
                                                                new OperatorNode('-', 'subtract', [
                                                                  new OperatorNode('-', 'unaryMinus', [new ConstantNode(2)]),
                                                                  new ConstantNode(1)
                                                                ])
                                                              ])
                                                            ])
                                                          ])
                                                        ]));

    // Functional Power Rule, d/dx((x^3 + x)^(5x + 2)) = (x^3 + x)^(5x + 2) * [(((3*1*x)^(3-1)+1) * ((5x + 2) / (x^3 + x))) + (5*1 + 0)log((x^3 + x))]
    //                                                 = (x^3 + x)^(5x + 2) * [((3x^2 + 1)*(5x + 2) / (x^3 + x)) + 5log(x^3 + x)]
    assert.deepEqual(math.eval('derivative((x^3 + x)^(5x + 2), x)'), new OperatorNode('*', 'multiply', [
                                                                       new OperatorNode('^', 'pow', [
                                                                         new ParenthesisNode(
                                                                           new OperatorNode('+', 'add', [
                                                                             new OperatorNode('^', 'pow', [
                                                                               new SymbolNode('x'),
                                                                               new ConstantNode(3)
                                                                             ]),
                                                                             new SymbolNode('x')
                                                                           ])
                                                                         ),
                                                                         new ParenthesisNode(
                                                                           new OperatorNode('+', 'add', [
                                                                             new OperatorNode('*', 'multiply', [
                                                                               new ConstantNode(5),
                                                                               new SymbolNode('x')
                                                                             ]),
                                                                             new ConstantNode(2)
                                                                           ])
                                                                         )
                                                                       ]),
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
                                                                                     new OperatorNode('-', 'subtract', [
                                                                                       new ConstantNode(3),
                                                                                       new ConstantNode(1)
                                                                                     ])
                                                                                   ])
                                                                                 ])
                                                                               ]),
                                                                               new ConstantNode(1)
                                                                             ])
                                                                           ),
                                                                           new OperatorNode('/', 'divide', [
                                                                             new ParenthesisNode(
                                                                               new OperatorNode('+', 'add', [
                                                                                 new OperatorNode('*', 'multiply', [
                                                                                   new ConstantNode(5),
                                                                                   new SymbolNode('x')
                                                                                 ]),
                                                                                 new ConstantNode(2)
                                                                               ])
                                                                             ),
                                                                             new ParenthesisNode(
                                                                               new OperatorNode('+', 'add', [
                                                                                 new OperatorNode('^', 'pow', [
                                                                                   new SymbolNode('x'),
                                                                                   new ConstantNode(3)
                                                                                 ]),
                                                                                 new SymbolNode('x')
                                                                               ])
                                                                             )
                                                                           ])
                                                                         ]),
                                                                         new OperatorNode('*', 'multiply', [
                                                                           new ParenthesisNode(
                                                                             new OperatorNode('+', 'add', [
                                                                               new OperatorNode('*', 'multiply', [
                                                                                 new ConstantNode(5),
                                                                                 new ConstantNode(1)
                                                                               ]),
                                                                               new ConstantNode(0)
                                                                             ])
                                                                           ),
                                                                           new FunctionNode('log', [
                                                                             new ParenthesisNode(
                                                                               new OperatorNode('+', 'add', [
                                                                                 new OperatorNode('^', 'pow', [
                                                                                   new SymbolNode('x'),
                                                                                   new ConstantNode(3)
                                                                                 ]),
                                                                                 new SymbolNode('x')
                                                                               ])
                                                                             )
                                                                           ])
                                                                         ])
                                                                       ])
                                                                     ]));
  });

  it('should properly take the derivative of mathematical functions', function() {
    assert.deepEqual(math.eval('derivative(sqrt((6x)), x)'), new OperatorNode('/', 'divide', [
                                                               math.parse('(6 * 1)'),
                                                               math.parse('2 * sqrt((6 * x))')
                                                             ]));
    assert.deepEqual(math.eval('derivative(nthRoot((6x)), x)'), new OperatorNode('/', 'divide', [
                                                                  math.parse('(6 * 1)'),
                                                                  math.parse('2 * sqrt((6 * x))')
                                                                ]));
    assert.deepEqual(math.eval('derivative(nthRoot(6x, 3), x)'), new OperatorNode('*', 'multiply', [
                                                                   math.parse('1/3'),
                                                                   new OperatorNode('*', 'multiply', [
                                                                     math.parse('6*1'),
                                                                     new OperatorNode('^', 'pow', [
                                                                       math.parse('6x'),
                                                                       math.parse('1/3 - 1')
                                                                     ])
                                                                   ])
                                                                 ]));
    // (6 * x) ^ (1 / (2 * x)) * (((6*1)*((1/(2x))/(6x))) + ((((0*2x)-(1*(2*1)))/(2x)^2)*log(6x)))
    assert.deepEqual(math.eval('derivative(nthRoot(6x, 2x), x)'), new OperatorNode('*', 'multiply', [
                                                                    new OperatorNode('^', 'pow', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(6),
                                                                        new SymbolNode('x')
                                                                      ]),
                                                                      new OperatorNode('/', 'divide', [
                                                                        new ConstantNode(1),
                                                                        new OperatorNode('*', 'multiply', [
                                                                          new ConstantNode(2),
                                                                          new SymbolNode('x')
                                                                        ])
                                                                      ])
                                                                    ]),
                                                                    new OperatorNode('+', 'add', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new OperatorNode('*', 'multiply', [
                                                                          new ConstantNode(6),
                                                                          new ConstantNode(1)
                                                                        ]),
                                                                        new OperatorNode('/', 'divide', [
                                                                          new OperatorNode('/', 'divide', [
                                                                            new ConstantNode(1),
                                                                            new OperatorNode('*', 'multiply', [
                                                                              new ConstantNode(2),
                                                                              new SymbolNode('x')
                                                                            ])
                                                                          ]),
                                                                          new OperatorNode('*', 'multiply', [
                                                                            new ConstantNode(6),
                                                                            new SymbolNode('x')
                                                                          ])
                                                                        ])
                                                                      ]),
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new OperatorNode('/', 'divide', [
                                                                          new OperatorNode('-', 'subtract', [
                                                                            new OperatorNode('*', 'multiply', [
                                                                              new ConstantNode(0),
                                                                              new OperatorNode('*', 'multiply', [
                                                                                new ConstantNode(2),
                                                                                new SymbolNode('x')
                                                                              ])
                                                                            ]),
                                                                            new OperatorNode('*', 'multiply', [
                                                                              new ConstantNode(1),
                                                                              new OperatorNode('*', 'multiply', [
                                                                                new ConstantNode(2),
                                                                                new ConstantNode(1)
                                                                              ])
                                                                            ])
                                                                          ]),
                                                                          new OperatorNode('^', 'pow', [
                                                                            new OperatorNode('*', 'multiply', [
                                                                              new ConstantNode(2),
                                                                              new SymbolNode('x')
                                                                            ]),
                                                                            new ConstantNode(2)
                                                                          ])
                                                                        ]),
                                                                        new FunctionNode('log', [
                                                                          new OperatorNode('*', 'multiply', [
                                                                            new ConstantNode(6),
                                                                            new SymbolNode('x')
                                                                          ])
                                                                        ])
                                                                      ])
                                                                    ])
                                                                  ]));
    assert.deepEqual(math.eval('derivative(log((6x)), x)'), math.parse('(6*1)/(6*x)'));
    assert.deepEqual(math.eval('derivative(log10((6x)), x)'), new OperatorNode('/', 'divide', [
                                                                  math.parse('(6*1)'),
                                                                  math.parse('(6x)log(10)')
                                                                ]));
    assert.deepEqual(math.eval('derivative(log((6x), 10), x)'), new OperatorNode('/', 'divide', [
                                                                  math.parse('(6*1)'),
                                                                  math.parse('(6x)log(10)')
                                                                ]));
    // d/dx(log(2x, 3x)) = ((2 * 1) / (2 * x) * log(3 * x) - log(2 * x) * (3 * 1) / (3 * x)) / log(3 * x) ^ 2 = (log(3x) - log(2x)) / (xlog(3x)^2)
    assert.deepEqual(math.eval('derivative(log(2x, 3x), x)'), new OperatorNode('/', 'divide', [
                                                                new OperatorNode('-', 'subtract', [
                                                                  new OperatorNode('*', 'multiply', [
                                                                    new OperatorNode('/', 'divide', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(2),
                                                                        new ConstantNode(1)
                                                                      ]),
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(2),
                                                                        new SymbolNode('x')
                                                                      ])
                                                                    ]),
                                                                    new FunctionNode('log', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(3),
                                                                        new SymbolNode('x')
                                                                      ])
                                                                    ])
                                                                  ]),
                                                                  new OperatorNode('*', 'multiply', [
                                                                    new FunctionNode('log', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(2),
                                                                        new SymbolNode('x')
                                                                      ])
                                                                    ]),
                                                                    new OperatorNode('/', 'divide', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(3),
                                                                        new ConstantNode(1)
                                                                      ]),
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(3),
                                                                        new SymbolNode('x')
                                                                      ])
                                                                    ])
                                                                  ])
                                                                ]),
                                                                new OperatorNode('^', 'pow', [
                                                                  new FunctionNode('log', [
                                                                    new OperatorNode('*', 'multiply', [
                                                                      new ConstantNode(3),
                                                                      new SymbolNode('x')
                                                                    ])
                                                                  ]),
                                                                  new ConstantNode(2)
                                                                ])
                                                              ]));

    assert.deepEqual(math.eval('derivative(sin(2x), x)'), math.parse('2*1*cos(2x)'));
    assert.deepEqual(math.eval('derivative(cos(2x), x)'), math.parse('2*1*-sin(2x)'));
    assert.deepEqual(math.eval('derivative(tan(2x), x)'), math.parse('2*1*sec(2x)^2'));
    assert.deepEqual(math.eval('derivative(sec(2x), x)'), new OperatorNode('*', 'multiply', [
                                                            new OperatorNode('*', 'multiply', [
                                                              new ConstantNode(2),
                                                              new ConstantNode(1)
                                                            ]),
                                                            math.parse('sec(2x)*tan(2x)')
                                                          ]));
    assert.deepEqual(math.eval('derivative(csc(2x), x)'), new OperatorNode('*', 'multiply', [
                                                            new OperatorNode('-', 'unaryMinus', [
                                                              new OperatorNode('*', 'multiply', [
                                                                new ConstantNode(2),
                                                                new ConstantNode(1)
                                                              ]),
                                                            ]),
                                                            math.parse('csc(2x)cot(2x)')
                                                          ]));
    assert.deepEqual(math.eval('derivative(cot(2x), x)'), new OperatorNode('*', 'multiply', [
                                                            new OperatorNode('-', 'unaryMinus', [
                                                              new OperatorNode('*', 'multiply', [
                                                                new ConstantNode(2),
                                                                new ConstantNode(1)
                                                              ]),
                                                            ]),
                                                            math.parse('csc(2x)^2')
                                                          ]));
    assert.deepEqual(math.eval('derivative(asin(2x), x)'), new OperatorNode('/', 'divide', [
                                                             new OperatorNode('*', 'multiply', [
                                                               new ConstantNode(2),
                                                               new ConstantNode(1)
                                                             ]),
                                                             new FunctionNode('sqrt', [
                                                               new OperatorNode('-', 'subtract', [
                                                                 new ConstantNode(1),
                                                                 new OperatorNode('^', 'pow', [
                                                                   new OperatorNode('*', 'multiply', [
                                                                     new ConstantNode(2),
                                                                     new SymbolNode('x')
                                                                   ]),
                                                                   new ConstantNode(2)
                                                                 ])
                                                               ])
                                                             ])
                                                           ]));
    assert.deepEqual(math.eval('derivative(acos(2x), x)'), new OperatorNode('/', 'divide', [
                                                             new OperatorNode('-', 'unaryMinus', [
                                                               new OperatorNode('*', 'multiply', [
                                                                 new ConstantNode(2),
                                                                 new ConstantNode(1)
                                                               ])
                                                             ]),
                                                             new FunctionNode('sqrt', [
                                                               new OperatorNode('-', 'subtract', [
                                                                 new ConstantNode(1),
                                                                 new OperatorNode('^', 'pow', [
                                                                   new OperatorNode('*', 'multiply', [
                                                                     new ConstantNode(2),
                                                                     new SymbolNode('x')
                                                                   ]),
                                                                   new ConstantNode(2)
                                                                 ])
                                                               ])
                                                             ])
                                                           ]));
    assert.deepEqual(math.eval('derivative(atan(2x), x)'), new OperatorNode('/', 'divide', [
                                                             new OperatorNode('*', 'multiply', [
                                                               new ConstantNode(2),
                                                               new ConstantNode(1)
                                                             ]),
                                                             new OperatorNode('+', 'add', [
                                                               new OperatorNode('^', 'pow', [
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new ConstantNode(2),
                                                                   new SymbolNode('x')
                                                                 ]),
                                                                 new ConstantNode(2)
                                                               ]),
                                                               new ConstantNode(1)
                                                             ])
                                                           ]));
    assert.deepEqual(math.eval('derivative(asec(2x), x)'), new OperatorNode('/', 'divide', [
                                                             new OperatorNode('*', 'multiply', [
                                                               new ConstantNode(2),
                                                               new ConstantNode(1)
                                                             ]),
                                                             new OperatorNode('*', 'multiply', [ 
                                                               new FunctionNode('abs', [
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new ConstantNode(2),
                                                                   new SymbolNode('x')
                                                                 ])
                                                               ]),
                                                               new FunctionNode('sqrt', [
                                                                 new OperatorNode('-', 'subtract', [
                                                                   new OperatorNode('^', 'pow', [
                                                                     new OperatorNode('*', 'multiply', [
                                                                       new ConstantNode(2),
                                                                       new SymbolNode('x')
                                                                     ]),
                                                                     new ConstantNode(2)
                                                                   ]),
                                                                   new ConstantNode(1)
                                                                 ])
                                                               ])
                                                             ])
                                                           ]));
    assert.deepEqual(math.eval('derivative(acsc(2x), x)'), new OperatorNode('/', 'divide', [
                                                             new OperatorNode('-', 'unaryMinus', [ 
                                                               new OperatorNode('*', 'multiply', [
                                                                 new ConstantNode(2),
                                                                 new ConstantNode(1)
                                                               ])
                                                             ]),
                                                             new OperatorNode('*', 'multiply', [ 
                                                               new FunctionNode('abs', [
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new ConstantNode(2),
                                                                   new SymbolNode('x')
                                                                 ])
                                                               ]),
                                                               new FunctionNode('sqrt', [
                                                                 new OperatorNode('-', 'subtract', [
                                                                   new OperatorNode('^', 'pow', [
                                                                     new OperatorNode('*', 'multiply', [
                                                                       new ConstantNode(2),
                                                                       new SymbolNode('x')
                                                                     ]),
                                                                     new ConstantNode(2)
                                                                   ]),
                                                                   new ConstantNode(1)
                                                                 ])
                                                               ])
                                                             ])
                                                           ]));
    assert.deepEqual(math.eval('derivative(acot(2x), x)'), new OperatorNode('/', 'divide', [
                                                             new OperatorNode('-', 'unaryMinus', [
                                                               new OperatorNode('*', 'multiply', [
                                                                 new ConstantNode(2),
                                                                 new ConstantNode(1)
                                                               ])
                                                             ]),
                                                             new OperatorNode('+', 'add', [
                                                               new OperatorNode('^', 'pow', [
                                                                 new OperatorNode('*', 'multiply', [
                                                                   new ConstantNode(2),
                                                                   new SymbolNode('x')
                                                                 ]),
                                                                 new ConstantNode(2)
                                                               ]),
                                                               new ConstantNode(1)
                                                             ])
                                                           ]));
    assert.deepEqual(math.eval('derivative(sinh(2x), x)'), math.parse('2*1*cosh(2x)'));
    assert.deepEqual(math.eval('derivative(cosh(2x), x)'), math.parse('2*1*sinh(2x)'));
    assert.deepEqual(math.eval('derivative(tanh(2x), x)'), math.parse('2*1*sech(2x)^2'));
    assert.deepEqual(math.eval('derivative(sech(2x), x)'), new OperatorNode('*', 'multiply', [
                                                             new OperatorNode('-', 'unaryMinus', [
                                                               new OperatorNode('*', 'multiply', [
                                                                 new ConstantNode(2),
                                                                 new ConstantNode(1)
                                                               ]),
                                                             ]),
                                                             math.parse('sech(2x)tanh(2x)')
                                                           ]));
    assert.deepEqual(math.eval('derivative(csch(2x), x)'), new OperatorNode('*', 'multiply', [
                                                             new OperatorNode('-', 'unaryMinus', [
                                                               new OperatorNode('*', 'multiply', [
                                                                 new ConstantNode(2),
                                                                 new ConstantNode(1)
                                                               ]),
                                                             ]),
                                                             math.parse('csch(2x)coth(2x)')
                                                           ]));
    assert.deepEqual(math.eval('derivative(coth(2x), x)'), new OperatorNode('*', 'multiply', [
                                                             new OperatorNode('-', 'unaryMinus', [
                                                               new OperatorNode('*', 'multiply', [
                                                                 new ConstantNode(2),
                                                                 new ConstantNode(1)
                                                               ]),
                                                             ]),
                                                             math.parse('csch(2x)^2')
                                                           ]));
    assert.deepEqual(math.eval('derivative(asinh(2x), x)'), new OperatorNode('/', 'divide', [
                                                              new OperatorNode('*', 'multiply', [
                                                                new ConstantNode(2),
                                                                new ConstantNode(1)
                                                              ]),
                                                              new FunctionNode('sqrt', [
                                                                new OperatorNode('+', 'add', [
                                                                  new OperatorNode('^', 'pow', [
                                                                    new OperatorNode('*', 'multiply', [
                                                                      new ConstantNode(2),
                                                                      new SymbolNode('x')
                                                                    ]),
                                                                    new ConstantNode(2)
                                                                  ]),
                                                                  new ConstantNode(1)
                                                                ])
                                                              ])
                                                            ]));
    assert.deepEqual(math.eval('derivative(acosh(2x), x)'), new OperatorNode('/', 'divide', [
                                                              new OperatorNode('*', 'multiply', [
                                                                new ConstantNode(2),
                                                                new ConstantNode(1)
                                                              ]),
                                                              new FunctionNode('sqrt', [
                                                                new OperatorNode('-', 'subtract', [
                                                                  new OperatorNode('^', 'pow', [
                                                                    new OperatorNode('*', 'multiply', [
                                                                      new ConstantNode(2),
                                                                      new SymbolNode('x')
                                                                    ]),
                                                                    new ConstantNode(2)
                                                                  ]),
                                                                  new ConstantNode(1)
                                                                ])
                                                              ])
                                                            ]));
    assert.deepEqual(math.eval('derivative(atanh(2x), x)'), new OperatorNode('/', 'divide', [
                                                              new OperatorNode('*', 'multiply', [
                                                                new ConstantNode(2),
                                                                new ConstantNode(1)
                                                              ]),
                                                              new OperatorNode('-', 'subtract', [
                                                                new ConstantNode(1),
                                                                new OperatorNode('^', 'pow', [
                                                                  new OperatorNode('*', 'multiply', [
                                                                    new ConstantNode(2),
                                                                    new SymbolNode('x')
                                                                  ]),
                                                                  new ConstantNode(2)
                                                                ])
                                                              ])
                                                            ]));
    assert.deepEqual(math.eval('derivative(asech(2x), x)'), new OperatorNode('/', 'divide', [
                                                              new OperatorNode('-', 'unaryMinus', [
                                                                new OperatorNode('*', 'multiply', [
                                                                  new ConstantNode(2),
                                                                  new ConstantNode(1)
                                                                ])
                                                              ]),
                                                              new OperatorNode('*', 'multiply', [ 
                                                                new OperatorNode('*', 'multiply', [
                                                                  new ConstantNode(2),
                                                                  new SymbolNode('x')
                                                                ]),
                                                                new FunctionNode('sqrt', [
                                                                  new OperatorNode('-', 'subtract', [
                                                                    new ConstantNode(1),
                                                                    new OperatorNode('^', 'pow', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(2),
                                                                        new SymbolNode('x')
                                                                      ]),
                                                                      new ConstantNode(2)
                                                                    ])
                                                                  ])
                                                                ])
                                                              ])
                                                            ]));
    assert.deepEqual(math.eval('derivative(acsch(2x), x)'), new OperatorNode('/', 'divide', [
                                                              new OperatorNode('-', 'unaryMinus', [ 
                                                                new OperatorNode('*', 'multiply', [
                                                                  new ConstantNode(2),
                                                                  new ConstantNode(1)
                                                                ])
                                                              ]),
                                                              new OperatorNode('*', 'multiply', [ 
                                                                new FunctionNode('abs', [
                                                                  new OperatorNode('*', 'multiply', [
                                                                    new ConstantNode(2),
                                                                    new SymbolNode('x')
                                                                  ])
                                                                ]),
                                                                new FunctionNode('sqrt', [
                                                                  new OperatorNode('+', 'add', [
                                                                    new OperatorNode('^', 'pow', [
                                                                      new OperatorNode('*', 'multiply', [
                                                                        new ConstantNode(2),
                                                                        new SymbolNode('x')
                                                                      ]),
                                                                      new ConstantNode(2)
                                                                    ]),
                                                                    new ConstantNode(1)
                                                                  ])
                                                                ])
                                                              ])
                                                            ]));
    assert.deepEqual(math.eval('derivative(acoth(2x), x)'), new OperatorNode('/', 'divide', [
                                                              new OperatorNode('-', 'unaryMinus', [ 
                                                                new OperatorNode('*', 'multiply', [
                                                                  new ConstantNode(2),
                                                                  new ConstantNode(1)
                                                                ])
                                                              ]),
                                                              new OperatorNode('-', 'subtract', [
                                                                new ConstantNode(1),
                                                                new OperatorNode('^', 'pow', [
                                                                  new OperatorNode('*', 'multiply', [
                                                                    new ConstantNode(2),
                                                                    new SymbolNode('x')
                                                                  ]),
                                                                  new ConstantNode(2)
                                                                ])
                                                              ])
                                                            ]));
  });

  it('should throw error if expressions contain unsupported operators or functions', function() {
    assert.throws(function () { math.eval('derivative(x << 2, x)'); }, /Error: Operator "<<" not supported by derivative/);
    assert.throws(function () { math.eval('derivative(subset(x), x)'); }, /Error: Function "subset" not supported by derivative/);
  });

  it('should have controlled behavior on arguments errors', function() {
    assert.throws(function() {
      math.eval('derivative(sqrt(), x)');
    }, /TypeError: Too few arguments in function sqrt \(expected: number or Complex or BigNumber or Array or Matrix or Fraction or string or boolean or null, index: 0\)/);
    assert.throws(function() {
      math.eval('derivative(sqrt(12, 2x), x)');
    }, /TypeError: Too many arguments in function sqrt \(expected: 1, actual: 2\)/);
  });

  it('should throw error for incorrect argument types', function() {
    assert.throws(function () {
      math.eval('derivative(42, 42)');
    }, /TypeError: Unexpected type of argument in function derivative \(expected: SymbolNode, actual: ConstantNode, index: 1\)/);

    assert.throws(function () {
      math.eval('derivative([1, 2; 3, 4], x)');
    }, /TypeError: Unexpected type of argument in function constTag \(expected: OperatorNode or ConstantNode or SymbolNode or ParenthesisNode or FunctionNode or FunctionAssignmentNode, actual: ArrayNode, index: 1\)/);

    assert.throws(function () {
      math.eval('derivative(x + [1, 2; 3, 4], x)');
    }, /TypeError: Unexpected type of argument in function constTag \(expected: OperatorNode or ConstantNode or SymbolNode or ParenthesisNode or FunctionNode or FunctionAssignmentNode, actual: ArrayNode, index: 1\)/);
  });

  it('should throw error if incorrect number of arguments', function() {
    assert.throws(function () {
      math.eval('derivative(x + 2)');
    }, /TypeError: Too few arguments in function derivative \(expected: SymbolNode, index: 1\)/);

    assert.throws(function () {
      math.eval('derivative(x + 2, x, "stuff", true, 42)');
    }, /TypeError: Too many arguments in function derivative \(expected: 2, actual: 5\)/);
  });

});
