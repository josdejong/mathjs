module.exports = function (math) {
  var util = require('../../util/index'),

      Scope = require('../../expression/Scope'),
      OperatorNode = require('../../expression/node/OperatorNode'),
      SymbolNode = require('../../expression/node/SymbolNode'),
      collection = require('../../type/collection'),
      isString = util.string.isString,
      isNumber = util.number.isNumber,
      isCollection = collection.isCollection;

  /**
   * Pretty print an expression.
   *
   * Syntax:
   *
   *     math.prettyprint(expr)
   *     math.prettyprint(expr, scope)
   *     math.prettyprint([expr1, expr2, expr3, ...])
   *     math.prettyprint([expr1, expr2, expr3, ...], scope)
   *
   * Example:
   *
   *     math.prettyprint('x^x^(x+1)');            // "x^x^(x + 1)"
   *
   *     var scope = {a:3}
   *     math.prettyprint('a * x', scope);         // "3x"
   *
   *     scope = {a:1, b: 0}
   *     math.prettyprint('a * x + b * x', scope); // "x"
   *
   *
   *
   * @param {String | String[] | Matrix} expr
   * @param {Scope | Object} [scope]
   * @return {*} res
   * @throws {Error}
   */
  math.prettyprint = function _eval (expr, scope) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new util.error.ArgumentsError('prettyprint', arguments.length, 1, 2);
    }

    // instantiate a scope
    var prettyprintScope;
    if (scope) {
      if (scope instanceof Scope) {
        prettyprintScope = scope;
      }
      else {
        prettyprintScope = new Scope(math, scope);
      }
    }
    else {
      prettyprintScope = new Scope(math);
    }

    if (isString(expr)) {
      // prettyprint a single expression
      var node = math.parse(expr, prettyprintScope);
      enablePretty(node)
      return node.expr.toString();
    }
    else if (isCollection(expr)) {
      // prettyprint an array or matrix with expressions
      return collection.deepMap(expr, function (elem) {
        var node = math.parse(elem, prettyprintScope);
        return node.expr.toString;
      });
    }
    else {
      // oops
      throw new TypeError('String or matrix expected');
    }
  };

  function operatorNodetoString () {
    /*
     * Replaces OperatorNode.prototype.toString
     * so that when toString is called this
     * instance function is called instead.
     */
    var params = this.params;
    var lprec = ["+","-"] // lower precendence

    switch (params.length) {
      case 1:
      if (this.name == '-') {
        // special case: unary minus
        return '-' + params[0].toString();
      }
      else {
        // for example '5!'
        return params[0].toString() + this.name;
      }

      case 2: // for example '2+3'
      var lhs = params[0].toString()
        , rhs = params[1].toString()
        , spc = " "

      /*
       * DEAL WITH 1's and 0's
       * want 1 * x -> x
       * x * 1 -> x
       * 1 * 1 -> 1
       * 0 * x -> "0"
       * sin(x) * 0 -> "0"
       */
      if (lhs === "1" && this.name === "*")
        return rhs;

      if (rhs === "1" && this.name === "*")
        return lhs;

      if (lhs === "0")
        return (precedence(this) === 8) ? rhs : "0";

      if (rhs === "0")
        return (precedence(this) === 8) ? lhs : "0";

      /*
       * DEAL WITH MULTIPLICATIONS
       * 3 * x -> 3x
       * x * 3 -> 3x
       * 3 * 3 -> 3 * 3
       * x * x -> x * x
       */
      if (this.name === "*") {
        if (!isNaN(lhs) !== !isNaN(rhs)) {

          if (!isNaN(lhs) && (params[1] instanceof SymbolNode))
            return lhs + rhs;

          if (!isNaN(rhs) && (params[0] instanceof SymbolNode))
            return rhs + lhs;
        }
      }

      /*
       * determine precedence of this
       * node and adjacent nodes.
       */
      if (this.name === "^")
        spc = ""

      if (params[0] instanceof OperatorNode) {

        if (precedence(this) >= precedence(params[0]))
          lhs = lhs;
        else
          lhs = "(" + lhs + ")";
      }

      if (params[1] instanceof OperatorNode) {

        if (precedence(this) >= precedence(params[1]))
          rhs = rhs;
        else
          rhs = "(" + rhs + ")";
      }

      return lhs + spc + this.name + spc + rhs;

      default: // this should occur. format as a function call
      return this.name + '(' + this.params.join(', ') + ')';

    }

  };


  function symbolNodetoString () {
    var value = this.scope.symbols[this.name]
    if (isNumber(value))
      return value.toString()
    else
      return this.name
  }

  function enablePretty (node) {
    /**
     * Over-ride Object.prototype.toString
     * method with an Object.toString method.
     *
     */
    var operators = node.find({
      type: OperatorNode
    });

    var symbols = node.find({
      type: SymbolNode
    });

    operators.forEach( function (o) {
      o.toString = operatorNodetoString
    })

    symbols.forEach( function (o) {
      o.toString = symbolNodetoString
    })


  };



  function precedence (node) {
    /*
     * Precendence hack for deciding if we
     * should pretty print brackets or not.
     */
    var prec = null;
    var precs = {
      "^" :1    // power
    , "!" :2    // factorial
    , "'" :3    // transpose
    , ":" :4    // range [GUESSING AT THIS]
    , "/" :5    // divide
    , "./":5    // element-wise divide
    , "*" :6    // multiply
    , ".*":6    // element-wise multiply
    , "%" :7    // mod
    , "+" :8    // add
    , "-" :8    // subtract
    , "in":9    // unit conversion
    , "<" :10   // smaller
    , ">" :10   // larger
    , "<=":10   // smaller or equal to
    , ">=":10   // larger or equal to
    , "==":11   // equal to
    , "!=":11   // unequal
    , "=" :12   // assignment
    }
    if (node.name)
      prec = precs[node.name]

    return prec
  }

};
