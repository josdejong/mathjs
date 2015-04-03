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
  'equal': function (node, callbacks) {
    return '\\left({' + node.args[0].toTex(callbacks)
      + '}={' + node.args[1].toTex(callbacks) + '}\\right)';
  },
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

exports.operators = {
  'transpose': '^{\\top}',
  'factorial': '!',
  'pow': '^',
  'dotPow': '.^{\\wedge}', //TODO
  'unaryPlus': '+',
  'unaryMinus': '-',
  'bitNot': '~', //TODO
  'not': '\\neg',
  'multiply': '\\cdot',
  'divide': '\\frac', //TODO how to handle that?
  'dotMultiply': '.\\cdot', //TODO
  'dotDivide': '.:', //TODO
  'mod': '\\mod', //TODO function call or infix?
  'add': '+',
  'subtract': '-',
  'to': '\\rightarrow',
  'leftShift': '<<',    //TODO how to signify that this isn't a relation?
  'rightArithShift': '>>', //TODO how to signify that this isn't a relation?
  'rightLogShift': '>>>',
  'equal': '=',
  'unequal': '\\neq',
  'smaller': '<',
  'larger': '>',
  'smallerEq': '\\leq',
  'largerEq': '\\geq',
  'bitAnd': '\\&', //TODO
  'bitXor': '\\underline{|}', //TODO
  'bitOr': '|', //TODO
  'and': '\\wedge',
  'xor': '\\veebar',
  'or': '\\vee'
};

var units = {
  deg: '^{\\circ}'
};

//FIXME find a good solution so that single characters still
//get rendered in regular italic whereas single character units
//are rendered with \mathrm
exports.toSymbol = function (name) {
  if (typeof exports.symbols[name] !== 'undefined') {
    return '{' + exports.symbols[name] + '}';
  }
  else if (name.indexOf('_') !== -1) {
    //symbol with index (eg. alpha_1)
    var index = name.indexOf('_');
    return '{' + toSymbol(name.substring(0, index)) + '}_{'
      + toSymbol(name.substring(index + 1)) + '}';
  }
  return '\\mathrm{' + name + '}';
};

//returns the latex output for a given function
exports.toFunction = function (node, callbacks, name) {
  if ((typeof functions[name] !== 'undefined')) {
    return functions[name](node, callbacks);
  }

  //fallback
  return defaultToTex(node, callbacks, name);
}
