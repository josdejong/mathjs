// objects

// load math.js (using node.js)
const { evaluate, format } = require('..')

// create an object. Keys can be symbols or strings
print(evaluate('{x: 2 + 1, y: 4}')) // {"x": 3, "y": 4}
print(evaluate('{"name": "John"}')) // {"name": "John"}

// create an object containing an object
print(evaluate('{a: 2, b: {c: 3, d: 4}}')) // {"a": 2, "b": {"c": 3, "d": 4}}

let scope = {
  obj: {
    prop: 42
  }
}

// retrieve properties using dot notation or bracket notation
print(evaluate('obj.prop', scope)) // 42
print(evaluate('obj["prop"]', scope)) // 42

// set properties (returns the whole object, not the property value!)
print(evaluate('obj.prop = 43', scope)) // 43
print(evaluate('obj["prop"] = 43', scope)) // 43
print(scope.obj) // {"prop": 43}

/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print (value) {
  const precision = 14
  console.log(format(value, precision))
}
