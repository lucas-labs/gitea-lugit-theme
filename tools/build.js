import { join } from 'path';
import { cwd } from 'process';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { buildScss } from './tasks/scss.js';
import { buildImg } from './tasks/img.js';
import { buildTemplates } from './tasks/templates.js';
import { Logger } from './utils/logger.js';
import { buildFonts } from './tasks/fonts.js';
const srcPath = join(cwd(), 'src');
const distPath = join(cwd(), 'dist');

const logger = new Logger('build', 'info', 'brightMagenta');

function exit(err) {
    if (err) {
        console.error(err);
    } else {
        console.log('')
        logger.info('Build completed successfully');
    }

    process.exit(err ? 1 : 0);
}

async function build() {
    // cleaning, remove dist folder
    if (existsSync(distPath)) {
        rmSync(distPath, { recursive: true });
    }

    // recreate dist folder
    mkdirSync(distPath, { recursive: true });

    // start building tasks
    await Promise.all([
        buildScss(srcPath, distPath),
        buildImg(srcPath, distPath),
        buildFonts(srcPath, distPath),
        buildTemplates(srcPath, distPath),
    ]);
}

build().then(exit).catch(exit);
