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


//create a comma separated list of function arguments
function functionArgs(args, callbacks) {
  return args.map( function (arg) {
    return arg.toTex(callbacks);
  }).join(',');
}

var defaultTemplate = '\\mathrm{%name%}\\left(%*%\\right)';

/*
 * expand a template
 *
 * @param {String} template
 * @param {String} name of the function
 * @param {Array} arguments of the function ( Strings )
 **/
function expandTemplate(template, name, args) {
  //replace %name% with the variable 'name'
  template = template.replace(/%name%/g, name);

  //replace %0%, %1% .... with the arguments in args
  args.forEach(function (arg, index) {
    template = template.replace(RegExp('%' + index + '%', 'g'), arg);
  });

  //replace %*% with a comma separated list of all arguments
  template = template.replace('%*%', args.map(function (arg) {
      return arg;
    }).join(','));

  //replace %% with %, this comes in handy when you need a % in your LaTeX string
  template = template.replace('%%', '%');

  return template;
}

//this is a map containing all the latex converters for all the functions
var functions = {
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
  'fix': defaultTemplate,
  'floor': '\\left\\lfloor%0%\\right\\rfloor',
  'gcd': '\\gcd\\left(%*%\\right)',
  'lcm': defaultTemplate,
  'log10': '\\log_{10}\\left(%0%\\right)',
  'log': {
    1: '\\ln\\left(%0%\\right)',
    2: '\\log_{%1%}\\left(%0%\\right)'
  },
  'mod': '\\left(%0%' + exports.operators['mod'] + '%1%\\right)',
  'multiply': '\\left(%0%' + exports.operators['multiply'] + '%1%\\right)',
  'norm': {
    1: '\\left\\|%0%\\right\\|',
    2: defaultTemplate
  },
  'nthRoot': '\\sqrt[%1%]{%0%}',
  'pow': '\\left(%0%\\right)' + exports.operators['pow'] + '{%1%}',
  'round': {
    1: '\\left\\lfloor%0%\\right\\rceil',
    2: defaultTemplate
  },
  'sign': defaultTemplate,
  'sqrt': '\\sqrt{%0%}',
  'square': '\\left(%0%\\right)^2',
  'subtract': '\\left(%0%' + exports.operators['subtract'] + '%1%\\right)',
  'unaryMinus': exports.operators['unaryMinus'] + '\\left(%0%\\right)',
  'unaryPlus': exports.operators['unaryPlus'] + '\\left(%0%\\right)',
  'xgcd': defaultTemplate,

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
  'boolean': defaultTemplate,
  'chain': defaultTemplate,
  'complex': {
    0: '0',
    1: '\\left(%0%\\right)',
    2: '\\left(\\left(%0%\\right)+'
      + exports.symbols['i'] + '\\cdot\\left(%1%\\right)\\right)',
  },
  'index': defaultTemplate,
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
  'parser': defaultTemplate,
  'string': {
    0: '""',
    1: function (node) {
      return '"' + node.args[0].toString() + '"';
    }
  },
  'unit': {
    1: '\\left(%0%\\right)',
    2: '\\left(\\left(%0%\\right)%1%\\right)'
  },

  //expression TODO does the default even work in this case? (.toTex on the args)
  'compile': defaultTemplate,
  'eval': defaultTemplate,
  'help': defaultTemplate,
  'parse': defaultTemplate,

  //logical
  'and': '\\left(%0%' + exports.operators['and'] + '%1%\\right)',
  'not': exports.operators['not'] + '\\left(%0%\\right)',
  'or': '\\left(%0%' + exports.operators['or'] + '%1%\\right)',
  'xor': '\\left(%0%' + exports.operators['xor'] + '%1%\\right)',

  //matrix
  'concat': defaultTemplate,
  'cross': '\\left(%0%\\right)\\times\\left(%1%\\right)',
  'det': '\\det\\left(%0%\\right)',
  'diag': defaultTemplate,
  'dot': '\\left(%0%\\cdot%1%\\right)',
  'eye': defaultTemplate,
  'flatten': defaultTemplate,
  'inv': '\\left(%0%\\right)^{-1}',
  'ones': defaultTemplate,
  'range': defaultTemplate,
  'resize': defaultTemplate,
  'size': defaultTemplate,
  'squeeze': defaultTemplate,
  'subset': defaultTemplate,
  'trace': '\\mathrm{tr}\\left(%0%\\right)',
  'transpose': '\\left(%0%\\right)' + exports.operators['transpose'],
  'zeros': defaultTemplate,

  //probability
  'combinations': '\\binom{%0%}{%1%}',
  'distribution': defaultTemplate,
  'factorial': '\\left(%0%\\right)' + exports.operators['factorial'],
  'gamma': '\\Gamma\\left(%0%\\right)',
  'permutations': defaultTemplate,
  'pickRandom': defaultTemplate,
  'randomInt': defaultTemplate,
  'random': defaultTemplate,

  //relational
  'compare': defaultTemplate,
  'deepEqual': defaultTemplate,
  'equal': '\\left(%0%' + exports.operators['equal'] + '%1%\\right)',
  'largerEq': '\\left(%0%' + exports.operators['largerEq'] + '%1%\\right)',
  'larger': '\\left(%0%' + exports.operators['larger'] + '%1%\\right)',
  'smallerEq': '\\left(%0%' + exports.operators['smallerEq'] + '%1%\\right)',
  'smaller': '\\left(%0%' + exports.operators['smaller'] + '%1%\\right)',
  'unequal': '\\left(%0%' + exports.operators['unequal'] + '%1%\\right)',

  //statistics
  'max': '\\max\\left(%*%\\right)',
  'mean': defaultTemplate,
  'median': defaultTemplate,
  'min': '\\min\\left(%*%\\right)',
  'prod': defaultTemplate,
  'std': defaultTemplate,
  'sum': defaultTemplate,
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
  'clone': defaultTemplate,
  'filter': defaultTemplate,
  'forEach': defaultTemplate,
  'format': defaultTemplate,
  'import': defaultTemplate,
  'map': defaultTemplate,
  'print': defaultTemplate,
  'sort': defaultTemplate,
  'typeof': defaultTemplate
};

var units = {
  deg: '^\\circ'
};

//FIXME find a good solution so that single characters still
//get rendered in regular italic whereas single character units
//are rendered with \mathrm
exports.toSymbol = function (name) {
  if (units.hasOwnProperty(name)) {
    return units[name];
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
  return '\\mathrm{' + name + '}';
};

//returns the latex output for a given function
exports.toFunction = function (node, callbacks, name) {
  var latexConverter = functions[name];
  var args = node.args.map(function (arg) { //get LaTeX of the arguments
    return arg.toTex(callbacks);
  });

  switch (typeof latexConverter) {
    case 'function': //a callback function
      return latexConverter(node, callbacks);
    case 'string': //a template string
      return expandTemplate(latexConverter, name, args);
    case 'object': //an object with different "converters" for different numbers of arguments
      switch (typeof latexConverter[args.length]) {
        case 'function':
          return latexConverter[args.length](node, callbacks);
        case 'string':
          return expandTemplate(latexConverter[args.length], name, args);
      }
      //no break here! That's intentionally
    default:
      return expandTemplate(defaultTemplate, name, args);
  }
}
