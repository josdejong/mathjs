import math from '../src/defaultInstance.js'

math.SymbolNode.onUndefinedSymbol = (name, node) => node

math.typed.onMismatch = (name, args, signatures) => {
  let nodeArg = false
  for (const arg of args) {
    if (math.isNode(arg)) {
      nodeArg = true
      break
    }
  }
  if (nodeArg) {
    const specialOps = { addScalar: 'add', multiplyScalar: 'multiply' }
    if (name in specialOps) name = specialOps[name]
    const maybeOp = math.OperatorNode.getOperator(name)
    const newArgs = Array.from(args, arg => math.simplify.ensureNode(arg))
    if (maybeOp) return new math.OperatorNode(maybeOp, name, newArgs)
    return new math.FunctionNode(new math.SymbolNode(name), newArgs)
  }

  let argstr = args[0].toString()
  for (let i = 1; i < args.length; ++i) {
    argstr += `, ${args[i]}`
  }

  throw TypeError(`Typed function type mismatch for ${name} called with '${argstr}'`)
}

function mystringify (obj) {
  let s = '{'
  for (const key in obj) {
    s += `${key}: ${obj[key]}, `
  }
  return s.slice(0, -2) + '}'
}

function logExample (expr, scope = {}) {
  let header = `Evaluating: '${expr}'`
  if (Object.keys(scope).length > 0) {
    header += ` in scope ${mystringify(scope)}`
  }
  console.log(header)
  let result
  try {
    result = math.evaluate(expr, scope)
    if (math.isNode(result)) {
      result = `Expression ${result.toString()}`
    }
  } catch (err) {
    result = err.toString()
  }
  console.log(`  --> ${result}`)
}

let point = 1
console.log(`${point++}. By just evaluating all unknown symbols to themselves, and
providing a typed-function handler that builds expression trees when there is
no matching signature, we implement full-fledged symbolic evaluation:`)
logExample('x*y + 3x - y + 2', { y: 7 })
console.log(`
${point++}. If all of the free variables have values, this evaluates
all the way to the numeric value:`)
logExample('x*y + 3x - y + 2', { x: 1, y: 7 })
console.log(`
${point++}. It works with matrices as well, for example.`)
logExample('[x^2 + 3x + x*y, y, 12]', { x: 2 })
logExample('[x^2 + 3x + x*y, y, 12]', { x: 2, y: 7 })
console.log(`(Note there are no fractions as in the simplifyConstant
version, since we are using ordinary 'math.evaluate()' in this approach.)

${point++}. However, to break a chain of automatic conversions that disrupts
this style of evaluation, it's necessary to remove the former conversion
from 'number' to 'string':`)
logExample('count(57)')
console.log(`(In develop, this returns 2, the length of the string representation
of 57. However, it turns out that with only very slight tweaks to "Unit," 
all tests pass without the automatic 'number' -> 'string' conversion,
suggesting it isn't really being used, or at least very little.

${point++}. This lets you more easily perform operations like symbolic differentiation:`)
logExample('derivative(sin(x) + exp(x) + x^3, x)')
console.log("(Note no quotes in the argument to 'derivative' -- it is directly\n" +
  'operating on the expression, without any string values involved.)')

console.log(`
${point++}. Doing it this way respects assignment, since ordinary evaluate does:`)
logExample('f = x^2+2x*y; derivative(f,x)')
console.log(`
${point++}. You can also build up expressions incrementally and use the scope:`)
logExample('h1 = x^2+5x; h3 = h1 + h2; derivative(h3,x)', {
  h2: math.evaluate('3x+7')
})
console.log(`
${point++}. Some kinks still remain at the moment. Scope values for the
variable of differentiation disrupt the results:`)
logExample('derivative(x^3 + x^2, x)')
logExample('derivative(x^3 + x^2, x)', { x: 1 })
console.log(`${''}(We'd like the latter evaluation to return the result of the
first differentiation, evaluated at 1, or namely 5. However, there is not (yet)
a concept in math.evaluate that  'derivative' creates a variable-binding
environment, blocking off the 'x' from being substituted via the outside
scope within its first argument. Implementing this may be slightly trickier
in this approach since ordinary 'evaluate' (in the absence of 'rawArgs'
markings) is an essentially "bottom-up" operation whereas 'math.resolve' is
more naturally a "top-down" operation. The point is you need to know you're
inside a 'derivative' or other binding environment at the time that you do
substitution.)

Also, unlike the simplifyConstant approach, derivative doesn't know to
'check' whether a contained variable actually depends on 'x', so the order
of assignments makes a big difference:`)
logExample('h3 = h1+h2; h1 = x^2+5x; derivative(h3,x)', {
  h2: math.evaluate('3x+7')
})
console.log(`${''}(Here, 'h1' in the first assignment evaluates to a
SymbolNode('h1'), which ends up being part of the argument to the eventual
derivative call, and there's never anything to fill in the later definition
of 'h1', and as it's a different symbol, its derivative with respect to 'x'
is assumed to be 0.)

Nevertheless, such features could be implemented.`)
