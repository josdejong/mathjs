export const flattenAssociationDocs = {
  name: 'flattenAssociation',
  category: 'Expression',
  syntax: [
    'flattenAssociation(node)',
    'flattenAssociation(node, context)'
  ],
  description: 'Returns a clone of node in which all subtrees of calls ' +
    'to the same associative operator (as determined by context, if ' +
    'supplied) are flattened into a single call with multiple arguments',
  examples: [
    "flattenAssociation(parse('x y z'))",
    "flattenAssociation(parse('2 / 3 / (4 + 5 +6)'), " +
      '{divide: {associative: false}})'
  ],
  seealso: ['simplify', 'simplifyConstant']
}
