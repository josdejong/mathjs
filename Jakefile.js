/**
 * Jake build script for mathjs
 */

var util = require('./tools/jake-utils.js'),
    filesize = require('filesize');

/**
 * Constants
 */
var MATHJS       = './math.js';
var MATHJS_MIN   = './math.min.js';
var HEADER      = './src/header.js';

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
task('build', ['concat', 'minify', 'version']);

/**
 * concat task
 */
desc('Concatenate all source files into one file');
task('concat', function () {
    var result = util.concat({
        src: [
            './src/exports.js',
            './src/util.js',
            './src/type/**/*.js',
            './src/constants.js',
            './src/functions.js',
            './src/function/**/*.js',
            './src/parser/node/Node.js',
            './src/parser/node/Symbol.js',
            './src/parser/node/Constant.js',
            './src/parser/node/Block.js',
            './src/parser/node/Assignment.js',
            './src/parser/node/FunctionAssignment.js',
            './src/parser/Scope.js',
            './src/parser/Parser.js'
        ],
        dest: MATHJS,
        header: util.read(HEADER) + '\n(function() {\n',
        separator: '\n',
        footer: '\n})();\n'
    });

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

    console.log('Minified ' +
        MATHJS +     ' (' + filesize(util.read(result.src[0]).length, 1) + ') to ' +
        MATHJS_MIN + ' (' + filesize(result.code.length, 1) + ')');
});

/**
 * version task
 */
desc('Update version and date in the library');
task('version', ['concat', 'minify'], function () {
    var files = [MATHJS, MATHJS_MIN];
    util.replace({
        replacements: [
            {pattern: '@@date',    replacement: util.version()},
            {pattern: '@@version', replacement: util.today()}
        ],
        src: files
    });

    console.log('Version and date updated in ' + files.join(' '));
});

/**
 * test task
 */
desc('Test the library');
task('test', ['concat'], function () {
    require('./test/all.js');
    console.log('Tests successful');
});

