var gulp   = require('gulp');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var zip = require('gulp-zip');

gulp.task('compress', function() {
    gulp.src(['js/layout.js'])
        .pipe(minify({
            ext:{
                src:'-src.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('build/js'))
});

gulp.task('compress-background', function() {
    gulp.src(['background.js'])
        .pipe(minify({
            ext:{
                src:'-src.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('copy', function () {
    gulp.src(['manifest.json'])
        .pipe(gulp.dest('build'));
});

gulp.task('copy-img', function () {
    gulp.src('img/*')
        .pipe(gulp.dest('build/img/'));
});

gulp.task('copy-css', function () {
    gulp.src('css/*')
        .pipe(gulp.dest('build/css/'));
});

gulp.task('minify', function() {
    return gulp.src(['popup.html'])
        .pipe(htmlmin({collapseWhitespace: true,removeComments: true,}))
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return gulp.src(['build/**/*'], {read: false})
        .pipe(clean());
});

gulp.task('package', function() {
    gulp.src('build/**/*')
        .pipe(zip('chrome-layout-manager-extension.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['clean','compress','compress-background', 'minify','copy','copy-css','copy-img']);

