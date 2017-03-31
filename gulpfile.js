var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var useref = require('gulp-useref');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var uncss = require('gulp-uncss');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var htmlreplace = require('gulp-html-replace');
var stringreplace = require('gulp-string-replace');
var pretiffy = require('gulp-prettify');

var bases = {
    app: './public/',
    dist: './dist/'
};

var paths = {
    scripts: './js/**/*.js',
    scss: './scss/**/*.scss',
    css: './css/**/*.css',
    html: './views/index.html',
    images: './images/**.*',
    vendors: './bower_components/'
};

// JavaScript hint task
gulp.task('jshint', function() {
    gulp.src(paths.scripts, { cwd: bases.app })
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Sass compile task
gulp.task('sass', function() {
    return gulp.src(paths.scss, { cwd: bases.app })
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(bases.app + './css/'));
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts, { cwd: bases.dist })
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(bases.dist + 'js/'));
});

gulp.task('styles', function() {
    return gulp.src(paths.css, { cwd: bases.dist })
        .pipe(uncss({
            html: 'index.html',
            ignore: '.loading'
        }))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(bases.dist + 'css/'));
});

// Copy tasks
gulp.task('copy', function(cb) {
    runSequence(['copy:fonts', 'copy:html', 'copy:images', 'copy:scripts', 'copy:styles', 'copy:vendors'], cb);
});

gulp.task('copy:fonts', function() {
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}', { cwd: bases.app })
        .pipe(gulp.dest(bases.dist + './fonts'));
});

gulp.task('copy:html', function() {
    return gulp.src(paths.html)
        .pipe(htmlreplace({
            'css': 'css/vendor.min.css',
            'js': 'js/vendor.min.js'
        }))
        .pipe(stringreplace('style.css', 'style.min.css'))
        .pipe(stringreplace('main.js', 'main.min.js'))
        .pipe(pretiffy())
        .pipe(gulp.dest(bases.dist));
});

gulp.task('copy:images', function() {
    return gulp.src(paths.images, { cwd: bases.app })
        .pipe(imagemin())
        .pipe(gulp.dest(bases.dist + '/images'));
});

gulp.task('copy:scripts', function() {
    return gulp.src(paths.scripts, { cwd: bases.app })
        .pipe(gulp.dest(bases.dist + 'js/'));
});

gulp.task('copy:styles', function() {
    return gulp.src(paths.css, { cwd: bases.app })
        .pipe(gulp.dest(bases.dist + 'css/'));
});

gulp.task('copy:vendors', function() {
    var jsFilter = gulpFilter('**/*.js', { restore: true });
    var cssFilter = gulpFilter('**/*.css', { restore: true });

    return gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(bases.dist + 'js/'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(bases.dist + 'css/'))
        .pipe(cssFilter.restore);
});

// Clean task
gulp.task('clean', function() {
    return gulp.src(bases.dist, { read: false })
        .pipe(clean());
});

// Build task
gulp.task('build', function(cb) {
    runSequence('clean', 'jshint', 'sass', 'copy', 'styles', 'scripts', cb);
});

// Serve tasks
gulp.task('serve', function() {
    browserSync.init({
        server: 'app/',
        port: 8080
    });

    gulp.watch(bases.app + paths.html).on('change', browserSync.reload);
    gulp.watch(bases.app + paths.scss, ['sass']).on('change', browserSync.reload);
    gulp.watch(bases.app + paths.scripts).on('change', browserSync.reload);
});

gulp.task('serve:dist', function() {
    browserSync.init({
        server: 'dist/',
        port: 8080
    });
});