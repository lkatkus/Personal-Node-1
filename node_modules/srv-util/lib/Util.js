"use strict";

const assert = require("assert");
const path = require("path");

const Exception = require("srv-core").Exception;

/**
 * Class holds various utility methods.
 */
class Util {

    /**
     * Concatenates passed parameters.
     * <code>undefined</code> and <code>null</code> values represented as empty strings.
     *
     * @param {...*} - values to concatenate
     * @return {string} Concatenated value.
     */
    static concatenate() {
        let ret = "";
        for (let i = 0, l = arguments.length; i < l; i++) {
            if (arguments[i] !== undefined && arguments[i] !== null) {
                ret += String(arguments[i]);
            }
        }
        return ret;
    }

    /**
     * Escapes <code>RegExp</code> control characters.
     * If parameter is not string - it is converted to string before escaping.
     * Returns empty string if parameter is null or undefined.
     *
     * @param {*} str - String to escape
     * @return {string} Escaped string
     */
    static escapeRegExp(str) {
        if (str === undefined || str === null) {
            return "";
        }
        return Util.concatenate(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Makes shallow copy of specified object.
     * If <code>Array</code> is passed - creates copies of all objects in source array and
     * returns new <code>Array</code> instance with copied objects.
     * If <code>includeProperties</code> is specified - returned object will contain only properties specifed in it.
     * If <code>obj</code> is not an object - returns <code>obj</code>.
     *
     * @param {object|Array} obj - Source object or array of source objects
     * @param {string[]} [includeProperties=[]] - Array of properties to include
     * @return {object|Array} Shallow copy of specified object or array of shallow copied objects
     */
    static objectCopy(obj, includeProperties = []) {
        if (typeof obj !== "object" || obj === null) {
            return obj;
        }
        let source;
        if (Array.isArray(obj)) {
            source = obj;
        } else {
            source = [obj];
        }
        if (!Array.isArray(includeProperties)) {
            if (includeProperties !== null) {
                includeProperties = [includeProperties];
            } else {
                includeProperties = [];
            }
        }
        const result = [];
        for (let i = 0, l = source.length; i < l; i++) {
            const r = {};
            for (let key in source[i]) {
                if (includeProperties.length === 0 || includeProperties.includes(key)) {
                    r[key] = source[i][key];
                }
            }
            result.push(r);
        }
        if (Array.isArray(obj)) {
            return result;
        } else {
            return result[0];
        }
    }

    /**
     * Execute task with every element in <code>paramArray</code> in sequence.
     *
     * @param {Array} paramArray - List of parameters to execute task with
     * @param {boolean} stopOnError - If <code>true</code> stops execution if task calls callback with error and returns acquired results;
     *      if <code>false</code> - executes task with all parameters.
     * @param {function} task - Task to execute. Function is executed with following parameters:
     *      <ul>
     *      <li><code>index</code> - parameter index in array</li>
     *      <li><code>param</code> - current parameter value</li>
     *      <li><code>taskCallback</code> - callback for task finsh</li>
     *      </ul>
     * @param {function} callback - Callback is executed when either execution is finished or
     *      encountered error and <code>stopOnError</code> is set to <code>true</code>.
     *      Callback receives results array with result for each task.
     *      If <code>stopOnError</code> is set - second callbask parameter will contain results for executed tasks.
     *      Every error will be wrapped into <code>Exception</code>.
     */
    static arrayExecutor(paramArray, stopOnError, task, callback) {
        assert.equal(Array.isArray(paramArray), true, "argument 'paramArray' must be instance of Array");
        assert.equal(typeof stopOnError, "boolean", "argument 'stopOnError' must be boolean");
        assert.equal(typeof task, "function", "argument 'task' must be function");
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        const result = [];
        // If param array is empty - return immediately.
        if (paramArray.length <= 0) {
            return callback(null, result);
        }
        let i = 0;
        const taskCallback = function(err, res) {
            if (err) {
                err = new Exception("Task " + i + " failed", err);
                result.push(err);
                if (stopOnError) {
                    return callback(err, result);
                }
            } else {
                result.push(res);
            }
            if (paramArray.length > ++i) {
                process.nextTick(task, i, paramArray[i], taskCallback);
            } else {
                return callback(null, result);
            }
        };
        process.nextTick(task, i, paramArray[i], taskCallback);
    }

    /**
     * Retrieves value from provided object via specified path.
     * If <code>obj</code> is <code>null</code> or <code>undefined</code> - returns <code>null</code>.
     * If provided path does not exist - returns <code>null</code>.
     *
     * @param {*} obj - Starting object
     * @param {string} path - Path to value
     * @return {*|null} Value found in path or <code>null</code> if path could not be traversed.
     */
    static getPathValue(obj, path) {
        if (!obj) {
            return null;
        }
        assert.equal(typeof path, "string", "argument 'path' must be string");
        path = path.split(".");
        for (let i = 0, l = path.length - 1; i < l; i++) {
            if (obj[path[i]] === undefined || obj[path[i]] === null) {
                return null;
            }
            obj = obj[path[i]];
        }
        // We traversed through path to the end - return value
        return obj[path[path.length - 1]];
    }

    /**
     * Loads class. <code>moduleConfig</code> should contain property <code>module</code> with module name.
     * Local module (name starts with <code>./</code> or <code>../</code>) will be loaded relative
     * to current directory. Otherwise module will be loaded with <code>require()</code>.
     * If <code>moduleConfig</code> contains property <code>class</code> then it will be used to select
     * specifi class from module exports.
     *
     * @param {object} moduleConfig - Module configuration
     * @return {function} Class ready for instantiation
     * @throws {Exception} <ul>
     *      <li>If fails to load module</li>
     *      <li>If loaded module is not a class (function)</li>
     *  </ul>
     */
    static loadClass(moduleConfig) {
        assert.equal(moduleConfig !== null && typeof moduleConfig === "object", true, "argument 'moduleConfig' must be object");
        assert.equal(typeof moduleConfig.module, "string", "argument 'moduleConfig.module' must be string");
        if (moduleConfig.class) {
            assert.equal(typeof moduleConfig.class, "string", "argument 'moduleConfig.class' must be string");
        }
        let Class;
        try {
            if (moduleConfig.module.startsWith(".")) {
                // If module is local (starts with ./ or ../) - load it relative to current directory
                Class = require(path.join(process.cwd(), moduleConfig.module));
            } else {
                Class = require(moduleConfig.module);
            }
        } catch (err) {
            throw new Exception("Failed to load module", err);
        }
        if (moduleConfig.class) {
            Class = Class[moduleConfig.class];
        }
        if (typeof Class !== "function") {
            throw new Exception("Loaded module is not a class");
        }
        return Class;
    }

}

module.exports = Util;
