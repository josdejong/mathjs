export const reassociateDocs = {
  name: 'reassociate',
  category: 'Expression',
  syntax: [
    'reassociate(node)',
    'reassociate(node, context)',
    'reassociate(node, context, options)'
  ],
  description: 'Within node, reconfigures operators that are associative ' +
    '(as determined by context, if supplied). The desired reconfiguration ' +
    '(default flat, or right or left) is determined by options.direction, ' +
    'and whether to modify or clone node by options.inplace',
  examples: [
    "reassociate(parse('x y z'))",
    "reassociate(parse('2 / 3 / (4+5+6)'), {divide: {associative: false}})",
    "reassociate(parse('add(x,y,z,w)'), undefined, {direction: 'left'})",
    "reassociate(parse('multiply(x,y,z,w)'), undefined, {direction: 'right'})"
  ],
  seealso: ['operatorIs', 'simplify']
}
