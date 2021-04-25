const { create, all } = require('../..')

const math = create(all)

// The expression evaluator accepts an optional scope object.
// This is the symbol table for variable defintions and function declations.

// Scope can be a bare object.
function withObjectScope () {
  const scope = { x: 1 }

  math.evaluate('x', scope) // 1
  math.evaluate('y = x', scope)
  math.evaluate('area(length, width) = length * width', scope)

  console.log('Object scope:', scope)
}

// Where safety is important, scope can also be a Map
function withPlainMapScope () {
  const scope = new Map()
  scope.set('x', 1)

  math.evaluate('x', scope) // 1
  math.evaluate('y = x', scope)
  math.evaluate('area(length, width) = length * width', scope)

  console.log('Map scope:', scope)
}

// Where flexibility is important, scope can duck type appear to be a Map.
function withMapScope () {
  const scope = new MapScope()
  scope.set('x', 1)

  math.evaluate('x', scope) // 1
  math.evaluate('y = x', scope)
  math.evaluate('area(length, width) = length * width', scope)

  console.log('Map-like scope:', scope.localScope)
}

// This is a minimal set of functions to look like a Map.
class MapScope {
  constructor () {
    this.localScope = new Map()
  }

  get (key) {
    // Remember to sanitize your inputs, or use
    // a datastructure that isn't a footgun.
    return this.localScope.get(key)
  }

  set (key, value) {
    return this.localScope.set(key, value)
  }

  has (key) {
    return this.localScope.has(key)
  }

  keys () {
    return this.localScope.keys()
  }
}

withObjectScope()
withPlainMapScope()
withMapScope()
