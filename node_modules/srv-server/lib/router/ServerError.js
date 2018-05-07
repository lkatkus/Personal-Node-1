"use strict";

const assert = require("assert");

const Exception = require("srv-core").Exception;
const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;
const HTMLUtil = require("srv-util").HTMLUtil;

/**
 * Error page serving middleware.
 * Shows error saved in <code>session.error</code>.
 * Session object does not save actual <code>Error</code> instances.
 * {@link Exception.errSerializer} can be used to save complete Error information.
 *
 * @extends Middleware
 */
class ServerError extends Middleware {

    /**
     * Creates error page middleware instance.
     * Uses <code>server.router.serverError.errorPage</code> configuration parameter as path to error page (relative to <code>basePath</code>).
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._errorPage = Config.getValue("server.router.serverError.errorPage");
        assert.equal(typeof this._errorPage, "string", "Route to error page must be string");
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        this.router.all(this._errorPage, function(req, res) {
            let err;
            if (req.session && req.session.error) {
                err = req.session.error;
                // Reset error
                delete req.session.error;
            } else {
                err = "Error";
            }
            res.set("Content-Type", "text/html");
            res.status(500).send(HTMLUtil.generateErrorHTMLPage(err, true));
        });
    }

}

module.exports = ServerError;
