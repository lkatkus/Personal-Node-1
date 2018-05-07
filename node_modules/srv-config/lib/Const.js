"use strict";

const path = require("path");

/**
 * Class holds various contants.
 */
class Const {

///////////////////////////////////////////////////////////////////////////////
// Constants used in Config class.
///////////////////////////////////////////////////////////////////////////////

    /**
     * Default configuration directory can be specified in environment variable CONF_DIR.
     * If not specified in environment - use process.cwd() + /conf
     *
     * @type {string}
     */
    static get CONF_DIR() {
        if (process.env.CONF_DIR) {
            return process.env.CONF_DIR;
        }
        return (path.join(process.cwd(), "conf"));
    }

    /**
     * Default configuration file name can be specified in environment variable CONF_FILE.
     * If not specified in environment - use config.properties
     *
     * @type {string}
     */
    static get CONF_FILE() {
        if (process.env.CONF_FILE) {
            return process.env.CONF_FILE;
        }
        return "config.properties";
    }

}

module.exports = Const;
