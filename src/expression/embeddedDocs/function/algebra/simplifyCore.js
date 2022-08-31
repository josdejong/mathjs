export const simplifyCoreDocs = {
  name: 'simplifyCore',
  category: 'Algebra',
  syntax: [
    'simplifyCore(node)'
  ],
  description: 'Perform simple one-pass simplifications on an expression tree.',
  examples: [
    'simplifyCore(parse("0*x"))',
    'simplifyCore(parse("(x+0)*2"))'
  ],
  seealso: [
    'simplify', 'simplifyConstant', 'evaluate'
  ]
}
