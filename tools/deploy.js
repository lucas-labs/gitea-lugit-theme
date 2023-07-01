import { Logger } from './utils/logger.js';
import { getArg } from './utils/funcs.js';
import { resolve } from 'path';
import { cwd } from 'process';
import { deploy } from './tasks/deploy.js';

const logger = new Logger('deploy', 'info', 'brightMagenta');

const src = './src';
const dist = './dist';
const serviceName = getArg('--service', 'gitea');
const srcPath = resolve(cwd(), src);
const distPath = resolve(cwd(), dist);
const serverPath = resolve(
    cwd(),
    getArg('--sever', 'D:/users/lucas/Desktop/dev/server/gitea')
);

logger.info('Deploy started!');
logger.info(`Service name: '${serviceName}'`);
logger.info(`Src path: ${srcPath}`);
logger.info(`Dist path: ${distPath}`);
logger.info(`Server path: ${serverPath}`);

function exit(err) {
    err && logger.error(err);
    process.exit(err ? 1 : 0);
}

async function executeDeployTask() {
    await deploy(srcPath, distPath, serverPath, serviceName);
}

executeDeployTask().then(exit).catch(exit);
