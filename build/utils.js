"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify = require("json-stringify-safe");
const OBJLENGTH = 10;
const ARRLENGTH = 10;
const STRINGLIMIT = 1000;
const STRINGTRUNCATE = 200;
const notBase64 = /[^A-Z0-9+/=]/i;
const TAGS_PATTERN = /\B@[a-z0-9_-]+/gi;
exports.promiseErrorHandler = (promise) => {
    promise.catch((err) => {
        // TOD use wdio logger
        // tslint:disable-next-line:no-console
        console.log(err);
    });
};
exports.isEmpty = (object) => !object || Object.keys(object).length === 0;
const isBase64 = (str) => {
    if (typeof str !== "string") {
        return false;
    }
    const len = str.length;
    if (!len || len % 4 !== 0 || notBase64.test(str)) {
        return false;
    }
    const firstPaddingChar = str.indexOf("=");
    return firstPaddingChar === -1 ||
        firstPaddingChar === len - 1 ||
        (firstPaddingChar === len - 2 && str[len - 1] === "=");
};
/**
 * Limit the length of an arbitrary variable of any type, suitable for being logged or displayed
 * @param  {Any} val Any variable
 * @return {Any} Limited var of same type
 */
exports.limit = (val) => {
    if (!val) {
        return val;
    }
    // Ensure we're working with a copy
    let value = JSON.parse(stringify(val));
    switch (Object.prototype.toString.call(value)) {
        case "[object String]":
            if (value.length > 100 && isBase64(value)) {
                return `[base64] ${value.length} bytes`;
            }
            if (value.length > STRINGLIMIT) {
                return `${value.substr(0, STRINGTRUNCATE)} ... (${value.length - STRINGTRUNCATE} more bytes)`;
            }
            return value;
        case "[object Array]": {
            const { length } = value;
            if (length > ARRLENGTH) {
                value = value.slice(0, ARRLENGTH);
                value.push(`(${length - ARRLENGTH} more items)`);
            }
            return value.map(exports.limit);
        }
        case "[object Object]": {
            const keys = Object.keys(value);
            const removed = [];
            for (let i = 0, l = keys.length; i < l; i += 1) {
                if (i < OBJLENGTH) {
                    value[keys[i]] = exports.limit(value[keys[i]]);
                }
                else {
                    delete value[keys[i]];
                    removed.push(keys[i]);
                }
            }
            if (removed.length) {
                value._ = `${keys.length - OBJLENGTH} more keys: ${JSON.stringify(removed)}`;
            }
            return value;
        }
        default: {
            return value;
        }
    }
};
exports.addTagsToSuite = (tags, suiteStartObj) => {
    if (tags && tags.length > 0) {
        if (tags[0].name) {
            suiteStartObj.tags = tags.map((tag) => tag.name);
        }
        else {
            suiteStartObj.tags = tags;
        }
    }
};
exports.addBrowserParam = (browser, testStartObj) => {
    if (browser) {
        const param = { key: "browser", value: browser };
        testStartObj.parameters = [param];
    }
};
exports.addDescription = (description, suiteStartObj) => {
    if (description) {
        suiteStartObj.description = description;
    }
};
exports.getBrowserDescription = (capabilities, cid) => {
    if (capabilities && !exports.isEmpty(capabilities)) {
        const targetName = capitalizeFirstLetter(capabilities.browserName || capabilities.deviceName || cid);
        const version = capabilities.version || capabilities.platformVersion;
        const browser = version ? `${targetName} v.${version}` : `${targetName}`;
        const browserWithPlatform = capabilities.platform ?
            `${browser} on ${capitalizeFirstLetter(capabilities.platform)}`
            : browser;
        return browserWithPlatform;
    }
    return "";
};
const capitalizeFirstLetter = (val) => {
    if (val) {
        return val.charAt(0).toUpperCase() + val.toLowerCase().slice(1);
    }
    return val;
};
exports.parseTags = (text) => ("" + text).match(TAGS_PATTERN) || [];
exports.sendToReporter = (event, msg = {}) => {
    process.send(Object.assign({ event }, msg));
};
