"use strict";

/**
 * Class holds various contants.
 */
class Const {

///////////////////////////////////////////////////////////////////////////////
// Constants used in Log class.
///////////////////////////////////////////////////////////////////////////////

    /**
     * Default logger name.
     *
     * @type {string}
     */
    static get DEFAULT_LOGGER_NAME() {
        return "srv";
    }

    /**
     * Default logger level.
     *
     * @type {string}
     */
    static get DEFAULT_LOGGER_LEVEL() {
        return "info";
    }

    /**
     * Should logger inspect source by default.
     *
     * @type {Boolean}
     */
    static get DEFAULT_LOGGER_SOURCE() {
        return false;
    }

    /**
     * Default logger output mode for bunyan-format.
     *
     * @type {Boolean}
     */
    static get DEFAULT_LOGGER_OUTPUT_MODE() {
        return "long";
    }

}

module.exports = Const;
