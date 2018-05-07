#!/usr/bin/env node

"use strict";

const Log = require("srv-log").Log;
const Config = require("srv-config").Config;
const Util = require("srv-util").Util;

const Init = require("./lib/Init");

// Initialize and start HTTP server
Init.go(function(err) {
    if (err) {
        // Initialization failure
        Log.logger.error({err: err}, "Failed to initialize");
    } else {
        let beforeStart = Config.getValue("beforeStart");
        // If beforeStart hook configured - instantiate and execute it
        if (beforeStart && beforeStart.module) {
            let ModuleClass;
            let moduleInstance;
            try {
                ModuleClass = Util.loadClass(beforeStart);
                moduleInstance = new ModuleClass();
                if (beforeStart.method) {
                    moduleInstance[beforeStart.method](function(err) {
                        if (err) {
                            Log.logger.error({err: err}, "Failed to execute 'beforeStart' hook");
                            process.exit(1);
                        }
                        startWeb();
                    });
                } else {
                    startWeb();
                }
            } catch (err) {
                Log.logger.error({err: err}, "Failed to load and instantiate 'beforeStart' hook");
                process.exit(1);
            }
        } else {
            startWeb();
        }
    }
});

/**
 * Starts HTTP and HTTPS servers.
 */
function startWeb() {
    // Starting HTTP server
    const HTTPServer = require("srv-server").HTTPServer;
    HTTPServer.start(function(err) {
        if (err) {
            Log.logger.error({err: err}, "Failed to start HTTP server");
        }
        // Starting HTTPS server
        const HTTPSServer = require("srv-server").HTTPSServer;
        HTTPSServer.start(function(err) {
            if (err) {
                Log.logger.error({err: err}, "Failed to start HTTPS server");
            }
            let afterStart = Config.getValue("afterStart");
            // If afterStart hook configured - instantiate and execute it
            if (afterStart && afterStart.module) {
                let ModuleClass;
                let moduleInstance;
                try {
                    ModuleClass = Util.loadClass(afterStart);
                    moduleInstance = new ModuleClass();
                    if (afterStart.method) {
                        moduleInstance[afterStart.method](function(err) {
                            if (err) {
                                Log.logger.error({err: err}, "Failed to execute 'afterStart' hook");
                                stopWeb(1);
                            }
                        });
                    }
                } catch (err) {
                    Log.logger.error({err: err}, "Failed to load and instantiate 'afterStart' hook");
                    stopWeb(1);
                }
            }
        });
    });
}

/**
 * Stops HTTP and HTTPS servers.
 */
function stopWeb(exitCode) {
     // Stopping HTTP server
    const HTTPServer = require("srv-server").HTTPServer;
    const HTTPSServer = require("srv-server").HTTPSServer;
    if (HTTPServer.isRunning) {
        HTTPServer.stop(function(err) {
            if (err) {
                Log.logger.error({err: err}, "Failed to stop HTTP server");
            }
            if (HTTPSServer.isRunning) {
                HTTPSServer.stop(function(err) {
                    if (err) {
                        Log.logger.error({err: err}, "Failed to stop HTTPS server");
                    }
                    process.exit(exitCode);
                });
            } else {
                process.exit(exitCode);
            }
       });
    } else {
        if (HTTPSServer.isRunning) {
            HTTPSServer.stop(function(err) {
                if (err) {
                    Log.logger.error({err: err}, "Failed to stop HTTPS server");
                }
                process.exit(exitCode);
            });
        } else {
            process.exit(exitCode);
        }
    }
}
