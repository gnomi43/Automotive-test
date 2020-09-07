const   gulp = require('gulp'),
        sass = require('gulp-sass'),
        browserSync = require('browser-sync').create(),
        cleanCSS = require('gulp-clean-css'),
        imagemin = require('gulp-imagemin'),
        imageminGuetzli = require('imagemin-guetzli'),
        imageminMozjpeg = require('imagemin-mozjpeg'),
        imageminPngquant = require('imagemin-pngquant');

function style () {
    return gulp.src('./scss/**/*.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./css'))
    
    .pipe(browserSync.stream());
}


// Оптимизация PNG //
gulp.task('png-min', () =>
    gulp.src('./img/*.png')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 5})
            ]))
        .pipe(gulp.dest('dist'))
);

// Оптимизация JPG //
gulp.task('guetzli', () =>
    gulp.src('./img/*.jpg')
        .pipe(imagemin([ imageminGuetzli({quality: 85}) ]))
        .pipe(gulp.dest('dist-guetzli'))
);

gulp.task('mozjpeg', () =>
    gulp.src('./img/*.jpg')
        .pipe(imagemin([
             imageminMozjpeg({
                 progressive: true,
                 quality: 80,
                 sample: ['2x1']
                }) 
            ]))
        .pipe(gulp.dest('dist'))
);
// комбинированая оптимизация фотографий 
gulp.task('jpegcombo', () =>
    gulp.src('./img/*.jpg')
        .pipe(imagemin([ imageminGuetzli({quality: 95}) ]))
        .pipe(imagemin([
             imageminMozjpeg({
                 progressive: true,
                 quality: 85,
                 sample: ['2x1']
                }) 
            ]))
        .pipe(gulp.dest('dist'))
);
// /Оптимизация JPG //

function watch () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./scss/**/*.scss', style);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;