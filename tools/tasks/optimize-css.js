import { join } from 'path';
import { Logger } from '../utils/logger.js';
import { readFileSync, readdirSync } from 'fs';
import * as csstree from 'css-tree';
import { writeFile } from 'fs/promises';

const logger = new Logger('build', 'info', 'brightMagenta');

function getcCssFiles(distPath, path) {
    try {
        return readdirSync(join(distPath, path))
            .filter((fn) => fn.endsWith('.css') && !fn.endsWith('.min.css'))
            .map((file) => ({
                name: file.replace('.css', ''),
                path: join(distPath, path, file),
            }));
    } catch (err) {
        return [];
    }
}

export async function optimizeCss(distPath, replace = true) {
    // get the css files in the dist folder
    const cssFiles = getcCssFiles(distPath, 'public/assets/css');

    for (const file of cssFiles) {
        logger.info(`Sanitizing ${file.name} css file`);
        let usedCssVariables = [];        

        // read the css file
        const cssContent = readFileSync(file.path, { encoding: 'utf-8' });
        const ast = csstree.parse(cssContent, {});

        // get the css variables used in the css file
        csstree.walk(ast, (node) => {
            if (node.type === 'Function' && node.name === 'var') {
                // get the variable name
                for (const child of node.children) {
                    if (child.type === 'Identifier') {
                        usedCssVariables.push(child.name);
                    }
                }
            }

            // could also be that the variable is assigned to another variable
            if (node.type === 'Declaration' && node.property.startsWith('--')) {
                // check if its assigned to another variable
                if(node.property.startsWith('--')) {
                    if (node.value && node.value.type === 'Function' && node.value.name === 'var') {
                        for (const child of node.value.children) {
                            if (child.type === 'Identifier') {
                                if (!usedCssVariables.includes(child.name)) {
                                    usedCssVariables.push(child.name);
                                }
                            }
                        }
                    } else if (node.value && node.value.type === 'Raw' && node.value.value) {
                        const val = node.value.value.trimStart(); // var(--v-primary)

                        // if starts with var(, then its assigned to another variable or many variables, get everything that's inside
                        // var(...) using regex capturing 

                        // get all varname groups
                        const matches = val.matchAll(/var\((?<varname>[^),\s]+)/g);

                        for (const match of matches) {
                            // get the varname group
                            const varname = match.groups?.varname;

                            if (varname) {
                                if (!usedCssVariables.includes(varname)) {
                                    usedCssVariables.push(varname);
                                }
                            }
                        }                        
                    }
                }

                if (node.value.children) {
                    for (const child of node.value.children) {
                        if (child.type === 'Function' && child.name === 'var') {
                            for (const varChild of child.children) {
                                if (varChild.type === 'Identifier') {
                                    usedCssVariables.push(varChild.name);
                                }
                            }
                        }
                    }
                }
            }
        });

        // walk to find all variable declarations and remove the unused ones
        csstree.walk(ast, (node, item, list) => {
            if (
                node.type === 'Declaration' &&
                (node.property.startsWith('--v-') || node.property.startsWith('--c-'))
            ) {
                const variable = node.property;

                if (!usedCssVariables.includes(variable)) {
                    list.remove(item);
                }
            }
        });

        const finalPath = replace ? file.path : file.path.replace('.css', '.min.css');

        await writeFile(finalPath, csstree.generate(ast, { mode: 'safe' }));
    }
}
