"use strict";

const assert = require("assert");
const bodyParser = require("body-parser");

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;

/**
 * Posted JSON parsing middleware.
 * Parses POST'ed JSON data (application/json).
 * Parsed JSON saved in <code>req.body</code>.
 *
 * @extends Middleware
 */
class JSON extends Middleware {

    /**
     * Creates JSON parsing middleware instance.
     * Uses <code>server.router.json.limit</code> configuration parameter to specify maximum size of request.
     * Uses <code>server.router.json.rawBody</code> configuration parameter to specify if raw body should be saved in request.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._limit = Config.getValue("server.router.json.limit");
        if (!this._limit || (typeof this._limit !== "number" && typeof this._limit !== "string")) {
            this._limit = "100kb";
        }
        this._rawBody = Config.getValue("server.router.json.rawBody");
        if (this._rawBody) {
            assert.equal(typeof this._rawBody, "boolean", "'server.router.json.rawBody' must be boolean");
        } else {
            this._rawBody = false;
        }
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        const self = this;
        this.router.use(bodyParser.json({
            limit: this._limit,
            verify: function(req, res, buf) {
                if (self._rawBody) {
                    req.rawBody = buf;
                }
            }
        }));
    }

}

module.exports = JSON;
