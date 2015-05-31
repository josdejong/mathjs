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

  it('should take the derivative of a OperatorNodes with Constants', function() {
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


    // d/dx(7x / 2) = 7 * 1 / 2 = 7 / 2
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
                                                                    new OperatorNode('-', 'minus', [
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
    assert.deepEqual(math.eval('derivative(log((6x)), x)'), math.parse('(6*1)/(6*x)'));
    assert.deepEqual(math.eval('derivative(log((6x), 10), x)'), new OperatorNode('/', 'divide', [
                                                                  math.parse('(6*1)'),
                                                                  math.parse('(6x)log(10)')
                                                                ]));
    assert.deepEqual(math.eval('derivative(sin(2x), x)'), math.parse('2*1*cos(2x)'));
    assert.deepEqual(math.eval('derivative(cos(2x), x)'), math.parse('2*1*-sin(2x)'));
    assert.deepEqual(math.eval('derivative(tan(2x), x)'), math.parse('2*1*sec(2x)^2'));
  });

  /*
  it('should have controlled behavior on arguments errors', function() {
    var funcList = ['log', 'sin', 'cos', 'tan'];

    for (var i = 0; i < funcList.length; ++i) {
      // Too few arguments
      var f = math.eval('f(x) = derivative(' + funcList[i] + '(), x)');
      var errStr = 'TypeError: Too few arguments in function ' + funcList[i] +
                   ' (expected: number or Complex or BigNumber or Unit or Array or Matrix or Fraction or boolean or null, index: 0)';
      assert.throws(function () { f(2); }, errStr);

      // Too many arguments
      f = math.eval('f(x) = derivative(' + funcList[i] + '(x, x, x, x, x), x)');
      assert.throws(function () { f(2, 2, 2, 2, 2); }, /SyntaxError: Wrong number of arguments in function f \(5 provided, 1 expected\)/);
    }
  });
  */

  it('should throw error if expressions contain unsupported operators or functions', function() {
    assert.throws(function () { math.eval('derivative(x << 2, x)'); }, /Error: Operator "<<" not supported by derivative/);
    assert.throws(function () { math.eval('derivative(subset(x), x)'); }, /Error: Function "subset" not supported by derivative/);
  });

  it('should throw error for incorrect argument types', function() {
    assert.throws(function () {
      math.eval('derivative(42, 42)');
    }, /TypeError: Unexpected type of argument in function derivative \(expected: SymbolNode, actual: ConstantNode, index: 1\)/);

    assert.throws(function () {
      math.eval('derivative([1, 2; 3, 4], x)');
    }, /TypeError: Unexpected type of argument in function constTag \(expected: OperatorNode or ConstantNode or SymbolNode or ParenthesisNode or FunctionNode, actual: ArrayNode, index: 1\)/);

    assert.throws(function () {
      math.eval('derivative(x + [1, 2; 3, 4], x)');
    }, /TypeError: Unexpected type of argument in function constTag \(expected: OperatorNode or ConstantNode or SymbolNode or ParenthesisNode or FunctionNode, actual: ArrayNode, index: 1\)/);
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
