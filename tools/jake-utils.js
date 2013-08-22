/**
 * Utility methods for jake
 *
 * Dependencies:
 *     jake
 *     uglify-js
 *     dateable
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
    uglify = require('uglify-js'),
    dateable = require('dateable');

/**
 * Returns today's date as a formatted string.
 * Default format is 'YYYY-MM-DD', for example '2013-02-18'
 * @param {String} [format]
 * @return {String} today
 */
function today (format) {
  var date = new Date();
  return dateable.format(date, format || 'YYYY-MM-DD');
}

/**
 * Read the version number from the package.json file.
 * If not found, an error is thrown
 * @return {String} version
 * @throws {Error}
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
 *          'main.js',
 *          'other/*.js'
 *         ]
 *     });
 *
 * @param {Object} params Object containing parameters:
 *                        {Object[]} replacements Array containing objects with
 *                                                parameters:
 *                                                {String | RegExp} pattern
 *                                                {String}          replacement
 *                        {String | String[]} src The filenames. Can contain
 *                                                patterns.
 * @return {Object} res   Result information. The object contains:
 *                        {String[]} src       List with the filenames on which
 *                                             the replacement is executed
 * @throws {Error}
 */
// TODO: change params of src such that we can also use regex expressions
function replace (params) {
  // do some checks on the provided parameters
  if (!(params instanceof Object)) {
    throw new Error('Object with parameters expected as first argument.');
  }
  if (!params.replacements) {
    throw new Error('Parameter "replacements" missing.');
  }
  if (!Array.isArray(params.replacements)) {
    throw new Error('Parameter "replacements" must be an array.');
  }
  if (!params.src) {
    throw new Error('Parameter "src" containing an array with filenames missing.');
  }

  var filelist = new jake.FileList();
  filelist.include(params.src);
  var filenames = filelist.toArray();

  filenames.forEach(function (filename) {
    var file = String(read(filename));
    params.replacements.forEach(function (replacement, index) {
      // check the replacement parameters
      if (!(replacement instanceof Object)) {
        throw new Error('Parameter "replacement" must be an object.');
      }
      if (!replacement.pattern) {
        throw new Error('Parameter "pattern" in missing replacement object ' +
            '(index ' + index + ')');
      }
      if (!replacement.replacement) {
        throw new Error('Parameter "replacement" missing in replacement object ' +
            '(index ' + index + ')');
      }

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
 *             './lib/main.js',
 *             './lib/extra.js',
 *             './lib/functions/**',
 *         ],
 *         dest: './lib/mylibrary.js',           // optional
 *         header: '// license information...',  // optional
 *         separator: '\n',                      // optional
 *         footer: '// the end...'               // optional
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
  // do some checks on the provided parameters
  if (!(params instanceof Object)) {
    throw new Error('Object with parameters expected as first argument.');
  }
  if (!params.src) {
    throw new Error('Parameter "src" containing an array with filenames missing.');
  }

  var code = '';
  var separator = params.separator ? String(params.separator) : '';

  // header
  if (params.header) {
    code += String(params.header) + separator;
  }

  // files
  var filelist = new jake.FileList();
  filelist.include(params.src);
  var filenames = filelist.toArray();
  filenames.map(function(filename) {
    code += read(filename) + separator;
  });

  // footer
  if (params.footer) {
    code += String(params.footer);
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
 *         dest: './lib/mylibrary.min.js',       // optional
 *         options: {},                          // uglify-js options. optional
 *         header: '// license information...',  // optional
 *         separator: '\n',                      // optional
 *         footer: '// the end...'               // optional
 *     });
 *
 * @param {Object} params  Object containing:
 *                         {String | String[]} src  One source file or an array
 *                                                  with source files to be
 *                                                  minified. The file names
 *                                                  can contain patterns.
 *                         {String} [dest]      The target file. Optional
 *                         {Object} [options]   uglify-js options.
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
 *                         {String} code        The contents of the minified
 *                                              file.
 */
function minify (params) {
  // do some checks on the provided parameters
  if (!(params instanceof Object)) {
    throw new Error('Object with parameters expected as first argument.');
  }
  if (!params.src) {
    throw new Error('Parameter "src" containing an array with filenames missing.');
  }
  if (params.options) {
    if (!(params.options instanceof Object)) {
      throw new Error('Parameter "options" must be an object.');
    }
  }

  var code = '';
  var separator = params.separator ? String(params.separator) : '';
  var options = params.options || {};

  // header
  if (params.header) {
    code += String(params.header) + separator;
  }

  // src
  var filelist = new jake.FileList();
  filelist.include(params.src);
  var filenames = filelist.toArray();
  var minified = uglify.minify(filenames, options);
  code += minified.code;

  // footer
  if (params.footer) {
    code += separator + String(params.footer);
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