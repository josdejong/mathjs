'use strict';

exports.symbols = {
  // GREEK LETTERS
  Alpha: 'A',     alpha: '\\alpha',
  Beta: 'B',      beta: '\\beta',
  Gamma: '\\Gamma',    gamma: '\\gamma',
  Delta: '\\Delta',    delta: '\\delta',
  Epsilon: 'E',   epsilon: '\\epsilon',  varepsilon: '\\varepsilon',
  Zeta: 'Z',      zeta: '\\zeta',
  Eta: 'H',       eta: '\\eta',
  Theta: '\\Theta',    theta: '\\theta',    vartheta: '\\vartheta',
  Iota: 'I',      iota: '\\iota',
  Kappa: 'K',     kappa: '\\kappa',    varkappa: '\\varkappa',
  Lambda: '\\Lambda',   lambda: '\\lambda',
  Mu: 'M',        mu: '\\mu',
  Nu: 'N',        nu: '\\nu',
  Xi: '\\Xi',       xi: '\\xi',
  Omicron: 'O',   omicron: 'o',
  Pi: '\\Pi',       pi: '\\pi',       varpi: '\\varpi',
  Rho: 'P',       rho: '\\rho',      varrho: '\\varrho',
  Sigma: '\\Sigma',    sigma: '\\sigma',    varsigma: '\\varsigma',
  Tau: 'T',       tau: '\\tau',
  Upsilon: '\\Upsilon',  upsilon: '\\upsilon',
  Phi: '\\Phi',      phi: '\\phi',      varphi: '\\varphi',
  Chi: 'X',       chi: '\\chi',
  Psi: '\\Psi',      psi: '\\psi',
  Omega: '\\Omega',    omega: '\\omega',
  //logic
  'true': '\\mathrm{True}',
  'false': '\\mathrm{False}',
  //other
  i: 'i', //TODO use \i ??
  inf: '\\infty',
  Inf: '\\infty',
  infinity: '\\infty',
  Infinity: '\\infty',
  oo: '\\infty',
  lim: '\\lim',
  'undefined': '\\mathbf{?}'
};

exports.operators = {
  'transpose': '^\\top',
  'factorial': '!',
  'pow': '^',
  'dotPow': '.^\\wedge', //TODO find ideal solution
  'unaryPlus': '+',
  'unaryMinus': '-',
  'bitNot': '~', //TODO find ideal solution
  'not': '\\neg',
  'multiply': '\\cdot',
  'divide': '\\frac', //TODO how to handle that properly?
  'dotMultiply': '.\\cdot', //TODO find ideal solution
  'dotDivide': '.:', //TODO find ideal solution
  'mod': '\\mod',
  'add': '+',
  'subtract': '-',
  'to': '\\rightarrow',
  'leftShift': '<<',
  'rightArithShift': '>>',
  'rightLogShift': '>>>',
  'equal': '=',
  'unequal': '\\neq',
  'smaller': '<',
  'larger': '>',
  'smallerEq': '\\leq',
  'largerEq': '\\geq',
  'bitAnd': '\\&',
  'bitXor': '\\underline{|}',
  'bitOr': '|',
  'and': '\\wedge',
  'xor': '\\veebar',
  'or': '\\vee'
};

exports.defaultTemplate = '\\mathrm{%name%}\\left(%*%\\right)';

