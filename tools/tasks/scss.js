import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Logger } from '../utils/logger.js';
import { compile } from 'sass';

const logger = new Logger(buildScss.name, 'debug', 'pink');
const scss_home = 'themes/scss';
const css_home = '/public/css';

export async function buildScss(src_home, dist_home) {
    logger.info('SCSS build has started');
    const themes = get_themes(src_home);
    mkdirSync(join(dist_home, css_home), { recursive: true });

    for (const theme of themes) {
        logger.debug(`Building ${theme.name} theme`);

        const result = compile(theme.path, {
            loadPaths: [join(src_home, scss_home), join(src_home, '../node_modules')],
            quietDeps: true,
            logger: {
                debug: logger.simpleDebug.bind(logger),
                info:  logger.simpleInfo.bind(logger),
                warn:  logger.simpleWarn.bind(logger),
                error: logger.simpleError.bind(logger),
            }
        });
        
        logger.debug(`Writing ${theme.name} theme to disk`);

        writeFileSync(
            join(dist_home, css_home, `theme-${theme.name}.css`),
            result.css
        );
    }

    logger.info('SCSS build has finished');
}


function get_themes(src_home) {
    return readdirSync(join(src_home, scss_home)).filter(
        (fn) => fn.endsWith('.scss') && !fn.startsWith('_')
    ).map((file) => ({
        name: file.replace('.scss', ''),
        path: join(src_home, scss_home, file),
    }))
}


// for (const flavor of Object.keys(variants)) {
//     for (const accent of accents) {
//         const input = builder(flavor, accent);
//         const result = compileString(input, {
//             loadPaths: [join(__dirname, 'src'), join(__dirname, 'node_modules')],
//         });

//         mkdirSync(join(__dirname, 'dist'), { recursive: true });
//         writeFileSync(
//             join(__dirname, 'dist', `theme-catppuccin-${flavor}-${accent}.css`),
//             result.css
//         );
//     }
// }
