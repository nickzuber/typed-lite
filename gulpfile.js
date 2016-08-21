
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var header = require('gulp-header');

var pkg = require('./package.json');
var banner = ['/*!',
  ' // <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> ',
  ' // Copyright (c) 2016 <%= pkg.author %>',
  ' */',
	''].join('\n');

gulp.task('build', function () {
	gulp.src(['./index.js'])
	.pipe(browserify({}))
	.pipe(uglify())
	.pipe(rename({
		basename: 'typed-lite',
		extname: '.min.js'
	}))
	.pipe(header(banner, {pkg: pkg}))
	.pipe(gulp.dest('./build'))
});

