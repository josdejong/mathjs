/**
 * Jake build script for math.js
 */

var jake = require('jake'),
    util = require('./tools/jake-utils.js');

/**
 * Constants
 */
var HEADER          = './src/header.js';
var MATHJS          = './math.js';
var MATHJS_MIN      = './math.min.js';
var MATHJS_HELP     = './extensions/help.js';
var MATHJS_HELP_MIN = './extensions/help.min.js';

// register start time
var start = +new Date();

/**
 * default task
 */
desc('Execute all tasks: build and test the library');
task('default', ['build', 'test'], function () {
    // calculate duration
    var end = +new Date();
    var duration = end - start;
    console.log('Done (' + duration + ' ms)');
});

/**
 * build task
 */
desc('Build the library');
task('build', ['concat', 'minify']);

/**
 * concat task
 */
desc('Concatenate all source files into one file');
task('concat', function () {
    var header = util.read(HEADER);
    var docs = buildDocs();
    var result = util.concat({
        src: [
            './src/namespace.js',
            './src/util.js',
            './src/type/**/*.js',
            './src/constants.js',
            './src/functions.js',
            './src/expr/node/Node.js',
            './src/expr/node/ConstantNode.js',
            './src/expr/node/OperatorNode.js',
            './src/expr/node/SymbolNode.js',
            './src/expr/node/ParamsNode.js',
            './src/expr/node/MatrixNode.js',
            './src/expr/node/BlockNode.js',
            './src/expr/node/AssignmentNode.js',
            './src/expr/node/UpdateNode.js',
            './src/expr/node/FunctionNode.js',
            './src/expr/Scope.js',
            './src/expr/Parser.js',
            './src/function/**/*.js',
            './src/compatibility.js',
            './src/init.js',
            './src/exports.js'
        ],
        dest: MATHJS,
        header: header + '\n(function() {\n',
        separator: '\n',
        footer: docs + '\n})();\n'
    });

    updateVersion(MATHJS);

    console.log('Concatenated ' + result.src.length + ' files into ' +
        MATHJS + ' (' + filesize(result.code.length, 1) + ')');
});

/**
 * minify task
 */
desc('Minify the library');
task('minify', ['concat'], function () {
    var result = util.minify({
        src: MATHJS,
        dest: MATHJS_MIN,
        header: util.read(HEADER)
    });

    updateVersion(MATHJS_MIN);

    console.log('Minified ' +
        MATHJS +     ' (' + filesize(util.read(result.src[0]).length, 1) + ') to ' +
        MATHJS_MIN + ' (' + filesize(result.code.length, 1) + ')');
});

/**
 * Build docs.
 * Reads all *.json files in src/docs, and creates JavaScript code from it
 * where all docs are put in a single JSON object in math.docs.
 * @return {String} docs
 */
function buildDocs () {
    var filelist = new jake.FileList();
    filelist.include([
        './src/docs/**/*.json'
    ]);
    var files = filelist.toArray();

    // generate a single JSON object with all docs
    var docs = {};
    files.forEach(function (file) {
        var content = String(util.read(file)).trim();
        if (content) {
            var doc = JSON.parse(content);
            docs[doc.name] = doc;
        }
    });

    return '/**\n * Documentation\n */\n' +
        'math.docs = ' + JSON.stringify(docs, null, 4) + ';' +
        '\n';
}

/**
 * test task
 */
desc('Test the library');
task('test', ['concat'], function () {
    // TODO: use a testing suite for testing: nodeunit, mocha, tap, ...
    var filelist = new jake.FileList();
    filelist.include([
        './test/**/*.js'
    ]);

    var files = filelist.toArray();
    files.forEach(function (file) {
        require('./' + file);
    });

    console.log('Executed ' + files.length + ' test files successfully');
});

/**
 * Update version and date patterns in given file.
 * Patterns '@@date' and '@@version' will be replaced with current date and
 * version.
 * @param {String} file
 */
function updateVersion(file) {
    // update date and version number
    util.replace({
        replacements: [
            {pattern: '@@date',    replacement: util.today()},
            {pattern: '@@version', replacement: util.version()}
        ],
        src: file
    });
}

/**
 * Return the filesize in kilo bytes
 * @param {Number} size    Size in Bytes
 * @return {String} str    Formatted string like "50.7KB"
 */
function filesize (size) {
    return (size / 1024).toPrecision(3) + 'KB';
}
