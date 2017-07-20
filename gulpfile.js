/**
 * Gulp Packages
 */

// General
var gulp = require('gulp'),
	fs = require('fs'),
	del = require('del'),
	lazypipe = require('lazypipe'),
	plumber = require('gulp-plumber'),
	flatten = require('gulp-flatten'),
	tap = require('gulp-tap'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	footer = require('gulp-footer'),
	watch = require('gulp-watch'),
	livereload = require('gulp-livereload'),
	package = require('./package.json');

// Scripts
var jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

// Styles
var sass = require('gulp-sass'),
	prefix = require('gulp-autoprefixer'),
	minify = require('gulp-cssnano');

// SVGs
var svgmin = require('gulp-svgmin'),
	svgstore = require('gulp-svgstore');


/**
 * Paths to project folders
 */

var paths = {
	input: 'src/**/*',
	output: 'dist/',
	scripts: {
		input: 'src/js/*',
		output: 'dist/js/'
	},
	styles: {
		input: 'src/sass/**/*.{scss,sass}',
		output: 'dist/css/'
	},
	svgs: {
		input: 'src/svg/*',
		output: 'dist/svg/'
	},
	images: {
		input: 'src/img/*',
		output: 'dist/img/'
	},
	static: {
		input: 'src/static/*',
		output: 'dist/'
	}
};


/**
 * Template for banner to add to file headers
 */

var banner = {
	full :
		'/*!\n' +
		' * <%= package.name %> v<%= package.version %>: <%= package.description %>\n' +
		' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
		' * MIT License\n' +
		' * <%= package.repository.url %>\n' +
		' */\n\n',
	min :
		'/*!' +
		' <%= package.name %> v<%= package.version %>' +
		' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
		' | MIT License' +
		' | <%= package.repository.url %>' +
		' */\n'
};


/**
 * Gulp Taks
 */

// Lint, minify, and concatenate scripts
gulp.task('build:scripts', ['clean:dist'], function() {
	var jsTasks = lazypipe()
		.pipe(header, banner.full, { package : package })
		.pipe(gulp.dest, paths.scripts.output)
		.pipe(rename, { suffix: '.min' })
		.pipe(uglify, { output: {comments: /^! /} })
		.pipe(header, banner.min, { package : package })
		.pipe(gulp.dest, paths.scripts.output);

	return gulp.src(paths.scripts.input)
		.pipe(plumber())
		.pipe(tap(function (file, t) {
			if ( file.isDirectory() ) {
				if ( file.relative == 'vendor')
					return gulp.src(file.path + '/*.js')
						.pipe(gulp.dest(paths.scripts.output + 'vendor/'));
				return gulp.src(file.path + '/*.js')
					.pipe(concat(file.relative + '.js'))
					.pipe(jsTasks());
			}
		}))
		.pipe(jsTasks());
});

// Process, lint, and minify Sass files
gulp.task('build:styles', ['clean:dist'], function() {
	return gulp.src(paths.styles.input)
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		}))
		.pipe(flatten())
		.pipe(prefix({
			browsers: ['last 2 version', '> 1%'],
			cascade: true,
			remove: true
		}))
		.pipe(header(banner.full, { package : package }))
		.pipe(gulp.dest(paths.styles.output))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minify({ discardComments: {removeAll: true} }))
		.pipe(header(banner.min, { package : package }))
		.pipe(gulp.dest(paths.styles.output));
});

// Generate SVG sprites
gulp.task('build:svgs', ['clean:dist'], function () {
	return gulp.src(paths.svgs.input)
		.pipe(plumber())
		.pipe(tap(function (file, t) {
			if ( file.isDirectory() ) {
				return gulp.src(file.path + '/*.svg')
					.pipe(svgmin())
					.pipe(svgstore({
						fileName: file.relative + '.svg',
						prefix: 'icon-',
						inlineSvg: true
					}))
					.pipe(gulp.dest(paths.svgs.output));
			}
		}))
		.pipe(svgmin())
		.pipe(gulp.dest(paths.svgs.output));
});

// Copy image files into output folder
gulp.task('build:images', ['clean:dist'], function() {
	return gulp.src(paths.images.input)
		.pipe(plumber())
		.pipe(gulp.dest(paths.images.output));
});

// Copy static files into output folder
gulp.task('build:static', ['clean:dist'], function() {
	return gulp.src(paths.static.input)
		.pipe(plumber())
		.pipe(gulp.dest(paths.static.output));
});

// Lint scripts
gulp.task('lint:scripts', function () {
	return gulp.src(paths.scripts.input)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// Remove pre-existing content from output and test folders
gulp.task('clean:dist', function () {
	del.sync([
		paths.output
	]);
});

// Spin up livereload server and listen for file changes
gulp.task('watch', ['compile'], function () {
	livereload.listen();
	gulp.watch(paths.input).on('change', function(file) {
		gulp.start('compile');
		gulp.start('refresh');
	});
});

// Run livereload after file change
gulp.task('refresh', ['compile'], function () {
	livereload();
});

// Compile files
gulp.task('compile', [
	'lint:scripts',
	'clean:dist',
	'build:scripts',
	'build:styles',
	'build:images',
	'build:static',
	'build:svgs'
]);

// Default: compile files
gulp.task('default', ['compile']);
