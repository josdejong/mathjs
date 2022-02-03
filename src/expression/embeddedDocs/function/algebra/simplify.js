export const simplifyDocs = {
  name: 'simplify',
  category: 'Algebra',
  syntax: [
    'simplify(expr)',
    'simplify(expr, rules)'
  ],
  description: 'Simplify an expression tree.',
  examples: [
    'simplify("3 + 2 / 4")',
    'simplify("2x + x")',
    'f = parse("x * (x + 2 + x)")',
    'simplified = simplify(f)',
    'simplified.evaluate({x: 2})'
  ],
  seealso: [
    'derivative', 'parse', 'evaluate'
  ]
}

export const resolveDocs = {
  name: 'simplify.resolve',
  category: 'Algebra',
  syntax: [
    'simplify.resolve(node, scope)'
  ],
  description: 'Substitute variables in an expression tree.',
  examples: [
    'simplify.resolve(parse("1 + x"), { x: 7 })',
    'simplify.resolve(parse("size(text)"), { text: "Hello World" })',
    'simplify.resolve(parse("x + y"), { x: parse("3z") })'
  ],
  seealso: [
    'simplify', 'evaluate'
  ],
  mayThrow: [
    'ReferenceError'
  ]
}

export const simplifyCoreDocs = {
  name: 'simplify.simplifyCore',
  category: 'Algebra',
  syntax: [
    'simplify.simplifyCore(node)'
  ],
  description: 'Perform simple one-pass simplifications on an expression tree.',
  examples: [
    'simplify.simplifyCore(parse("0*x"))',
    'simplify.simplifyCore(parse("(x+0)*2"))'
  ],
  seealso: [
    'simplify', 'evaluate'
  ]
}
