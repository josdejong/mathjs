var gulp = require('gulp');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var header = require('gulp-header');

var DOCS_SRC = './node_modules/mathjs/docs/**/*.md';
var DOCS_DEST = './docs';
var HISTORY_SRC = './node_modules/mathjs/HISTORY.md';
var HISTORY_DEST = '.';

var MD_HEADER =
    '---\n' +
    'layout: default\n' +
    '---\n' +
    '\n';

/**
 * Import docs and preprocess them for the static HTML web page:
 * - Add a markdown header containing the layout page
 * - Replace internal links to other markdown documents with *.html
 */
gulp.task('preprocess', function () {
  return gulp.src(DOCS_SRC)
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

gulp.task('default', ['preprocess', 'history']);
