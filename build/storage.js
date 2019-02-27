"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Storage {
    constructor() {
        this.testItems = new Map();
        this.allTestItems = new Array();
        this.suites = new Array();
    }
    getCurrentSuite() {
        const currentSuite = this.suites[this.suites.length - 1];
        return currentSuite ? currentSuite : null;
    }
    addSuite(value) {
        this.suites.push(value);
    }
    removeSuite() {
        this.suites.pop();
    }
    getTest(uid) {
        const suite = this.testItems[uid];
        if (!suite) {
            return null;
        }
        return suite;
    }
    addTest(uid, value) {
        this.testItems[uid] = value;
        this.allTestItems.push(value);
    }
    removeTest(uid) {
        delete this.testItems[uid];
    }
    getStartedTests() {
        const tests = this.allTestItems || [];
        return tests.slice();
    }
}
exports.Storage = Storage;
