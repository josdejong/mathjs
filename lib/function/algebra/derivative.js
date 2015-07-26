'use strict';

function factory (type, config, load, typed, math) {
  var ConstantNode    = load(require('../../expression/node/ConstantNode'));
  var FunctionNode    = load(require('../../expression/node/FunctionNode'));
  var OperatorNode    = load(require('../../expression/node/OperatorNode'));
  var ParenthesisNode = load(require('../../expression/node/ParenthesisNode'));
  var SymbolNode      = load(require('../../expression/node/SymbolNode'));


  /**
   * Takes the derivative of an expression expressed in parser Nodes.
   * This uses rules of differentiation which can be found here:
   *   http://en.wikipedia.org/wiki/Differentiation_rules
   *
   * Syntax:
   *
   *     derivative(expr, variable)
   *
   * Usage:
   *
   *     math.eval('derivative(2*x, x)')
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} expr
   * @param  {SymbolNode} variable   The variable to differentiate over
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}    The derivative of `expr`
   */
  var derivative = typed('derivative', {
    'Node, SymbolNode': function (expr, variable) {
      var constNodes = {};
      constTag(constNodes, expr, variable.name);
      return _derivative(expr, constNodes);
    }
  });

  /**
   * Does a depth-first search on the expression tree to identify what Nodes
   * are constants (e.g. 2 + 2), and stores the ones that are constants in
   * constNodes. Classification is done as follows:
   *
   *   1. ConstantNodes are constants.
   *   2. If there exists a SymbolNode, of which we are differentiating over,
   *      in the subtree it is not constant.
   *
   * @param  {Object} constNodes  Holds the nodes that are constant
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param  {string} varName     Variable that we are differentiating
   * @return {boolean}  if node is constant
   */
  var constTag = typed('constTag', {
    'Object, ConstantNode, string': function (constNodes, node) {
      return constNodes[node] = true;
    },

    'Object, SymbolNode, string': function (constNodes, node, varName) {
      if (node.name != varName) {
        return constNodes[node] = true;
      }
      return false;
    },

    'Object, ParenthesisNode, string': function (constNodes, node, varName) {
      return constTag(constNodes, node.content, varName);
    },

    'Object, FunctionAssignmentNode, string': function (constNodes, node, varName) {
      if (node.params.indexOf(varName) == -1) {
        return constNodes[node] = true;
      }
      return constTag(constNodes, node.expr, varName);
    },

    'Object, FunctionNode | OperatorNode, string': function (constNodes, node, varName) {
      if (node.args.length != 0) {
        var isConst = constTag(constNodes, node.args[0], varName);
        for (var i = 1; i < node.args.length; ++i) {
          isConst = constTag(constNodes, node.args[i], varName) && isConst;
        }

        if (isConst) {
          return constNodes[node] = true;
        }
      }
      return false;
    }
  });

  /**
   * Applies differentiation rules.
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param  {Object} constNodes  Holds the nodes that are constant
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}    The derivative of `expr`
   */
  var _derivative = typed('_derivative', {
    'ConstantNode, Object': function (node) {
       return new ConstantNode('0', node.valueType);
    },

    'SymbolNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return new ConstantNode('0', config.number);
      }
      return new ConstantNode('1', config.number);
    },

    'ParenthesisNode, Object': function (node, constNodes) {
      return new ParenthesisNode(_derivative(node.content, constNodes));
    },

    'FunctionAssignmentNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return new ConstantNode('0', config.number);
      }
      return _derivative(node.expr, constNodes);
    },

    'FunctionNode, Object': function (node, constNodes) {
      if (node.args.length != 1) {
        funcArgsCheck(node);
      }

      if (constNodes[node] !== undefined) {
        return new ConstantNode('0', config.number);
      }

      var arg1 = node.args[0];
      var arg2;

      var div = false;
      var negative = false;

      var funcDerivative;
      switch (node.name) {
        case 'sqrt':
        case 'nthRoot':
          // d/dx(sqrt(x)) = 1 / (2*sqrt(x))
          if (node.args.length == 1) {
            div = true;
            funcDerivative = new OperatorNode('*', 'multiply', [
              new ConstantNode('2', config.number),
              new FunctionNode('sqrt', [arg1])
            ]);
            break;
          }

          // Rearrange from nthRoot(x, a) -> x^(1/a)
          arg2 = new OperatorNode('/', 'divide', [
            new ConstantNode('1', config.number),
            node.args[1]
          ]);

          // Is a variable?
          constNodes[arg2] = constNodes[node.args[1]];

          return _derivative(new OperatorNode('^', 'pow', [arg1, arg2]), constNodes);
        case 'log10':
          arg2 = new ConstantNode('10', config.number);
        case 'log':
          if (!arg2 && node.args.length == 1) {
            // d/dx(log(x)) = 1 / x
            funcDerivative = arg1.clone();
          } else if (arg2 || constNodes[node.args[1]] !== undefined) {
            // d/dx(log(x, c)) = 1 / (x*ln(c))
            funcDerivative = new OperatorNode('*', 'multiply', [
              arg1.clone(),
              new FunctionNode('log', [arg2 || node.args[1]])
            ]);
          } else {
            // d/dx(log(f(x), g(x))) = d/dx(log(f(x)) / log(g(x)))
            return _derivative(new OperatorNode('/', 'divide', [
                new FunctionNode('log', [arg1]),
                new FunctionNode('log', [node.args[1]])
              ]), constNodes);
          }

          div = true;
          break;
        case 'exp':
          // d/dx(e^x) = e^x
          funcDerivative = arg1.clone();
          break;
        case 'sin':
          // d/dx(sin(x)) = cos(x)
          funcDerivative = new FunctionNode('cos', [arg1.clone()]);
          break;
        case 'cos':
          // d/dx(cos(x)) = -sin(x)
          funcDerivative = new OperatorNode('-', 'unaryMinus', [
            new FunctionNode('sin', [arg1.clone()])
          ]);
          break;
        case 'tan':
          // d/dx(tan(x)) = sec(x)^2
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('sec', [arg1.clone()]),
            new ConstantNode('2', config.number)
          ]);
          break;
        case 'sec':
          // d/dx(sec(x)) = sec(x)tan(x)
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('tan', [arg1.clone()])
          ]);
          break;
        case 'csc':
          // d/dx(csc(x)) = -csc(x)cot(x)
          negative = true;
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('cot', [arg1.clone()])
          ]);
          break;
        case 'cot':
          // d/dx(cot(x)) = -csc(x)^2
          negative = true;
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('csc', [arg1.clone()]),
            new ConstantNode('2', config.number)
          ]);
          break;
        case 'asin':
          // d/dx(asin(x)) = 1 / sqrt(1 - x^2)
          div = true;
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              new ConstantNode('1', config.number),
              new OperatorNode('^', 'pow', [
                arg1.clone(),
                new ConstantNode('2', config.number)
              ])
            ])
          ]);
          break;
        case 'acos':
          // d/dx(acos(x)) = -1 / sqrt(1 - x^2)
          div = true;
          negative = true;
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              new ConstantNode('1', config.number),
              new OperatorNode('^', 'pow', [
                arg1.clone(),
                new ConstantNode('2', config.number)
              ])
            ])
          ]);
          break;
        case 'atan':
          // d/dx(atan(x)) = 1 / (x^2 + 1)
          div = true;
          funcDerivative = new OperatorNode('+', 'add', [
            new OperatorNode('^', 'pow', [
              arg1.clone(),
              new ConstantNode('2', config.number)
            ]),
            new ConstantNode('1', config.number)
          ]);
          break;
        case 'asec':
          // d/dx(asec(x)) = 1 / (|x|*sqrt(x^2 - 1))
          div = true;
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg1.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                new OperatorNode('^', 'pow', [
                  arg1.clone(),
                  new ConstantNode('2', config.number)
                ]),
                new ConstantNode('1', config.number)
              ])
            ])
          ]);
          break;
        case 'acsc':
          // d/dx(acsc(x)) = -1 / (|x|*sqrt(x^2 - 1))
          div = true;
          negative = true;
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg1.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                new OperatorNode('^', 'pow', [
                  arg1.clone(),
                  new ConstantNode('2', config.number)
                ]),
                new ConstantNode('1', config.number)
              ])
            ])
          ]);
          break;
        case 'acot':
          // d/dx(acot(x)) = -1 / (x^2 + 1)
          div = true;
          negative = true;
          funcDerivative = new OperatorNode('+', 'add', [
            new OperatorNode('^', 'pow', [
              arg1.clone(),
              new ConstantNode('2', config.number)
            ]),
            new ConstantNode('1', config.number)
          ]);
          break;
        case 'sinh':
          // d/dx(sinh(x)) = cosh(x)
          funcDerivative = new FunctionNode('cosh', [arg1.clone()]);
          break;
        case 'cosh':
          // d/dx(cosh(x)) = sinh(x)
          funcDerivative = new FunctionNode('sinh', [arg1.clone()]);
          break;
        case 'tanh':
          // d/dx(tanh(x)) = sech(x)^2
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('sech', [arg1.clone()]),
            new ConstantNode('2', config.number)
          ]);
          break;
        case 'sech':
          // d/dx(sech(x)) = -sech(x)tanh(x)
          negative = true;
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('tanh', [arg1.clone()])
          ]);
          break;
        case 'csch':
          // d/dx(csch(x)) = -csch(x)coth(x)
          negative = true;
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('coth', [arg1.clone()])
          ]);
          break;
        case 'coth':
          // d/dx(coth(x)) = -csch(x)^2
          negative = true;
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('csch', [arg1.clone()]),
            new ConstantNode('2', config.number)
          ]);
          break;
        case 'asinh':
          // d/dx(asinh(x)) = 1 / sqrt(x^2 + 1)
          div = true;
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('+', 'add', [
              new OperatorNode('^', 'pow', [
                arg1.clone(),
                new ConstantNode('2', config.number)
              ]),
              new ConstantNode('1', config.number)
            ])
          ]);
          break;
        case 'acosh':
          // d/dx(acosh(x)) = 1 / sqrt(x^2 - 1); XXX potentially only for x >= 1 (the real spectrum)
          div = true;
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              new OperatorNode('^', 'pow', [
                arg1.clone(),
                new ConstantNode('2', config.number)
              ]),
              new ConstantNode('1', config.number),
            ])
          ]);
          break;
        case 'atanh':
          // d/dx(atanh(x)) = 1 / (1 - x^2)
          div = true;
          funcDerivative = new OperatorNode('-', 'subtract', [
            new ConstantNode('1', config.number),
            new OperatorNode('^', 'pow', [
              arg1.clone(),
              new ConstantNode('2', config.number)
            ])
          ]);
          break;
        case 'asech':
          // d/dx(asech(x)) = -1 / (x*sqrt(1 - x^2))
          div = true;
          negative = true;
          funcDerivative = new OperatorNode('*', 'multiply', [
            arg1.clone(),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                new ConstantNode('1', config.number),
                new OperatorNode('^', 'pow', [
                  arg1.clone(),
                  new ConstantNode('2', config.number)
                ])
              ])
            ])
          ]);
          break;
        case 'acsch':
          // d/dx(acsch(x)) = -1 / (|x|*sqrt(x^2 + 1))
          div = true;
          negative = true;
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg1.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('+', 'add', [
                new OperatorNode('^', 'pow', [
                  arg1.clone(),
                  new ConstantNode('2', config.number)
                ]),
                new ConstantNode('1', config.number)
              ])
            ])
          ]);
          break;
        case 'acoth':
          // d/dx(acoth(x)) = -1 / (1 - x^2)
          div = true;
          negative = true;
          funcDerivative = new OperatorNode('-', 'subtract', [
            new ConstantNode('1', config.number),
            new OperatorNode('^', 'pow', [
              arg1.clone(),
              new ConstantNode('2', config.number)
            ])
          ]);
          break;
        case 'gamma':  // Needs digamma function, d/dx(gamma(x)) = gamma(x)digamma(x)
        default: throw new Error('Function "' + node.name + '" not supported by derivative');
      }

      var op, func;
      if (div) {
        op = '/';
        func = 'divide';
      } else {
        op = '*';
        func = 'multiply';
      }

      /* Apply chain rule to all functions:
         F(x)  = f(g(x))
         F'(x) = g'(x)*f'(g(x)) */
      var chainDerivative = _derivative(arg1, constNodes);
      if (negative) {
        chainDerivative = new OperatorNode('-', 'unaryMinus', [chainDerivative]);
      }
      return new OperatorNode(op, func, [chainDerivative, funcDerivative]);
    },

    'OperatorNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return new ConstantNode('0', config.number);
      }

      var arg1 = node.args[0];
      var arg2 = node.args[1];

      switch (node.op) {
        case '+':
        case '-':
          // d/dx(+/-f(x)) = +/-f'(x)
          if (node.args.length == 1) {
            return new OperatorNode(node.op, node.fn, [_derivative(arg1, constNodes)]);
          }

          // Linearity of differentiation, d/dx(f(x) +/- g(x)) = f'(x) +/- g'(x)
          return new OperatorNode(node.op, node.fn, [
            _derivative(arg1, constNodes),
            _derivative(arg2, constNodes)
          ]);
        case '*':
          // d/dx(c*f(x)) = c*f'(x)
          if (constNodes[arg1] !== undefined || constNodes[arg2] !== undefined) {
            var newArgs = (constNodes[arg1] !== undefined)
              ? [arg1.clone(), _derivative(arg2, constNodes)]
              : [arg2.clone(), _derivative(arg1, constNodes)];

            return new OperatorNode('*', 'multiply', newArgs);
          }

          // Product Rule, d/dx(f(x)*g(x)) = f'(x)*g(x) + f(x)*g'(x)
          return new OperatorNode('+', 'add', [
            new OperatorNode('*', 'multiply', [_derivative(arg1, constNodes), arg2.clone()]),
            new OperatorNode('*', 'multiply', [arg1.clone(), _derivative(arg2, constNodes)])
          ]);
        case '/':
          // d/dx(f(x) / c) = f'(x) / c
          if (constNodes[arg2] !== undefined) {
            return new OperatorNode('/', 'divide', [_derivative(arg1, constNodes), arg2]);
          }

          // Reciprocal Rule, d/dx(c / f(x)) = -c(f'(x)/f(x)^2)
          if (constNodes[arg1] !== undefined) {
            return new OperatorNode('*', 'multiply', [
              new OperatorNode('-', 'unaryMinus', [arg1]),
              new OperatorNode('/', 'divide', [
                _derivative(arg2, constNodes),
                new OperatorNode('^', 'pow', [arg2.clone(), new ConstantNode('2', config.number)])
              ])
            ]);
          }

          // Quotient rule, d/dx(f(x) / g(x)) = (f'(x)g(x) - f(x)g'(x)) / g(x)^2
          return new OperatorNode('/', 'divide', [
            new OperatorNode('-', 'subtract', [
              new OperatorNode('*', 'multiply', [_derivative(arg1, constNodes), arg2.clone()]),
              new OperatorNode('*', 'multiply', [arg1.clone(), _derivative(arg2, constNodes)])
            ]),
            new OperatorNode('^', 'pow', [arg2.clone(), new ConstantNode('2', config.number)])
          ]);
        case '^':
          if (constNodes[arg1] !== undefined) {
            // If is secretly constant; 0^f(x) = 1 (in JS), 1^f(x) = 1
            if (arg1.isConstantNode && (arg1.value == '0' || arg1.value == '1')) {
              return new ConstantNode('0', config.number);
            }

            // d/dx(c^f(x)) = c^f(x)*ln(c)*f'(x)
            return new OperatorNode('*', 'multiply', [
              node,
              new OperatorNode('*', 'multiply', [
                new FunctionNode('log', [arg1.clone()]),
                _derivative(arg2.clone(), constNodes)
              ])
            ]);
          }

          if (constNodes[arg2] !== undefined) {
            if (arg2.isConstantNode) {
              var expValue = arg2.value;

              // If is secretly constant; f(x)^0 = 1 -> d/dx(1) = 0
              if (expValue == '0') {
                return new ConstantNode('0', config.number);
              }
              // Ignore exponent; f(x)^1 = f(x)
              if (expValue == '1') {
                return _derivative(arg1, constNodes);
              }
            }

            // Elementary Power Rule, d/dx(f(x)^c) = c*f'(x)*f(x)^(c-1)
            var powMinusOne = new OperatorNode('^', 'pow', [
              arg1.clone(),
              new OperatorNode('-', 'subtract', [
                arg2,
                new ConstantNode('1', config.number)
              ])
            ]);

            return new OperatorNode('*', 'multiply', [
              arg2.clone(),
              new OperatorNode('*', 'multiply', [
                _derivative(arg1, constNodes),
                powMinusOne
              ]),
            ]);
          }

          // Functional Power Rule, d/dx(f^g) = f^g*[f'*(g/f) + g'ln(f)]
          return new OperatorNode('*', 'multiply', [
            new OperatorNode('^', 'pow', [arg1.clone(), arg2.clone()]),
            new OperatorNode('+', 'add', [
              new OperatorNode('*', 'multiply', [
                _derivative(arg1, constNodes),
                new OperatorNode('/', 'divide', [arg2.clone(), arg1.clone()])
              ]),
              new OperatorNode('*', 'multiply', [
                _derivative(arg2, constNodes),
                new FunctionNode('log', [arg1.clone()])
              ])
            ])
          ]);
        case '%':
        case 'mod':
        default: throw new Error('Operator "' + node.op + '" not supported by derivative');
      }
    }
  });

  /**
   * Ensures the number of arguments for a function are correct,
   * and will throw an error otherwise.
   *
   * @param {FunctionNode} node
   */
  function funcArgsCheck(node) {
    if ((node.name == 'log' || node.name == 'nthRoot') && node.args.length == 2) {
      return;
    }

    // Avoids unidentified symbol error
    for (var i = 0; i < node.args.length; ++i) {
      node.args[i] = new ConstantNode(0);
    }

    node.compile().eval();
    throw new Error('Expected TypeError, but none found');
  }

  /**
   * A transformation for the derivative function. This transformation will be
   * invoked when the function is used via the expression parser of math.js.
   *
   * @param {Array.<Node>} args
   *            Expects the following arguments: [f, x]
   * @param {Object} math
   * @param {Object} [scope]
   */
  derivative.transform = typed('derivative_transform', {
    'Array, Object, Object': function (args) {
      return derivative.apply(null, args);
    }
  });

  derivative.transform.rawArgs = true;

  return derivative;
}

exports.name = 'derivative';
exports.factory = factory;
