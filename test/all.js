/**
 * mathjs test
 */

// TODO: use nodeunit for testings

// test data types
require('./type/complex.js');
require('./type/unit.js');

// test functions
require('./function/arithmetic.js');
require('./function/complex.js');
require('./function/matrix.js');
require('./function/probability.js');
require('./function/statistics.js');
require('./function/trigonometry.js');
require('./function/units.js');
require('./function/util.js');

// test Parser
require('./parser/eval.js');
// TODO: more Parser tests

// TODO: test Workspace
// TODO: test Scope
// TODO: test Node, Assignment, Block, Constant, FunctionAssignment, Symbol, ArrayNode

// TODO: test minified library, for example on math.typeof(new Complex()) -> 'Complex'
