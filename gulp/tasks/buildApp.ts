let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let ts = plugins.typescript,
            buildConfig = config.tasks.browserifyApp;

        return gulp.src(buildConfig.src + config.wildcard + '.' + buildConfig.extensions.in)
            .pipe(ts(ts.createProject(config.root.file)))
            .pipe(gulp.dest(buildConfig.dest));
    };
};
