const math = require('..')
function symval (expr, scope = {}) {
  return math.simplify(
    expr, [
      'n1-n2 -> n1+(-n2)',
      'n1/n2 -> n1*n2^(-1)',
      math.simplify.simplifyConstant,
      'n1*n2^(-1) -> n1/n2',
      'n1+(-n2) -> n1-n2'
    ],
    scope, {
      unwrapConstants: true
    }
  )
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
  let result = symval(expr, scope)
  if (math.isNode(result)) {
    result = `Expression ${result.toString()}`
  }
  console.log(`  --> ${result}`)
}

let point = 1
console.log(`${point++}. By just simplifying constants as fully as possible, using
the scope as necessary, we create a sort of "symbolic" evaluation:`)
logExample('x*y + 3x - y + 2', { y: 7 })
console.log(`
${point++}. If all of the free variables have values, this evaluates
all the way to the numeric value:`)
logExample('x*y + 3x - y + 2', { x: 1, y: 7 })
console.log(`
${point++}. It works with matrices as well, for example`)
logExample('[x^2 + 3x + x*y, y, 12]', { x: 2 })
logExample('[x^2 + 3x + x*y, y, 12]', { x: 2, y: 7 })
console.log(`(Note all the fractions because currently simplifyConstant prefers
them. That preference could be tweaked for this purpose.)

${point++}. This lets you more easily perform operations like symbolic differentiation:`)
logExample('derivative(sin(x) + exp(x) + x^3, x)')
console.log("(Note no quotes in the argument to 'derivative' -- it is directly\n" +
  'operating on the expression, without any string values involved.)')

console.log(`
${point++}. You can also build up expressions incrementally:`)
logExample('derivative(h3,x)', {
  h3: symval('h1+h2'),
  h1: symval('x^2+3x'),
  h2: symval('3x+7')
})
console.log(`
${point++}. Some kinks still remain at the moment. The scope is not affected
by assignment expressions, and scope values for the variable of differentiation
disrupt the results:`)
logExample('derivative(x^3 + x^2, x)')
logExample('derivative(x^3 + x^2, x)', { x: 1 })
console.log(`${''}(We'd like the latter evaluation to return the result of the
first differentiation, evaluated at 1, or namely 5. However, there is not (yet)
a concept in mathjs (specifically in 'resolve') that  'derivative' creates a
variable-binding environment, blocking off the 'x' from being substituted via
the outside scope within its first argument.)

But such features can be implemented.`)
