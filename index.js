export {
    extensionName,
    context,
    saveChat,
    t,
};

import * as utils from './source/js/utils.js';

import { GlobalSettings } from './source/classes/GlobalSettings.js';
import { ChatSettings } from './source/classes/ChatSettings.js';
import { ExternalExtension } from './source/classes/ExternalExtension.js';
import { HTMLTemplateManager } from './source/classes/HTMLTemplateManager.js';

// * MARK:Types Definitions

/** @typedef {TomatoLib.GlobalInterface} GlobalInterface */

// * MARK:Extension variables

const context = () => SillyTavern.getContext();

const {
    t,
    saveChat,
    eventSource,
    eventTypes
} = context();

const {
    lodash
} = SillyTavern.libs;

const extensionName = "Tomato-Lib";
const extensionFullName = 'SillyTavern-Tomato-Lib';
const extensionFolderPath = `scripts/extensions/third-party/${extensionFullName}`;

function log(...mess) {
    const settings = this.extensionSettings || {};
    const name = this.extensionName || extensionName;

    if (!settings.enabled || !settings.debug) return;

    console.log(`[${name}]`, ...mess);
};

function debug(...mess) {
    const settings = this.extensionSettings || {};
    const name = this.extensionName || extensionName;

    if (!settings.enabled || !settings.debug) return;

    console.debug(`[${name}]`, ...mess);
};

function error(...mess) {
    const settings = this.extensionSettings || {};
    const name = this.extensionName || extensionName;

    if (!settings.enabled || !settings.debug) return;

    console.error(`[${name}]`, ...mess);
};

// * MARK:Extension Interface

/**
 * @type {TomatoLib.GlobalInterface}
 */
globalThis.TomatoLib = {
    API: {
        instances: new Map(),
        create(args) {
            const {
                extensionName,
                extensionMetadataName = '',
                extensionFolderPath,
                extensionSettings = {},
                extensionSettingsDefaults = {},
                extensionChatSettingsDefaults = {},
                extensionCallbacks = {},
            } = args;

            if (!extensionName) return;

            const instance = {
                settings: {
                    global: new GlobalSettings({
                        defaults: extensionSettingsDefaults,
                        settingsSource: extensionSettings,
                        callbacks: extensionCallbacks,
                    }),
                    local: new ChatSettings({
                        metadataName: extensionMetadataName,
                        defaults: extensionChatSettingsDefaults,
                    }),
                },
                templates: new HTMLTemplateManager({
                    folderPath: extensionFolderPath,
                }),
                log: log.bind({extensionSettings, extensionName}),
                debug: debug.bind({extensionSettings, extensionName}),
                error: error.bind({extensionSettings, extensionName}),
            };

            TomatoLib.API.instances.set(extensionName, instance);

            return instance;
        }
    },
    classes: {
        GlobalSettings,
        ChatSettings,
        HTMLTemplateManager,
        ExternalExtension,
    },
    debounceTimeout: Object.freeze({
        MICRO: 50,
        SHORT: 300,
        MED: 500,
        LONG: 700
    }),
    utils,
};

// * MARK:Initialize Extension

eventSource.once(eventTypes.APP_INITIALIZED, async function() {
    // ...
});
