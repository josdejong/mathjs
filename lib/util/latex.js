'use strict';

// FIXME: remove dependencies on Nodes
var ArrayNode = require('../expression/node/ArrayNode');
var OperatorNode = require('../expression/node/OperatorNode');
var SymbolNode = require('../expression/node/SymbolNode');
var ConstantNode = require('../expression/node/ConstantNode');

// GREEK LETTERS
var greek = {
  Alpha: 'A',     alpha: true,
  Beta: 'B',      beta: true,
  Gamma: true,    gamma: true,
  Delta: true,    delta: true,
  Epsilon: 'E',   epsilon: true,  varepsilon: true,
  Zeta: 'Z',      zeta: true,
  Eta: 'H',       eta: true,
  Theta: true,    theta: true,    vartheta: true,
  Iota: 'I',      iota: true,
  Kappa: 'K',     kappa: true,    varkappa: true,
  Lambda: true,   lambda: true,
  Mu: 'M',        mu: true,
  Nu: 'N',        nu: true,
  Xi: true,       xi: true,
  Omicron: 'O',   omicron: true,
  Pi: true,       pi: true,       varpi: true,
  Rho: 'P',       rho: true,      varrho: true,
  Sigma: true,    sigma: true,    varsigma: true,
  Tau: 'T',       tau: true,
  Upsilon: true,  upsilon: true,
  Phi: true,      phi: true,      varphi: true,
  Chi: 'X',       chi: true,
  Psi: true,      psi: true,
  Omega: true,    omega: true
};

var dots = {
  dots: true,
  ldots: true,
  cdots: true,
  vdots: true,
  ddots: true,
  idots: true
};

var logic = {
  'true': '\\mathrm{True}',
  'false': '\\mathrm{False}'
};

var other = {
  inf: '\\infty',
  Inf: '\\infty',
  infinity: '\\infty',
  Infinity: '\\infty',
  oo: '\\infty',
  lim: true,
  'undefined': '\\mathbf{?}'
};

//create a comma separated list of function arguments
function functionArgs(args, callbacks) {
  return args.map( function (arg) {
    return '{' + arg.toTex(callbacks) + '}';
  }).join(',');
}

//default toTex
function defaultToTex (node, callbacks, name) {
  name = typeof name !== 'undefined' ? name : node.name;
  return '\\mathrm{' + name + '}\\left('
      + functionArgs(node.args, callbacks) + '\\right)';
}

