"use strict";

const assert = require("assert");
const fs = require('fs');
const xml = require("xml2js");

const Exception = require("srv-core").Exception;

const Const = require("./Const");
const Util = require("./Util");

/**
 * Class holds various XML utility methods.
 */
class XMLUtil {

    /**
     * Escapes special characters so it is safe to add text to xml as value.
     * Replaces following characters: & < > " '
     *
     * @param {string} text - String to escape
     * @return {string} Text can be added to xml as value
     */
    static escapeXml(text) {
        text = Util.concatenate(text);
        return text.replace(/[&<>"']/g, function (c) {
		return Const.XML_CHAR_MAP[c];
        });
    };

    /**
     * Reads specified XML file and parses it.
     *
     * @param {string} fileName - File name to read
     * @param {function} callback - Callback executed when finished
     */
    static readXMLFile(fileName, callback) {
        assert.equal(typeof fileName, "string", "argument 'fileName' must be string");
        assert.equal(typeof callback, "function", "argument 'callback' must be function");
        const parser = new xml.Parser({
            explicitRoot: false,
            explicitArray: false,
            explicitChildren: true
        });
        fs.readFile(fileName, "utf8", function(err, data) {
            if (err) {
                return callback(new Exception("Error reading file '" + fileName + "'", err));
            }
            parser.parseString(data, function(err, data) {
                if (err) {
                    return callback(new Exception("Error parsing XML data", err));
                }
                return callback (null, XMLUtil.normalizeXMLData(data));
            });
        });
    }

