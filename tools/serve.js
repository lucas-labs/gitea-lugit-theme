import { watch } from 'chokidar';
import { TaskDebouncer } from './utils/task-debouncer.js';
import { Logger } from './utils/logger.js';
import { getArg } from './utils/funcs.js';
import { resolve } from 'path';
import { cwd } from 'process';
import { deploy } from './tasks/deploy.js';

const src = './src';
const dist = './dist';
const serviceName = getArg('--service', 'gitea');
const srcPath = resolve(cwd(), src);
const distPath = resolve(cwd(), dist);
const serverPath = resolve(
    cwd(),
    getArg('--sever', 'd:/gitea')
);
const debouncer = new TaskDebouncer(300);
const logger = new Logger('serve', 'info', 'brightMagenta');

logger.info('Serve task started!');
logger.info('Watching for changes...');
logger.info(`Service name: '${serviceName}'`);
logger.info(`Src path: ${srcPath}`);
logger.info(`Dist path: ${distPath}`);
logger.info(`Server path: ${serverPath}`);

const watcher = watch([`${src}/**/*`], {
    persistent: true,
    ignoreInitial: true,
});

watcher.on('change', (file) => debouncer.add(
    deploy,
    srcPath,
    distPath,
    serverPath,
    serviceName,
    file,
));
