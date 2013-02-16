/**
 * Jake build script for Math2
 */

var fs = require('fs'),
    jake = require('jake'),
    uglify = require('uglify-js'),
    replace = require('replace'),
    filesize = require('filesize');

require('date-utils');

/**
 * Constants
 */
var MATH2       = './math2.js';
var MATH2_MIN   = './math2.min.js';
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
    var filelist = new jake.FileList();
    filelist.include([
        './src/module.js',
        './src/util.js',
        './src/type/**/*.js',
        './src/types.js',
        './src/constants.js',
        './src/functions.js',
        './src/function/**/*.js'
    ]);
    var files = filelist.toArray();

    // concatenate all source files
    var out = '';
    files.map(function(file) {
        out += fs.readFileSync(file) + '\n';
    });

    // wrap the code in a closure and add the header file
    var header = fs.readFileSync(HEADER);
    out = header +
        '\n(function() {\n\n' +
        out +
        '\n})();\n';

    // write file
    fs.writeFileSync(MATH2, out);

    console.log('Concatenated ' + files.length + ' files into ' +
        MATH2 + ' (' + filesize(out.length, 1) + ')');
});

/**
 * minify task
 */
desc('Minify the library');
task('minify', ['concat'], function () {
    var header = fs.readFileSync(HEADER);
    var input = fs.readFileSync(MATH2);
    var result = uglify.minify(MATH2, {});
    var out = header + result.code;
    fs.writeFileSync(MATH2_MIN, out);

    console.log('Minified ' +
        MATH2 + ' (' + filesize(input.length, 1) + ') to ' +
        MATH2_MIN + ' (' + filesize(out.length, 1) + ')');
});

/**
 * version task
 */
desc('Update version and date in the library');
task('version', ['concat', 'minify'], function () {
    var files = [MATH2, MATH2_MIN];
    var pkg = JSON.parse(fs.readFileSync('./package.json'));
    if (!pkg.version) {
        throw new Error('No version found in package.json');
    }

    replace({
        regex: '@@version',
        replacement: pkg.version,
        path: files,
        silent: true
    });
    replace({
        regex: '@@date',
        replacement: today(),
        path: files,
        silent: true
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

/**
 * Retuns todays date in the format 'YYYY-MM-DD', for example '2013-02-18'
 * @return {String} today
 */
function today () {
    var date = new Date();
    return date.toFormat('YYYY-MM-DD');
}
