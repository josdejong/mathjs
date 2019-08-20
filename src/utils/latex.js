/* eslint no-template-curly-in-string: "off" */

import escapeLatexLib from 'escape-latex'
import { hasOwnProperty } from './object'

export const latexSymbols = {
  // GREEK LETTERS
  Alpha: 'A',
  alpha: '\\alpha',
  Beta: 'B',
  beta: '\\beta',
  Gamma: '\\Gamma',
  gamma: '\\gamma',
  Delta: '\\Delta',
  delta: '\\delta',
  Epsilon: 'E',
  epsilon: '\\epsilon',
  varepsilon: '\\varepsilon',
  Zeta: 'Z',
  zeta: '\\zeta',
  Eta: 'H',
  eta: '\\eta',
  Theta: '\\Theta',
  theta: '\\theta',
  vartheta: '\\vartheta',
  Iota: 'I',
  iota: '\\iota',
  Kappa: 'K',
  kappa: '\\kappa',
  varkappa: '\\varkappa',
  Lambda: '\\Lambda',
  lambda: '\\lambda',
  Mu: 'M',
  mu: '\\mu',
  Nu: 'N',
  nu: '\\nu',
  Xi: '\\Xi',
  xi: '\\xi',
  Omicron: 'O',
  omicron: 'o',
  Pi: '\\Pi',
  pi: '\\pi',
  varpi: '\\varpi',
  Rho: 'P',
  rho: '\\rho',
  varrho: '\\varrho',
  Sigma: '\\Sigma',
  sigma: '\\sigma',
  varsigma: '\\varsigma',
  Tau: 'T',
  tau: '\\tau',
  Upsilon: '\\Upsilon',
  upsilon: '\\upsilon',
  Phi: '\\Phi',
  phi: '\\phi',
  varphi: '\\varphi',
  Chi: 'X',
  chi: '\\chi',
  Psi: '\\Psi',
  psi: '\\psi',
  Omega: '\\Omega',
  omega: '\\omega',
  // logic
  true: '\\mathrm{True}',
  false: '\\mathrm{False}',
  // other
  i: 'i', // TODO use \i ??
  inf: '\\infty',
  Inf: '\\infty',
  infinity: '\\infty',
  Infinity: '\\infty',
  oo: '\\infty',
  lim: '\\lim',
  undefined: '\\mathbf{?}'
}

export const latexOperators = {
  transpose: '^\\top',
  ctranspose: '^H',
  factorial: '!',
  pow: '^',
  dotPow: '.^\\wedge', // TODO find ideal solution
  unaryPlus: '+',
  unaryMinus: '-',
  bitNot: '\\~', // TODO find ideal solution
  not: '\\neg',
  multiply: '\\cdot',
  divide: '\\frac', // TODO how to handle that properly?
  dotMultiply: '.\\cdot', // TODO find ideal solution
  dotDivide: '.:', // TODO find ideal solution
  mod: '\\mod',
  add: '+',
  subtract: '-',
  to: '\\rightarrow',
  leftShift: '<<',
  rightArithShift: '>>',
  rightLogShift: '>>>',
  equal: '=',
  unequal: '\\neq',
  smaller: '<',
  larger: '>',
  smallerEq: '\\leq',
  largerEq: '\\geq',
  bitAnd: '\\&',
  bitXor: '\\underline{|}',
  bitOr: '|',
  and: '\\wedge',
  xor: '\\veebar',
  or: '\\vee'
}

