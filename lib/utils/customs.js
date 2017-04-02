/**
 * Test for valid property names
 * @param {String} prop
 * @return {String} Returns the prop when ok, else throws an error
 */
exports.validateProperty = function (prop) {
  if (prop === 'constructor') {
    throw new Error('Access to "Function" is disabled');
  }

  return prop;
}
