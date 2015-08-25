'use strict';

function factory (type, config, load, typed) {
	var parse = load(require('../../expression/parse'));
  var ConstantNode    = load(require('../../expression/node/ConstantNode'));
  var FunctionNode    = load(require('../../expression/node/FunctionNode'));
  var OperatorNode    = load(require('../../expression/node/OperatorNode'));
  var ParenthesisNode = load(require('../../expression/node/ParenthesisNode'));
  var SymbolNode      = load(require('../../expression/node/SymbolNode'));

  /**
   * Returns a simplified expression tree. The parameter passed to the function is cloned
	 * before simplifying.
   * See this for more details on the theory:
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
			var res = expr.clone();

			// TODO: Remove all ParenthesisNodes

			// TODO: Make _simplify return a new node (since head node may change while simplifying)
			_simplify(res);
			return res;
    }
  });

	// Array of rules to be used to simplify expressions
	var ruleSet = [];

	// Array of strings, used to build the ruleSet.
  // Each l (left side) and r (right side) are parsed by
	// the expression parser into a node tree.
	// Left hand sides are matched to subtrees within the
	// expression to be parsed and replaced with the right
	// hand side.
	// TODO: Add support for constraints on constants (either in the form of a '=' expression or a callback [callback allows things like comparing symbols alphabetically])
	// TODO: Add support for calculation of rhs constants, such as: { l: "c1+c2", r: "c3", calculations: ["c3 = c1 + c2"] }
	var rules = [
		{ l: "0*n1", r: "0" },
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
				l: parse(rules[i].l),
				r: parse(rules[i].r)
			}
			console.log("Adding rule: " + rules[i]);
			console.log(newRule);
			ruleSet.push(newRule);
		}
	}

  /**
   * Simplfies an expression.
   *
   * @param  {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} node
   * @return {ConstantNode | SymbolNode | ParenthesisNode | FunctionNode | OperatorNode} The simplified form of `expr`
   */
  var _simplify = typed('_simplify', {
		'Node': function (node) {
	
			console.log('Entering _simplify(' + node.toString() + ')');

			// Try to match a rule against this node
			for (var i=0; i<ruleSet.length; i++) {
				// Recursive search to determine whether the rule matches the current node
				var matches = _ruleMatch(ruleSet[i].l, node);
				if (matches) {
					console.log('Match!');
					for(var key in matches.placeholders) {
						console.log('placeholder ' + key + ' = ' + matches.placeholders[key].toString());
					}
					// TODO: Perform the substitution
					// ... oops, we can't change node without clobbering everything,
					// and we don't know who node's parent is!
				}
			}

			// Continue the search with the (possibly changed) child nodes
			if(node instanceof OperatorNode || node instanceof FunctionNode) {
				if(node.args) {
					for(var i=0; i<node.args.length; i++) {
						_simplify(node.args[i]);
					}
				}
			}
			else if(node instanceof ParenthesisNode) {
				if(node.content) {
					_simplify(node.content);
				}
			}
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
		console.log('Entering _ruleMatch(' + rule.toString() + ', ' + node.toString() + ')');
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

		console.log('_ruleMatch(' + rule.toString() + ', ' + node.toString() + ') found a match');
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

			for(var i=0; i<r.args.length; i++) {
				if(!_exactMatch(r.args[i], q.args[i])) {
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
