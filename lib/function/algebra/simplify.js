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
	var rules = [
		{ l: "0*n1", r: "0" }
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

			// Try to match a rule against this node
			for (var i=0; i<ruleSet.length; i++) {
				// Recursive search to determine whether the rule matches the current node
				var matches = _ruleMatch(ruleSet, node);
				if (matches) {
					// Perform the substitution
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
			else if(node instanceof ParanthesisNode) {
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
		var res = null;

		if (rule instanceof OperatorNode && node instanceof OperatorNode ||
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

			// rule and node match. Search the children of rule and node.
			for(var i=0; i<rule.args.length; i++) {
				var childMatch = _ruleMatch(rule.args[i], node.args[i]);
				if(childMatch) {
					// The child matched, so add the information returned from the child to our result
					// TODO, add child matches
					// TODO: Check to see if all child placeholders of the same name match exactly, using yet another recursive function I haven't written yet
					// NOTE: placeholders returned from a single child are guaranteed to match. This is nice, since it means we won't have to repeat the checks each time we move back up a level
					// NOTE: placeholders returned from different children may not (and probably will not) match
					// TODO: Most of the time, they will not match, so return null
					// TODO: In the event they all do match, then hooray! combine the information and return it
				} 
				else {
					// Child did not match, so stop searching immediately
					return null;
				}
			}
		}
		if (rule instanceof SymbolNode) {
			// If the rule is a SymbolNode, then it carries a special meaning
			// according to the first character of the symbol node name.
			// c.* matches a ConstantNode
			// n.* matches any node
			if (rule.name.length === 0) {
				return null;
			}
			if (rule.name[0] == 'n') {
				// rule matches _anything_, so assign this node to the rule.name placeholder
				// TODO: Assign node to the rule.name placeholder.
				res.placeholders[rule.name]
				

	});

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