    /**
     * Normalizes parsed XML data object.
     * Parses special keys:
     * <ul>
     * <li>XML_ATTRIBUTES ('&') - attributes list</li>
     * <li>XML_SUBELEMENTS ('&&') - subelement objects</li>
     * <li>XML_TEXT ('_') - character data</li>
     * </ul>
     * If element is marked with 'xsi:nil=true' element value is null.
     * Supports following 'xsi:type' values:
     * <ul>
     * <li>xsd:string - returns value of XML_TEXT attribute</li>
     * <li>xsd:long - parseInt XML_TEXT attribute</li>
     * <li>xsd:integer - parseInt XML_TEXT attribute</li>
     * <li>xsd:int - parseInt XML_TEXT attribute</li>
     * <li>xsd:double - parseFloat XML_TEXT attribute</li>
     * <li>xsd:float - parseFloat XML_TEXT attribute</li>
     * <li>xsd:boolean - returns </code>true</code> if XML_TEXT attribute equals to "true" or "1"; otherwise returns </code>false</code></li>
     * <li>xsd:List - returns array of all subelements values;
     *      if value of subelement is an array - add all subelement's values instead of subelement itself</li>
     * <li>xsd:Array - returns array of all subelements values;
     *      if value of subelement is an array - add all subelement's values instead of subelement itself</li>
     * <li>xsd:Object - all attributes and subelements are combined.
     *      Subelement value overrides attribute value if element has both with same name.
     *      If value is complex (has attributes and/or subelements) - text part is saved in special
     *      property XML_TEXT_VALUE ('__TEXT_VALUE__').
     * </li>
     * </ul>
     * If data object does not have specified type and contains single element of type <code>Array</code>
     * then returns value of that element (discards middle element). For example we have forllowing XML:
     * <pre>
     * &lt;fields&gt;
     *     &lt;field name="itemName" type="text" title="Item"/&gt;
     *     &lt;field name="SKU"      type="text" title="SKU"/&gt;
     * &lt;/fields>
     * </pre>
     * then parsed data would contain
     * <pre>
     * "fields":{
     *     "field":[
     *         {"name":"itemName","type":"text","title":"Item"},
     *         {"name":"SKU","type":"text","title":"SKU"}
     *     ]
     * }
     * </pre>
     * and after normalization
     * <pre>
     * "fields":[
     *     {"name":"itemName","type":"text","title":"Item"},
     *     {"name":"SKU","type":"text","title":"SKU"}
     * ]
     * </pre>
     *
     * @param {*} obj - Object to be normalized
     * @returns {Object} Normalized object
     */
    static normalizeXMLData(obj) {
        if (typeof obj === "undefined" || obj === null) {
            return null;
        }
        if (/^\s*true\s*$/i.test(obj)) {
            return true;
        } else if (/^\s*false\s*$/i.test(obj)) {
            return false;
        }
        if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean" || typeof obj === "symbol") {
            return obj;
        }
        if (Array.isArray(obj)) {
            const ret = [];
            for (let i = 0, l = obj.length; i < l; i++) {
                ret.push(XMLUtil.normalizeXMLData(obj[i]));
            }
            return ret;
        }
        let type = null;
        if (obj[Const.XML_ATTRIBUTES]) {
            // Handle null values
            type = Util.concatenate(obj[Const.XML_ATTRIBUTES]["xsi:nil"]);
            if (/^\s*true\s*$/i.test(type)) {
                return null;
            } else {
                // Handle typed values
                type = Util.concatenate(obj[Const.XML_ATTRIBUTES]["xsi:type"]);
            }
        }
        // Type defaults to 'xsd:Object'
        if (!type) {
            type = "xsd:Object";
        }
        if (type === "xsd:string") {
            return Util.concatenate(obj[Const.XML_TEXT]);
        } else if (type === "xsd:long"
            || type === "xsd:integer"
            || type === "xsd:int") {
            return parseInt(Util.concatenate(obj[Const.XML_TEXT]));
        } else if (type === "xsd:double"
            || type === "xsd:float") {
            return parseFloat(Util.concatenate(obj[Const.XML_TEXT]));
        } else if (type === "xsd:date"
            || type === "xsd:time"
            || type === "xsd:datetime") {
            return new Date(Util.concatenate(obj[Const.XML_TEXT]));
        } else if (type === "xsd:boolean") {
            const xmlText = Util.concatenate(obj[Const.XML_TEXT]);
            if (/^\s*true\s*$/i.test(xmlText) || xmlText === "1") {
                return true;
            } else {
                return false;
            }
        } else if (type === "xsd:List"
            || type === "xsd:Array") {
            const ret = [];
            const props = obj[Const.XML_SUBELEMENTS];
            if (props) {
                for (let key in props) {
                    const elements = XMLUtil.normalizeXMLData(props[key]);
                    // If subelement value is an array - add it's values instead of subelement value itself
                    if (Array.isArray(elements)) {
                        Array.prototype.push.apply(ret, elements);
                    } else {
                        ret.push(elements);
                    }
                }
            }
            return ret;
        } else {
            // No type or "xsd:Object"
            // Subelement value overrides attribute value if element has both with same name.
            let ret = {};
            let props = obj[Const.XML_ATTRIBUTES];
            if (props) {
                for (let key in props) {
                    ret[key] = XMLUtil.normalizeXMLData(props[key]);
                }
            }
            props = obj[Const.XML_SUBELEMENTS];
            if (props) {
                for (let key in props) {
                    ret[key] = XMLUtil.normalizeXMLData(props[key]);
                }
            }
            for (let key in obj) {
                if (key !== Const.XML_ATTRIBUTES && key !== Const.XML_SUBELEMENTS && key !== Const.XML_TEXT) {
                    ret[key] = XMLUtil.normalizeXMLData(obj[key]);
                }
            }
            // If returning object only contains text value (no attributes and no subelements)
            // return simple string; otherwise add text value as special property
            if (obj[Const.XML_TEXT]) {
                if (Object.keys(ret).length > 0) {
                    ret[Const.XML_TEXT_VALUE] = obj[Const.XML_TEXT];
                } else {
                    return obj[Const.XML_TEXT];
                }
            }
            const keys = Object.keys(ret);
            if (keys.length === 1) {
                if (Array.isArray(ret[keys[0]])) {
                    ret = ret[keys[0]];
                }
            }
            return ret;
        }
    }

}

module.exports = XMLUtil;