//this is a map containing all the latex converters for all the functions
var functions = {
  //arithmetic
  'abs': function (node, callbacks) {
    return '\\left|{' + node.args[0].toTex(callbacks) + '}\\right|';
  },
  'add': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}+{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'ceil': function (node, callbacks) {
    return '\\left\\lceil{' + node.args[0].toTex(callbacks) + '}\\right\\rceil';
  },
  'cube': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)^{3}';
  },
  'divide': function (node, callbacks) {
    return '\\frac{' + node.args[0].toTex(callbacks) 
      + '}{' + node.args[1].toTex(callbacks) + '}';
  },
  'dotDivide': defaultToTex, //TODO not sure which symbol to use
  'dotMultiply': defaultToTex, //TODO not sure which symbol to use
  'dotPow': defaultToTex, //TODO not sure which symbol to use
  'exp': function (node, callbacks) {
    return '\\exp\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'fix': defaultToTex, //TODO is there a symbol for that?
  'floor': function (node, callbacks) {
    return '\\left\\lfloor{' + node.args[0].toTex(callbacks) + '}\\right\\rfloor';
  },
  'gcd': function (node, callbacks) {
    return '\\gcd\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'lcm': defaultToTex,
  'log10': function (node, callbacks) {
    return '\\log_{10}\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'log': function (node, callbacks) {
    if (node.args.length === 1) {
      return '\\ln\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
    }
    return '\\log_{' + node.args[1].toTex(callbacks)
      + '}\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'mod': function (node, callbacks) {
    return '\\mod\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'multiply': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks) 
      + '}\\cdot{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'norm': function (node, callbacks) {
    if (node.args.length === 1) {
      return '\\left\\|{' + node.args[0].toTex(callbacks) + '}\\right\\|';
    }
    else {
      return '\\mathrm{norm}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
    }
  },
  'nthRoot': function (node, callbacks) {
    return '\\sqrt[' + node.args[1].toTex(callbacks) 
      + ']{' + node.args[0].toTex(callbacks) + '}';
  },
  'pow': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks) 
      + '}^{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'round': function (node, callbacks) {
    if (node.args.length === 1) {
      return '\\left\\lfloor{' + node.args[0].toTex(callbacks) + '}\\right\\rceil';
    }
    return '\\mathrm{round}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'sign': defaultToTex,
  'sqrt': function (node, callbacks) {
    return '\\sqrt{' + node.args[0].toTex(callbacks) + '}';
  },
  'square': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)^{2}';
  },
  'subtract': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks) 
      + '}-{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'unaryMinus': function (node, callbacks) {
    return '-\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'unaryPlus': function (node, callbacks) {
    return '+\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'xgcd': defaultToTex,

  //bitwise
  'bitAnd': defaultToTex, //TODO use Ampersand?
  'bitOr': defaultToTex,  //TODO use | ?
  'bitXor': defaultToTex, //TODO what symbol?
  'leftShift': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}<<{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'rightArithShift': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}>>{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'rightLogShift': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}>>>{' + node.args[1].toTex(callbacks) + '}\\right)';
  },

  //complex TODO should there really be LaTeX conversion for those?
  'arg': function (node, callbacks) {
    return '\\arg\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'conj': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)^{*}';
  },
  'im': function (node, callbacks) {
    return '\\Im\\left\\lbrace{' + node.args[0].toTex(callbacks) + '}\\right\\rbrace';
  },
  're': function (node, callbacks) {
    return '\\Re\\left\\lbrace{' + node.args[0].toTex(callbacks) + '}\\right\\rbrace';
  },

  //construction
  'bignumber': function (node, callbacks) {
    if (node.args.length === 0) {
      return '0';
    }
    return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'boolean': defaultToTex,
  'chain': defaultToTex,
  'complex': function (node, callbacks) {
    switch (node.args.length) {
      case 0:
        return '0';
      case 1:
        return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
      case 2:
        return '\\left({\\left({' + node.args[0].toTex(callbacks) 
          + '}\\right)+i\\cdot\\left({' + node.args[1].toTex(callbacks) + '}\\right)}\\right)';
    }
  },
  'index': defaultToTex,
  'matrix': function (node, callbacks) {
    if (node.args.length === 0) {
      return '\\begin{bmatrix}\\end{bmatrix}';
    }
    return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'number': function (node, callbacks) {
    switch (node.args.length) {
      case 0:
        return '0';
      case 1:
        return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
      case 2:
        return '\\left(\\left({' + node.args[0].toTex(callbacks)
          + '}\\right){' + node.args[1].toTex(callbacks) + '}\\right)';
    }
  },
  'parser': defaultToTex,
  'string': function (node, callbacks) {
    if (node.args.length === 0) {
      return '""';
    }
    return '"' + node.args[0].toString() + '"';
  },
  'unit': function (node, callbacks) {
    if (node.args.length === 1) {
      return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
    }
    return '\\left({\\left({' + node.args[0].toTex(callbacks)
      + '}\\right){' + node.args[1].toTex() + '}}\\right)';
  },

  //expression TODO does the default even work in this case? (.toTex on the args)
  'compile': defaultToTex,
  'eval': defaultToTex,
  'help': defaultToTex,
  'parse': defaultToTex,

  //logical
  'and': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks) 
      + '}\\wedge{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'not': function (node, callbacks) {
    return '\\neg\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'or': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}\\vee{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'xor': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}\\veebar{' + node.args[1].toTex(callbacks) + '}\\right)';
  },

  //matrix
  'concat': defaultToTex, //TODO use || ?? well, not really!!
  'cross': function (node, callbacks) {
    return '{' + node.args[0].toTex(callbacks)
      + '}\\times{' + node.args[1].toTex(callbacks) + '}';
  },
  'det': function (node, callbacks) {
    return '\\det\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'diag': defaultToTex, //TODO use some symbol for that?
  'dot': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}\\cdot{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'eye': defaultToTex, //TODO use some symbol that represents that?
  'flatten': defaultToTex,
  'inv': function (node, callbacks) {
    return '{' + node.args[0].toTex(callbacks) + '}^{-1}';
  },
  'ones': defaultToTex, //TODO use some symbol for that?
  'range': defaultToTex, //TODO use some symbol for that?
  'resize': defaultToTex,
  'size': defaultToTex, //TODO use some symbol for that?
  'squeeze': defaultToTex,
  'subset': defaultToTex, //TODO use some symbol for that?
  'trace': function (node, callbacks) {
    return '\\mathrm{tr}\\left({' + node.args[0].toTex() + '}\\right)';
  },
  'transpose': function (node, callbacks) {
    return '{' + node.args[0].toTex(callbacks) + '}^{\\top}';
  },
  'zeros': defaultToTex, //TODO use some symbol for that

  //probability
  'combinations': function (node, callbacks) {
    return '\\binom{' + node.args[0].toTex(callbacks)
      + '}{' + node.args[1].toTex(callbacks) + '}';
  },
  'distribution': defaultToTex,
  'factorial': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks) + '}\\right)!';
  },
  'gamma': function (node, callbacks) {
    return '\\Gamma\\left({' + node.args[0].toTex(callbacks) + '}\\right)';
  },
  'permutation': defaultToTex, //TODO use some symbol for that? it has been just brackets
  'pickRandom': defaultToTex,
  'randomInd': defaultToTex, //TODO use some symbol for that?
  'random': defaultToTex, //TODO use some symbol for that?

  //relational
  'compare': defaultToTex,
  'deepEqual': defaultToTex,
  'equal': defaultToTex, //TODO use operator? This shouldn't conflict with Assignments!!!!
                 //maybe = with ? on top of it, or do assignments differently?
  'largerEq': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}\\geq{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'larger': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}>{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'smallerEq': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}\\leq{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'smaller': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}<{' + node.args[1].toTex(callbacks) + '}\\right)';
  },
  'unequal': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}\\neq{' + node.args[1].toTex(callbacks) + '}\\right)';
  },

  //statistics
  'max': function (node, callbacks) {
    return '\\max\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'mean': defaultToTex, //TODO use E() for that?
  'min': function (node, callbacks) {
    return '\\min\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'prod': defaultToTex, //TODO use \prod for that?
  'std': defaultToTex, //TODO use D() for that? 
  'sum': defaultToTex, //TODO use \sum?
  'var': function (node, callbacks) {
    return '\\mathrm{Var}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },

  //trigonometry
  'acosh': function (node, callbacks) {
    return '\\cosh^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'acos': function (node, callbacks) {
    return '\\cos^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'acoth': function (node, callbacks) {
    return '\\coth^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'acot': function (node, callbacks) {
    return '\\cot^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'acsch': function (node, callbacks) {
    return '\\mathrm{csch}^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'acsc': function (node, callbacks) {
    return '\\csc^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'asech': function (node, callbacks) {
    return '\\mathrm{sech}^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'asec': function (node, callbacks) {
    return '\\sec^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'asinh': function (node, callbacks) {
    return '\\sinh^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'asin': function (node, callbacks) {
    return '\\sin^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'atan2': function (node, callbacks) {
    return '\\mathrm{atan2}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'atanh': function (node, callbacks) {
    return '\\tanh^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'atan': function (node, callbacks) {
    return '\\tan^{-1}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'cosh': function (node, callbacks) {
    return '\\cosh\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'cos': function (node, callbacks) {
    return '\\cos\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'coth': function (node, callbacks) {
    return '\\coth\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'cot': function (node, callbacks) {
    return '\\cot\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'csch': function (node, callbacks) {
    return '\\mathrm{csch}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'csc': function (node, callbacks) {
    return '\\csc\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'sech': function (node, callbacks) {
    return '\\mathrm{sech}\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'sec': function (node, callbacks) {
    return '\\sec\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'sinh': function (node, callbacks) {
    return '\\sinh\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'sin': function (node, callbacks) {
    return '\\sin\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'tanh': function (node, callbacks) {
    return '\\tanh\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },
  'tan': function (node, callbacks) {
    return '\\tan\\left(' + functionArgs(node.args, callbacks) + '\\right)';
  },

  //units
  'to': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}\\rightarrow{' + node.args[1].toTex(callbacks) + '}\\right)';
  },

  //utils
  'clone': defaultToTex,
  'filter': defaultToTex,
  'forEach': defaultToTex,
  'format': defaultToTex,
  'import': defaultToTex,
  'map': defaultToTex,
  'print': defaultToTex,
  'sort': defaultToTex,
  'typeof': defaultToTex
};

