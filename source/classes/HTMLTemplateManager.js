import {
    extensionName,
    t,
} from '../../index.js';

export class HTMLTemplateManager {

    /** @type {Map<string, JQuery<HTMLElement>>} */ cache;
    /** @type {string} */ folderPath;
    /** @type {boolean} */ didFetchFallback;

    constructor ({ folderPath }) {
        this.cache = new Map();
        this.folderPath = folderPath;
        this.didFetchFallback = false;
    }

	/**
     * @typedef {Object} HTMLTemplateGetOptions
     * @property {boolean} [clone]
     *
     * @param {string} [fileName]
     * @param {HTMLTemplateGetOptions} [options]
     * @returns {Promise<JQuery<HTMLElement>>}
     */
    async get(fileName = 'settings', {clone = false} = {}) {
        const manager = this;

		if (!this.cache.has(fileName)) {
            try {
                await $
                    .get(`${this.folderPath}/source/templates/${fileName}.html`)
                    .done(function(response) {
                        manager.cache.set(fileName, $(response));
                    });
            } catch (error) {
				const tryFallbackPath = error?.status === 404 && !this.didFetchFallback;

				console.error('Template rendering error.', {error});

				if (tryFallbackPath) {
					this.folderPath = `${this.folderPath}.git`;
					this.didFetchFallback = true;

					console.warn(`Failed to fetch ${fileName}.html, attempting fallback path...`, {
                        error,
                        HTML_TEMPLATES: structuredClone({
                            folderPath: this.folderPath,
                            didFetchFallback: this.didFetchFallback,
                        }),
                    });

					return await this.get(fileName, {clone});
				}
            }
        }

        const $file = this.cache.get(fileName);

        if (!$file) {
            toastr.warning(t`HTML template ${fileName} could not be loaded`, extensionName);

            return $();
        }

		return clone ? $file.clone() : $file;
    }
}