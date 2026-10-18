declare global {
    namespace TomatoLib {
        interface ExternalExtensions {};

        type GlobalSettings = import('./source/classes/GlobalSettings.js').GlobalSettings;
        type ChatSettings = import('./source/classes/ChatSettings.js').ChatSettings;
        type HTMLTemplateManager = import('./source/classes/HTMLTemplateManager.js').HTMLTemplateManager;

        type GlobalSettingsClass = typeof import('./source/classes/GlobalSettings.js').GlobalSettings;
        type ChatSettingsClass = typeof import('./source/classes/ChatSettings.js').ChatSettings;
        type HTMLTemplateManagerClass = typeof import('./source/classes/HTMLTemplateManager.js').HTMLTemplateManager;
        type ExternalExtensionClass = typeof import('./source/classes/ExternalExtension.js').ExternalExtension;

        type Utils = typeof import('./source/js/utils.js');

        type UserCharacter = {
            name: string;
            description?: string;
            avatar: string;
            is_user: boolean;
        };

        type FileAttachment = import('../../../chats.js').FileAttachment & {
            type: 'avatar' | 'file';
            extension: string;
        };

        type FileManagerData = {
            files?: FileAttachment[];
            images?: FileAttachment[];
        };

        type APIInstanceArgs = {
            extensionName: string;
            extensionMetadataName?: string;
            extensionFolderPath: string;
            extensionSettings?: Object;
            extensionSettingsDefaults?: Object;
            extensionChatSettingsDefaults?: Object;
            extensionCallbacks?: Record<string, Function>;
        };

        type APIInstance = {
            settings: {
                global: GlobalSettings;
                local: ChatSettings;
            };
            templates: HTMLTemplateManager;
            log: (...args: any[]) => void;
            debug: (...args: any[]) => void;
            error: (...args: any[]) => void;
        };

        type GlobalInterface = {
            API: {
                create: (args: APIInstanceArgs) => APIInstance;
                instances: Map<string, APIInstance>;
            };
            classes: {
                GlobalSettings: GlobalSettingsClass,
                ChatSettings: ChatSettingsClass,
                HTMLTemplateManager: HTMLTemplateManagerClass,
                ExternalExtension: ExternalExtensionClass,
            };
            utils: Utils;
            /** @readonly @enum */
            debounceTimeout: {
                MICRO: 50;
                SHORT: 300;
                MED: 500;
                LONG: 700;
            };
        };

        type EventData<T> =
            JQuery.TriggeredEvent<any, Record<any, any>, T, any> |
            JQuery.EventBase<any, Record<any, any>, T, any>;
    }
}

export {}