// CURLY FUNCTIONS
// wrap parameters with {}
var curlyFunctions = {
  sqrt: true,
  inv: true,
  int: '\\int',
  Int: '\\int',
  integrate: '\\int',
  eigenvalues: '\\lambda',
  liminf: true,
  lim: true,
  exp: 'e^',
  sum: true,

  eye: '\\mathbf{I}'
};

var operators = {
  '<=': '\\leq',
  '>=': '\\geq',
  '!=': '\\neq',
  'in': '\\in',
  '*': '\\cdot',
  '/': '\\frac',
  'mod': '\\bmod',
  'to': '\\rightarrow',
  'not': '\\neg'
};

var units = {
  deg: '^{\\circ}'
};

var symbols = {};

function mapSymbols() {
  var args = Array.prototype.slice.call(arguments),
      obj;
  for (var i = 0, len = args.length; i < len; i++) {
    obj = args[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        symbols[key] = obj[key];
      }
    }
  }
}

mapSymbols(
  curlyFunctions,
  greek,
  dots,
  logic,
  other
);

function latexIs(arr, value) {
  return typeof arr[value] !== 'undefined';
}

function latexIsFn(arr) {
  return function(value) {
    return latexIs(arr, value);
  };
}

function latexToFn(arr) {
  return function(value) {
    if (typeof arr[value] === 'string') {
      value = arr[value];
    }
    else if (typeof value === 'string') { //TODO What the hell is this code doing???
      var index = value.indexOf('_');
      if (index !== -1) {
        value = exports.toSymbol(value.substring(0, index)) + '_{' +
            exports.toSymbol(value.substring(index+1)) + '}';
      }
    }

    return value;
  };
}

