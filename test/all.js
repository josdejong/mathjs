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
require('./function/probability.js');
require('./function/statistics.js');
require('./function/trigonometry.js');
require('./function/units.js');

// TODO: test Parser
// TODO: test Workspace
// TODO: test Scope
// TODO: test Node, Assignment, Block, Constant, FunctionAssignment, Symbol

// TODO: test minified library, for example on math.typeof(new Complex()) -> 'Complex'
