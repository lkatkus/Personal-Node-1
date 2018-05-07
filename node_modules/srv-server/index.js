"use strict";

const HTTPServer = require("./lib/HTTPServer");
const HTTPSServer = require("./lib/HTTPSServer");
const Session = require("./lib/router/Session");
const Static = require("./lib/router/Static");
const RequestLog = require("./lib/router/RequestLog");
const ServerError = require("./lib/router/ServerError");
const Upload = require("./lib/router/Upload");
const Form = require("./lib/router/Form");
const JSON = require("./lib/router/JSON");
const XML = require("./lib/router/XML");

module.exports = {
    HTTPServer: HTTPServer,
    HTTPSServer: HTTPSServer,
    Session: Session,
    Static: Static,
    RequestLog: RequestLog,
    ServerError: ServerError,
    Upload: Upload,
    Form: Form,
    JSON: JSON,
    XML: XML
};
