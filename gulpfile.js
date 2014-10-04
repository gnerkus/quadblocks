'use strict';

var gulp = require('gulp');

var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var deploy = require('gulp-gh-pages');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var reload = browserSync.reload;
var rename = require('gulp-rename');
var rimraf = require('rimraf');
var uglify = require('gulp-uglify');

var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');

gulp.task('serve', function() {
    var serve = serveStatic('./dist');

    var server = http.createServer(function(req, res) {
        var done = finalhandler(req, res);
        serve(req, res, done);
    });

    server.listen(8000);
});

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

// Clean output directory -- CLEARED
gulp.task('clean', function(cb) {
    rimraf.sync('./dist', cb);
});

// Lint Javascript -- CLEARED
gulp.task('jshint', function () {
    return gulp.src(paths.game)
        .pipe(jshint())
        .pipe(jshint.reporter());
});

// Build source Javascript for the game -- CLEARED
gulp.task('scripts', ['jshint'], function() {
    // Single entry point to browserify
    return gulp.src(paths.gameEntry)
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename('game.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(uglify())
        .pipe(rename('game.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});

// Build vendor Javascript -- CLEARED
gulp.task('vendor', function() {
    return gulp.src(paths.vendor.js)
        .pipe(gulp.dest('./dist/js/'))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('html', ['scripts'], function() {
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

// Optimize particle images -- CLEARED!
gulp.task('particles', function() {
    return gulp.src(paths.images[3])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/particles/'));
});

gulp.task('serve:dist', ['serve'], function () {
    browserSync({
        notify: true,
        server: 'dist'
    });

    gulp.watch(paths.game, ['jshint', 'scripts', reload]);
    gulp.watch(paths.vendor.js, ['vendor', reload]);
    gulp.watch(paths.html, ['html', reload]);
    gulp.watch(paths.images[0], ['spritesheets', reload]);
    gulp.watch(paths.images[1], ['images', reload]);
    gulp.watch(paths.images[2], ['tilesets', reload]);
    gulp.watch(paths.images[3], ['particles', reload]);
});

// Run 'gulp deploy' to push changes to the gh-pages branch
gulp.task('deploy', function() {
    gulp.src('./dist/**/*')
        .pipe(deploy(options));
});

gulp.task('build', ['clean', 'vendor', 'tilesets', 'spritesheets', 'images', 'particles', 'html']);
gulp.task('default', ['build']);

