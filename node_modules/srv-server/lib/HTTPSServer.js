"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");

const Exception = require("srv-core").Exception;
const Config = require("srv-config").Config;
const Log = require("srv-log").Log;

const Router = require("./Router");

// Static value for HTTPSServer.server
let _server = null;

// Static value for HTTPSServer.router
let _router = null;

/**
 * Class for creating/starting/stopping HTTPS server.
 */
class HTTPSServer {

    /**
     * Class logger.
     *
     * @type {Log}
     */
    static get log() {
        return _log;
    }

    /**
     * Returns HTTPS server instance or <code>null</code> if not initialized.
     *
     * @type {https.Server}
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
     * Returns <code>true</code> if HTTPS server is running.
     *
     * @type {boolean}
     */
    static get isRunning() {
        return (_server !== null);
    }

    /**
     * Starts HTTPS server. Uses following configuration parameters:
     * <ul>
     * <li><code>server.https.disabled</code> prevents starting server if <code>true</code></li>
     * <li><code>server.https.port</code> as server port</li>
     * <li><code>server.https.basePath</code> as base path</li>
     * <li><code>server.https.sslKey</code> as file name for SSL key</li>
     * <li><code>server.https.sslCert</code> as file name for SSL certificate</li>
     * <li><code>server.http.routerName</code> as named router configuration if specified</li>
     * </ul>
     *
     * @param {function} callback - Callback executed when finished
     */
    static start(callback) {
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        const disabled = Config.getValue("server.https.disabled");
        assert.equal(typeof disabled, "boolean", "'server.https.disabled' must be boolean");
        if (disabled) {
            HTTPSServer.log.info("HTTPS server is disabled. To enable set 'server.https.disabled' to false");
            return callback();
        }
        const port = Config.getValue("server.https.port");
        assert.equal(typeof port, "number", "Server HTTPS port should be number");
        const basePath = Config.getValue("server.https.basePath");
        assert.equal(typeof basePath, "string", "Server base path should be string");
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
            const options = {};
            const keyFile = path.join(process.cwd(), Config.getValue("server.https.sslKey"));
            try {
                options.key = fs.readFileSync(keyFile);
            } catch(err) {
                return callback(new Exception("Failed to read key file " + keyFile, err));
            }
            const certFile = path.join(process.cwd(), Config.getValue("server.https.sslCert"));
            try {
                options.cert = fs.readFileSync(certFile);
            } catch(err) {
                return callback(new Exception("Failed to read certificate file " + certFile, err));
            }
            _server = https.createServer(options, app).listen(port, function() {
                _router = r;
                HTTPSServer.log.info("HTTPS server has been started on https://localhost:%s%s", port, basePath);
                return callback();
            });
        });
    }

    /**
     * Stops HTTPS server.
     *
     * @param {function} callback - Callback executed when finished
     */
    static stop(callback) {
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        if (!HTTPSServer.server) {
            return callback(new Exception("HTTPS server was not running"));
        }
        HTTPSServer.server.close(function(err) {
            if (err) {
                return callback(new Exception("Error occured while stopping HTTPS server", err));
            }
            _router = null;
            _server = null;
            HTTPSServer.log.info("HTTPS server has been stopped");
            return callback();
        });
    }

}

// Static value for HTTPSServer.log
const _log = new Log(HTTPSServer);

module.exports = HTTPSServer;
