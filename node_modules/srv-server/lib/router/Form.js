"use strict";

const assert = require("assert");
const bodyParser = require("body-parser");

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;

/**
 * Posted forms parsing middleware.
 * Parses POST'ed forms (application/x-www-form-urlencoded).
 * Parsed form saved in <code>req.body</code>.
 *
 * @extends Middleware
 */
class Form extends Middleware {

    /**
     * Creates posted form parsing middleware instance.
     * Uses <code>server.router.form.rawBody</code> configuration parameter to specify if raw body should be saved in request.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._rawBody = Config.getValue("server.router.form.rawBody");
        if (this._rawBody) {
            assert.equal(typeof this._rawBody, "boolean", "'server.router.form.rawBody' must be boolean");
        } else {
            this._rawBody = false;
        }
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        const self = this;
        this.router.use(bodyParser.urlencoded({
            extended: true,
            verify: function(req, res, buf) {
                if (self._rawBody) {
                    req.rawBody = buf;
                }
            }
        }));
    }

}

module.exports = Form;
