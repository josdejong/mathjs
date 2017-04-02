/**
 * Get a property of an object and check whether the property value is
 * safe and allowed. When the returned value is for example Function,
 * an error is thrown.
 * @param {Object} object
 * @param {String} prop
 * @return {*} Returns the property value when safe, else throws an error
 */
function getSafeProperty (object, prop) {
  return getSafeValue(object[prop]);
}

/**
 * Test whether a value is safe to use (i.e. not Function
 * @param {*} value
 * @return {*} Returns the value when safe, else throws an error
 */
function getSafeValue(value) {
  if (value === Function) {
    throw new Error('Access to "Function" is disabled');
  }

  return value;
}

exports.getSafeProperty = getSafeProperty
exports.getSafeValue = getSafeValue