exports.toSymbol = latexToFn(symbols);

exports.isFunction = latexIsFn(functions);
//returns the latex output for a given function
exports.toFunction = function (node, callbacks, name) {
  if ((typeof functions[name] !== 'undefined')) {
    return functions[name](node, callbacks);
  }

  //fallback
  return defaultToTex(node, callbacks, name);
}

exports.isCurlyFunction = latexIsFn(curlyFunctions);
exports.toCurlyFunction = latexToFn(curlyFunctions);

exports.toOperator = latexToFn(operators);

exports.isUnit = latexIsFn(units);
exports.toUnit = (function() {
  var _toUnit = latexToFn(units);

  return function(value, notSpaced) {
    if (exports.isUnit(value)) {
      return _toUnit(value);
    }

    return (notSpaced ? '' : '\\,') + '\\mathrm{' + value + '}';
  };
}());

exports.addBraces = function(s, brace, type) {
  if (brace === null) {
    return s;
  }

  var braces = ['', ''];
  type = type || 'normal';

  if (typeof brace === 'undefined' || brace === false) {
    braces = ['{', '}'];
  }
  else if (brace === true) {
    braces = ['(', ')'];
    type = 'lr';
  }
  else if (Array.isArray(brace) && brace.length === 2) {
    braces = brace;
  }
  else {
    braces = [brace, brace];
  }

  switch (type) {
    case 'normal':
    case false:
      return braces[0] + s + braces[1];

    case 'lr':
      return '\\left' + braces[0] + '{' + s + '}' + '\\right' + braces[1];

    case 'be':
      return '\\begin{' + braces[0] + '}' + s + '\\end{' + braces[1] + '}';
  }

  return braces[0] + s + braces[1];
};

