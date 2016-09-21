"use strict"
/*
  Various utility functions used in the math stepper
 */

const Util = {}

// Adds `value` to a list in `dict`, creating a new list if the key isn't in
// the dictionary yet. Returns the updated dictionary.
Util.appendToArrayInObject = function(dict, key, value) {
  if (dict[key]) {
    dict[key].push(value);
  } else {
    dict[key] = [value];
  }
  return dict;
}


// Prints an expression properly (hopefully mathjs will do this itself soon)
Util.prettyPrint = function(expr) {
  switch (expr.type) {
    case 'OperatorNode':
      let str = prettyPrint(expr.args[0]);
      for (let i = 1; i < expr.args.length; i++) {
        switch (expr.op) {
          case '+':
          case '-':
          case '/':
            str += ' ' + expr.op + ' ';
            break;
          case '*':
            if (!expr.implicit) {
              str += ' ' + expr.op + ' ';
            }
            break;
          case '^':
            str += expr.op;
        }

        str += prettyPrint(expr.args[i]);
      }
      return str;
    case 'ParenthesisNode':
      return "(" + prettyPrint(expr.content) + ")";
    case 'ConstantNode':
    case 'SymbolNode':
      return expr.toString();

  }
}

module.exports = Util;
