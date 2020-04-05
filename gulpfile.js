const gulp = require(`gulp`);
const sourcemaps = require(`gulp-sourcemaps`);
const source = require(`vinyl-source-stream`);
const buffer = require(`vinyl-buffer`);
const browserify = require(`browserify`);
const sassify = require(`sassify`);
const babelify = require(`babelify`);

// const IS_PRODUCTION = process.env.NODE_ENV === `production`;
const dest = `build`;
const index = `src/index.js`;

const compile = () => {
  const bundler = browserify(index, {
    debug: true, // write own sourcemaps
    extensions: [`.js`],
  }).transform(sassify, {
    base64Encode: false,
    sourceMap: false,
    'no-auto-inject': false,
  });

  return bundler
    .transform(babelify)
    .bundle()
    .pipe(source(`bundle.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true })) // load browserify's sourcemaps
    .pipe(sourcemaps.write(`.`)) // write .map files near scripts
    .pipe(gulp.dest(dest));
};

gulp.task(`public`, () => {
  return gulp.src([`public/**`]).pipe(gulp.dest(dest));
});

gulp.task(`assets`, () => {
  return gulp.src([`src/assets/**`]).pipe(gulp.dest(`${dest}/assets`));
});

gulp.task(`js`, () => {
  return compile();
});

gulp.task(`build`, gulp.series([`js`, `assets`, `public`]));

gulp.task(`dev`, gulp.series(`build`), () => {
  gulp.watch(index, gulp.series(`build`));
});

// gulp.task(`default`, gulp.series(`build`));
