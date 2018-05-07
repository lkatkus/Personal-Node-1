"use strict";

const assert = require("assert");
const session = require("express-session");

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;

/**
 * Session handling middleware.
 * TODO: replace session store with production capable alternative.
 *
 * @extends Middleware
 */
class Session extends Middleware {

    /**
     * Creates session middleware instance.
     * Uses <code>server.router.session.secret</code> configuration parameter to initialize session.
     * Uses <code>server.router.session.maxAge</code> configuration parameter to specify session maximum age.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._secret = Config.getValue("server.router.session.secret");
        assert.equal(typeof this._secret, "string", "Session secret must be string");
        this._maxAge = Config.getValue("server.router.session.maxAge");
        if (this._maxAge) {
            assert.equal(typeof this._maxAge, "number", "Session timeout must be a number");
            assert.equal(this._maxAge >= 0, true, "Session timeout must be positive number");
        }
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        const options = {
            saveUninitialized: true,
            resave: true,
            secret: this._secret
        };
        if (this._maxAge) {
            options.cookie = {
                maxAge: this._maxAge
            };
        }
        this.router.use(session(options));
    }

}

module.exports = Session;
