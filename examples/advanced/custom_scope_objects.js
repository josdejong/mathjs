const { create, all } = require('../..')

const math = create(all)

// The expression evaluator accepts an optional scope object.
// This is the symbol table for variable defintions and function declations.

// Scope can be a bare object.
function withObjectScope () {
  const scope = { x: 3 }

  math.evaluate('x', scope) // 1
  math.evaluate('y = 2 x', scope)
  math.evaluate('scalar = 1', scope)
  math.evaluate('area(length, width) = length * width * scalar', scope)
  math.evaluate('A = area(x, y)', scope)

  console.log('Object scope:', scope)
}

// Where flexibility is important, scope can duck type appear to be a Map.
function withMapScope (scope, name) {
  scope.set('x', 3)

  math.evaluate('x', scope) // 1
  math.evaluate('y = 2 x', scope)
  math.evaluate('scalar = 1', scope)
  math.evaluate('area(length, width) = length * width * scalar', scope)
  math.evaluate('A = area(x, y)', scope)

  console.log(`Map-like scope (${name}):`, scope.localScope)
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

/*
 * This is a more fully featured example, with all methods
 * used in mathjs.
 *
 */
class AdvancedMapScope extends MapScope {
  constructor (parent) {
    super()
    this.parentScope = parent
  }

  get (key) {
    return this.localScope.get(key) ?? this.parentScope?.get(key)
  }

  has (key) {
    return this.localScope.has(key) ?? this.parentScope?.get(key)
  }

  keys () {
    if (this.parentScope) {
      return new Set([...this.localScope.keys(), ...this.parentScope.keys()])
    } else {
      return this.localScope.keys()
    }
  }

  delete () {
    return this.localScope.delete()
  }

  clear () {
    return this.localScope.clear()
  }

  /**
   * Creates a child scope from this one. This is used in function calls.
   *
   * @returns a new Map scope that has access to the symbols in the parent, but
   * cannot overwrite them.
   */
  createSubScope () {
    return new AdvancedMapScope(this)
  }

  toString () {
    return this.localScope.toString()
  }
}

withObjectScope()
// Where safety is important, scope can also be a Map
withMapScope(new Map(), 'simple Map')
// Where flexibility is important, scope can duck type appear to be a Map.
withMapScope(new MapScope(), 'MapScope example')
// Extra methods allow even finer grain control.
withMapScope(new AdvancedMapScope(), 'AdvancedScope example')
