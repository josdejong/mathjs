export const parseDocs = {
  name: 'parse',
  category: 'Expression',
  syntax: [
    'parse(expr)',
    'parse(expr, options)',
    'parse([expr1, expr2, expr3, ...])',
    'parse([expr1, expr2, expr3, ...], options)'
  ],
  description: 'Parse an expression. Returns a node tree, which can be evaluated by invoking node.evaluate() or transformed into a functional object via node.compile().',
  examples: [
    'node1 = parse("sqrt(3^2 + 4^2)")',
    'node1.evaluate()',
    'code1 = node1.compile()',
    'code1.evaluate()',
    'scope = {a: 3, b: 4}',
    'node2 = parse("a * b")',
    'node2.evaluate(scope)',
    'code2 = node2.compile()',
    'code2.evaluate(scope)'
  ],
  seealso: ['parser', 'evaluate', 'compile']
}
