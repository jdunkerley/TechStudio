let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let sourcemaps = plugins.sourcemaps,
            ts = plugins.typescript,
            buildConfig = config.tasks.buildTests;

        // Because the tests are transpiling src on the fly cleaning the transpiled src is safe.
        return gulp.src(buildConfig.src + '.' + buildConfig.extensions.in)
            .pipe(sourcemaps.init())
            .pipe(ts(ts.createProject(config.root.file)))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(buildConfig.dest));
    };
};
