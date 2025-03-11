/**
 * Transforms a WhatsApp template into the required format for the API
 * @param {Object} template - The template object from the list
 * @returns {Object} - Formatted template object for the API
 */
const formatTemplate = (template) => {
    if (!template || !template.name || !template.components) {
        throw new Error("Invalid template format");
    }

    const result = {
        content: {
            type: "template",
            name: template.name,
            language: {
                code: template.language || "en"
            },
            components: []
        }
    };

    // Process each component
    template.components.forEach(component => {
        // Skip components that don't have variables if they're BODY or FOOTER
        if ((component.type === "BODY" || component.type === "FOOTER") &&
            (!component.text || !component.text.includes("{{"))) {
            return; // Skip this component
        }

        const formattedComponent = {
            type: component.type.toLowerCase()
        };

        // Handle parameters based on component type
        switch (component.type) {
            case "HEADER":
                formattedComponent.parameters = formatHeaderParameters(component);
                break;
            case "BODY":
                formattedComponent.parameters = formatBodyParameters(component);
                break;
            case "FOOTER":
                // Footer typically doesn't need parameters, but add them if present
                if (component.text && component.text.includes("{{")) {
                    formattedComponent.parameters = extractParameters(component.text);
                }
                break;
            case "CAROUSEL":
                // For carousel, we need to format each card
                formattedComponent.parameters = formatCarouselParameters(component);
                break;
            case "BUTTONS":
                // For buttons, we need special handling
                formattedComponent.parameters = formatButtonParameters(component);
                break;
        }

        // Only add parameters if they exist
        if (!formattedComponent.parameters || formattedComponent.parameters.length === 0) {
            delete formattedComponent.parameters;
        }

        result.content.components.push(formattedComponent);
    });

    return result;
}

/**
 * Format header parameters based on format type
 * @param {Object} component - The header component
 * @returns {Array} - Formatted parameters
 */
const formatHeaderParameters = (component) => {
    const parameters = [];

    if (component.format === "IMAGE" && component.example && component.example.header_handle) {
        parameters.push({
            type: "image",
            url: component.example.header_handle[0]
        });
    } else if (component.format === "TEXT" && component.text) {
        // Extract parameters from text if they exist
        const textParams = extractParameters(component.text);
        if (textParams.length > 0) {
            return textParams;
        }

        // If example values are provided, use them
        if (component.example && component.example.header_text) {
            parameters.push({
                type: "text",
                text: component.example.header_text[0]
            });
        }
    }

    return parameters;
}

/**
 * Format body parameters
 * @param {Object} component - The body component
 * @returns {Array} - Formatted parameters
 */
const formatBodyParameters = (component) => {
    // Extract parameters from body text
    if (component.text && component.text.includes("{{")) {
        // If example values are provided, use them
        if (component.example && component.example.body_text) {
            return component.example.body_text[0].map(text => ({
                type: "text",
                text: text
            }));
        }

        // Otherwise extract placeholder parameters
        return extractParameters(component.text);
    }

    return [];
}

/**
 * Extract parameters from text with placeholders like {{1}}
 * @param {string} text - Text containing placeholders
 * @returns {Array} - Extracted parameters
 */
const extractParameters = (text) => {
    const parameters = [];
    const regex = /\{\{(\d+)\}\}/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        parameters.push({
            type: "text",
            text: `Parameter ${match[1]}`
        });
    }

    return parameters;
}

/**
 * Format carousel parameters
 * @param {Object} component - The carousel component
 * @returns {Array} - Formatted parameters
 */
const formatCarouselParameters = (component) => {
    const parameters = [];

    if (component.cards && Array.isArray(component.cards)) {
        component.cards.forEach(card => {
            // Process each card's components
            if (card.components) {
                card.components.forEach(cardComponent => {
                    if (cardComponent.type === "HEADER" && cardComponent.format === "IMAGE") {
                        parameters.push({
                            type: "image",
                            url: cardComponent.example?.header_handle?.[0] || ""
                        });
                    }
                });
            }
        });
    }

    return parameters;
}

/**
 * Format button parameters
 * @param {Object} component - The buttons component
 * @returns {Array} - Formatted parameters
 */
const formatButtonParameters = (component) => {
    const parameters = [];

    if (component.buttons && Array.isArray(component.buttons)) {
        component.buttons.forEach(button => {
            if (button.type === "URL" && button.url) {
                parameters.push({
                    type: "text",
                    text: button.url
                });
            } else if (button.type === "QUICK_REPLY" && button.text) {
                parameters.push({
                    type: "text",
                    text: button.text
                });
            }
        });
    }

    return parameters;
}
