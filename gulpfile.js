 var gulp = require('gulp');


gulp.task('default', function () {
  var src = [
		'./src/*.html',
		'./src/css/*.css'
	];

	return gulp.src(src)
		.pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
    gulp.watch('./src/*.html', ['default'])
    gulp.watch('./src/css/*.css', ['default'])
});
