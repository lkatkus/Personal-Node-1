"use strict";

/**
 * Class holds various contants.
 */
class Const {

///////////////////////////////////////////////////////////////////////////////
// Constants used in Install class.
///////////////////////////////////////////////////////////////////////////////

    /**
     * Directory name for SSL certificates.
     *
     * @type {string}
     */
    static get CERT() {
        return "cert";
    }

    /**
     * Directory name for configuration files.
     *
     * @type {string}
     */
    static get CONF() {
        return "conf";
    }

    /**
     * Directory name for web content.
     *
     * @type {string}
     */
    static get WEB() {
        return "web";
    }

    /**
     * Directory name for uploaded files.
     *
     * @type {string}
     */
    static get UPLOADS() {
        return "uploads";
    }

}

module.exports = Const;
