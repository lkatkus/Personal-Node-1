"use strict";

const assert = require("assert");
const bunyanMiddleware = require("bunyan-middleware");

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;
const Log = require("srv-log").Log;

/**
 * Request logger middleware.
 *
 * @extends Middleware
 */
class RequestLog extends Middleware {

    /**
     * Creates request logger middleware instance.
     * Uses <code>server.router.requestLog.logName</code> as logger name.
     * Uses <code>server.router.requestLog.requestStart</code> to specify if request start should be logged.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._logName = Config.getValue("server.router.requestLog.logName");
        assert.equal(typeof this._logName, "string", "'server.router.requestLog.logName' must be string");
        this._requestStart = Config.getValue("server.router.requestLog.requestStart");
        assert.equal(typeof this._requestStart, "boolean", "'server.router.requestLog.requestStart' must be boolean");
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        this.router.use(bunyanMiddleware({
            // Hackish (undocumented) way to acquire underlying logger
            logger: new Log()._log,
            logName: this._logName,
            requestStart: this._requestStart
        }));
    }

}

module.exports = RequestLog;
