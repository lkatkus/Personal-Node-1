"use strict";

const assert = require("assert");
const path = require("path");

const Exception = require("srv-core").Exception;
const Config = require("srv-config").Config;
const Log = require("srv-log").Log;

// Static value for Init.initialized
let _initialized = false;

/**
 * Class for server initialization.
 */
class Init {

    /**
     * Returns true if system is initialized already.
     *
     * @type {boolean}
     */
    static get initialized() {
        return _initialized;
    }

    /**
     * Initializes system environment:
     * <ul>
     * <li>reads configuration</li>
     * <li>initializes logging system</li>
     * <li>sets <code>uncaughtException</code> handler</li>
     * </ul>
     *
     * @param {function} callback - Callback executed when finished
     */
    static go(callback) {
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        if (Init.initialized) {
            return callback();
        }
        Config.initGlobalConfig(true, function(err) {
            if (err) {
                return callback(new Exception("Failed to initialize global config", err));
            }
            // Initialize global logger with 'globalConfig.logging' values
            Log.setDefaultConfig(Config.getValue("logging"));
            // Set uncaught exception handler
            process.on("uncaughtException", function(err) {
                Log.logger.fatal({err: err}, "Uncaught exception");
                process.exit(-1);
            });
            _initialized = true;
            return callback();
        });
    }

}

module.exports = Init;
