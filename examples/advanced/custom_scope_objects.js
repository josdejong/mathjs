import { all, create } from '../../lib/esm/index.js'

const math = create(all)

// The expression evaluator accepts an optional scope Map or object that can
// be used to keep additional variables and functions.

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

  console.log(`Map-like scope (${name}):`, scope)
}

// This is a minimal set of functions to look like a Map.
class CustomMap {
  constructor () {
    this.localScope = new Map()
  }

  get (key) {
    // Remember to sanitize your inputs, or use
    // a datastructure that isn't a footgun.
    return this.localScope.get(key)
  }

  set (key, value) {
    this.localScope.set(key, value)
    return this
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
class AdvancedCustomMap extends CustomMap {
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

  toString () {
    return this.localScope.toString()
  }
}

// Use a plain JavaScript object
withObjectScope()

// use a Map (recommended)
withMapScope(new Map(), 'Map example')

// Use a custom Map implementation
withMapScope(new CustomMap(), 'CustomMap example')

// Use a more advanced custom Map implementation
withMapScope(new AdvancedCustomMap(), 'AdvancedCustomMap example')
