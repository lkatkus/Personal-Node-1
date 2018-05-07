"use strict";

const assert = require("assert");
const path = require("path");
const multer = require("multer");

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;

/**
 * Uploaded files parsing middleware.
 * If error occured while handling upload - error is saved in <code>req.error<code>.
 * TODO: Now accepts all files of any size - this is dangerous from security point of view.
 *
 * @extends Middleware
 */
class Upload extends Middleware {

    /**
     * Creates uploaded files parsing middleware instance.
     * Uses <code>server.router.upload.dir</code> configuration parameter as uploaded files saving location (relative to process.cwd()).
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._dir = Config.getValue("server.router.upload.dir");
        assert.equal(typeof this._dir, "string", "Uploaded files directory should be a string");
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        let upload = multer({dest: path.join(process.cwd(), this._dir)}).any();
        this.router.use(function(req, res, next) {
            upload(req, res, function(err) {
                req.error = err;
                next();
            });
        });
    }

}

module.exports = Upload;
