"use strict";

const assert = require("assert");

const Exception = require("srv-core").Exception;

const Const = require("./Const");
const Util = require("./Util");

/**
 * Class holds various HTML utility methods.
 */
class HTMLUtil {

    /**
     * Escapes special characters so it is safe to add text to html as value.
     * Replaces following characters: & < > " ' \ \n \r \t \u2028 \u2029
     *
     * @param {string} text - String to escape
     * @return {string} Text can be added to html as value
     */
    static escapeHtml(text) {
        text = Util.concatenate(text);
        return text.replace(/[&<>"'\\\n\r\t\u2028\u2029]/g, function (c) {
		return Const.HTML_CHAR_MAP[c];
        });
    };

    /**
     * Returns simple HTML start string.
     *
     * @type {string}
     */
    static get htmlStart() {
        return "<html><body>";
    }

    /**
     * Returns simple HTML end string.
     *
     * @type {string}
     */
    static get htmlEnd() {
        return "</body></html>";
    }

    /**
     * Generates HTML page for specified error.
     *
     * @param {*} err - Error to show
     * @param {boolean} showStack - Shows stack trace if <code>true</code>
     * @param {string} [title=Error] - HTML page title
     * @returns {string} Generated HTML page
     */
    static generateErrorHTMLPage(err, showStack, title = "Error") {
        let html = "<!DOCTYPE html>";
        html += "<html>";
        html += "<head>";
        html += "<title>" + HTMLUtil.escapeHtml(title) + "</title>";
        html += "</head>";
        html += "<body>";
        html += HTMLUtil.generateErrorHTMLBody(err, showStack);
        html += "</body>";
        html += "</html>";
        return html;
    }

    /**
     * Generates HTML body for specified error.
     *
     * @param {*} err - Error to show
     * @param {boolean} [showStack=true] - Shows stack trace if true
     * @returns {string} Generated HTML part with specified error
     */
    static generateErrorHTMLBody(err, showStack = true) {
        let html = "";
        err = Exception.errSerializer(err, showStack);
        if (typeof err === "object") {
            let stackLines = err.stack;
            if (stackLines) {
                stackLines = stackLines.split("\n");
            } else {
                stackLines = [];
            }
            if (stackLines.length > 0) {
                html += "<h1>" + HTMLUtil.escapeHtml(stackLines[0]) + "</h1>";
                if (showStack) {
                    html += "<pre>";
                    for (let i = 1, l = stackLines.length; i < l; i++) {
                        html += "\n" + HTMLUtil.escapeHtml(stackLines[i]);
                    }
                    html += "</pre>";
                }
            } else {
                if (err.name || err.message) {
                    html += "<h1>" + HTMLUtil.escapeHtml(err.name) + ": " + HTMLUtil.escapeHtml(err.message) + "</h1>";
                } else {
                    html += "<h1>Error:"+ HTMLUtil.escapeHtml(err.toString()) + "</h1>";
                }
            }
            if (err.cause) {
                html += "<h2>Caused by:</h2>";
                html += HTMLUtil.generateErrorHTMLBody(err.cause, showStack);
            }
        } else {
            html += "<h1>" + HTMLUtil.escapeHtml(err) + "</h1>";
        }
        return html;
    }

}

module.exports = HTMLUtil;
