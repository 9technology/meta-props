import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import sequence from 'run-sequence';

gulp.task('default', ['build']);

gulp.task('build', done => sequence('clean', ['build:lib'], done));

gulp.task('clean', () => del(['lib', 'dist']));

gulp.task('build:lib', () => {
    return gulp.src(['src/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});
