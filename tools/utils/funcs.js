import {
    existsSync,
    lstatSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from 'fs';
import { basename, join } from 'path';

export function readFiles(path, extensions) {
    return readdirSync(path).filter((file) =>
        extensions.some((ext) => file.endsWith(ext))
    );
}

function copyFileSync(source, target) {
    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if (existsSync(target)) {
        if (lstatSync(target).isDirectory()) {
            targetFile = join(target, basename(source));
        }
    }

    writeFileSync(targetFile, readFileSync(source));
}

export function copyFolderRecursiveSync(source, target) {
    var files = [];

    var targetFolder = join(target, basename(source));
    if (!existsSync(targetFolder)) {
        mkdirSync(targetFolder);
    }

    // Copy
    if (lstatSync(source).isDirectory()) {
        files = readdirSync(source);
        files.forEach(function (file) {
            var curSource = join(source, file);
            if (lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

// https://github.com/bjoerge/debounce-promise/blob/master/index.js
export function debounce(fn, wait = 0, options = {}) {
    let lastCallAt;
    let deferred;
    let timer;
    let pendingArgs = [];
    return function debounced(...args) {
        const currentWait = getWait(wait);
        const currentTime = new Date().getTime();

        const isCold = !lastCallAt || currentTime - lastCallAt > currentWait;

        lastCallAt = currentTime;

        if (isCold && options.leading) {
            return options.accumulate
                ? Promise.resolve(fn.call(this, [args])).then((result) => result[0])
                : Promise.resolve(fn.call(this, ...args));
        }

        if (deferred) {
            clearTimeout(timer);
        } else {
            deferred = defer();
        }

        pendingArgs.push(args);
        timer = setTimeout(flush.bind(this), currentWait);

        if (options.accumulate) {
            const argsIndex = pendingArgs.length - 1;
            return deferred.promise.then((results) => results[argsIndex]);
        }

        return deferred.promise;
    };

    function flush() {
        const thisDeferred = deferred;
        clearTimeout(timer);

        Promise.resolve(
            options.accumulate
                ? fn.call(this, pendingArgs)
                : fn.apply(this, pendingArgs[pendingArgs.length - 1])
        ).then(thisDeferred.resolve, thisDeferred.reject);

        pendingArgs = [];
        deferred = null;
    }
}

function getWait(wait) {
    return typeof wait === 'function' ? wait() : wait;
}

function defer() {
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}

export async function sequence(tasks) {
    const results = [];
    for (const task of tasks) {
        results.push(await task());
    }
    return results;
}


async function tasksRunner(tasks, abort) {
    let result = null;
    for (const task of tasks) {
        if (abort.signal.aborted) {
            break;
        }

        result = await task(result);
    }
}

// each task should return a promise
// each task takes the result of the previous task as an argument
// the output of the last task is the output of the sequence
export async function sequenceStream(tasks) {
    const abort = new AbortController();

    abort.signal.addEventListener('abort', () => {
        console.log('sequenceStream aborted');
    });

    return [
        tasksRunner(tasks, abort),
        abort,
    ]
}

export const getArg = (flag, def) => {
    const args = process.argv.slice(2);
    const flagIndex = args.findIndex(arg => arg === flag);

    if (flagIndex !== -1 && flagIndex + 1 < args.length) {
        return args[flagIndex + 1];
    }

    return def || null;
};