/**
 * @template T
 * @typedef {TomatoLib.EventData<T>} EventData
 */

const {
    saveSettingsDebounced,
} = SillyTavern.getContext();

export class GlobalSettings {

    /** @type {Object} */ defaults;
    /** @type {Object} */ settings;
    /** @type {Record<string, Function>} */ callbacks;

    /**
     * @param {Object} args
     * @param {Object} args.defaults
     * @param {Object} args.settingsSource
     * @param {Record<string, Function>} args.callbacks
     */
    constructor ({ defaults, settingsSource, callbacks }) {
        this.defaults = defaults;
        this.settings = settingsSource;
        this.callbacks = callbacks;

        this.onBoolean = this.onBoolean.bind(this);
        this.onText = this.onText.bind(this);
        this.onNumber = this.onNumber.bind(this);
        this.printSettings = this.printSettings.bind(this);
    }

    /**
     * @param {JQuery|HTMLElement} element
     * @returns {{callback: Function; setting: string;}}
     */
    getCallback(element) {
        const $target = $(element);
        const setting = $target.attr(`setting`);
        const callback = this.callbacks[setting];

        return { callback, setting };
    }

    /**
     * @param {JQuery.TriggeredEvent} event
     */
    onBoolean(event) {
        const $target = $(event.target);
        const { callback, setting } = this.getCallback($target);
        const value = Boolean($target.prop('checked'));

        this.settings[setting] = value;

        if (callback) callback();

        saveSettingsDebounced();
    }

    /**
     * @param {JQuery.TriggeredEvent} event
     */
    onText(event) {
        const $target = $(event.target);
        const { callback, setting } = this.getCallback($target);
        const value = String($target.val());
        const pattern = String($target.attr('pattern') || '');

        if (pattern) {
            const regex = new RegExp(pattern);
            const isValid = regex.test(value);

            if (!isValid) return;
        }

        this.settings[setting] = value;

        if (callback) callback();

        saveSettingsDebounced();
    }

    /**
     * @param {JQuery.TriggeredEvent} event
     */
    onNumber(event) {
        const target = event.target;
        const { callback, setting } = this.getCallback(target);

        const defValue = this.defaults[setting];
        const raw_value = isNaN(Number(target.value)) ? defValue : Number(target.value);
        const min = Number(target.getAttribute('min') || raw_value);
        const max = Number(target.getAttribute('max') || raw_value);

        const insideMinBoundary = min !== raw_value ? (min <= raw_value) : true;
        const insideMaxBoundary = max !== raw_value ? (max >= raw_value) : true;
        let value = raw_value;

        if (!insideMinBoundary) value = min;
        if (!insideMaxBoundary) value = max;

        this.settings[setting] = value;

        if (callback) callback();

        saveSettingsDebounced();
    }

    /**
     * Dumps all the setting values into the console
     */
    printSettings() {
        for (const [key, value] of Object.entries(this.settings))
            console.debug(`[${key}] is set to: ${value}`);
    }
}
