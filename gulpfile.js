const   gulp            = require('gulp'),
        autoprefixer    = require('gulp-autoprefixer'),
        uglify          = require('gulp-uglify'),
        sass            = require('gulp-sass'),
        include         = require('gulp-include'),
        cleanCss        = require('gulp-clean-css'),
        rename          = require('gulp-rename'),
        imagemin        = require('gulp-imagemin'),
        bsync           = require('browser-sync').create(),
        del             = require('del'),
        csso            = require('gulp-csso'),
        gcmq            = require('gulp-group-css-media-queries'),
        pug             = require('gulp-pug');


gulp.task("clean:build", ()=>{
    return del(['./build']);
});

gulp.task('watch', ()=>{
    gulp.watch('./src/*.pug', gulp.series('html:dev'));
    gulp.watch('./src/pug/**/*.pug', gulp.series('html:dev'));
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass:dev'));
    gulp.watch('./src/js/*.js', gulp.series('js:dev'));
    gulp.watch('./src/img/**/*.{jpg,jpeg,png,gif}', gulp.series('img:dev'));
});

gulp.task('html:dev', ()=>{
    return gulp.src('./src/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./dev'))
        .pipe(bsync.reload({
            stream: true
        }));
});
    
gulp.task('sass:dev', async ()=>{
    return gulp.src('./src/scss/main.scss')
        .pipe(include({
            extensions: 'css',
            includePaths: [__dirname+'/src/bower_components']
        }))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(gcmq())
        .pipe(gulp.dest('./dev/css'))
        .pipe(csso())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./dev/css'))
        .pipe(bsync.reload({
            stream: true
        }));
});

gulp.task('js:dev', ()=>{
    return gulp.src(['./src/js/main.js', './src/js/libs.js'])
        .pipe(include({
            extensions: 'js',
            includePaths: [__dirname+'/src/bower_components']
        }))
        .pipe(gulp.dest('./dev/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dev/js'))
        .pipe(bsync.reload({
            stream: true
        }));
});

gulp.task('img:dev', async ()=>{
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('./dev/img'))
        .pipe(bsync.reload({
            stream: true
        }));
});

gulp.task('serve', async ()=>{
    return  bsync.init({
        server: './dev'
    })
});

gulp.task('dev', gulp.parallel('html:dev', 'sass:dev', 'js:dev', 'img:dev'));

gulp.task('default', gulp.series(
    'dev',
    gulp.parallel('watch', 'serve')
));


