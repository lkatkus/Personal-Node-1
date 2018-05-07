"use strict";

const assert = require("assert");
const bunyan = require("bunyan");
const bformat = require("bunyan-format");

const Exception = require("srv-core").Exception;

const Const = require("./Const");

// Holds static default configuration for new loggers
let _defaultConfig = {
    name: Const.DEFAULT_LOGGER_NAME,
    level: Const.DEFAULT_LOGGER_LEVEL,
    src: Const.DEFAULT_LOGGER_SOURCE,
    serializers: {
        err: Exception.errSerializer
    },
    stream: bformat({
        outputMode: Const.DEFAULT_LOGGER_OUTPUT_MODE
    })
};

/**
 * Class for managing logging system.
 * Now using <code>bunyan<code> as an underlying logger.
 */
class Log {

    /**
     * Creates <code>Log<code> instance.
     * If <code>conf</code> is <code>string</code> - use it as logger name.
     * If <code>conf</code> is instance of some class - add property <code>className</code>.
     * If parent logger is provided - default configuration fields are stripped and child is created.
     *
     * @param {string|object|class} conf - Logger name or configuration object
     * @param {string} conf.name=srv - Logger name
     * @param {string|number} [conf.level=info] - Logger level
     * @param {string} [conf.src=false] - Source inspection
     * @param {object} [conf.serializers={err: Exception.errSerializer}] - Log object serializers
     * @param {stream.Writable} [conf.stream=bunyan-format({outputMode: "long"})] - Log stream
     * @param {Log} [parent] - Parent logger
     * @returns {Log} Logger intance
     */
    constructor(conf, parent) {
        if (parent) {
            // If parent is provided - create child logger
            assert.equal(parent instanceof Log, true, "argument 'parent' should be an instance of Log");
            if (typeof conf !== "object" || conf === null) {
                if (typeof conf === "string") {
                    conf = {childName: conf};
                } else if (typeof conf === "function" && typeof conf.name === "string") {
                    conf = {className: conf.name};
                } else {
                    conf = {};
                }
            }
            // Make copy of configuration object before modifying it
            conf = Object.assign({}, conf);
            // Stripping default bunyan properties
            delete conf.name;
            delete conf.level;
            delete conf.src;
            delete conf.serializers;
            delete conf.stream;
            delete conf.streams;
            this._log = parent._log.child(conf);
        } else {
            // Create root logger
            if (typeof conf === "function" && typeof conf.name === "string") {
                conf = {className: conf.name};
            }
            if (typeof conf === "string") {
                conf = {name: conf};
            }
            if (typeof conf !== "object" || conf === null) {
                conf = {};
            }
            // Make copy of configuration object before modifying it
            conf = Object.assign({}, conf);
            // Set logging defaults if missing
            if (typeof conf.name !== "string") {
                conf.name = _defaultConfig.name;
            }
            if (typeof conf.level !== "string") {
                conf.level = _defaultConfig.level;
            }
            if (typeof conf.src !== "boolean") {
                conf.src = _defaultConfig.src;
            }
            if (typeof conf.serializers !== "object" || conf.serializers === null) {
                conf.serializers = _defaultConfig.serializers;
            }
            if (typeof conf.serializers.err !== "function") {
                conf.serializers.err = _defaultConfig.serializers.err;
            }
            // If none of 'stream' and 'streams' properties are declared
            if (!conf.stream && !conf.streams) {
                conf.stream = _defaultConfig.stream;
            }
            this._log = bunyan.createLogger(conf);
        }
    }

    /**
     * Current logger level.
     *
     * @type {number|string}
     */
    get level() {
        return this._log.level();
    }
    set level(level) {
        return this._log.level(level);
    }

    /**
     * Returns <code>true</code> if messages with TRACE level will be logged.
     *
     * @type {boolean}
     */
    get isTraceEnabled() {
        return this.level <= bunyan.TRACE;
    }

    /**
     * Returns <code>true</code> if messages with DEBUG level will be logged.
     *
     * @type {boolean}
     */
    get isDebugEnabled() {
        return this.level <= bunyan.DEBUG;
    }

    /**
     * Returns <code>true</code> if messages with INFO level will be logged.
     *
     * @type {boolean}
     */
    get isInfoEnabled() {
        return this.level <= bunyan.INFO;
    }

    /**
     * Returns <code>true</code> if messages with WARN level will be logged.
     *
     * @type {boolean}
     */
    get isWarnEnabled() {
        return this.level <= bunyan.WARN;
    }

