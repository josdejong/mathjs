
// helper function to safely check whether an object as a property
// copy from the function in object.js which is ES6
export function hasOwnProperty (object, property) {
  return object && Object.hasOwnProperty.call(object, property)
}
