"use strict";

var gulp = require('gulp');
var rimraf = require('rimraf');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var imagemin = require('gulp-imagemin');
var util = require('gulp-util');
var buildbranch = require('buildbranch');
var browserSync = require('browser-sync');
var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var paths = {
  game: ['./js/game/**/*.js'],
  images: ['./assets/spritesheets/*.png',
      './assets/images/*.png',
      './assets/tilesets/*.png',
      './assets/particles/*.png'],
  html: ['*.html'],
  dist: {
    css: './dist/css/',
    js: './dist/js/',
  },
  vendor: {
    js: ['./js/vendor/*.js']
  },
  gameEntry: ['.js/game/main.js']
};

gulp.task('webserver', function () {
	var serve = serveStatic("./dist");

	var server = http.createServer(function (req, res) {
	    var done = finalhandler(req, res);
	    serve(req, res, done);
	});

	server.listen(8000);
});

/**
 * removes css- and js-dist folder.
 */
gulp.task('clean', function(cb) {
	rimraf('./dist', cb);
});

gulp.task('scripts', function () {
	// Single entry point to browserify
	return gulp.src(paths.gameEntry)
	    .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', function () {
	return gulp.src('*.html')
	    .pipe(gulp.dest('dist/'));
});

gulp.task('spritesheets', function () {
	return gulp.src(paths.images[0])
	    .pipe(imagemin())
	    .pipe(gulp.dest('dist/assets/spritesheets'));
});

gulp.task('images', function () {
	return gulp.src(paths.images[1])
	    .pipe(imagemin())
	    .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('tilesets', function () {
	return gulp.src(paths.images[2])
	    .pipe(imagemin())
	    .pipe(gulp.dest('dist/assets/tilesets'));
});

gulp.task('particles', function () {
	return gulp.src(paths.images[3])
	    .pipe(imagemin())
	    .pipe(gulp.dest('dist/assets/particles'));
});

gulp.task('watch', function () {
	// When a game source file changes, run tasks and reload browser
    gulp.watch(paths.game, ['scripts', browserSync.reload]);
    gulp.watch(paths.html, ['html', browserSync.reload]);
    gulp.watch(paths.images[0], ['spritesheets', browserSync.reload]);
    gulp.watch(paths.images[1], ['images', browserSync.reload]);
    gulp.watch(paths.images[2], ['tilesets', browserSync.reload]);
    gulp.watch(paths.images[3], ['particles', browserSync.reload]);
});

// Start server with browser-sync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('default', ['browser-sync', 'clean', 'watch'], function () {

});



