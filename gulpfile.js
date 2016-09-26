var gulp = require('gulp'),
    apidoc = require('gulp-apidoc');

gulp.task('apidoc',function(done){
    apidoc({
        src: "app/controllers",
        dest: "apidoc/",
        debug: false
    },done);
});
