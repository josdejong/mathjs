// This example demonstrates importing a custom data type,
// and extending an existing function (add) with support for this data type.

const { create, factory, all } = require('../..')
const math = create(all)

// factory function which defines a new data type CustomValue
const createCustomValue = factory('CustomValue', ['typed'], ({ typed }) => {
  // create a new data type
  function CustomValue (value) {
    this.value = value
  }
  CustomValue.prototype.isCustomValue = true
  CustomValue.prototype.toString = function () {
    return 'CustomValue:' + this.value
  }

  // define a new data type with typed-function
  typed.addType({
    name: 'CustomValue',
    test: function (x) {
      // test whether x is of type CustomValue
      return x && x.isCustomValue === true
    }
  })

  return CustomValue
})

// function add which can add the CustomValue data type
// When imported in math.js, the existing function `add` with support for
// CustomValue, because both implementations are typed-functions and do not
// have conflicting signatures.
const createAddCustomValue = factory('add', ['typed', 'CustomValue'], ({ typed, CustomValue }) => {
  return typed('add', {
    'CustomValue, CustomValue': function (a, b) {
      return new CustomValue(a.value + b.value)
    }
  })
})

// import the new data type and function
math.import([
  createCustomValue,
  createAddCustomValue
])

// use the new type
const ans1 = math.add(new math.CustomValue(2), new math.CustomValue(3))
console.log(ans1.toString())
// outputs 'CustomValue:5'

// you can automatically use the new type in functions which use `add` under the hood:
const ans2 = math.sum(new math.CustomValue(6), new math.CustomValue(1), new math.CustomValue(2))
console.log(ans2.toString())
// outputs 'CustomValue:9'
