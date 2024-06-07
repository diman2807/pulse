import gulp from 'gulp';
import browserSync from 'browser-sync';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';

// Создание экземпляра browserSync
const bs = browserSync.create();

// Настройка gulp-sass с использованием dart-sass
const compileSass = gulpSass(sass);

// Задача для запуска сервера
gulp.task('server', function(done) {
    bs.init({
        server: {
            baseDir: "src"
        }
    });

    gulp.watch("src/*.html").on('change', bs.reload);
    done();
});

// Задача для компиляции SCSS в CSS
gulp.task('styles', function() {
    return gulp.src("src/scss/**/*.+(scss|sass)")
        .pipe(compileSass({outputStyle: 'compressed'}).on('error', compileSass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("src/css"))
        .pipe(bs.stream());
});

// Задача для отслеживания изменений
gulp.task('watch', function() {
    gulp.watch("src/scss/**/*.+(scss|sass)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', bs.reload);
});

// Задача по умолчанию
gulp.task('default', gulp.parallel('watch', 'server', 'styles'));