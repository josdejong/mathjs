var exec = require('child_process').exec;
var gulp = require('gulp');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var header = require('gulp-header');

var LIB_SRC = './node_modules/mathjs/dist/*';
var LIB_DEST = './js/lib';
var DOCS_SRC = './node_modules/mathjs/docs/**/*.md';
var DOCS_DEST = './docs';
var HISTORY_SRC = './node_modules/mathjs/HISTORY.md';
var HISTORY_DEST = '.';

var MD_HEADER =
    '---\n' +
    'layout: default\n' +
    '---\n' +
    '\n';

gulp.task('install', function (cb) {
  // TODO: change to online library
  exec('npm install ../mathjs', cb);
});

gulp.task('update', function (cb) {
  // TODO: change to online library
  exec('npm update ../mathjs', cb);
});

/**
 * copy math.js and math.min.js
 */
gulp.task('lib', function () {
  return gulp.src(LIB_SRC)
      .pipe(gulp.dest(LIB_DEST));
});

// TODO: get version number and size and update this on the download page

/**
 * Import docs and preprocess them for the static HTML web page:
 * - Add a markdown header containing the layout page
 * - Replace internal links to other markdown documents with *.html
 */
gulp.task('docs', function () {
  return gulp.src(DOCS_SRC)
      .pipe(replace(/HISTORY.md/g, 'history.html'))        // change links to history.md to lowercase
      .pipe(replace(/(\([\w\./]*).md(\))/g, '$1.html$2'))  // replace urls to *.md with *.html
      .pipe(header(MD_HEADER))                             // add header with markdown layout
      .pipe(gulp.dest(DOCS_DEST));
});

/**
 * Copy and preprocess the history file
 */
gulp.task('history', function () {
  return gulp.src(HISTORY_SRC)
      .pipe(header(MD_HEADER))    // add header with markdown layout
      .pipe(rename('history.md')) // rename to lower case
      .pipe(gulp.dest(HISTORY_DEST));
});

gulp.task('default', ['install', 'update', 'lib', 'docs', 'history']);
