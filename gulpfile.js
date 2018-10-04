const gulp = require('gulp');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');

// pull in the project Typescript config
const tsProject = ts.createProject('tsconfig.json');
//task to be run when the watcher detects changes
gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('./dist/'));
});
//set up a watcher to watch over changes
gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
  gulp.watch('src/server/**/*.ts', ['scripts']);
  gulp.watch('src/controller/**/*.ts', ['scripts']);
});

gulp.task('server', ['watch'], () => {
    nodemon({
        script: 'dist/server/app.js',
        env: { 'NODE_ENV': process.env.NODE_ENV || 'DEV' },
        watch: [
        'dist/server/**/*.js'
        ]
    })
})
