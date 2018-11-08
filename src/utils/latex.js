'use strict'

import escapeLatex from 'escape-latex'

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
  'true': '\\mathrm{True}',
  'false': '\\mathrm{False}',
  // other
  i: 'i', // TODO use \i ??
  inf: '\\infty',
  Inf: '\\infty',
  infinity: '\\infty',
  Infinity: '\\infty',
  oo: '\\infty',
  lim: '\\lim',
  'undefined': '\\mathbf{?}'
}

export const latexOperators = {
  'transpose': '^\\top',
  'ctranspose': '^H',
  'factorial': '!',
  'pow': '^',
  'dotPow': '.^\\wedge', // TODO find ideal solution
  'unaryPlus': '+',
  'unaryMinus': '-',
  'bitNot': '\\~', // TODO find ideal solution
  'not': '\\neg',
  'multiply': '\\cdot',
  'divide': '\\frac', // TODO how to handle that properly?
  'dotMultiply': '.\\cdot', // TODO find ideal solution
  'dotDivide': '.:', // TODO find ideal solution
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
}

export const defaultTemplate = `\\mathrm{\${name}}\\left(\${args}\\right)`

const units = {
  deg: '^\\circ'
}

export function escape (string) {
  return escapeLatex(string, { 'preserveFormatting': true })
}

// @param {string} name
// @param {boolean} isUnit
export function toSymbol (name, isUnit) {
  isUnit = typeof isUnit === 'undefined' ? false : isUnit
  if (isUnit) {
    if (units.hasOwnProperty(name)) {
      return units[name]
    }

    return '\\mathrm{' + escape(name) + '}'
  }

  if (latexSymbols.hasOwnProperty(name)) {
    return latexSymbols[name]
  }

  return escape(name)
}
