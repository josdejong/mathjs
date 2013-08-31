/**
 * Jake build script for math.js
 */

var jake = require('jake'),
    util = require('./tools/jake-utils.js'),
    browserify = require('browserify');

/**
 * Constants
 */
var INDEX       = './index.js';
var HEADER      = './lib/header.js';
var SHIM        = './lib/shim.js';
var DIST        = './dist';
var MATHJS      = DIST + '/math.js';
var MATHJS_MIN  = DIST + '/math.min.js';

// register start time
var start = +new Date();

/**
 * default task
 */
desc('Execute all tasks: bundle and minify the library');
task('default', ['bundle', 'minify'], function () {
  // calculate duration
  var end = +new Date();
  var duration = end - start;
  console.log('Done (' + duration + ' ms)');
});

/**
 * Bundle task
 */
desc('Bundle the library');
task('bundle', {async: true}, function () {
  var b = browserify();

  // make directory dist
  jake.mkdirP(DIST);

  b.add(INDEX);
  b.bundle({
    standalone: 'math'
  }, function (err, code) {
    if(err) {
      throw err;
    }

    // add header and shim
    var lib = util.read(HEADER) + code + util.read(SHIM);

    // write bundled file
    util.write(MATHJS, lib);

    // update version number and stuff in the javascript files
    updateVersion(MATHJS);

    console.log('Bundled library ' + MATHJS + ' (' + filesize(lib.length, 1) + ')');

    complete();
  });
});

/**
 * minify task
 */
desc('Minify the library');
task('minify', ['bundle'], function () {
  var result = util.minify({
    src: MATHJS,
    dest: MATHJS_MIN,
    header: util.read(HEADER)
  });
  updateVersion(MATHJS_MIN);

  console.log('Minified library ' + MATHJS_MIN + ' (' + filesize(result.code.length, 1) + ')');
});

// TODO: test the bundled library and minified library (not the sources)

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
