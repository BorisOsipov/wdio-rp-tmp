"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const reporter_1 = require("@wdio/reporter");
const ReportPortalClient = require("reportportal-client");
const constants_1 = require("./constants");
const entities_1 = require("./entities");
const ReporterOptions_1 = require("./ReporterOptions");
const storage_1 = require("./storage");
const utils_1 = require("./utils");
class ReportPortalReporter extends reporter_1.default {
    constructor(options) {
        super(Object.assign({ stdout: true }, options));
        this.storage = new storage_1.Storage();
        this.rpPromisesCompleted = false;
        this.options = Object.assign(new ReporterOptions_1.default(), options);
    }
    get isSynchronised() {
        return this.rpPromisesCompleted;
    }
    set isSynchronised(value) {
        this.rpPromisesCompleted = value;
    }
    onSuiteStart(suite) {
        const suiteStartObj = new entities_1.StartTestItem(suite.title, constants_1.TYPE.SUITE);
        const suiteItem = this.storage.getCurrentSuite();
        let parentId = null;
        if (suiteItem !== null) {
            parentId = suiteItem.id;
        }
        const { tempId, promise } = ReportPortalReporter.client.startTestItem(suiteStartObj, this.tempLaunchId, parentId);
        utils_1.promiseErrorHandler(promise);
        this.storage.addSuite(new entities_1.StorageEntity(suiteStartObj.type, tempId, promise, suite));
    }
    onSuiteEnd(suite) {
        const suiteItem = this.storage.getCurrentSuite();
        const finishSuiteObj = { status: constants_1.STATUS.PASSED };
        const { promise } = ReportPortalReporter.client.finishTestItem(suiteItem.id, finishSuiteObj);
        utils_1.promiseErrorHandler(promise);
        this.storage.removeSuite();
    }
    onTestStart(test) {
        if (!test.title) {
            return;
        }
        const parent = this.storage.getCurrentSuite();
        const testStartObj = new entities_1.StartTestItem(test.title, constants_1.TYPE.STEP);
        if (this.options.parseTagsFromTestTitle) {
            testStartObj.addTagsToTest();
        }
        // TODO
        // addBrowserParam(test.runner[test.cid].browserName, testStartObj);
        const { tempId, promise } = ReportPortalReporter.client.startTestItem(testStartObj, this.tempLaunchId, parent.id);
        utils_1.promiseErrorHandler(promise);
        this.storage.addTest(test.uid, new entities_1.StorageEntity(testStartObj.type, tempId, promise, test));
        return promise;
    }
    onTestPass(test) {
        this.testFinished(test, constants_1.STATUS.PASSED);
    }
    onTestFail(test) {
        this.testFinished(test, constants_1.STATUS.FAILED);
    }
    onTestSkip(test) {
        const testItem = this.storage.getTest(test.uid);
        if (testItem === null) {
            this.onTestStart(test);
        }
        this.testFinished(test, constants_1.STATUS.SKIPPED, new entities_1.Issue("NOT_ISSUE"));
    }
    testFinished(test, status, issue) {
        const testItem = this.storage.getTest(test.uid);
        if (testItem === null) {
            return;
        }
        const finishTestObj = new entities_1.EndTestItem(status, issue);
        if (status === constants_1.STATUS.FAILED) {
            const message = `${test.error.stack} `;
            finishTestObj.description = `${test.file}\n\`\`\`error\n${message}\n\`\`\``;
            ReportPortalReporter.client.sendLog(testItem.id, {
                level: constants_1.LEVEL.ERROR,
                message,
            });
        }
        const { promise } = ReportPortalReporter.client.finishTestItem(testItem.id, finishTestObj);
        utils_1.promiseErrorHandler(promise);
        this.storage.removeTest(test.uid);
    }
    onRunnerStart(event, client) {
        this.isMultiremote = event.isMultiremote;
        ReportPortalReporter.client = client || new ReportPortalClient(this.options.reportPortalClientConfig);
        ReportPortalReporter.launchId = process.env.RP_LAUNCH_ID;
        const startLaunchObj = {
            description: this.options.reportPortalClientConfig.description,
            id: ReportPortalReporter.launchId,
            mode: this.options.reportPortalClientConfig.mode,
            tags: this.options.reportPortalClientConfig.tags,
        };
        const { tempId } = ReportPortalReporter.client.startLaunch(startLaunchObj);
        this.tempLaunchId = tempId;
    }
    onRunnerEnd() {
        return __awaiter(this, void 0, void 0, function* () {
            const finishPromise = ReportPortalReporter.client.getPromiseFinishAllItems(this.tempLaunchId);
            yield finishPromise;
            this.isSynchronised = true;
        });
    }
    onBeforeCommand(command) {
    }
    onAfterCommand(command) {
    }
}
ReportPortalReporter.reporterName = "reportportal";
exports.default = ReportPortalReporter;
(module).exports = ReportPortalReporter;
