var gulp   = require('gulp');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-minify');

gulp.task('compress', function() {
    gulp.src(['js/layout.js'])
        .pipe(minify({
            ext:{
                //src:'-src.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('compress2', function() {
    gulp.src(['background.js'])
        .pipe(minify({
            ext:{
                //src:'-src.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('copy', function () {
    gulp.src(['manifest.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-img', function () {
    gulp.src('img/*')
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('copy-css', function () {
    gulp.src('css/*')
        .pipe(gulp.dest('dist/css/'));
});


gulp.task('watch', function () {
    console.log("Watch here!");
    //gulp.watch('src/*.coffee', ['scripts']);
});

gulp.task('minify', function() {
    return gulp.src(['popup.html'])
        .pipe(htmlmin({collapseWhitespace: true,removeComments: true,}))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['dist/*.*','dist/js/*.*'], {read: false})
        .pipe(clean());
});

gulp.task('default', ['compress','compress2', 'minify','copy','copy-css','copy-img']);
