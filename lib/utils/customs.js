/**
 * Get a property of an object and check whether the property value is
 * safe and allowed. When the returned value is for example Function,
 * an error is thrown.
 * @param {Object} object
 * @param {String} prop
 * @return {*} Returns the property value when safe, else throws an error
 */
function getSafeProperty (object, prop) {
  if (prop === 'constructor' || prop === '__proto__') {
    throw new Error('Access to property "' + prop + '" is disabled');
  }

  var value = object[prop];

  if (value === Function || value === Object) {
    throw new Error('Access to "' + value.name + '" is disabled');
  }

  return value;
}

exports.getSafeProperty = getSafeProperty;
