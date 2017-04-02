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

exports.getSafeValue = getSafeValue
