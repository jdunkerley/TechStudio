import * as path from 'path';
import * as del from 'del';
let config = require('../config');

export default (gulp: any, plugins: any) => {
    return () => {
        let files: string[] = [];

        let wildcard = config.wildcard;
        for (let key in config.tasks) {
            if (config.tasks.hasOwnProperty(key)) {
                let task = config.tasks[key];

                if (task.dest) {
                    let glob = wildcard + '.{' + task.extensions.out + ',map}';
                    files.push(path.join(task.dest, glob));
                }
            }
        }

        files.push(path.join(config.dest + wildcard));
        files.push(path.join(config.appdest + wildcard));

        // Don't delete from node_modules or source!
        files.push('!node_modules' + wildcard);
        files.push('!' + path.join(config.root.src, wildcard));

        return del(files);
    };
}
