"use strict";

const assert = require("assert");
const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);

const Middleware = require("srv-core").Middleware;
const Config = require("srv-config").Config;

/**
 * Posted XML parsing middleware.
 * Parses POST'ed XML data (application/xml).
 * Parsed XML saved in <code>req.body</code>.
 *
 * @extends Middleware
 */
class XML extends Middleware {

    /**
     * Creates XML parsing middleware instance.
     * Uses <code>server.router.xml.limit</code> configuration parameter to specify maximum size of XML body.
     * Uses <code>server.router.xml.rawBody</code> configuration parameter to specify if raw body should be saved in request.
     *
     * @param {function} app - Express application
     * @param {function} router - Express router to attach to
     */
    constructor(app, router) {
        super(app, router);
        this._limit = Config.getValue("server.router.xml.limit");
        if (this._limit) {
            assert.equal(typeof this._limit === "number" || typeof this._limit === "string", true, "'server.router.xml.limit' must be number or string");
        }
        this._rawBody = Config.getValue("server.router.xml.rawBody");
        if (this._rawBody) {
            assert.equal(typeof this._rawBody, "boolean", "'server.router.xml.rawBody' must be boolean");
        } else {
            this._rawBody = false;
        }
    }

    /**
     * Binds this middleware to router
     */
    bindToRouter() {
        const self = this;
        const options = {
            xmlParseOptions: {
                explicitArray: false,
                explicitRoot: false
            },
            verify: function(req, res, buf) {
                if (self._rawBody) {
                    req.rawBody = buf;
                }
            }
        };
        if (this._limit) {
            options.limit = this._limit;
        }
        this.router.use(bodyParser.xml(options));
    }

}

module.exports = XML;
