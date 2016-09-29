"use strict"
/*
  Various utility functions used in the math stepper
 */
const NodeType = require('./NodeType');

const Util = {}

// Adds `value` to a list in `dict`, creating a new list if the key isn't in
// the dictionary yet. Returns the updated dictionary.
Util.appendToArrayInObject = function(dict, key, value) {
  if (dict[key]) {
    dict[key].push(value);
  }
  else {
    dict[key] = [value];
  }
  return dict;
}


// Prints an expression properly.
// If showPlusMinus is true, print + - (e.g. 2 + -3)
// If it's false (the default) 2 + -3 would print as 2 - 3
// This supports the conversion of subtraction to addition of negative terms,
// which is needed to flatten operands.
Util.prettyPrint = function(expr, showPlusMinus=false) {
  let string = prettyPrintDFS(expr);
  if (showPlusMinus) {
    return string;
  }
  else {
    return string.replace(/\+ \-/g, '- ');
  }
}

function prettyPrintDFS(expr) {
  if (NodeType.isOperator(expr)) {
    let str = prettyPrintDFS(expr.args[0]);
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
      str += prettyPrintDFS(expr.args[i]);
    }
    return str;
  }
  else if (NodeType.isParenthesis(expr)) {
    return "(" + prettyPrintDFS(expr.content) + ")";
  }
  else {
    return expr.toString();
  }
}

module.exports = Util;
