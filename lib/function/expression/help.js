module.exports = function (math) {
  var util = require('../../util/index.js'),

      Help = require('../../type/Help.js');

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
        if (math.hasOwnProperty(prop)) {
          if (search === math[prop]) {
            text = prop;
            break;
          }
        }
      }

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
    }

    if (!text) {
      throw new Error('Could not find search term "' + search + '"');
    }
    else {
      var doc = math.expression.docs[text];
      if (!doc) {
        throw new Error('No documentation found on "' + text + '"');
      }
      return new Help(math, doc);
    }
  };
};
