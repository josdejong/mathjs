'use strict';

function factory (type, config, load, typed) {
  var parse = load(require('../../expression/parse'));
  var ConstantNode    = load(require('../../expression/node/ConstantNode'));
  var FunctionNode    = load(require('../../expression/node/FunctionNode'));
  var OperatorNode    = load(require('../../expression/node/OperatorNode'));
  var ParenthesisNode = load(require('../../expression/node/ParenthesisNode'));
  var SymbolNode      = load(require('../../expression/node/SymbolNode'));

  /**
   * Returns a simplified expression tree. 
   *
   * For more details on the theory:
   *   http://stackoverflow.com/questions/7540227/strategies-for-simplifying-math-expressions
   *   https://en.wikipedia.org/wiki/Symbolic_computation#Simplification
   *
   * Syntax:
   *
   *     simplify(expr)
   *
   * Usage:
   *
   *     math.eval('simplify(2 * 1 * x ^ (2 - 1))')
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} expr
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} The simplified form of `expr`
   */
  var simplify = typed('simplify', {
    'Node': function (expr) {

      var res = removeParens(expr);
      var after = 'foo';
      var before = 'bar';
      while(before != after) {
        var before = after;
        res = _simplify(res);
        var after = res.toString({paranthesis: 'all'});
      }

      console.log("Returning " + after + " from simplify");
      return res;
    }
  });

  function removeParens(node) {
    return node.transform(function(node, path, parent) {
      if(node.isParenthesisNode) {
        return node.content;
      }
      else {
        return node;
      }
    });
  }
    

  // Array of rules to be used to simplify expressions
  var ruleSet = [];

  // Array of strings, used to build the ruleSet.
  // Each l (left side) and r (right side) are parsed by
  // the expression parser into a node tree.
  // Left hand sides are matched to subtrees within the
  // expression to be parsed and replaced with the right
  // hand side.
  // TODO: Add support for constraints on constants (either in the form of a '=' expression or a callback [callback allows things like comparing symbols alphabetically])
  // To evaluate lhs constants for rhs constants, use: { l: "c1+c2", r: "c3", evaluate: "c3 = c1 + c2" }. Multiple assignments are separated by ';' in block format.
  var rules = [
    { l: "v*c",   r: "c*v" },
    { l: "0*n",   r: "0" },
    { l: "c1+c2", r: "c3", evaluate: "c3 = c1 + c2" },
    { l: "c1-c2", r: "c3", evaluate: "c3 = c1 - c2" },
    { l: "c1*c2", r: "c3", evaluate: "c3 = c1 * c2" },
    { l: "n^1", r: "n"},
    { l: "c1*(c2*n3)", r: "(c1*c2)*n3" },
    { l: "(c1*n2)*n3", r: "c1*(n2*n3)" },
    { l: "1*n", r: "n" },
    { l: "n/n", r: "1" },
    { l: "n+n", r: "2*n" },
    { l: "n*n", r: "n^2" },
    { l: "n1*n2 + n2", r: "(n1+1)*n2" },
    { l: "n^n1 * n^n2", r: "n^(n1+n2)" },
    { l: "n^n1 * n", r: "n^(n1+1)" },
    { l: "n * n^n1", r: "n^(n1+1)" },
  ];


  /**
   * Parse the string array of rules into nodes
   * 
   * Example syntax for rules:
   *
   * Position constants to the left in a product:
   * { l: "n1 * c1", r: "c1 * n1" }
   * n1 is any Node, and c1 is a ConstantNode.
   *
   * Apply difference of squares formula:
   * { l: "(n1 - n2) * (n1 + n2)", r: "n1^2 - n2^2" }
   * n1, n2 mean any Node.
   */
  function _buildRules() {
    for(var i=0; i<rules.length; i++) {
      var newRule = {
        l: removeParens(parse(rules[i].l)),
        r: removeParens(parse(rules[i].r)),
      }
      if(rules[i].evaluate) {
        newRule.evaluate = parse(rules[i].evaluate);
      }
//      console.log("Adding rule: " + rules[i]);
//      console.log(newRule);
      ruleSet.push(newRule);
    }
  }

  /**
   * Returns a simplfied form of node, or the original node if no simplification was possible.
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} The simplified form of `expr`, or the original node if no simplification was possible.
   */
  var _simplify = typed('_simplify', {
    'Node': function (node) {

      //console.log('Entering _simplify(' + node.toString() + ')');

      // Do not clone node unless we find a match
      var res = node;


      // First replace our child nodes with their simplified versions
      // If a child could not be simplified, the assignments will have
      // no effect since the node is returned unchanged
      if(res instanceof OperatorNode || res instanceof FunctionNode) {
        if(res.args) {
          for(var i=0; i<res.args.length; i++) {
            res.args[i] = _simplify(res.args[i]);
          }
        }
      }
      else if(res instanceof ParenthesisNode) {
        if(res.content) {
          res.content = _simplify(res.content);
        }
      }

      // Try to match a rule against this node
      for (var i=0; i<ruleSet.length; i++) {
        // Recursive search to determine whether the rule matches the current node
        var matches = _ruleMatch(ruleSet[i].l, res);

        if (matches) {
          var before = res.toString({parenthesis: 'all'});

          // Create a new node by cloning the rhs of the matched rule
          res = ruleSet[i].r.clone();

          // Perform calculations to generate rhs placeholders (if any)
          if(ruleSet[i].evaluate) {
            // Multiple assignments can be listed in block form
            var assignments = ruleSet[i].evaluate.filter(function (node) { return node.isAssignmentNode; } );
            for(var j=0; j<assignments.length; j++) {
              var valuesIn = {};
              for(var key in matches.placeholders) {
                valuesIn[key] = matches.placeholders[key].value;
              }
              var valueOut = assignments[j].expr.eval(valuesIn);
              var newPlaceholder = new ConstantNode(valueOut);
              matches.placeholders[assignments[j].name] = newPlaceholder;
            }
          }
          // Replace placeholders with their respective nodes
          //console.log("Traversing rule " + res);
          res = res.transform(function(n, path, parent) {
            if(n.isSymbolNode) {
              if(matches.placeholders.hasOwnProperty(n.name)) {
                var replace = matches.placeholders[n.name].clone();
                return replace;
              }
            } 
            return n;
          });

          var after = res.toString({parenthesis: 'all'});
          console.log("Simplified " + before + " to " + after);

        }
      }
      
      // If node was never cloned, this is the original node (although its children may have been altered)
      return res;
    }
  });

  /**
   * Determines whether node matches rule.
   *
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} rule
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @return {Object} Information about the match, if it exists.
   */
  function _ruleMatch(rule, node) {
//    console.log('Entering _ruleMatch(' + JSON.stringify(rule) + ', ' + JSON.stringify(node) + ')');
//    console.log('rule = ' + rule);
//    console.log('node = ' + node);

//    console.log('Entering _ruleMatch(' + rule.toString() + ', ' + node.toString() + ')');
    var res = {placeholders:{}};

    if (rule instanceof OperatorNode && node instanceof OperatorNode
     || rule instanceof FunctionNode && node instanceof FunctionNode) {

      // If the rule is an OperatorNode or a FunctionNode, then node must match exactly  
      if (rule instanceof OperatorNode) {
        if (rule.op !== node.op || rule.fn !== node.fn) {
          return null;
        }
      }
      else if (rule instanceof FunctionNode) {
        if (rule.name !== node.name) {
          return null;
        }
      }

      // rule and node should have the same number of args
      if(rule.args.length !== node.args.length) {
        return null;
      }

      // rule and node match. Search the children of rule and node.
      var childMatches = [];  
      for(var i=0; i<rule.args.length; i++) {
        var childMatch = _ruleMatch(rule.args[i], node.args[i]);
        if(childMatch) {
          childMatches.push(childMatch);
          // The child matched, so add the information returned from the child to our result
        } 
        else {
          // Child did not match, so stop searching immediately
          return null;
        }
      }
      // All of the children returned a match.
      // Examine the children's placeholders to ensure they match (they most likely will not)
      // NOTE: placeholders returned from different children may not (and probably will not) match
      // NOTE: placeholders returned from a single child are guaranteed to match. This is nice, since it means we won't have to repeat the checks each time we move back up a level.
      res.placeholders = {};
      for(var i=0; i<childMatches.length; i++) {

        // Some children may not have placeholders; this is OK
        if(childMatches[i].placeholders) {
          for(var placeholderKey in childMatches[i].placeholders) {
            if(res.placeholders.hasOwnProperty(placeholderKey)) {
              // Another child already has a placeholder with the same name.
              // Make sure they match before moving on.
              if (!_exactMatch(
                res.placeholders[placeholderKey],
                childMatches[i].placeholders[placeholderKey]
              )) {
                // This placeholder didn't match another child's placeholder of the same name
                return null;
              }
            }
          }

          // Don't immediately add a new placeholder to res.placeholders, since we don't need to check
          // placeholders returned from a single child against themselves

          // If we are lucky enough to make it to here, then all the placeholders returned by this child are OK
          // Add them to our res.placeholders
          for(var placeholderKey in childMatches[i].placeholders) {
              res.placeholders[placeholderKey] = childMatches[i].placeholders[placeholderKey];
          }
        }
      }
    }
    else if (rule instanceof SymbolNode) {
      // If the rule is a SymbolNode, then it carries a special meaning
      // according to the first character of the symbol node name.
      // c.* matches a ConstantNode
      // n.* matches any node
      if (rule.name.length === 0) {
        throw new Error("Symbol in rule has 0 length...!?");
      }
      if (rule.name[0] == 'n') {
        // rule matches _anything_, so assign this node to the rule.name placeholder
        // Assign node to the rule.name placeholder.
        // Our parent will check for matches among placeholders.
        res.placeholders[rule.name] = node;
      }
      else if (rule.name[0] == 'v') {
        // rule matches any variable thing (not a ConstantNode)
        if(!node.isConstantNode) {
          res.placeholders[rule.name] = node;
        }
        else {
          // Mis-match: rule was expecting something other than a ConstantNode
          return null;
        }
      }
      else if (rule.name[0] == 'c') {
        // rule matches any ConstantNode
        if(node instanceof ConstantNode) {
          res.placeholders[rule.name] = node;
        }
        else {
          // Mis-match: rule was expecting a ConstantNode
          return null;
        }
      }
      else {
        throw new Error("Invalid symbol in rule: " + rule.name);
      }
    }
    else if (rule instanceof ConstantNode) {
      // Literal constant in our rule, so much match node exactly
      if(rule.value === node.value) {
        // The constants match
      }
      else {
        return null;
      }
    }
    else {
      // Some other node was encountered which we aren't prepared for, so no match
      return null;
    }

    // It's a match!

    //console.log('_ruleMatch(' + rule.toString() + ', ' + node.toString() + ') found a match');
    return res;
  }


  /**
   * Determines whether p and q (and all their children nodes) are identical.
   *
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} p
   * @param {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} q
   * @return {Object} Information about the match, if it exists.
   */
  function _exactMatch(p, q) {
    if(p instanceof ConstantNode && q instanceof ConstantNode) {
      if(p.value !== q.value) {
        return false;
      }
    }
    else if(p instanceof SymbolNode && q instanceof SymbolNode) {
      if(p.name !== q.name) {
        return false;
      }
    }
    else if(p instanceof OperatorNode && q instanceof OperatorNode
         || p instanceof FunctionNode && q instanceof FunctionNode) {
      if (p instanceof OperatorNode) {
        if (p.op !== q.op || p.fn !== q.fn) {
          return false;
        }
      }
      else if (p instanceof FunctionNode) {
        if (p.name !== q.name) {
          return false;
        }
      }

      if(p.args.length !== q.args.length) {
        return false;
      }

      for(var i=0; i<p.args.length; i++) {
        if(!_exactMatch(p.args[i], q.args[i])) {
          return false;
        }
      }
    }
    else {
      return false;
    }

    return true;
  }

      


  /**
   * Ensures the number of arguments for a function are correct,
   * and will throw an error otherwise.
   *
   * @param {FunctionNode} node
   */
  function funcArgsCheck(node) {
    if ((node.name == 'log' || node.name == 'nthRoot') && node.args.length == 2) {
      return;
    }

    // Avoids unidentified symbol error
    for (var i = 0; i < node.args.length; ++i) {
      node.args[i] = new ConstantNode(0);
    }

    node.compile().eval();
    throw new Error('Expected TypeError, but none found');
  }

  _buildRules();

  return simplify;
}

exports.name = 'simplify';
exports.factory = factory;
