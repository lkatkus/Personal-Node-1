"use strict";

const assert = require("assert");
const http = require("http");
const express = require("express");

const Exception = require("srv-core").Exception;
const Config = require("srv-config").Config;
const Log = require("srv-log").Log;

const Router = require("./Router");

// Static value for HTTPServer.server
let _server = null;

// Static value for HTTPServer.router
let _router = null;

/**
 * Class for creating/starting/stopping HTTP server.
 */
class HTTPServer {

    /**
     * Class logger.
     *
     * @type {Log}
     */
    static get log() {
        return _log;
    }

    /**
     * Returns HTTP server instance or <code>null</code> if not initialized.
     *
     * @type {http.Server}
     */
    static get server() {
        return _server;
    }

    /**
     * Returns Express router instance or <code>null</code> if not initialized.
     *
     * @type {express.Router}
     */
    static get router() {
        return _router;
    }

    /**
     * Returns <code>true</code> if HTTP server is running.
     *
     * @type {boolean}
     */
    static get isRunning() {
        return (_server !== null);
    }

    /**
     * Starts HTTP server. Uses following configuration parameters:
     * <ul>
     * <li><code>server.http.disabled</code> prevents starting server if <code>true</code></li>
     * <li><code>server.http.port</code> as server port</li>
     * <li><code>server.http.basePath</code> as base path</li>
     * <li><code>server.http.routerName</code> as named router configuration if specified</li>
     * </ul>
     *
     * @param {function} callback - Callback executed when finished
     */
    static start(callback) {
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        const disabled = Config.getValue("server.http.disabled");
        assert.equal(typeof disabled, "boolean", "'server.http.disabled' must be boolean");
        if (disabled) {
            HTTPServer.log.info("HTTP server is disabled. To enable set 'server.http.disabled' to false");
            return callback();
        }
        const port = Config.getValue("server.http.port");
        assert.equal(typeof port, "number", "Server HTTP port must be number");
        const basePath = Config.getValue("server.http.basePath");
        assert.equal(typeof basePath, "string", "Server base path must be string");
        const routerName = Config.getValue("server.http.routerName");
        if (routerName) {
            assert.equal(typeof routerName, "string", "Router configuration name must be string");
        }
        const app = express();
        Router.create(routerName, app, function(err, r) {
            if (err) {
                return callback(new Exception("Failed to create router", err));
            }
            app.use(basePath, r);
            _server = http.createServer(app).listen(port, function() {
                _router = r;
                HTTPServer.log.info("HTTP server has been started on http://localhost:%s%s", port, basePath);
                return callback();
            });
        });
    }

    /**
     * Stops HTTP server.
     *
     * @param {function} callback - Callback executed when finished
     */
    static stop(callback) {
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        if (!HTTPServer.server) {
            return callback(new Exception("HTTP server was not running"));
        }
        HTTPServer.server.close(function(err) {
            if (err) {
                return callback(new Exception("Error occured while stopping HTTP server", err));
            }
            _router = null;
            _server = null;
            HTTPServer.log.info("HTTP server has been stopped");
            return callback();
        });
    }

}

// Static value for HTTPServer.log
const _log = new Log(HTTPServer);

module.exports = HTTPServer;
