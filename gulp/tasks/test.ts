let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let testConfig = config.tasks.buildTests;
        return gulp.src(testConfig.dest + config.wildcard + '.' + testConfig.extensions.out)
            .pipe(plugins.jasmine());
    };
}