//this is a map containing all the latex converters for all the functions
exports.functions = {
  //arithmetic
  'abs': '\\left|%0%\\right|',
  'add': '\\left(%0%+%1%\\right)',
  'ceil': '\\left\\lceil%0%\\right\\rceil',
  'cube': '\\left(%0%\\right)^3',
  'divide': '\\frac{%0%}{%1%}',
  'dotDivide': '\\left(%0%' + exports.operators['dotDivide'] + '%1%\\right)',
  'dotMultiply': '\\left(%0%' + exports.operators['dotMultiply'] + '%1%\\right)',
  'dotPow': '\\left(%0%' + exports.operators['dotPow'] + '%1%\\right)',
  'exp': '\\exp\\left(%0%\\right)',
  'fix': exports.defaultTemplate,
  'floor': '\\left\\lfloor%0%\\right\\rfloor',
  'gcd': '\\gcd\\left(%*%\\right)',
  'lcm': exports.defaultTemplate,
  'log10': '\\log_{10}\\left(%0%\\right)',
  'log': {
    1: '\\ln\\left(%0%\\right)',
    2: '\\log_{%1%}\\left(%0%\\right)'
  },
  'mod': '\\left(%0%' + exports.operators['mod'] + '%1%\\right)',
  'multiply': '\\left(%0%' + exports.operators['multiply'] + '%1%\\right)',
  'norm': {
    1: '\\left\\|%0%\\right\\|',
    2: exports.defaultTemplate
  },
  'nthRoot': '\\sqrt[%1%]{%0%}',
  'pow': '\\left(%0%\\right)' + exports.operators['pow'] + '{%1%}',
  'round': {
    1: '\\left\\lfloor%0%\\right\\rceil',
    2: exports.defaultTemplate
  },
  'sign': exports.defaultTemplate,
  'sqrt': '\\sqrt{%0%}',
  'square': '\\left(%0%\\right)^2',
  'subtract': '\\left(%0%' + exports.operators['subtract'] + '%1%\\right)',
  'unaryMinus': exports.operators['unaryMinus'] + '\\left(%0%\\right)',
  'unaryPlus': exports.operators['unaryPlus'] + '\\left(%0%\\right)',
  'xgcd': exports.defaultTemplate,

  //bitwise
  'bitAnd': '\\left(%0%' + exports.operators['bitAnd'] + '%1%\\right)',
  'bitOr': '\\left(%0%' + exports.operators['bitOr'] + '%1%\\right)',
  'bitXor': '\\left(%0%' + exports.operators['bitXor'] + '%1%\\right)',
  'bitNot': exports.operators['bitNot'] + '\\left(%0%\\right)',
  'leftShift': '\\left(%0%' + exports.operators['leftShift'] + '%1%\\right)',
  'rightArithShift': '\\left(%0%' + exports.operators['rightArithShift'] + '%1%\\right)',
  'rightLogShift': '\\left(%0%' + exports.operators['rightLogShift'] + '%1%\\right)',

  //complex
  'arg': '\\arg\\left(%0%\\right)',
  'conj': '\\left(%0%\\right)^*',
  'im': '\\Im\\left\\lbrace%0%\\right\\rbrace',
  're': '\\Re\\left\\lbrace%0%\\right\\rbrace',

  //construction
  'bignumber': {
    0: '0',
    1: '\\left(%0%\\right)'
  },
  'boolean': exports.defaultTemplate,
  'chain': exports.defaultTemplate,
  'complex': {
    0: '0',
    1: '\\left(%0%\\right)',
    2: '\\left(\\left(%0%\\right)+'
      + exports.symbols['i'] + '\\cdot\\left(%1%\\right)\\right)',
  },
  'index': exports.defaultTemplate,
  'matrix': {
    0: '\\begin{bmatrix}\\end{bmatrix}',
    1: '\\left(%0%\\right)',
    2: '\\left(%0%\\right)'
  },
  'number': {
    0: '0',
    1: '\\left(%0%\\right)',
    2: '\\left(\\left(%0%\\right)%1%\\right)'
  },
  'parser': exports.defaultTemplate,
  'sparse': {
    0: '\\begin{bsparse}\\end{bsparse}',
    1: '\\left(%0%\\right)'
  },
  'string': {
    0: '\\mathtt{""}',
    1: '\\mathrm{string}\\left(%0%\\right)'
  },
  'unit': {
    1: '\\left(%0%\\right)',
    2: '\\left(\\left(%0%\\right)%1%\\right)'
  },

  //expression TODO does the default even work in this case? (.toTex on the args)
  'compile': exports.defaultTemplate,
  'eval': exports.defaultTemplate,
  'help': exports.defaultTemplate,
  'parse': exports.defaultTemplate,

  //logical
  'and': '\\left(%0%' + exports.operators['and'] + '%1%\\right)',
  'not': exports.operators['not'] + '\\left(%0%\\right)',
  'or': '\\left(%0%' + exports.operators['or'] + '%1%\\right)',
  'xor': '\\left(%0%' + exports.operators['xor'] + '%1%\\right)',

  //matrix
  'concat': exports.defaultTemplate,
  'cross': '\\left(%0%\\right)\\times\\left(%1%\\right)',
  'det': '\\det\\left(%0%\\right)',
  'diag': exports.defaultTemplate,
  'dot': '\\left(%0%\\cdot%1%\\right)',
  'eye': exports.defaultTemplate,
  'flatten': exports.defaultTemplate,
  'inv': '\\left(%0%\\right)^{-1}',
  'ones': exports.defaultTemplate,
  'range': exports.defaultTemplate,
  'resize': exports.defaultTemplate,
  'size': exports.defaultTemplate,
  'squeeze': exports.defaultTemplate,
  'subset': exports.defaultTemplate,
  'trace': '\\mathrm{tr}\\left(%0%\\right)',
  'transpose': '\\left(%0%\\right)' + exports.operators['transpose'],
  'zeros': exports.defaultTemplate,

  //probability
  'combinations': '\\binom{%0%}{%1%}',
  'distribution': exports.defaultTemplate,
  'factorial': '\\left(%0%\\right)' + exports.operators['factorial'],
  'gamma': '\\Gamma\\left(%0%\\right)',
  'permutations': exports.defaultTemplate,
  'pickRandom': exports.defaultTemplate,
  'randomInt': exports.defaultTemplate,
  'random': exports.defaultTemplate,

  //relational
  'compare': exports.defaultTemplate,
  'deepEqual': exports.defaultTemplate,
  'equal': '\\left(%0%' + exports.operators['equal'] + '%1%\\right)',
  'largerEq': '\\left(%0%' + exports.operators['largerEq'] + '%1%\\right)',
  'larger': '\\left(%0%' + exports.operators['larger'] + '%1%\\right)',
  'smallerEq': '\\left(%0%' + exports.operators['smallerEq'] + '%1%\\right)',
  'smaller': '\\left(%0%' + exports.operators['smaller'] + '%1%\\right)',
  'unequal': '\\left(%0%' + exports.operators['unequal'] + '%1%\\right)',

  //statistics
  'max': '\\max\\left(%*%\\right)',
  'mean': exports.defaultTemplate,
  'median': exports.defaultTemplate,
  'min': '\\min\\left(%*%\\right)',
  'prod': exports.defaultTemplate,
  'std': exports.defaultTemplate,
  'sum': exports.defaultTemplate,
  'var': '\\mathrm{Var}\\left(%*%\\right)',

  //trigonometry
  'acosh': '\\cosh^{-1}\\left(%0%\\right)',
  'acos': '\\cos^{-1}\\left(%0%\\right)',
  'acoth': '\\coth^{-1}\\left(%0%\\right)',
  'acot': '\\cot^{-1}\\left(%0%\\right)',
  'acsch': '\\mathrm{csch}^{-1}\\left(%0%\\right)',
  'acsc': '\\csc^{-1}\\left(%0%\\right)',
  'asech': '\\mathrm{sech}^{-1}\\left(%0%\\right)',
  'asec': '\\sec^{-1}\\left(%0%\\right)',
  'asinh': '\\sinh^{-1}\\left(%0%\\right)',
  'asin': '\\sin^{-1}\\left(%0%\\right)',
  'atan2': '\\mathrm{atan2}\\left(%*%\\right)',
  'atanh': '\\tanh^{-1}\\left(%0%\\right)',
  'atan': '\\tan^{-1}\\left(%0%\\right)',
  'cosh': '\\cosh\\left(%0%\\right)',
  'cos': '\\cos\\left(%0%\\right)',
  'coth': '\\coth\\left(%0%\\right)',
  'cot': '\\cot\\left(%0%\\right)',
  'csch': '\\mathrm{csch}\\left(%0%\\right)',
  'csc': '\\csc\\left(%0%\\right)',
  'sech': '\\mathrm{sech}\\left(%0%\\right)',
  'sec': '\\sec\\left(%0%\\right)',
  'sinh': '\\sinh\\left(%0%\\right)',
  'sin': '\\sin\\left(%0%\\right)',
  'tanh': '\\tanh\\left(%0%\\right)',
  'tan': '\\tan\\left(%0%\\right)',

  //units
  'to': '\\left(%0%' + exports.operators['to'] + '%1%\\right)',

  //utils
  'clone': exports.defaultTemplate,
  'filter': exports.defaultTemplate,
  'forEach': exports.defaultTemplate,
  'format': exports.defaultTemplate,
  'import': exports.defaultTemplate,
  'map': exports.defaultTemplate,
  'print': exports.defaultTemplate,
  'sort': exports.defaultTemplate,
  'typeof': exports.defaultTemplate
};

var units = {
  deg: '^\\circ'
};

//@param {string} name
//@param {boolean} isUnit
exports.toSymbol = function (name, isUnit) {
  isUnit = typeof isUnit === 'undefined' ? false : isUnit;
  if (isUnit) {
    if (units.hasOwnProperty(name)) {
      return units[name];
    }
    return '\\mathrm{' + name + '}';
  }

  if (exports.symbols.hasOwnProperty(name)) {
    return exports.symbols[name];
  }
  else if (name.indexOf('_') !== -1) {
    //symbol with index (eg. alpha_1)
    var index = name.indexOf('_');
    return exports.toSymbol(name.substring(0, index)) + '_{'
      + exports.toSymbol(name.substring(index + 1)) + '}';
  }
  return name;
};
