module.exports = function (math) {
  var Help = require('../../type/Help');

  /**
   * Retrieve help on a function or data type.
   * Help files are retrieved from the documentation in math.expression.docs.
   * @param {function | string | Object} search
   * @return {Help} help
   */
  math.help = function help(search) {
    if (arguments.length != 1) {
      throw new SyntaxError('Wrong number of arguments in function help ' +
          '(' + arguments.length + ' provided, 1 expected)');
    }

    var text = null;
    if ((search instanceof String) || (typeof(search) === 'string')) {
      text = search;
    }
    else {
      var prop;
      for (prop in math) {
        // search in functions and constants
        if (math.hasOwnProperty(prop) && (search === math[prop])) {
          text = prop;
          break;
        }
      }

      /* TODO: implement help for data types
      if (!text) {
        // search data type
        for (prop in math.type) {
          if (math.type.hasOwnProperty(prop)) {
            if (search === math.type[prop]) {
              text = prop;
              break;
            }
          }
        }
      }
      */
    }

    var doc = math.expression.docs[text];
    if (!text || !doc) {
      throw new Error('No documentation found on "' + text + '"');
    }
    return new Help(math, doc);
  };
};
