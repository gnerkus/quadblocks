'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var deploy = require('gulp-gh-pages');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var finalhandler = require('finalhandler');
var http = require('http');
var rimraf = require('rimraf');
var serveStatic = require('serve-static');

var paths = {
    game: ['./game/**/*.js'],
    images: ['./assets/spritesheets/*.png',
        './assets/images/*.png',
        './assets/tilesets/*.png',
        './assets/particles/*.png'
    ],
    html: ['*.html'],
    vendor: {
        js: ['./vendor/*.js']
    },
    gameEntry: ['./game/main.js']
};

var options = {
    remoteUrl: 'https://github.com/gnerkus/quadblocks.git',
    branch: 'gh-pages'
};

gulp.task('webserver', function() {
    var serve = serveStatic('./dist');

    var server = http.createServer(function(req, res) {
        var done = finalhandler(req, res);
        serve(req, res, done);
    });

    server.listen(8000);
});

/**
 * removes css- and js-dist folder.
 */
gulp.task('clean', function(cb) {
    rimraf.sync('./dist', cb);
});

gulp.task('scripts', function() {
    // Single entry point to browserify
    return gulp.src(paths.gameEntry)
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('vendor', function() {
    return gulp.src(paths.vendor.js)
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('dist/'));
});

gulp.task('spritesheets', function() {
    return gulp.src(paths.images[0])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/spritesheets/'));
});

gulp.task('images', function() {
    return gulp.src(paths.images[1])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images/'));
});

gulp.task('tilesets', function() {
    return gulp.src(paths.images[2])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/tilesets/'));
});

gulp.task('particles', function() {
    return gulp.src(paths.images[3])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/particles/'));
});

// Run 'gulp deploy' to push changes to the gh-pages branch
gulp.task('deploy', function() {
    gulp.src('./dist/**/*')
        .pipe(deploy(options));
});

gulp.task('watch', function() {
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
            baseDir: './dist'
        }
    });
});

gulp.task('build', ['clean', 'vendor', 'scripts', 'spritesheets', 'particles', 'tilesets', 'images', 'html']);
gulp.task('default', ['webserver', 'browser-sync', 'build', 'watch']);
