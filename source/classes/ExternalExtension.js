/** @typedef {TomatoLib.ExternalExtensions} ExternalExtensions */

/**
 * @template {keyof ExternalExtensions} Name
 */

export class ExternalExtension {
    /** @type {Name} */ key;
    /** @type {boolean} */ enabled;
    /** @type {typeof globalThis[Name]} */ global;

    /**
     * @param {Name} key
     */
    constructor (key) {
        this.key = key;
        this.enabled = key in globalThis;
        this.global = key in globalThis ? globalThis[key] : null;
    }

    /**
     * @template {keyof typeof globalThis[Name]} K
     * @param {K} key
     * @param {any[]} [args]
     * @returns {ReturnType<typeof globalThis[Name][K]>}
     */
    call(key, ...args) {
        if (!this.enabled) return;

        const value = this.global[key];

        if (!value || typeof value !== 'function') return;

        // @ts-ignore
        return args.length > 0 ? value(...args) : value();
    }

    /**
     * @template {keyof typeof globalThis[Name]} K
     * @param {K} key
     * @returns {typeof globalThis[Name][K]}
     */
    get(key) {
        if (!this.enabled) return;

        const value = this.global[key];

        if (!value) return;
        if (typeof value === 'function') return;
        return value;
    }
}