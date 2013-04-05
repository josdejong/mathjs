/**
 * Backward compatibility stuff
 */
// TODO: remove error messages for deprecated methods (deprecated since version 0.5.0)
function deprecated(deprecated, replacement) {
    throw new Error(
        'Constructor "' + deprecated +'" has been replaced by ' +
        'constructor method "' + replacement + '" in math.js v0.5.0');
}
math.Complex = function () {
    deprecated('new math.Complex()', 'math.complex()');
};
math.Unit = function () {
    deprecated('new math.Unit()', 'math.unit()');
};
math.parser.Parser = function () {
    deprecated('new math.parser.Parser()', 'math.parser()');
};
math.parser.Workspace = function () {
    deprecated('new math.parser.Workspace()', 'math.workspace()');
};
