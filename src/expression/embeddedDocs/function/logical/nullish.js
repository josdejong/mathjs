export const nullishDocs = {
  name: 'nullish',
  category: 'Logical',
  syntax: [
    'x ?? y',
    'nullish(x, y)'
  ],
  description: 'Nullish coalescing operator. Returns the right-hand operand when the left-hand operand is null or undefined, and otherwise returns the left-hand operand.',
  examples: [
    'null ?? 42',
    'undefined ?? 42',
    '0 ?? 42',
    'false ?? 42',
    'null ?? undefined ?? 42'
  ],
  seealso: [
    'and', 'or', 'not'
  ]
}
