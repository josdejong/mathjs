export const resolveDocs = {
  name: 'resolve',
  category: 'Algebra',
  syntax: [
    'resolve(node, scope)'
  ],
  description: 'Recursively substitute variables in an expression tree.',
  examples: [
    'resolve(parse("1 + x"), { x: 7 })',
    'resolve(parse("size(text)"), { text: "Hello World" })',
    'resolve(parse("x + y"), { x: parse("3z") })',
    'resolve(parse("3x"), { x: parse("y+z"), z: parse("w^y") })'
  ],
  seealso: [
    'simplify', 'evaluate'
  ],
  mayThrow: [
    'ReferenceError'
  ]
}