exports.toArgs = function(that, customFunctions) { //This can probably be removed
  var name = that.name,
      args = that.args,
      func = exports.toSymbol(that.name),
      texParams = null,
      brace = null,
      type = false,
      showFunc = false,
      prefix = '',
      suffix = '',
      op = null;

  switch (name) {
    // OPERATORS
    case 'add':
      op = '+';
      break;

    case 'subtract':
      op = '-';
      break;

    case 'larger':
      op = '>';
      break;

    case 'largerEq':
      op = '>=';
      break;

    case 'smaller':
      op = '<';
      break;

    case 'smallerEq':
      op = '<=';
      break;

    case 'unequal':
      op = '!=';
      break;

    case 'equal':
      op = '=';
      break;

    case 'mod':
      op = 'mod';
      break;

    case 'multiply':
      op = '*';
      break;

    case 'pow':
      op = '^';
      break;

    case 'concat':
      op = '||';
      break;

    case 'factorial':
      op = '!';
      break;

    case 'permutations':
      if (args.length === 1) {
        if (args[0] instanceof SymbolNode || args[0] instanceof ConstantNode) {
          op = '!';
        }
        else {
          return '{\\left(' + args[0].toTex(customFunctions) + '\\right)!}';
        }
      }
      else {
        // op = 'P';
        var n = args[0].toTex(customFunctions),
            k = args[1].toTex(customFunctions);
        return '\\frac{' + n + '!}{\\left(' + n + ' - ' + k + '\\right)!}';
      }
      break;

    // probability
    case 'combinations':
      op = '\\choose';
      break;

    // LR BRACES
    case 'abs':
      brace = '|';
      type = 'lr';
      break;

    case 'norm':
      brace = '\\|';
      type = 'lr';

      if (args.length === 2) {
        var tmp = args[1].toTex(customFunctions);

        if (tmp === '\\text{inf}') {
          tmp = '\\infty';
        }
        else if (tmp === '\\text{-inf}') {
          tmp = '{- \\infty}';
        }
        else if (tmp === '\\text{fro}') {
          tmp = 'F';
        }

        suffix = '_{' + tmp + '}';
        args = [args[0]];
      }
      break;

    case 'ceil':
      brace = ['\\lceil', '\\rceil'];
      type = 'lr';
      break;

    case 'floor':
      brace = ['\\lfloor', '\\rfloor'];
      type = 'lr';
      break;

    case 'round':
      brace = ['\\lfloor', '\\rceil'];
      type = 'lr';

      if (args.length === 2) {
        suffix = '_' + exports.addBraces(args[1].toTex(customFunctions));
        args = [args[0]];
      }
      break;


    // NORMAL BRACES
    case 'inv':
      suffix = '^{-1}';
      break;

    case 'transpose':
      suffix = '^{T}';
      brace = false;
      break;

    // SPECIAL NOTATION
    case 'log':
      var base = 'e';
      if (args.length === 2) {
        base = args[1].toTex(customFunctions);
        func = '\\log_{' + base + '}';
        args = [args[0]];
      }
      if (base === 'e') {
        func = '\\ln';
      }

      showFunc = true;
      break;

    case 'square':
      suffix = '^{2}';
      break;

    case 'cube':
      suffix = '^{3}';
      break;


    // MATRICES
    case 'eye':
      showFunc = true;
      brace = false;
      func += '_';
      break;

    case 'det':
      if (that.args[0] instanceof ArrayNode) {
        //FIXME passing 'vmatrix' like that is really ugly
        that.args[0].latexType = 'vmatrix';
        var latex = that.args[0].toTex(customFunctions);
        delete that.args[0].latexType;
        return latex;
      }

      brace = 'vmatrix';
      type = 'be';
      break;

    default:
      showFunc = true;
      break;
  }

  if (op !== null) {
    brace = (op === '+' || op === '-');
    texParams = (new OperatorNode(op, name, args)).toTex(customFunctions);
  }
  else {
    op = ', ';
  }

  if (brace === null && !exports.isCurlyFunction(name)) {
    brace = true;
  }

  texParams = texParams || args.map(function(param) {
    return '{' + param.toTex(customFunctions) + '}'  ;
  }).join(op);

  return prefix + (showFunc ? func : '') +
      exports.addBraces(texParams, brace, type) +
      suffix;
};
