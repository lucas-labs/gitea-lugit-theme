import { exec } from 'child_process';

import { Logger } from '../utils/logger.js';
const logger = new Logger(restartService.name, 'info', 'brightRed');

export async function restartService(serviceName) {
    return new Promise((resolve, reject) => {
        logger.info(`Restarting '${serviceName}' service...`);

        let command;
        let args;

        if (process.platform === 'win32') {
            command = 'cmd.exe';
            args = ['/c', 'net', 'stop', serviceName, '&&', 'net', 'start', serviceName];
        } else {
            command = 'sudo';
            args = ['systemctl', 'restart', serviceName];
        }

        exec(`${command} ${args.join(' ')}`, (error, stdout) => {
            if (error) {
                logger.error(`Failed to restart '${serviceName}' service: ${error}`);
                reject(error);
            } else {
                logger.info(`'${serviceName}' service restarted!`);
                resolve(stdout);
            }
        });
    });
}
