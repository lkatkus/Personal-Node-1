"use strict";

const assert = require("assert");
const handlebars = require("express-handlebars");
const path = require("path");

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;

/**
 * <p>Adds Handlebars rendering engine for express.</p>
 * <p>Uses <code>server.router.handlebars.extname</code> configuration parameter to specify template extension.
 * Defaults to '.handlebars'.</p>
 * <p>Uses <code>server.router.handlebars.viewsDir</code> configuration parameter to specify views directory.
 * Defaults to 'views/'.</p>
 * <p>Uses <code>server.router.handlebars.layoutsDir</code> configuration parameter to specify layouts directory.
 * Defaults to 'views/layouts/'.</p>
 * <p>Uses <code>server.router.handlebars.partialsDir</code> configuration parameter to specify partials directory.
 * Defaults to 'views/partials/'.</p>
 * <p>Uses <code>server.router.handlebars.defaultLayout</code> configuration parameter to specify default layout.
 * Defaults to empty - no layout used.</p>
 *
 * @extends Middleware
 */
class Handlebars extends Middleware {

    /**
     * Creates session middleware instance.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._extname = Config.getValue("server.router.handlebars.extname");
        if (this._extname) {
            assert.equal(typeof this._extname, "string", "Template extension must be string");
        } else {
            this._extname = ".handlebars";
        }
        this._viewsDir = Config.getValue("server.router.handlebars.viewsDir");
        if (this._viewsDir) {
            assert.equal(typeof this._viewsDir, "string", "Views directory must be string");
        }
        this._layoutsDir = Config.getValue("server.router.handlebars.layoutsDir");
        if (this._layoutsDir) {
            assert.equal(typeof this._layoutsDir, "string", "Layouts directory must be string");
        }
        this._partialsDir = Config.getValue("server.router.handlebars.partialsDir");
        if (this._partialsDir) {
            assert.equal(typeof this._partialsDir, "string", "Partials directory must be string");
        }
        this._defaultLayout = Config.getValue("server.router.handlebars.defaultLayout");
        if (this._defaultLayout) {
            assert.equal(typeof this._defaultLayout, "string", "Default layout must be string");
        }
    }

    /**
     * Adds handlebars rendering engine to express.
     */
    bindToRouter() {
        const params = {};
        params.extname = this._extname;
        if (this._layoutsDir) {
            params.layoutsDir = path.join(process.cwd(), this._layoutsDir);
        }
        if (this._partialsDir) {
            params.partialsDir = path.join(process.cwd(), this._partialsDir);
        }
        if (this._defaultLayout) {
            params.defaultLayout = this._defaultLayout;
        }
        const engine = handlebars(params);
        this.app.engine(this._extname, engine);
        if (this._viewsDir) {
            this.app.set("views", path.join(process.cwd(), this._viewsDir));
        }
        this.app.set("view engine", this._extname);
    
    }
}

module.exports = Handlebars;