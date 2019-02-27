"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
class ReporterOptions {
    constructor() {
        this.debug = false;
        this.enableRetriesWorkaround = false;
        this.enableScreenshotsReporting = false;
        this.enableSeleniumCommandReporting = false;
        this.parseTagsFromTestTitle = false;
        this.screenshotsLogLevel = constants_1.LEVEL.INFO;
        this.seleniumCommandsLogLevel = constants_1.LEVEL.DEBUG;
        this.reportPortalClientConfig = { mode: constants_1.MODE.DEFAULT, tags: [], description: "" };
    }
}
exports.default = ReporterOptions;
