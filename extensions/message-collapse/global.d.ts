/**
 * Message Collapser Extension for SillyTavern
 * TypeScript type declarations
 * 
 * @version 1.1.0
 * @see https://docs.sillytavern.app/for-contributors/writing-extensions/
 */

export {};

// Import global types from SillyTavern
// Adjust path based on extension location:
// - For user-scoped: ../../../../public/global
// - For server-scoped: ../../../../global
import '../../../../public/global';

declare global {
    /**
     * Extension configuration interface
     */
    interface MessageCollapserSettings {
        /** Enable/disable extension */
        enabled: boolean;
        /** Character threshold for collapse (100-5000) */
        threshold: number;
        /** Preview lines count (5-30) */
        previewLines: number;
    }

    /**
     * Extension metadata
     */
    interface MessageCollapserManifest {
        display_name: string;
        loading_order: number;
        requires: string[];
        optional: string[];
        js: string;
        css: string;
        author: string;
        version: string;
        homePage: string;
        auto_update: boolean;
        description: string;
        scope?: string;
        entrypoint?: string;
    }
}

// Extension exports
export const EXTENSION_NAME: string;
export const defaultSettings: MessageCollapserSettings;
