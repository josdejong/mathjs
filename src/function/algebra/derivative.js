'use strict'

function factory (type, config, load, typed) {
  const parse = load(require('../../expression/parse'))
  const simplify = load(require('./simplify'))
  const equal = load(require('../relational/equal'))
  const isZero = load(require('../utils/isZero'))
  const getType = load(require('../utils/typeof'))
  const numeric = load(require('../../type/numeric'))
  const ConstantNode = load(require('../../expression/node/ConstantNode'))
  const FunctionNode = load(require('../../expression/node/FunctionNode'))
  const OperatorNode = load(require('../../expression/node/OperatorNode'))
  const ParenthesisNode = load(require('../../expression/node/ParenthesisNode'))
  const SymbolNode = load(require('../../expression/node/SymbolNode'))

  /**
   * Takes the derivative of an expression expressed in parser Nodes.
   * The derivative will be taken over the supplied variable in the
   * second parameter. If there are multiple variables in the expression,
   * it will return a partial derivative.
   *
   * This uses rules of differentiation which can be found here:
   *
   * - [Differentiation rules (Wikipedia)](https://en.wikipedia.org/wiki/Differentiation_rules)
   *
   * Syntax:
   *
   *     derivative(expr, variable)
   *     derivative(expr, variable, options)
   *
   * Examples:
   *
   *     math.derivative('x^2', 'x')                     // Node {2 * x}
   *     math.derivative('x^2', 'x', {simplify: false})  // Node {2 * 1 * x ^ (2 - 1)
   *     math.derivative('sin(2x)', 'x'))                // Node {2 * cos(2 * x)}
   *     math.derivative('2*x', 'x').eval()              // number 2
   *     math.derivative('x^2', 'x').eval({x: 4})        // number 8
   *     const f = math.parse('x^2')
   *     const x = math.parse('x')
   *     math.derivative(f, x)                           // Node {2 * x}
   *
   * See also:
   *
   *     simplify, parse, eval
   *
   * @param  {Node | string} expr           The expression to differentiate
   * @param  {SymbolNode | string} variable The variable over which to differentiate
   * @param  {{simplify: boolean}} [options]
   *                         There is one option available, `simplify`, which
   *                         is true by default. When false, output will not
   *                         be simplified.
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}    The derivative of `expr`
   */
  const derivative = typed('derivative', {
    'Node, SymbolNode, Object': function (expr, variable, options) {
      const constNodes = {}
      constTag(constNodes, expr, variable.name)
      const res = _derivative(expr, constNodes)
      return options.simplify ? simplify(res) : res
    },
    'Node, SymbolNode': function (expr, variable) {
      return derivative(expr, variable, { simplify: true })
    },

    'string, SymbolNode': function (expr, variable) {
      return derivative(parse(expr), variable)
    },
    'string, SymbolNode, Object': function (expr, variable, options) {
      return derivative(parse(expr), variable, options)
    },

    'string, string': function (expr, variable) {
      return derivative(parse(expr), parse(variable))
    },
    'string, string, Object': function (expr, variable, options) {
      return derivative(parse(expr), parse(variable), options)
    },

    'Node, string': function (expr, variable) {
      return derivative(expr, parse(variable))
    },
    'Node, string, Object': function (expr, variable, options) {
      return derivative(expr, parse(variable), options)
    }

    // TODO: replace the 8 signatures above with 4 as soon as typed-function supports optional arguments

    /* TODO: implement and test syntax with order of derivatives -> implement as an option {order: number}
    'Node, SymbolNode, ConstantNode': function (expr, variable, {order}) {
      let res = expr
      for (let i = 0; i < order; i++) {
        let constNodes = {}
        constTag(constNodes, expr, variable.name)
        res = _derivative(res, constNodes)
      }
      return res
    }
    */
  })

  derivative._simplify = true

  derivative.toTex = function (deriv) {
    return _derivTex.apply(null, deriv.args)
  }

  // NOTE: the optional "order" parameter here is currently unused
  const _derivTex = typed('_derivTex', {
    'Node, SymbolNode': function (expr, x) {
      if (type.isConstantNode(expr) && getType(expr.value) === 'string') {
        return _derivTex(parse(expr.value).toString(), x.toString(), 1)
      } else {
        return _derivTex(expr.toString(), x.toString(), 1)
      }
    },
    'Node, ConstantNode': function (expr, x) {
      if (getType(x.value) === 'string') {
        return _derivTex(expr, parse(x.value))
      } else {
        throw new Error("The second parameter to 'derivative' is a non-string constant")
      }
    },
    'Node, SymbolNode, ConstantNode': function (expr, x, order) {
      return _derivTex(expr.toString(), x.name, order.value)
    },
    'string, string, number': function (expr, x, order) {
      let d
      if (order === 1) {
        d = '{d\\over d' + x + '}'
      } else {
        d = '{d^{' + order + '}\\over d' + x + '^{' + order + '}}'
      }
      return d + `\\left[${expr}\\right]`
    }
  })

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
  // TODO: can we rewrite constTag into a pure function?
  const constTag = typed('constTag', {
    'Object, ConstantNode, string': function (constNodes, node) {
      constNodes[node] = true
      return true
    },

    'Object, SymbolNode, string': function (constNodes, node, varName) {
      // Treat other variables like constants. For reasoning, see:
      //   https://en.wikipedia.org/wiki/Partial_derivative
      if (node.name !== varName) {
        constNodes[node] = true
        return true
      }
      return false
    },

    'Object, ParenthesisNode, string': function (constNodes, node, varName) {
      return constTag(constNodes, node.content, varName)
    },

    'Object, FunctionAssignmentNode, string': function (constNodes, node, varName) {
      if (node.params.indexOf(varName) === -1) {
        constNodes[node] = true
        return true
      }
      return constTag(constNodes, node.expr, varName)
    },

    'Object, FunctionNode | OperatorNode, string': function (constNodes, node, varName) {
      if (node.args.length > 0) {
        let isConst = constTag(constNodes, node.args[0], varName)
        for (let i = 1; i < node.args.length; ++i) {
          isConst = constTag(constNodes, node.args[i], varName) && isConst
        }

        if (isConst) {
          constNodes[node] = true
          return true
        }
      }
      return false
    }
  })

  /**
   * Applies differentiation rules.
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @param  {Object} constNodes  Holds the nodes that are constant
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode}    The derivative of `expr`
   */
  const _derivative = typed('_derivative', {
    'ConstantNode, Object': function (node) {
      return createConstantNode(0)
    },

    'SymbolNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return createConstantNode(0)
      }
      return createConstantNode(1)
    },

    'ParenthesisNode, Object': function (node, constNodes) {
      return new ParenthesisNode(_derivative(node.content, constNodes))
    },

    'FunctionAssignmentNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return createConstantNode(0)
      }
      return _derivative(node.expr, constNodes)
    },

    'FunctionNode, Object': function (node, constNodes) {
      if (node.args.length !== 1) {
        funcArgsCheck(node)
      }

      if (constNodes[node] !== undefined) {
        return createConstantNode(0)
      }

      const arg0 = node.args[0]
      let arg1

      let div = false // is output a fraction?
      let negative = false // is output negative?

      let funcDerivative
      switch (node.name) {
        case 'cbrt':
          // d/dx(cbrt(x)) = 1 / (3x^(2/3))
          div = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            createConstantNode(3),
            new OperatorNode('^', 'pow', [
              arg0,
              new OperatorNode('/', 'divide', [
                createConstantNode(2),
                createConstantNode(3)
              ])
            ])
          ])
          break
        case 'sqrt':
        case 'nthRoot':
          // d/dx(sqrt(x)) = 1 / (2*sqrt(x))
          if (node.args.length === 1) {
            div = true
            funcDerivative = new OperatorNode('*', 'multiply', [
              createConstantNode(2),
              new FunctionNode('sqrt', [arg0])
            ])
          } else if (node.args.length === 2) {
            // Rearrange from nthRoot(x, a) -> x^(1/a)
            arg1 = new OperatorNode('/', 'divide', [
              createConstantNode(1),
              node.args[1]
            ])

            // Is a variable?
            constNodes[arg1] = constNodes[node.args[1]]

            return _derivative(new OperatorNode('^', 'pow', [arg0, arg1]), constNodes)
          }
          break
        case 'log10':
          arg1 = createConstantNode(10)
          /* fall through! */
        case 'log':
          if (!arg1 && node.args.length === 1) {
            // d/dx(log(x)) = 1 / x
            funcDerivative = arg0.clone()
            div = true
          } else if ((node.args.length === 1 && arg1) ||
              (node.args.length === 2 && constNodes[node.args[1]] !== undefined)) {
            // d/dx(log(x, c)) = 1 / (x*ln(c))
            funcDerivative = new OperatorNode('*', 'multiply', [
              arg0.clone(),
              new FunctionNode('log', [arg1 || node.args[1]])
            ])
            div = true
          } else if (node.args.length === 2) {
            // d/dx(log(f(x), g(x))) = d/dx(log(f(x)) / log(g(x)))
            return _derivative(new OperatorNode('/', 'divide', [
              new FunctionNode('log', [arg0]),
              new FunctionNode('log', [node.args[1]])
            ]), constNodes)
          }
          break
        case 'pow':
          constNodes[arg1] = constNodes[node.args[1]]
          // Pass to pow operator node parser
          return _derivative(new OperatorNode('^', 'pow', [arg0, node.args[1]]), constNodes)
        case 'exp':
          // d/dx(e^x) = e^x
          funcDerivative = new FunctionNode('exp', [arg0.clone()])
          break
        case 'sin':
          // d/dx(sin(x)) = cos(x)
          funcDerivative = new FunctionNode('cos', [arg0.clone()])
          break
        case 'cos':
          // d/dx(cos(x)) = -sin(x)
          funcDerivative = new OperatorNode('-', 'unaryMinus', [
            new FunctionNode('sin', [arg0.clone()])
          ])
          break
        case 'tan':
          // d/dx(tan(x)) = sec(x)^2
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('sec', [arg0.clone()]),
            createConstantNode(2)
          ])
          break
        case 'sec':
          // d/dx(sec(x)) = sec(x)tan(x)
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('tan', [arg0.clone()])
          ])
          break
        case 'csc':
          // d/dx(csc(x)) = -csc(x)cot(x)
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('cot', [arg0.clone()])
          ])
          break
        case 'cot':
          // d/dx(cot(x)) = -csc(x)^2
          negative = true
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('csc', [arg0.clone()]),
            createConstantNode(2)
          ])
          break
        case 'asin':
          // d/dx(asin(x)) = 1 / sqrt(1 - x^2)
          div = true
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              createConstantNode(1),
              new OperatorNode('^', 'pow', [
                arg0.clone(),
                createConstantNode(2)
              ])
            ])
          ])
          break
        case 'acos':
          // d/dx(acos(x)) = -1 / sqrt(1 - x^2)
          div = true
          negative = true
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              createConstantNode(1),
              new OperatorNode('^', 'pow', [
                arg0.clone(),
                createConstantNode(2)
              ])
            ])
          ])
          break
        case 'atan':
          // d/dx(atan(x)) = 1 / (x^2 + 1)
          div = true
          funcDerivative = new OperatorNode('+', 'add', [
            new OperatorNode('^', 'pow', [
              arg0.clone(),
              createConstantNode(2)
            ]),
            createConstantNode(1)
          ])
          break
        case 'asec':
          // d/dx(asec(x)) = 1 / (|x|*sqrt(x^2 - 1))
          div = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg0.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                new OperatorNode('^', 'pow', [
                  arg0.clone(),
                  createConstantNode(2)
                ]),
                createConstantNode(1)
              ])
            ])
          ])
          break
        case 'acsc':
          // d/dx(acsc(x)) = -1 / (|x|*sqrt(x^2 - 1))
          div = true
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg0.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                new OperatorNode('^', 'pow', [
                  arg0.clone(),
                  createConstantNode(2)
                ]),
                createConstantNode(1)
              ])
            ])
          ])
          break
        case 'acot':
          // d/dx(acot(x)) = -1 / (x^2 + 1)
          div = true
          negative = true
          funcDerivative = new OperatorNode('+', 'add', [
            new OperatorNode('^', 'pow', [
              arg0.clone(),
              createConstantNode(2)
            ]),
            createConstantNode(1)
          ])
          break
        case 'sinh':
          // d/dx(sinh(x)) = cosh(x)
          funcDerivative = new FunctionNode('cosh', [arg0.clone()])
          break
        case 'cosh':
          // d/dx(cosh(x)) = sinh(x)
          funcDerivative = new FunctionNode('sinh', [arg0.clone()])
          break
        case 'tanh':
          // d/dx(tanh(x)) = sech(x)^2
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('sech', [arg0.clone()]),
            createConstantNode(2)
          ])
          break
        case 'sech':
          // d/dx(sech(x)) = -sech(x)tanh(x)
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('tanh', [arg0.clone()])
          ])
          break
        case 'csch':
          // d/dx(csch(x)) = -csch(x)coth(x)
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            node,
            new FunctionNode('coth', [arg0.clone()])
          ])
          break
        case 'coth':
          // d/dx(coth(x)) = -csch(x)^2
          negative = true
          funcDerivative = new OperatorNode('^', 'pow', [
            new FunctionNode('csch', [arg0.clone()]),
            createConstantNode(2)
          ])
          break
        case 'asinh':
          // d/dx(asinh(x)) = 1 / sqrt(x^2 + 1)
          div = true
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('+', 'add', [
              new OperatorNode('^', 'pow', [
                arg0.clone(),
                createConstantNode(2)
              ]),
              createConstantNode(1)
            ])
          ])
          break
        case 'acosh':
          // d/dx(acosh(x)) = 1 / sqrt(x^2 - 1); XXX potentially only for x >= 1 (the real spectrum)
          div = true
          funcDerivative = new FunctionNode('sqrt', [
            new OperatorNode('-', 'subtract', [
              new OperatorNode('^', 'pow', [
                arg0.clone(),
                createConstantNode(2)
              ]),
              createConstantNode(1)
            ])
          ])
          break
        case 'atanh':
          // d/dx(atanh(x)) = 1 / (1 - x^2)
          div = true
          funcDerivative = new OperatorNode('-', 'subtract', [
            createConstantNode(1),
            new OperatorNode('^', 'pow', [
              arg0.clone(),
              createConstantNode(2)
            ])
          ])
          break
        case 'asech':
          // d/dx(asech(x)) = -1 / (x*sqrt(1 - x^2))
          div = true
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            arg0.clone(),
            new FunctionNode('sqrt', [
              new OperatorNode('-', 'subtract', [
                createConstantNode(1),
                new OperatorNode('^', 'pow', [
                  arg0.clone(),
                  createConstantNode(2)
                ])
              ])
            ])
          ])
          break
        case 'acsch':
          // d/dx(acsch(x)) = -1 / (|x|*sqrt(x^2 + 1))
          div = true
          negative = true
          funcDerivative = new OperatorNode('*', 'multiply', [
            new FunctionNode('abs', [arg0.clone()]),
            new FunctionNode('sqrt', [
              new OperatorNode('+', 'add', [
                new OperatorNode('^', 'pow', [
                  arg0.clone(),
                  createConstantNode(2)
                ]),
                createConstantNode(1)
              ])
            ])
          ])
          break
        case 'acoth':
          // d/dx(acoth(x)) = -1 / (1 - x^2)
          div = true
          negative = true
          funcDerivative = new OperatorNode('-', 'subtract', [
            createConstantNode(1),
            new OperatorNode('^', 'pow', [
              arg0.clone(),
              createConstantNode(2)
            ])
          ])
          break
        case 'abs':
          // d/dx(abs(x)) = abs(x)/x
          funcDerivative = new OperatorNode('/', 'divide', [
            new FunctionNode(new SymbolNode('abs'), [arg0.clone()]),
            arg0.clone()
          ])
          break
        case 'gamma': // Needs digamma function, d/dx(gamma(x)) = gamma(x)digamma(x)
        default: throw new Error('Function "' + node.name + '" is not supported by derivative, or a wrong number of arguments is passed')
      }

      let op, func
      if (div) {
        op = '/'
        func = 'divide'
      } else {
        op = '*'
        func = 'multiply'
      }

      /* Apply chain rule to all functions:
         F(x)  = f(g(x))
         F'(x) = g'(x)*f'(g(x)) */
      let chainDerivative = _derivative(arg0, constNodes)
      if (negative) {
        chainDerivative = new OperatorNode('-', 'unaryMinus', [chainDerivative])
      }
      return new OperatorNode(op, func, [chainDerivative, funcDerivative])
    },

    'OperatorNode, Object': function (node, constNodes) {
      if (constNodes[node] !== undefined) {
        return createConstantNode(0)
      }

      if (node.op === '+') {
        // d/dx(sum(f(x)) = sum(f'(x))
        return new OperatorNode(node.op, node.fn, node.args.map(function (arg) {
          return _derivative(arg, constNodes)
        }))
      }

      if (node.op === '-') {
        // d/dx(+/-f(x)) = +/-f'(x)
        if (node.isUnary()) {
          return new OperatorNode(node.op, node.fn, [
            _derivative(node.args[0], constNodes)
          ])
        }

        // Linearity of differentiation, d/dx(f(x) +/- g(x)) = f'(x) +/- g'(x)
        if (node.isBinary()) {
          return new OperatorNode(node.op, node.fn, [
            _derivative(node.args[0], constNodes),
            _derivative(node.args[1], constNodes)
          ])
        }
      }

      if (node.op === '*') {
        // d/dx(c*f(x)) = c*f'(x)
        const constantTerms = node.args.filter(function (arg) {
          return constNodes[arg] !== undefined
        })

        if (constantTerms.length > 0) {
          const nonConstantTerms = node.args.filter(function (arg) {
            return constNodes[arg] === undefined
          })

          const nonConstantNode = nonConstantTerms.length === 1
            ? nonConstantTerms[0]
            : new OperatorNode('*', 'multiply', nonConstantTerms)

          const newArgs = constantTerms.concat(_derivative(nonConstantNode, constNodes))

          return new OperatorNode('*', 'multiply', newArgs)
        }

        // Product Rule, d/dx(f(x)*g(x)) = f'(x)*g(x) + f(x)*g'(x)
        return new OperatorNode('+', 'add', node.args.map(function (argOuter) {
          return new OperatorNode('*', 'multiply', node.args.map(function (argInner) {
            return (argInner === argOuter)
              ? _derivative(argInner, constNodes)
              : argInner.clone()
          }))
        }))
      }

      if (node.op === '/' && node.isBinary()) {
        const arg0 = node.args[0]
        const arg1 = node.args[1]

        // d/dx(f(x) / c) = f'(x) / c
        if (constNodes[arg1] !== undefined) {
          return new OperatorNode('/', 'divide', [_derivative(arg0, constNodes), arg1])
        }

        // Reciprocal Rule, d/dx(c / f(x)) = -c(f'(x)/f(x)^2)
        if (constNodes[arg0] !== undefined) {
          return new OperatorNode('*', 'multiply', [
            new OperatorNode('-', 'unaryMinus', [arg0]),
            new OperatorNode('/', 'divide', [
              _derivative(arg1, constNodes),
              new OperatorNode('^', 'pow', [arg1.clone(), createConstantNode(2)])
            ])
          ])
        }

        // Quotient rule, d/dx(f(x) / g(x)) = (f'(x)g(x) - f(x)g'(x)) / g(x)^2
        return new OperatorNode('/', 'divide', [
          new OperatorNode('-', 'subtract', [
            new OperatorNode('*', 'multiply', [_derivative(arg0, constNodes), arg1.clone()]),
            new OperatorNode('*', 'multiply', [arg0.clone(), _derivative(arg1, constNodes)])
          ]),
          new OperatorNode('^', 'pow', [arg1.clone(), createConstantNode(2)])
        ])
      }

      if (node.op === '^' && node.isBinary()) {
        const arg0 = node.args[0]
        const arg1 = node.args[1]

        if (constNodes[arg0] !== undefined) {
          // If is secretly constant; 0^f(x) = 1 (in JS), 1^f(x) = 1
          if (type.isConstantNode(arg0) && (isZero(arg0.value) || equal(arg0.value, 1))) {
            return createConstantNode(0)
          }

          // d/dx(c^f(x)) = c^f(x)*ln(c)*f'(x)
          return new OperatorNode('*', 'multiply', [
            node,
            new OperatorNode('*', 'multiply', [
              new FunctionNode('log', [arg0.clone()]),
              _derivative(arg1.clone(), constNodes)
            ])
          ])
        }

        if (constNodes[arg1] !== undefined) {
          if (type.isConstantNode(arg1)) {
            // If is secretly constant; f(x)^0 = 1 -> d/dx(1) = 0
            if (isZero(arg1.value)) {
              return createConstantNode(0)
            }
            // Ignore exponent; f(x)^1 = f(x)
            if (equal(arg1.value, 1)) {
              return _derivative(arg0, constNodes)
            }
          }

          // Elementary Power Rule, d/dx(f(x)^c) = c*f'(x)*f(x)^(c-1)
          const powMinusOne = new OperatorNode('^', 'pow', [
            arg0.clone(),
            new OperatorNode('-', 'subtract', [
              arg1,
              createConstantNode(1)
            ])
          ])

          return new OperatorNode('*', 'multiply', [
            arg1.clone(),
            new OperatorNode('*', 'multiply', [
              _derivative(arg0, constNodes),
              powMinusOne
            ])
          ])
        }

        // Functional Power Rule, d/dx(f^g) = f^g*[f'*(g/f) + g'ln(f)]
        return new OperatorNode('*', 'multiply', [
          new OperatorNode('^', 'pow', [arg0.clone(), arg1.clone()]),
          new OperatorNode('+', 'add', [
            new OperatorNode('*', 'multiply', [
              _derivative(arg0, constNodes),
              new OperatorNode('/', 'divide', [arg1.clone(), arg0.clone()])
            ]),
            new OperatorNode('*', 'multiply', [
              _derivative(arg1, constNodes),
              new FunctionNode('log', [arg0.clone()])
            ])
          ])
        ])
      }

      throw new Error('Operator "' + node.op + '" is not supported by derivative, or a wrong number of arguments is passed')
    }
  })

  /**
   * Ensures the number of arguments for a function are correct,
   * and will throw an error otherwise.
   *
   * @param {FunctionNode} node
   */
  function funcArgsCheck (node) {
    // TODO add min, max etc
    if ((node.name === 'log' || node.name === 'nthRoot' || node.name === 'pow') && node.args.length === 2) {
      return
    }

    // There should be an incorrect number of arguments if we reach here

    // Change all args to constants to avoid unidentified
    // symbol error when compiling function
    for (let i = 0; i < node.args.length; ++i) {
      node.args[i] = createConstantNode(0)
    }

    node.compile().eval()
    throw new Error('Expected TypeError, but none found')
  }

  /**
   * Helper function to create a constant node with a specific type
   * (number, BigNumber, Fraction)
   * @param {number} value
   * @param {string} [valueType]
   * @return {ConstantNode}
   */
  function createConstantNode (value, valueType) {
    return new ConstantNode(numeric(value, valueType || config.number))
  }

  return derivative
}

exports.name = 'derivative'
exports.factory = factory