    /**
     * Returns <code>true</code> if messages with ERROR level will be logged.
     *
     * @type {boolean}
     */
    get isErrorEnabled() {
        return this.level <= bunyan.ERROR;
    }

    /**
     * Returns <code>true</code> if messages with FATAL level will be logged.
     *
     * @type {boolean}
     */
    get isFatalEnabled() {
        return this.level <= bunyan.FATAL;
    }

    /**
     * Logs with level trace.
     *
     * @param {...*}
     */
    trace() {
        this._log.trace.apply(this._log, arguments);
    }

    /**
     * Logs with level debug.
     *
     * @param {...*}
     */
    debug() {
        this._log.debug.apply(this._log, arguments);
    }

    /**
     * Logs with level info.
     *
     * @param {...*}
     */
    info() {
        this._log.info.apply(this._log, arguments);
    }

    /**
     * Logs with level warn.
     *
     * @param {...*}
     */
    warn() {
        this._log.warn.apply(this._log, arguments);
    }

    /**
     * Logs with level error.
     *
     * @param {...*}
     */
    error() {
        this._log.error.apply(this._log, arguments);
    }

    /**
     * Logs with level fatal.
     *
     * @param {...*}
     */
    fatal() {
        this._log.fatal.apply(this._log, arguments);
    }

    // Static logger.
    // Undocumented
    static get logger() {
        return _log;
    }

    /**
     * Sets default configuration for new loggers.
     * If <code>conf</code> is <code>string</code> - use it as logger name.
     *
     * @param {string|object|class} conf - Logger name or configuration object
     * @param {string} conf.name=srv - Logger name
     * @param {string|number} [conf.level=info] - Logger level
     * @param {string} [conf.src=false] - Source inspection
     * @param {object} [conf.serializers={err: Exception.errSerializer}] - Log object serializers
     * @param {stream.Writable} [conf.stream=bunyan-format({outputMode: "long"})] - Log stream
     * @param {string} [conf.outputMode=long] - Stream format output mode (short|long|simple|json|bunyan).
     */
    static setDefaultConfig(conf) {
        if (typeof conf === "function" && typeof conf.name === "string") {
            conf = {className: conf.name};
        }
        if (typeof conf === "string") {
            conf = {name: conf};
        }
        if (typeof conf !== "object" || conf === null) {
            conf = {};
        }
        // Make copy of configuration object before modifying it
        conf = Object.assign({}, conf);
        // Set logging defaults if missing
        if (typeof conf.name !== "string") {
            conf.name = Const.DEFAULT_LOGGER_NAME;
        }
        if (typeof conf.level !== "string" && typeof conf.level !== "number") {
            conf.level = Const.DEFAULT_LOGGER_LEVEL;
        }
        if (typeof conf.src !== "boolean") {
            conf.src = Const.DEFAULT_LOGGER_SOURCE;
        }
        if (typeof conf.serializers !== "object" || conf.serializers === null) {
            conf.serializers = {};
        }
        if (typeof conf.serializers.err !== "function") {
            conf.serializers.err = Exception.errSerializer;
        }
        // If none of 'stream' and 'streams' properties are declared
        if (!conf.stream && !conf.streams) {
            let outputMode = Const.DEFAULT_LOGGER_OUTPUT_MODE;
            if (conf.outputMode === "short" || conf.outputMode === "long" || conf.outputMode === "simple" || conf.outputMode === "json" || conf.outputMode === "bunyan") {
                outputMode = conf.outputMode;
            }
            conf.stream = bformat({
                outputMode: outputMode
            });
        }
        _defaultConfig = conf;
    }

}

// Holds static logger
// Undocumented
const _log = new Log(_defaultConfig);

// Holds global logger
// Undocumented
global.log = _log;

module.exports = Log;

// Changes to bunyan-format to support 'err.cause' property"
//
// add following function to lib/format-record.js
//
//function getFullErrorStack(ex) {
//    if (!ex) {
//        return;
//    }
//    var ret = ex.stack || ex.toString();
//    var cex = ex.cause;
//    if (typeof (cex) === 'function') {
//        cex = cex.apply(ex);
//    }
//    if (cex) {
//        ret += '\nCaused by: ' + getFullErrorStack(cex);
//    }
//    return (ret);
//}
//
// Change error serialization routine (around line 342) to following:
//
//    if (rec.err && rec.err.stack) {
////      details.push(indent(rec.err.stack));
//      details.push(indent(getFullErrorStack(rec.err)));
//      delete rec.err;
//    }
