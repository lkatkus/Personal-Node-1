"use strict";

/**
 * Class holds various contants.
 */
class Const {

///////////////////////////////////////////////////////////////////////////////
// Constants used in HTMLUtil class.
///////////////////////////////////////////////////////////////////////////////

    /**
     * Object with HTML replacements for characters.
     * @type {Object}
     */
    static get HTML_CHAR_MAP() {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&apos;",
            "\\": "&#x005C;",
            "\n": "\\n",
            "\r": "\\r",
            "\t": "&#x0009;",
            "\u2028": "&#x2028;",
            "\u2029": "&#x2029;"
        };
    }

///////////////////////////////////////////////////////////////////////////////
// Constants used in XMLUtil class.
///////////////////////////////////////////////////////////////////////////////

    /**
     * Object with XML replacements for characters.
     * @type {Object}
     */
    static get XML_CHAR_MAP() {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&apos;"
        };
    }

    /**
     * Property name where attributes are stored.
     *
     * @type {string}
     */
    static get XML_ATTRIBUTES() {
        return "$";
    }

    /**
     * Property name where subelements are stored.
     *
     * @type {string}
     */
    static get XML_SUBELEMENTS() {
        return "$$";
    }

    /**
     * Property name where text is stored.
     *
     * @type {string}
     */
    static get XML_TEXT() {
        return "_";
    }

    /**
     * Property name for text value.
     *
     * @type {string}
     */
    static get XML_TEXT_VALUE() {
        return "__TEXT_VALUE__";
    }

}

module.exports = Const;
