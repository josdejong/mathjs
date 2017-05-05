/**
 * Get a unique name for a arguments to store in defs
 * @param {Object} defs
 * @return {string} A string like 'args1', 'args2', ...
 * @private
 */
function getUniqueArgumentsName (defs) {
  var argsName;
  var i = 0;

  do {
    argsName = 'args' + i;
    i++;
  }
  while (argsName in defs);

  return argsName;
}

module.exports = getUniqueArgumentsName;
