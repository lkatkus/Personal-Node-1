"use strict";

const assert = require("assert");

/**
 * Base class for router middleware.
 * Implementing classes should overwrite <code>bindToRouter()</code>.
 */
class Middleware {

    /**
     * Creates middleware instance.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        assert.equal(typeof app, "function", "argument 'app' must be function");
        assert.equal(typeof router, "function", "argument 'router' must be function");
        this._app = app;
        this._router = router;
    }

    /**
     * Returns reference to Express application.
     *
     * @return {express.Application}
     */
    get app() {
        return this._app;
    }

    /**
     * Returns reference to router object.
     *
     * @return {express.Router}
     */
    get router() {
        return this._router;
    }

    /**
     * Binds this middleware to router.
     * Should be overwritten by implementing class.
     */
    bindToRouter() {
    }

}

module.exports = Middleware;
