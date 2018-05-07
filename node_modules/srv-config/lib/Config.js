"use strict";

const assert = require("assert");
const path = require("path");
const properties = require("properties");

const Exception = require("srv-core").Exception;
const Util = require("srv-util").Util;

const Const = require("./Const");

// Static value for Config.globalConfig
let _globalConfig = null;

/**
 * Class handles and holds system configuration.
 * By default configuration is read from 'process.cwd() + /conf/config.properties'.
 * Configuration file location and name can be specified in environment by setting following variables:
 * <ul>
 * <li>CONF_DIR - specifies configuration file location</li>
 * <li>CONF_FILE - specifies configuration file location</li>
 * </ul>
 */
class Config {

    /**
     * Returns shallow copy of global config.
     *
     * @type {Object}
     */
    static get globalConfig() {
        if (!_globalConfig) {
            return {};
        }
        return Object.assign({}, _globalConfig);
    }

    /**
     * Returns configuration directory.
     *
     * @type {string}
     */
    static get confDir() {
        return Const.CONF_DIR;
    }

    /**
     * Reads and initializes global configuration.
     *
     * @param {boolean} reload - Forces reload of configuration
     * @param {function} callback - Callback executed when finished
     */
    static initGlobalConfig(reload, callback) {
        assert.equal(typeof reload, "boolean", "argument 'reload' must be boolean");
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        // Load only first time or if explicitly requested
        if (!reload && _globalConfig) {
            return callback();
        }
        const confFile = path.join(Const.CONF_DIR, Const.CONF_FILE);
        properties.parse(confFile, {
            path: true,
            namespaces: true,
            sections: true,
            variables: true,
            include: true,
            reviver: function(key, value, section) {
                if (this.isSection) {
                    return this.assert();
                }
                if (typeof value === "string") {
                    const values = value.split(",");
                    for (let i = 0, l = values.length; i < l; i++) {
                        values[i] = values[i].trim();
                    }
                    return values.length === 1 ? value : values;
                }
                return this.assert();
            }
        }, function(err, conf) {
            if (err) {
                return callback(new Exception("Failed to read configuration file: " + confFile, err));
            }
            _globalConfig = conf;
            return callback();
        });
    }

    /**
     * Retrieves value from default configuration.
     * If provided path does not exists - returns <code>null</code>.
     *
     * @param {string} path - Path to value
     * @return {*|null} Value in configuration
     */
    static getValue(path) {
        return Util.getPathValue(Config.globalConfig, path);
    }

}

module.exports = Config;
