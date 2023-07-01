const LOG_LEVEL_MAP = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const ANSI_COLORS = {
    reset: '\x1b[0m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    pink: '\x1b[38;2;255;182;193m'
};

export class Logger {
    /**
     * @param {string} ctx
     * @param {'debug'|'info'|'warn'|'error'} log_level - default: 'debug'
     * @param {'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'white'|'gray'|'brightRed'|
     *        'brightGreen'|'brightYellow'|'brightBlue'|'brightMagenta'|'brightCyan'|'pink'} color - default: 'magenta'
     */
    constructor(ctx, log_level, color = 'magenta') {
        this.ctx = ctx;
        this.log_level = LOG_LEVEL_MAP[log_level || 'debug'];
        this.color = ANSI_COLORS[color] || ANSI_COLORS.reset;

        if (this.log_level === undefined) {
            throw new Error(`Invalid log level: ${log_level}`);
        }
    }

    debug(...args) {
        if (!this.#canLog('debug')) return;
        this.log('DEBUG', false, ...args);
    }

    info(...args) {
        if (!this.#canLog('info')) return;
        this.log('INFO', false, ...args);
    }

    warn(...args) {
        if (!this.#canLog('warn')) return;
        this.log('WARN', false, ...args);
        
    }

    error(...args) {
        if (!this.#canLog('error')) return;
        this.log('ERROR', false, ...args);
    }

    log(level, simple, ...args) {
        if (simple) {
            args = [args[0]];
        }

        if (level === 'ERROR') {
            console.error(
                `${this.color}[${level}] [${this.ctx}]${ANSI_COLORS.reset}`,
                ...args
            );
        } else {
            console.log('🍵', `${this.color}[${this.ctx}]${ANSI_COLORS.reset}`, ...args);
        }
    }

    simpleDebug(...args) {
        if (!this.#canLog('debug')) return;
        this.log('DEBUG', true, ...args);
    }

    simpleInfo(...args) {
        if (!this.#canLog('info')) return;
        this.log('INFO', true, ...args);
    }

    simpleWarn(...args) {
        if (!this.#canLog('warn')) return;
        this.log('WARN', true, ...args);
        
    }

    simpleError(...args) {
        if (!this.#canLog('error')) return;
        this.log('ERROR', true, ...args);
    }

    #canLog(level) {
        return this.log_level <= LOG_LEVEL_MAP[level];
    }
}
