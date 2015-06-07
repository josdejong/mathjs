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

exports.defaultTemplate = '\\mathrm{${name}}\\left(${args}\\right)';

//this is a map containing all the latex converters for all the functions
exports.functions = {
  //arithmetic
  'abs': '\\left|${args[0]}\\right|',
  'add': '\\left(${args[0]}+${args[1]}\\right)',
  'ceil': '\\left\\lceil${args[0]}\\right\\rceil',
  'cube': '\\left(${args[0]}\\right)^3',
  'divide': '\\frac{${args[0]}}{${args[1]}}',
  'dotDivide': '\\left(${args[0]}' + exports.operators['dotDivide'] + '${args[1]}\\right)',
  'dotMultiply': '\\left(${args[0]}' + exports.operators['dotMultiply'] + '${args[1]}\\right)',
  'dotPow': '\\left(${args[0]}' + exports.operators['dotPow'] + '${args[1]}\\right)',
  'exp': '\\exp\\left(${args[0]}\\right)',
  'fix': exports.defaultTemplate,
  'floor': '\\left\\lfloor${args[0]}\\right\\rfloor',
  'gcd': '\\gcd\\left(${args}\\right)',
  'lcm': exports.defaultTemplate,
  'log10': '\\log_{10}\\left(${args[0]}\\right)',
  'log': {
    1: '\\ln\\left(${args[0]}\\right)',
    2: '\\log_{${args[1]}}\\left(${args[0]}\\right)'
  },
  'mod': '\\left(${args[0]}' + exports.operators['mod'] + '${args[1]}\\right)',
  'multiply': '\\left(${args[0]}' + exports.operators['multiply'] + '${args[1]}\\right)',
  'norm': {
    1: '\\left\\|${args[0]}\\right\\|',
    2: exports.defaultTemplate
  },
  'nthRoot': '\\sqrt[${args[1]}]{${args[0]}}',
  'pow': '\\left(${args[0]}\\right)' + exports.operators['pow'] + '{${args[1]}}',
  'round': {
    1: '\\left\\lfloor${args[0]}\\right\\rceil',
    2: exports.defaultTemplate
  },
  'sign': exports.defaultTemplate,
  'sqrt': '\\sqrt{${args[0]}}',
  'square': '\\left(${args[0]}\\right)^2',
  'subtract': '\\left(${args[0]}' + exports.operators['subtract'] + '${args[1]}\\right)',
  'unaryMinus': exports.operators['unaryMinus'] + '\\left(${args[0]}\\right)',
  'unaryPlus': exports.operators['unaryPlus'] + '\\left(${args[0]}\\right)',
  'xgcd': exports.defaultTemplate,

  //bitwise
  'bitAnd': '\\left(${args[0]}' + exports.operators['bitAnd'] + '${args[1]}\\right)',
  'bitOr': '\\left(${args[0]}' + exports.operators['bitOr'] + '${args[1]}\\right)',
  'bitXor': '\\left(${args[0]}' + exports.operators['bitXor'] + '${args[1]}\\right)',
  'bitNot': exports.operators['bitNot'] + '\\left(${args[0]}\\right)',
  'leftShift': '\\left(${args[0]}' + exports.operators['leftShift'] + '${args[1]}\\right)',
  'rightArithShift': '\\left(${args[0]}' + exports.operators['rightArithShift'] + '${args[1]}\\right)',
  'rightLogShift': '\\left(${args[0]}' + exports.operators['rightLogShift'] + '${args[1]}\\right)',

  //complex
  'arg': '\\arg\\left(${args[0]}\\right)',
  'conj': '\\left(${args[0]}\\right)^*',
  'im': '\\Im\\left\\lbrace${args[0]}\\right\\rbrace',
  're': '\\Re\\left\\lbrace${args[0]}\\right\\rbrace',

  //combinatorics
  'stirlingS2': '\\mathrm{S}\\left(${args[0]},${args[1]}\\right)',
  'bellNumbers': '\\mathrm{B}_{${args[0]}}',
  'composition': exports.defaultTemplate,

  //construction
  'bignumber': {
    0: '0',
    1: '\\left(${args[0]}\\right)'
  },
  'boolean': exports.defaultTemplate,
  'chain': exports.defaultTemplate,
  'complex': {
    0: '0',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(\\left(${args[0]}\\right)+'
      + exports.symbols['i'] + '\\cdot\\left(${args[1]}\\right)\\right)',
  },
  'index': exports.defaultTemplate,
  'matrix': {
    0: '\\begin{bmatrix}\\end{bmatrix}',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(${args[0]}\\right)'
  },
  'number': {
    0: '0',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(\\left(${args[0]}\\right)${args[1]}\\right)'
  },
  'parser': exports.defaultTemplate,
  'sparse': {
    0: '\\begin{bsparse}\\end{bsparse}',
    1: '\\left(${args[0]}\\right)'
  },
  'string': {
    0: '\\mathtt{""}',
    1: '\\mathrm{string}\\left(${args[0]}\\right)'
  },
  'unit': {
    1: '\\left(${args[0]}\\right)',
    2: '\\left(\\left(${args[0]}\\right)${args[1]}\\right)'
  },

  //expression TODO does the default even work in this case? (.toTex on the args)
  'compile': exports.defaultTemplate,
  'eval': exports.defaultTemplate,
  'help': exports.defaultTemplate,
  'parse': exports.defaultTemplate,

  //logical
  'and': '\\left(${args[0]}' + exports.operators['and'] + '${args[1]}\\right)',
  'not': exports.operators['not'] + '\\left(${args[0]}\\right)',
  'or': '\\left(${args[0]}' + exports.operators['or'] + '${args[1]}\\right)',
  'xor': '\\left(${args[0]}' + exports.operators['xor'] + '${args[1]}\\right)',

  //matrix
  'concat': exports.defaultTemplate,
  'cross': '\\left(${args[0]}\\right)\\times\\left(${args[1]}\\right)',
  'det': '\\det\\left(${args[0]}\\right)',
  'diag': exports.defaultTemplate,
  'dot': '\\left(${args[0]}\\cdot${args[1]}\\right)',
  'eye': exports.defaultTemplate,
  'flatten': exports.defaultTemplate,
  'inv': '\\left(${args[0]}\\right)^{-1}',
  'ones': exports.defaultTemplate,
  'range': exports.defaultTemplate,
  'resize': exports.defaultTemplate,
  'size': exports.defaultTemplate,
  'squeeze': exports.defaultTemplate,
  'subset': exports.defaultTemplate,
  'trace': '\\mathrm{tr}\\left(${args[0]}\\right)',
  'transpose': '\\left(${args[0]}\\right)' + exports.operators['transpose'],
  'zeros': exports.defaultTemplate,

  //probability
  'combinations': '\\binom{${args[0]}}{${args[1]}}',
  'distribution': exports.defaultTemplate,
  'factorial': '\\left(${args[0]}\\right)' + exports.operators['factorial'],
  'gamma': '\\Gamma\\left(${args[0]}\\right)',
  'permutations': exports.defaultTemplate,
  'pickRandom': exports.defaultTemplate,
  'randomInt': exports.defaultTemplate,
  'random': exports.defaultTemplate,

  //relational
  'compare': exports.defaultTemplate,
  'deepEqual': exports.defaultTemplate,
  'equal': '\\left(${args[0]}' + exports.operators['equal'] + '${args[1]}\\right)',
  'largerEq': '\\left(${args[0]}' + exports.operators['largerEq'] + '${args[1]}\\right)',
  'larger': '\\left(${args[0]}' + exports.operators['larger'] + '${args[1]}\\right)',
  'smallerEq': '\\left(${args[0]}' + exports.operators['smallerEq'] + '${args[1]}\\right)',
  'smaller': '\\left(${args[0]}' + exports.operators['smaller'] + '${args[1]}\\right)',
  'unequal': '\\left(${args[0]}' + exports.operators['unequal'] + '${args[1]}\\right)',

  //statistics
  'max': '\\max\\left(${args}\\right)',
  'mean': exports.defaultTemplate,
  'median': exports.defaultTemplate,
  'min': '\\min\\left(${args}\\right)',
  'prod': exports.defaultTemplate,
  'std': exports.defaultTemplate,
  'sum': exports.defaultTemplate,
  'var': '\\mathrm{Var}\\left(${args}\\right)',

  //trigonometry
  'acosh': '\\cosh^{-1}\\left(${args[0]}\\right)',
  'acos': '\\cos^{-1}\\left(${args[0]}\\right)',
  'acoth': '\\coth^{-1}\\left(${args[0]}\\right)',
  'acot': '\\cot^{-1}\\left(${args[0]}\\right)',
  'acsch': '\\mathrm{csch}^{-1}\\left(${args[0]}\\right)',
  'acsc': '\\csc^{-1}\\left(${args[0]}\\right)',
  'asech': '\\mathrm{sech}^{-1}\\left(${args[0]}\\right)',
  'asec': '\\sec^{-1}\\left(${args[0]}\\right)',
  'asinh': '\\sinh^{-1}\\left(${args[0]}\\right)',
  'asin': '\\sin^{-1}\\left(${args[0]}\\right)',
  'atan2': '\\mathrm{atan2}\\left(${args}\\right)',
  'atanh': '\\tanh^{-1}\\left(${args[0]}\\right)',
  'atan': '\\tan^{-1}\\left(${args[0]}\\right)',
  'cosh': '\\cosh\\left(${args[0]}\\right)',
  'cos': '\\cos\\left(${args[0]}\\right)',
  'coth': '\\coth\\left(${args[0]}\\right)',
  'cot': '\\cot\\left(${args[0]}\\right)',
  'csch': '\\mathrm{csch}\\left(${args[0]}\\right)',
  'csc': '\\csc\\left(${args[0]}\\right)',
  'sech': '\\mathrm{sech}\\left(${args[0]}\\right)',
  'sec': '\\sec\\left(${args[0]}\\right)',
  'sinh': '\\sinh\\left(${args[0]}\\right)',
  'sin': '\\sin\\left(${args[0]}\\right)',
  'tanh': '\\tanh\\left(${args[0]}\\right)',
  'tan': '\\tan\\left(${args[0]}\\right)',

  //units
  'to': '\\left(${args[0]}' + exports.operators['to'] + '${args[1]}\\right)',

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