export const latexFunctions = {
  // arithmetic
  abs: { 1: '\\left|${args[0]}\\right|' },
  add: { 2: `\\left(\${args[0]}${latexOperators.add}\${args[1]}\\right)` },
  cbrt: { 1: '\\sqrt[3]{${args[0]}}' },
  ceil: { 1: '\\left\\lceil${args[0]}\\right\\rceil' },
  cube: { 1: '\\left(${args[0]}\\right)^3' },
  divide: { 2: '\\frac{${args[0]}}{${args[1]}}' },
  dotDivide: { 2: `\\left(\${args[0]}${latexOperators.dotDivide}\${args[1]}\\right)` },
  dotMultiply: { 2: `\\left(\${args[0]}${latexOperators.dotMultiply}\${args[1]}\\right)` },
  dotPow: { 2: `\\left(\${args[0]}${latexOperators.dotPow}\${args[1]}\\right)` },
  exp: { 1: '\\exp\\left(${args[0]}\\right)' },
  expm1: `\\left(e${latexOperators.pow}{\${args[0]}}-1\\right)`,
  fix: { 1: '\\mathrm{${name}}\\left(${args[0]}\\right)' },
  floor: { 1: '\\left\\lfloor${args[0]}\\right\\rfloor' },
  gcd: '\\gcd\\left(${args}\\right)',
  hypot: '\\hypot\\left(${args}\\right)',
  log: {
    1: '\\ln\\left(${args[0]}\\right)',
    2: '\\log_{${args[1]}}\\left(${args[0]}\\right)'
  },
  log10: { 1: '\\log_{10}\\left(${args[0]}\\right)' },
  log1p: {
    1: '\\ln\\left(${args[0]}+1\\right)',
    2: '\\log_{${args[1]}}\\left(${args[0]}+1\\right)'
  },
  log2: '\\log_{2}\\left(${args[0]}\\right)',
  mod: { 2: `\\left(\${args[0]}${latexOperators.mod}\${args[1]}\\right)` },
  multiply: { 2: `\\left(\${args[0]}${latexOperators.multiply}\${args[1]}\\right)` },
  norm: {
    1: '\\left\\|${args[0]}\\right\\|',
    2: undefined // use default template
  },
  nthRoot: { 2: '\\sqrt[${args[1]}]{${args[0]}}' },
  nthRoots: { 2: '\\{y : $y^{args[1]} = {${args[0]}}\\}' },
  pow: { 2: `\\left(\${args[0]}\\right)${latexOperators.pow}{\${args[1]}}` },
  round: {
    1: '\\left\\lfloor${args[0]}\\right\\rceil',
    2: undefined // use default template
  },
  sign: { 1: '\\mathrm{${name}}\\left(${args[0]}\\right)' },
  sqrt: { 1: '\\sqrt{${args[0]}}' },
  square: { 1: '\\left(${args[0]}\\right)^2' },
  subtract: { 2: `\\left(\${args[0]}${latexOperators.subtract}\${args[1]}\\right)` },
  unaryMinus: { 1: `${latexOperators.unaryMinus}\\left(\${args[0]}\\right)` },
  unaryPlus: { 1: `${latexOperators.unaryPlus}\\left(\${args[0]}\\right)` },

  // bitwise
  bitAnd: { 2: `\\left(\${args[0]}${latexOperators.bitAnd}\${args[1]}\\right)` },
  bitNot: { 1: latexOperators.bitNot + '\\left(${args[0]}\\right)' },
  bitOr: { 2: `\\left(\${args[0]}${latexOperators.bitOr}\${args[1]}\\right)` },
  bitXor: { 2: `\\left(\${args[0]}${latexOperators.bitXor}\${args[1]}\\right)` },
  leftShift: { 2: `\\left(\${args[0]}${latexOperators.leftShift}\${args[1]}\\right)` },
  rightArithShift: { 2: `\\left(\${args[0]}${latexOperators.rightArithShift}\${args[1]}\\right)` },
  rightLogShift: { 2: `\\left(\${args[0]}${latexOperators.rightLogShift}\${args[1]}\\right)` },

  // combinatorics
  bellNumbers: { 1: '\\mathrm{B}_{${args[0]}}' },
  catalan: { 1: '\\mathrm{C}_{${args[0]}}' },
  stirlingS2: { 2: '\\mathrm{S}\\left(${args}\\right)' },

  // complex
  arg: { 1: '\\arg\\left(${args[0]}\\right)' },
  conj: { 1: '\\left(${args[0]}\\right)^*' },
  im: { 1: '\\Im\\left\\lbrace${args[0]}\\right\\rbrace' },
  re: { 1: '\\Re\\left\\lbrace${args[0]}\\right\\rbrace' },

  // logical
  and: { 2: `\\left(\${args[0]}${latexOperators.and}\${args[1]}\\right)` },
  not: { 1: latexOperators.not + '\\left(${args[0]}\\right)' },
  or: { 2: `\\left(\${args[0]}${latexOperators.or}\${args[1]}\\right)` },
  xor: { 2: `\\left(\${args[0]}${latexOperators.xor}\${args[1]}\\right)` },

  // matrix
  cross: { 2: '\\left(${args[0]}\\right)\\times\\left(${args[1]}\\right)' },
  ctranspose: { 1: `\\left(\${args[0]}\\right)${latexOperators.ctranspose}` },
  det: { 1: '\\det\\left(${args[0]}\\right)' },
  dot: { 2: '\\left(${args[0]}\\cdot${args[1]}\\right)' },
  expm: { 1: '\\exp\\left(${args[0]}\\right)' },
  inv: { 1: '\\left(${args[0]}\\right)^{-1}' },
  sqrtm: { 1: `{\${args[0]}}${latexOperators.pow}{\\frac{1}{2}}` },
  trace: { 1: '\\mathrm{tr}\\left(${args[0]}\\right)' },
  transpose: { 1: `\\left(\${args[0]}\\right)${latexOperators.transpose}` },

  // probability
  combinations: { 2: '\\binom{${args[0]}}{${args[1]}}' },
  combinationsWithRep: { 2: '\\left(\\!\\!{\\binom{${args[0]}}{${args[1]}}}\\!\\!\\right)' },
  factorial: { 1: `\\left(\${args[0]}\\right)${latexOperators.factorial}` },
  gamma: { 1: '\\Gamma\\left(${args[0]}\\right)' },

  // relational
  equal: { 2: `\\left(\${args[0]}${latexOperators.equal}\${args[1]}\\right)` },
  larger: { 2: `\\left(\${args[0]}${latexOperators.larger}\${args[1]}\\right)` },
  largerEq: { 2: `\\left(\${args[0]}${latexOperators.largerEq}\${args[1]}\\right)` },
  smaller: { 2: `\\left(\${args[0]}${latexOperators.smaller}\${args[1]}\\right)` },
  smallerEq: { 2: `\\left(\${args[0]}${latexOperators.smallerEq}\${args[1]}\\right)` },
  unequal: { 2: `\\left(\${args[0]}${latexOperators.unequal}\${args[1]}\\right)` },

  // special
  erf: { 1: 'erf\\left(${args[0]}\\right)' },

  // statistics
  max: '\\max\\left(${args}\\right)',
  min: '\\min\\left(${args}\\right)',
  variance: '\\mathrm{Var}\\left(${args}\\right)',

  // trigonometry
  acos: { 1: '\\cos^{-1}\\left(${args[0]}\\right)' },
  acosh: { 1: '\\cosh^{-1}\\left(${args[0]}\\right)' },
  acot: { 1: '\\cot^{-1}\\left(${args[0]}\\right)' },
  acoth: { 1: '\\coth^{-1}\\left(${args[0]}\\right)' },
  acsc: { 1: '\\csc^{-1}\\left(${args[0]}\\right)' },
  acsch: { 1: '\\mathrm{csch}^{-1}\\left(${args[0]}\\right)' },
  asec: { 1: '\\sec^{-1}\\left(${args[0]}\\right)' },
  asech: { 1: '\\mathrm{sech}^{-1}\\left(${args[0]}\\right)' },
  asin: { 1: '\\sin^{-1}\\left(${args[0]}\\right)' },
  asinh: { 1: '\\sinh^{-1}\\left(${args[0]}\\right)' },
  atan: { 1: '\\tan^{-1}\\left(${args[0]}\\right)' },
  atan2: { 2: '\\mathrm{atan2}\\left(${args}\\right)' },
  atanh: { 1: '\\tanh^{-1}\\left(${args[0]}\\right)' },
  cos: { 1: '\\cos\\left(${args[0]}\\right)' },
  cosh: { 1: '\\cosh\\left(${args[0]}\\right)' },
  cot: { 1: '\\cot\\left(${args[0]}\\right)' },
  coth: { 1: '\\coth\\left(${args[0]}\\right)' },
  csc: { 1: '\\csc\\left(${args[0]}\\right)' },
  csch: { 1: '\\mathrm{csch}\\left(${args[0]}\\right)' },
  sec: { 1: '\\sec\\left(${args[0]}\\right)' },
  sech: { 1: '\\mathrm{sech}\\left(${args[0]}\\right)' },
  sin: { 1: '\\sin\\left(${args[0]}\\right)' },
  sinh: { 1: '\\sinh\\left(${args[0]}\\right)' },
  tan: { 1: '\\tan\\left(${args[0]}\\right)' },
  tanh: { 1: '\\tanh\\left(${args[0]}\\right)' },

  // unit
  to: { 2: `\\left(\${args[0]}${latexOperators.to}\${args[1]}\\right)` },

  // utils
  numeric: function (node, options) {
    // Not sure if this is strictly right but should work correctly for the vast majority of use cases.
    return node.args[0].toTex()
  },

  // type
  number: {
    0: '0',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(\\left(${args[0]}\\right)${args[1]}\\right)'
  },
  string: {
    0: '\\mathtt{""}',
    1: '\\mathrm{string}\\left(${args[0]}\\right)'
  },
  bignumber: {
    0: '0',
    1: '\\left(${args[0]}\\right)'
  },
  complex: {
    0: '0',
    1: '\\left(${args[0]}\\right)',
    2: `\\left(\\left(\${args[0]}\\right)+${latexSymbols.i}\\cdot\\left(\${args[1]}\\right)\\right)`
  },
  matrix: {
    0: '\\begin{bmatrix}\\end{bmatrix}',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(${args[0]}\\right)'
  },
  sparse: {
    0: '\\begin{bsparse}\\end{bsparse}',
    1: '\\left(${args[0]}\\right)'
  },
  unit: {
    1: '\\left(${args[0]}\\right)',
    2: '\\left(\\left(${args[0]}\\right)${args[1]}\\right)'
  }

}

export const defaultTemplate = '\\mathrm{${name}}\\left(${args}\\right)'

const latexUnits = {
  deg: '^\\circ'
}

export function escapeLatex (string) {
  return escapeLatexLib(string, { preserveFormatting: true })
}

// @param {string} name
// @param {boolean} isUnit
export function toSymbol (name, isUnit) {
  isUnit = typeof isUnit === 'undefined' ? false : isUnit
  if (isUnit) {
    if (hasOwnProperty(latexUnits, name)) {
      return latexUnits[name]
    }

    return '\\mathrm{' + escapeLatex(name) + '}'
  }

  if (hasOwnProperty(latexSymbols, name)) {
    return latexSymbols[name]
  }

  return escapeLatex(name)
}
