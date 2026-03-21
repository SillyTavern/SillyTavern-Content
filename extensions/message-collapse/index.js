/**
 * Message Collapser Extension for SillyTavern
 *
 * Automatically collapse long messages with expand button.
 * Configurable threshold and toggle.
 *
 * @author Crystaria (with Xiao Zhua)
 * @version 1.1.0
 * @license AGPL-3.0
 * @scope third-party
 */

// ========== Extension Constants ==========
const EXTENSION_NAME = 'message-collapse';
const EXTENSION_VERSION = '1.1.0';

// Timing constants (ms)
const MESSAGE_PROCESS_DELAY = 100;
const CHAT_CHANGED_DELAY = 500;
const STATUS_MESSAGE_DURATION = 3000;

// Setting validation ranges
const SETTING_RANGES = {
    threshold: { min: 100, max: 5000, step: 100, default: 1000 },
    previewLines: { min: 5, max: 30, step: 1, default: 10 },
};

// ========== Import dependencies (Third-party extension pattern) ==========
import { extension_settings, getContext } from '../../../extensions.js';
import { saveSettingsDebounced, eventSource, event_types } from '../../../../script.js';

/**
 * Default extension settings
 */
const defaultSettings = Object.freeze({
    enabled: true,
    threshold: SETTING_RANGES.threshold.default,
    previewLines: SETTING_RANGES.previewLines.default,
});

/**
 * Settings HTML template (uses CSS classes from style.css)
 */
const SETTINGS_HTML = `
<div id="message-collapser-settings">
    <h4>Message Collapser Settings</h4>

    <div class="form-group">
        <label>
            <input type="checkbox" id="mc-enabled">
            <span>Enable Message Collapser</span>
        </label>
    </div>

    <div class="form-group">
        <label for="mc-threshold">Threshold (characters):</label>
        <input type="number" id="mc-threshold" value="1000" min="100" max="5000" step="100">
    </div>

    <div class="form-group">
        <label for="mc-preview">Preview Lines:</label>
        <input type="number" id="mc-preview" value="10" min="5" max="30" step="1">
    </div>

    <button id="mc-save">Save Settings</button>

    <div id="mc-status"></div>
</div>
`;

/**
 * Initialize extension settings storage
 * Ensures all required keys exist in storage
 */
function initSettingsStorage() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = {};
    }

    const stored = extension_settings[EXTENSION_NAME];

    // Initialize missing keys with defaults
    for (const [key, value] of Object.entries(defaultSettings)) {
        if (stored[key] === undefined) {
            stored[key] = value;
        }
    }

    return stored;
}

/**
 * Get extension settings with proper initialization
 * @returns {Object} Current extension settings
 */
function getSettings() {
    const stored = initSettingsStorage();

    // Return merged settings (stored values take precedence)
    return {
        enabled: stored.enabled ?? defaultSettings.enabled,
        threshold: stored.threshold ?? defaultSettings.threshold,
        previewLines: stored.previewLines ?? defaultSettings.previewLines,
    };
}

/**
 * Validate a setting value against its allowed range
 * @param {string} key - Setting key
 * @param {number} value - Value to validate
 * @returns {Object} Validation result with isValid and corrected value
 */
function validateSetting(key, value) {
    const range = SETTING_RANGES[key];
    if (!range) {
        return { isValid: false, error: `Unknown setting: ${key}` };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
        return { isValid: false, error: `Value must be a number` };
    }

    if (numValue < range.min || numValue > range.max) {
        return {
            isValid: false,
            error: `Value must be between ${range.min} and ${range.max}`,
            corrected: Math.max(range.min, Math.min(range.max, numValue))
        };
    }

    return { isValid: true, value: numValue };
}

/**
 * Save extension settings to disk (Official pattern)
 * Updates both extension_settings and storage
 */
function saveSettingsSync() {
    const settings = getSettings();
    extension_settings[EXTENSION_NAME] = { ...settings };
    saveSettingsDebounced();
    console.log('[MessageCollapser] Settings saved:', settings);
}

/**
 * Save settings with validation
 * @param {Object} newSettings - Settings to save
 * @returns {Object} Save result with success status and errors
 */
function saveSettingsWithValidation(newSettings) {
    const errors = [];
    const validatedSettings = {};

    // Validate threshold
    const thresholdResult = validateSetting('threshold', newSettings.threshold);
    if (thresholdResult.isValid) {
        validatedSettings.threshold = thresholdResult.value;
    } else {
        errors.push(`Threshold: ${thresholdResult.error}`);
        validatedSettings.threshold = thresholdResult.corrected ?? SETTING_RANGES.threshold.default;
    }

    // Validate previewLines
    const previewResult = validateSetting('previewLines', newSettings.previewLines);
    if (previewResult.isValid) {
        validatedSettings.previewLines = previewResult.value;
    } else {
        errors.push(`Preview Lines: ${previewResult.error}`);
        validatedSettings.previewLines = previewResult.corrected ?? SETTING_RANGES.previewLines.default;
    }

    // Save validated settings
    const settings = getSettings();
    extension_settings[EXTENSION_NAME] = {
        ...settings,
        ...validatedSettings,
        enabled: newSettings.enabled ?? settings.enabled,
    };
    saveSettingsDebounced();

    return {
        success: errors.length === 0,
        errors,
        settings: extension_settings[EXTENSION_NAME],
    };
}

