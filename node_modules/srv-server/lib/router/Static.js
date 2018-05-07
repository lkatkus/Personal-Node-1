"use strict";

const assert = require("assert");
const path = require("path");
const express = require("express");

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;

/**
 * Static pages middleware.
 *
 * @extends Middleware
 */
class Static extends Middleware {

    /**
     * Creates static pages middleware instance.
     * Renders view with registered template engines.
     * Serves static file if rendering fails.
     * Uses <code>server.router.static.dir</code> configuration parameter as static files location (relative to process.cwd()).
     * Uses <code>server.router.static.path</code> configuration parameter as path in address (relative to <code>basePath</code>).
     * Uses <code>server.router.static.index</code> configuration parameter as list of index files.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._staticDir = Config.getValue("server.router.static.dir");
        assert.equal(typeof this._staticDir, "string", "Static files directory must be string");
        this._staticPath = Config.getValue("server.router.static.path");
        if (this._staticPath) {
            assert.equal(typeof this._staticPath, "string", "Path for static files must be string");
        } else {
            this._staticPath = "/";
        }
        this._staticIndex = Config.getValue("server.router.static.index");
        if (this._staticIndex) {
            if (typeof this._staticIndex === "string") {
                this._staticIndex = [this._staticIndex];
            }
            assert.equal(Array.isArray(this._staticIndex), true, "List of index files must be an instance of Array");
        }
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        const options = {};
        if (this._staticIndex) {
            options.index = this._staticIndex;
        }
        const staticFiles = express.static(path.join(process.cwd(), this._staticDir), options);
        const self = this;
        this.router.use(this._staticPath, function (req, res, next) {
            if (req.method !== "GET" && req.method !== "HEAD") {
                return next();
            }
            try {
                // Try to render file
                res.render(path.join(process.cwd(), self._staticDir, req.path), function(err, html) {
                    if ((err)) {
                        // Serve static if render fails
                        return staticFiles(req, res, next);
                    }
                    res.send(html);
                });
            } catch (err) {
                // Serve static if render fails
                return staticFiles(req, res, next);
            }
        });
    }

}

module.exports = Static;
