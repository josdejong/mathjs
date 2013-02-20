/**
 * Utility methods for jake
 *
 * Dependencies:
 *     jake
 *     uglify-js
 *     date-utils
 *
 * Usage:
 *     var util = require('jake-utils');
 *
 *     // minify, concatenate, replace patterns in files
 *     var result  = util.minify({...});
 *     var result  = util.concat({...});
 *     var result  = util.replace({...});
 *
 *     // get date and version
 *     var version = util.version();
 *     var today   = util.today();
 *
 *     // read and write files
 *     var data = util.read(filename);
 *     util.write(filename, data);
 */

var fs = require('fs'),
    jake = require('jake'),
    uglify = require('uglify-js');

require('date-utils');

/**
 * Returns today's date as a formatted string.
 * Default format is 'YYYY-MM-DD', for example '2013-02-18'
 * @param {String} [format]
 * @return {String} today
 */
function today (format) {
    var date = new Date();
    return date.toFormat(format || 'YYYY-MM-DD');
}

/**
 * Read the version number from the package.json file.
 * If not found, an error is thrown
 * @return {String} version
 */
function version() {
    var pkg = JSON.parse(read('./package.json'));
    if (!pkg.version) {
        throw new Error('No version found in package.json');
    }
    return pkg.version;
}

/**
 * Replace patterns in text files.
 * Patterns can be a string or a regular expression.
 *
 * Example usage:
 *     var result = replace({
 *         replacements: [
 *             {pattern: '@@date',    replacement: '2013-02-18'},
 *             {pattern: '@@version', replacement: '1.4.0'}
 *         },
 *         src: [
 *          'file1.js',
 *          'file2.js'
 *         ]
 *     });
 *
 * @param {Object} params Object containing parameters:
 *                        {Object[]} replacements Array containing objects with
 *                                                parameters:
 *                                                {String | RegExp} pattern
 *                                                {String}          replacement
 *                        {String[]} src          The filenames. Can contain
 *                                                patterns.
 * @return {Object} res   Result information. The object contains:
 *                        {String[]} src       List with the filenames on which
 *                                             the replacement is executed
 */
// TODO: change params of src such that we can also use regex expressions
function replace (params) {
    var filelist = new jake.FileList();
    filelist.include(params.src);
    var filenames = filelist.toArray();

    filenames.forEach(function (filename) {
        var file = String(read(filename));
        params.replacements.forEach(function (replacement) {
            file = file.replace(replacement.pattern, replacement.replacement);
        });
        write(filename, file);
    });

    return {
        src: filenames
    }
}

/**
 * Concatenate a list with files into one file
 *
 * Example:
 *     var result = concat({
 *         src: [
 *             './src/main.js',
 *             './src/extra.js',
 *             './src/functions/**',
 *         ],
 *         dest: './lib/mylibrary.js',
 *         header: '// license information...'
 *     });
 *
 * @param {Object} params  Object containing:
 *                         {String[]} src       A list with source files to be
 *                                              Included. Can contain patterns.
 *                         {String} [dest]      The target file. Optional
 *                         {String} [separator] Text to be inserted between the
 *                                              files. Optional.
 *                         {String} [header]    Text to be added on top.
 *                                              Optional.
 *                         {String} [footer]    Text to be added at the bottom.
 *                                              Optional.
 * @return {Object} res    Result information. The object contains:
 *                         {String[]} src       List with the filenames of the
 *                                              files which are concatenated
 *                         {String} code        The contents of the concatenated
 *                                              file
 */
function concat (params) {
    // concatenate all source files
    var code = '';
    var separator = params.separator || '';

    // header
    if (params.header) {
        code += params.header + separator;
    }

    // files
    var filelist = new jake.FileList();
    filelist.include(params.src);
    var filenames = filelist.toArray();
    filenames.map(function(filename) {
        code += read(filename) + separator;
    });

    // footer
    if (params.header) {
        code += params.footer;
    }

    // write output
    if (params.dest) {
        // write file
        write(params.dest, code);
    }

    return {
        src: filenames,
        code: code
    };
}

/**
 * Minify files using uglify-js.
 *
 * Example:
 *     var result = minify({
 *         src:  [
 *             './lib/mylibrary.js'
 *         ],
 *         dest: './lib/mylibrary.min.js',
 *         header: '// license information...'
 *     });
 *
 * @param {Object} params  Object containing:
 *                         {String | String[]} src  One source file or an array
 *                                                  with source files to be
 *                                                  minified. The file names
 *                                                  can contain patterns.
 *                         {String} [dest]      The target file. Optional
 *                         {String} [header]    Text to be added on top.
 *                                              Optional.
 *                         {String} [separator] Text to be inserted between
 *                                              header, contents and footer.
 *                                              Optional.
 *                         {String} [footer]    Text to be added at the bottom.
 *                                              Optional.
 * @return {Object} res    Result information. The object contains:
 *                         {String[]} src       List with the filenames of the
 *                                              files which are minified
 *                         {String} code        The contents of the concatenated
 *                                              file.
 */
function minify (params) {
    var code = '';
    var separator = params.separator || '';

    // header
    if (params.header) {
        code += params.header + params.separator;
    }

    // src
    var filelist = new jake.FileList();
    filelist.include(params.src);
    var filenames = filelist.toArray();
    var minified = uglify.minify(filenames, {});
    code += minified.code;

    // footer
    if (params.footer) {
        code += params.separator + params.footer;
    }

    // write output
    if (params.dest) {
        write(params.dest, code);
    }

    return {
        src: filenames,
        code: code
    };
}

/**
 * Read a file from disk.
 * 
 * Example:
 *     var data = read(filename);
 * 
 * @param {String} filename
 * @param {String} [encoding]
 * @return {String} data
 */
function read(filename, encoding) {
    return fs.readFileSync(filename, encoding);
}

/**
 * Write a file to disk
 *
 * Example:
 *     write(filename, data);
 *
 * @param {String} filename
 * @param {String} data
 * @param {String} [encoding]
 */
function write(filename, data, encoding) {
    fs.writeFileSync(filename, data, encoding);
}

// export all methods
module.exports = exports = {
    read: read,
    write: write,
    concat: concat,
    minify: minify,
    replace: replace,
    version: version,
    today: today
};