/**
 * Show status message in the settings panel
 * @param {HTMLElement} statusElement - Status display element
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, info)
 */
function showStatusMessage(statusElement, message, type = 'success') {
    if (!statusElement) return;

    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3',
    };

    statusElement.textContent = message;
    statusElement.style.color = colors[type] || colors.success;

    setTimeout(() => {
        if (statusElement) statusElement.textContent = '';
    }, STATUS_MESSAGE_DURATION);
}

/**
 * Add settings UI to extension panel
 */
function addSettingsUI() {
    try {
        // Use jQuery to append settings HTML (SillyTavern pattern)
        $('#extensions_settings').append(SETTINGS_HTML);

        // Initialize UI with current settings
        initializeUI();
    } catch (error) {
        console.error('[MessageCollapser] Error in addSettingsUI:', error);
        throw error;
    }
}

/**
 * Initialize UI controls with current settings
 */
function initializeUI() {
    const settings = getSettings();

    const enabledCheckbox = document.getElementById('mc-enabled');
    const thresholdInput = document.getElementById('mc-threshold');
    const previewInput = document.getElementById('mc-preview');
    const saveButton = document.getElementById('mc-save');
    const statusDiv = document.getElementById('mc-status');

    if (!enabledCheckbox || !thresholdInput || !previewInput || !saveButton) {
        console.error('[MessageCollapser] UI elements not found!');
        return;
    }

    // Load current settings
    enabledCheckbox.checked = settings.enabled;
    thresholdInput.value = settings.threshold;
    previewInput.value = settings.previewLines;

    console.log('[MessageCollapser] UI initialized with settings:', settings);

    // Save button handler
    saveButton.addEventListener('click', () => {
        const newSettings = {
            enabled: enabledCheckbox.checked,
            threshold: parseInt(thresholdInput.value, 10),
            previewLines: parseInt(previewInput.value, 10),
        };

        const result = saveSettingsWithValidation(newSettings);

        if (result.success) {
            showStatusMessage(statusDiv, `Settings saved at ${new Date().toLocaleTimeString()}`, 'success');
            // Reprocess all messages with new settings
            reprocessAllMessages();
        } else {
            const warningMsg = `Saved with adjustments: ${result.errors.join('; ')}`;
            showStatusMessage(statusDiv, warningMsg, 'info');
        }
    });
}

/**
 * Handle new message received
 * @param {Object} args - Event arguments containing messageId
 */
function onMessageReceived(args) {
    const settings = getSettings();

    if (!settings.enabled) {
        return;
    }

    // Process message after short delay to allow DOM to update
    setTimeout(() => {
        try {
            const messageId = args?.messageId;
            if (!messageId) {
                return;
            }

            const messageElement = document.querySelector(`[messageid="${messageId}"]`);
            if (!messageElement) {
                return;
            }

            processMessage(messageElement, settings);
        } catch (error) {
            console.error('[MessageCollapser] Error in message handler:', error);
        }
    }, MESSAGE_PROCESS_DELAY);
}

/**
 * Handle chat changed - reprocess all messages
 */
function onChatChanged() {
    const settings = getSettings();

    if (!settings.enabled) {
        return;
    }

    // Process all existing messages after delay
    setTimeout(() => {
        try {
            const messages = document.querySelectorAll('.mes');

            messages.forEach((msg) => {
                try {
                    processMessage(msg, settings);
                } catch (error) {
                    console.error('[MessageCollapser] Error processing message:', error);
                }
            });
        } catch (error) {
            console.error('[MessageCollapser] Error in chat change handler:', error);
        }
    }, CHAT_CHANGED_DELAY);
}

/**
 * Get text content length for collapse calculation
 * Handles both plain text and HTML content
 * @param {HTMLElement} textElement - Message text element
 * @returns {number} Character count
 */
function getMessageLength(textElement) {
    // Use textContent for accurate character count (excludes HTML tags)
    const textContent = textElement.textContent || '';
    // Trim whitespace for more accurate counting
    return textContent.trim().length;
}

/**
 * Process a single message element
 * @param {HTMLElement} messageElement - Message DOM element
 * @param {Object} settings - Extension settings
 */
function processMessage(messageElement, settings) {
    try {
        // Skip if already processed (has collapse toggle)
        if (messageElement.querySelector('.collapse-toggle')) {
            return;
        }

        // Get message text element
        const textElement = messageElement.querySelector('.mes_text');
        if (!textElement) {
            return;
        }

        // Skip if message is short enough
        const messageLength = getMessageLength(textElement);
        if (messageLength <= settings.threshold) {
            return;
        }

        // Apply collapse effect
        collapseMessage(textElement, settings);
    } catch (error) {
        console.error('[MessageCollapser] Error in processMessage:', error);
    }
}

