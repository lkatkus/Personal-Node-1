"use strict";

/**
 * Error class with inner error.
 * Allows to create a chain of errors.
 *
 * @extends Error
 */
class Exception extends Error {

    /**
     * Creates new Exception instance with message and possible cause.
     *
     * @param {string} message - Message decribing exception
     * @param {Error|*} [cause=null] - Initial cause for this error
     */
    constructor(message, cause = null) {
        super(message);
        this._cause = cause;
    }

    /**
     * Returns inner error.
     *
     * @type {Error|null|*}
     */
    get cause() {
        return this._cause;
    }

    /**
     * Returns object with serialized exception fields.
     *
     * @param {boolean} [showStack=true] - Includes stack information if <code>true</code>
     * @return {Object} Serialized exception object
     */
    toObject(showStack = true) {
        return Exception.errSerializer(this, showStack);
    }

    /**
     * Serializes error to <code>Object</code>.<br/>
     * If passed parameter is not instance of <code>Error</code> - returns parameter value.<br/>
     * If passed parameter is instance of <code>Error</code> - returns object with information extracted form it.<br/>
     * If passed <code>Error</code> object has property <code>cause</code> it is treated as inner error.<br/>
     * Serializes only fields with value (undefined and null fields are skipped).
     *
     * @param {Error|*} err - <code>Error</code> object to serialize
     * @param {boolean} [showStack=true] - Includes stack information if <code>true</code>
     * @returns {Object|*} Object with information extracted form <code>Error</code>
     */
    static errSerializer(err, showStack = true) {
        if (!(err instanceof Error)) {
            return err;
        }
        const o = {};
        if (err.name) {
            o.name = err.name;
        }
        if (err.message) {
            o.message = err.message;
        }
        if (err.code) {
            o.code = err.code;
        }
        if (err.signal) {
            o.signal = err.signal;
        }
        if (showStack) {
            const stack = err.stack;
            if (stack) {
                o.stack = stack;
            }
        }
        let cause = err.cause;
        if (typeof cause === "function") {
            // Make sure smooth execution
            try {
                cause = err.cause();
            } catch(ignored) {
                cause = null;
            }
        }
        if (cause) {
            o.cause = Exception.errSerializer(cause, showStack);
        }
        return o;
    }

}

module.exports = Exception;
