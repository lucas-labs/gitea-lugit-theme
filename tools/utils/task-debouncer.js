/**
 * #### TaskDebouncer
 *
 * Executes a task after a certain delay, but cancels the execution if
 * a new task is sent before the delay expires. Also, if a task is
 * already being executed, the new task is queued and executed after
 * the current one finishes. It will only execute the task that was
 * sent last.
 */
export class TaskDebouncer {
    constructor(debounceDelay) {
        this.debounceDelay = debounceDelay;
        this.queued = undefined;
        this.isProcessing = false;
        this.timerId = null;
    }

    #clearQueue() {
        this.queued = undefined;
    }

    #enqueue(executor, args) {
        this.queued = { executor, args };
        this.#processQueue();
    }

    #setProcessing(value) {
        this.isProcessing = value;
    }

    async #processQueue() {
        if (this.isProcessing || !this.queued) {
            return;
        }
        const { executor, args } = this.queued;
        this.#clearQueue();

        // execute the task
        this.#setProcessing(true);
        await executor(...args);
        this.#setProcessing(false);

        // continue with the next task
        this.#continue();
    }

    #continue() {
        if (this.queued) {
            this.#processQueue();
        }
    }

    /**
     * Adds a task to the queue. If a task is already being executed,
     * the new task is queued and executed after the current one finishes.
     * It will only execute the task if no other task is sent before the
     * delay expires or before the current task finishes.
     *
     * IOW, it will only execute the task that was sent last.
     */
    add(executor, ...args) {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            this.#enqueue(executor, args);
        }, this.debounceDelay);
    }
}
