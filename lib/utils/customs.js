/**
 * Get a property of an object and check whether the property value is
 * safe and allowed. When the returned value is for example Function,
 * an error is thrown.
 * @param {Object} object
 * @param {String} prop
 * @return {*} Returns the property value when safe, else throws an error
 */
function getSafeProperty (object, prop) {
  // Note: checking for property names like "constructor" is not
  // helpful since you can work around it.

  var value = object[prop];

  if (value === Function || value === Object || value === Function.bind) {
    throw new Error('Access to "' + value.name + '" is disabled');
  }

  return value;
}

exports.getSafeProperty = getSafeProperty;