/**
 * Collapse a message element with preview and toggle button
 * @param {HTMLElement} textElement - Message text element to collapse
 * @param {Object} settings - Extension settings
 */
function collapseMessage(textElement, settings) {
    try {
        const previewLines = settings.previewLines;
        const innerHTML = textElement.innerHTML;

        // Split by line breaks for preview calculation
        const lines = innerHTML.split(/\r?\n/);

        // Don't collapse if fewer lines than preview setting
        if (lines.length <= previewLines) {
            return;
        }

        // Create preview content (first N lines)
        const previewContent = lines.slice(0, previewLines).join('\n');

        // Create wrapper element
        const wrapper = document.createElement('div');
        wrapper.className = 'message-collapser-wrapper';

        // Create preview container (visible when collapsed)
        const previewContainer = document.createElement('div');
        previewContainer.className = 'message-collapser-preview';
        previewContainer.innerHTML = previewContent;

        // Create full content container (hidden initially)
        const fullContainer = document.createElement('div');
        fullContainer.className = 'message-collapser-full';
        fullContainer.style.display = 'none';
        fullContainer.innerHTML = innerHTML;

        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'collapse-toggle';
        toggleButton.type = 'button';
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.innerHTML = '<span class="collapse-icon">📄</span><span class="collapse-text">Show more</span>';

        // Toggle click handler
        toggleButton.addEventListener('click', () => {
            const isCollapsed = fullContainer.style.display === 'none';
            if (isCollapsed) {
                // Expand
                previewContainer.style.display = 'none';
                fullContainer.style.display = 'block';
                toggleButton.setAttribute('aria-expanded', 'true');
                toggleButton.querySelector('.collapse-text').textContent = 'Show less';
            } else {
                // Collapse
                previewContainer.style.display = 'block';
                fullContainer.style.display = 'none';
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.querySelector('.collapse-text').textContent = 'Show more';

                // Scroll back to top of collapsed content for better UX
                wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        // Assemble the structure
        wrapper.appendChild(previewContainer);
        wrapper.appendChild(fullContainer);
        wrapper.appendChild(toggleButton);

        // Replace original content with collapsed structure
        textElement.innerHTML = '';
        textElement.appendChild(wrapper);
    } catch (error) {
        console.error('[MessageCollapser] Error in collapseMessage:', error);
    }
}

/**
 * Re-process all messages with current settings
 * Useful when settings change or extension is re-enabled
 */
function reprocessAllMessages() {
    const settings = getSettings();
    const messages = document.querySelectorAll('.mes');

    messages.forEach((msg) => {
        try {
            // Remove existing collapse wrapper if present
            const existingWrapper = msg.querySelector('.message-collapser-wrapper');
            if (existingWrapper) {
                const textElement = msg.querySelector('.mes_text');
                if (textElement) {
                    // Restore original content from full container if expanded
                    const fullContainer = existingWrapper.querySelector('.message-collapser-full');
                    if (fullContainer && fullContainer.style.display === 'block') {
                        textElement.innerHTML = fullContainer.innerHTML;
                    } else {
                        // Was collapsed, restore from preview
                        const previewContainer = existingWrapper.querySelector('.message-collapser-preview');
                        if (previewContainer) {
                            textElement.innerHTML = previewContainer.innerHTML;
                        }
                    }
                }
            }

            // Re-process with current settings
            if (settings.enabled) {
                processMessage(msg, settings);
            }
        } catch (error) {
            console.error('[MessageCollapser] Error reprocessing message:', error);
        }
    });
}

/**
 * Initialize the extension
 * Sets up UI, event listeners, and processes existing messages
 */
async function init() {
    try {
        // Initialize settings storage
        initSettingsStorage();

        console.log('[MessageCollapser] Extension v' + EXTENSION_VERSION + ' initializing...');

        // Add settings UI using jQuery (SillyTavern pattern)
        addSettingsUI();

        // Register event listeners
        if (eventSource && event_types) {
            eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);
            eventSource.on(event_types.CHAT_CHANGED, onChatChanged);
            console.log('[MessageCollapser] Event listeners registered');
        } else {
            console.warn('[MessageCollapser] Event source not available');
        }

        // Process existing messages
        setTimeout(() => {
            reprocessAllMessages();
        }, CHAT_CHANGED_DELAY);

        console.log('[MessageCollapser] Extension loaded successfully');
    } catch (error) {
        console.error('[MessageCollapser] Initialization failed:', error);
        throw error;
    }
}

// Initialize on jQuery ready (SillyTavern third-party extension pattern)
jQuery(async () => {
    await init();
});

// Export for external access and testing
export {
    EXTENSION_NAME,
    EXTENSION_VERSION,
    defaultSettings,
    getSettings,
    init,
    reprocessAllMessages,
};
