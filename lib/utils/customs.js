/**
 * Get a property of an object and check whether the property value is
 * safe and allowed. When the returned value is for example Function,
 * an error is thrown.
 * @param {Object} object
 * @param {String} prop
 * @return {*} Returns the property value when safe, else throws an error
 */
exports.getSafeProperty = function (object, prop) {
  var value = object[prop];

  if (value === Function) {
    throw new Error('Access to "Function" is disabled');
  }

  return value;
}
