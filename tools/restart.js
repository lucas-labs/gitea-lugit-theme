import { getArg } from './utils/funcs.js';
import { restartService } from './tasks/restart-service.js';
import { Logger } from './utils/logger.js';

const logger = new Logger('restart', 'info', 'brightMagenta');
const serviceName = getArg('--service', 'gitea');

function exit(err) {
    if (err) {
        console.error(err);
    } else {
        console.log('');
        logger.info('Build completed successfully');
    }

    process.exit(err ? 1 : 0);
}

restartService(serviceName).then(exit).catch(exit);
