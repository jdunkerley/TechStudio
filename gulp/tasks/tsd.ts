let config = require('../config');

// This task will fetch the most recent typings, and needs to initially be run once, before any other task.
// Thereafter it only needs to be run to update the existing typings.
export default (gulp: any, plugins: any) => {
    return () => {
        return gulp.src(config.root.tsd)
            .pipe(plugins.tsd());
    };
};
