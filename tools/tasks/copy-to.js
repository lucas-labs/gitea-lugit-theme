import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/logger.js';

const logger = new Logger(copyTo.name, 'info', 'brightYellow');

export async function copyTo(sourcePath, targetPath) {
    logger.info(`Copying ${sourcePath} to ${targetPath}`);
    await recursiveCopy(sourcePath, targetPath);
    logger.info(`Copy has finished!`);
}

async function recursiveCopy(sourcePath, targetPath) {
    // Create the target directory if it doesn't exist
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
    }

    // Get all files and directories in the source path
    const files = fs.readdirSync(sourcePath, { withFileTypes: true });

    for (const file of files) {
        const sourceFile = path.join(sourcePath, file.name);
        const targetFile = path.join(targetPath, file.name);

        if (file.isDirectory()) {
            // Recursively copy directories
            await recursiveCopy(sourceFile, targetFile);
        } else {
            // Copy files
            fs.copyFileSync(sourceFile, targetFile);
        }
    }
}
