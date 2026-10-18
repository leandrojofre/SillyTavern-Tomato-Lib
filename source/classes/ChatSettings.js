import {
    context,
    saveChat
} from "../../index.js";

export class ChatSettings {

    /** @type {string} */ metadataKey;

    /**
     * @param {Object} args
     * @param {string} args.metadataName
     * @param {Object} args.defaults
     */
    constructor ({metadataName, defaults}) {
        this.metadataKey = metadataName ? `${metadataName}_settings` : '';
        this.defaults = defaults;
    }

    refresh() {
        const { chatMetadata, chatId } = context();
        const { metadataKey } = this;

        if (!chatId || !metadataKey) return false;

        const currentMetadata = chatMetadata[metadataKey] || structuredClone(this.defaults);

        chatMetadata[metadataKey] = currentMetadata;

        return true;
    }

    update() {
        saveChat();
    }

    /**
     * @returns {string[]}
     */
    keys() {
        if (!this.refresh()) return;

        const { chatMetadata } = context();
        const { metadataKey } = this;

        return Object.keys(chatMetadata[metadataKey]);
    }

    /**
     * @param {string} name
     * @param {any} value
     */
    set(name, value) {
        if (!this.refresh()) return;
        if (!name || typeof name !== 'string') return;

        const { chatMetadata } = context();
        const { metadataKey } = this;

        chatMetadata[metadataKey][name] = value;

        this.update();
    }

    /**
     * @param {string} name
     */
    get(name) {
        if (!this.refresh()) return;
        if (!name || typeof name !== 'string') return;

        const { chatMetadata } = context();
        const { metadataKey } = this;

        return chatMetadata[metadataKey][name];
    }
}