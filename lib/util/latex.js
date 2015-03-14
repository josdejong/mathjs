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

// FUNCTIONS
var functions = {
  acos: '\\cos^{-1}',
  arccos: '\\cos^{-1}',
  cos: true,
  csc: true,
  csch: false,
  exp: true,
  ker: true,
  limsup: true,
  min: true,
  sinh: true,
  asin: '\\sin^{-1}',
  arcsin: '\\sin^{-1}',
  cosh: true,
  deg: true,
  gcd: true,
  lg: true,
  ln: true,
  Pr: true,
  sup: true,
  atan: '\\tan^{-1}',
  atan2: '\\tan2^{-1}',
  arctan: '\\tan^{-1}',
  cot: true,
  det: true,
  hom: true,
  log: true,
  log10: '\\log_{10}',
  sec: true,
  sech: false,
  tan: true,
  arg: true,
  coth: true,
  dim: true,
  inf: true,
  max: true,
  sin: true,
  tanh: true,

  fix: false,
  lcm: false,
  sign: false,
  xgcd: false,
  unaryMinus: false,
  unaryPlus: false,

  // complex
  complex: false,
  conj: false,
  im: false,
  re: false,

  // matrix
  diag: false,
  resize: false,
  size: false,
  squeeze: false,
  subset: false,
  index: false,
  ones: false,
  zeros: false,
  range: false,

  // probability
  random: false,

  // statistics
  mean: '\\mu',
  median: false,
  prod: false,
  std: '\\sigma',
  'var': '\\sigma^2'
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
  'in': true,
  '*': '\\cdot',
  '/': '\\frac',
  'mod': '\\bmod',
  'to': '\\rightarrow'
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
  functions,
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
    if (typeof arr[value] === 'boolean') {
      if (arr[value] === true) {
        value = '\\' + value;
      }
      else {
        value = '\\mathrm{' + value + '}';
      }
    }
    else if (typeof arr[value] === 'string') {
      value = arr[value];
    }
    else if (typeof value === 'string') {
      var index = value.indexOf('_');
      if (index !== -1) {
        value = exports.toSymbol(value.substring(0, index)) + '_{' +
            exports.toSymbol(value.substring(index+1)) + '}';
      }
    }

    return value;
  };
}

exports.isSymbol = latexIsFn(symbols);
exports.toSymbol = latexToFn(symbols);

exports.isFunction = latexIsFn(functions);
exports.toFunction = latexToFn(functions);

exports.isCurlyFunction = latexIsFn(curlyFunctions);
exports.toCurlyFunction = latexToFn(curlyFunctions);

exports.isOperator = latexIsFn(operators);
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

exports.toArgs = function(that, customFunctions) {
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
