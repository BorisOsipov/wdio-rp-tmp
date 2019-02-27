import Reporter from "@wdio/reporter";
import * as ReportPortalClient from "reportportal-client";
import {LEVEL, STATUS, TYPE} from "./constants";
import {EndTestItem, Issue, StartTestItem, StorageEntity} from "./entities";
import ReporterOptions from "./ReporterOptions";
import {Storage} from "./storage";
import {promiseErrorHandler} from "./utils";

export default class ReportPortalReporter extends Reporter {
  get isSynchronised(): boolean {
    return this.rpPromisesCompleted;
  }

  set isSynchronised(value: boolean) {
    this.rpPromisesCompleted = value;
  }

  public static reporterName = "reportportal";
  public static launchId;
  public static client: ReportPortalClient;
  public storage = new Storage();
  public tempLaunchId: string;
  public options: ReporterOptions;
  private isMultiremote: boolean;
  private rpPromisesCompleted = false;

  constructor(options: any) {
    super(Object.assign({stdout: true}, options));
    this.options = Object.assign(new ReporterOptions(), options);
  }

  public onSuiteStart(suite: any) {
    const suiteStartObj = new StartTestItem(suite.title, TYPE.SUITE);
    const suiteItem = this.storage.getCurrentSuite();
    let parentId = null;
    if (suiteItem !== null) {
      parentId = suiteItem.id;
    }
    const { tempId, promise } = ReportPortalReporter.client.startTestItem(
      suiteStartObj,
      this.tempLaunchId,
      parentId,
    );
    promiseErrorHandler(promise);
    this.storage.addSuite(new StorageEntity(suiteStartObj.type, tempId, promise, suite));
  }

  public onSuiteEnd(suite: any) {
    const suiteItem = this.storage.getCurrentSuite();
    const finishSuiteObj = {status: STATUS.PASSED};
    const { promise } = ReportPortalReporter.client.finishTestItem(suiteItem.id, finishSuiteObj);
    promiseErrorHandler(promise);
    this.storage.removeSuite();
  }

  public onTestStart(test: any) {
    if (!test.title) {
      return;
    }
    const parent = this.storage.getCurrentSuite();
    const testStartObj = new StartTestItem(test.title, TYPE.STEP);
    if (this.options.parseTagsFromTestTitle) {
      testStartObj.addTagsToTest();
    }
    // TODO
    // addBrowserParam(test.runner[test.cid].browserName, testStartObj);

    const { tempId, promise } = ReportPortalReporter.client.startTestItem(
      testStartObj,
      this.tempLaunchId,
      parent.id,
    );
    promiseErrorHandler(promise);

    this.storage.addTest(test.uid, new StorageEntity(testStartObj.type, tempId, promise, test));
    return promise;
  }

  public onTestPass(test: any) {
    this.testFinished(test, STATUS.PASSED);
  }

  public onTestFail(test: any) {
    this.testFinished(test, STATUS.FAILED);
  }

  public onTestSkip(test: any) {
    const testItem = this.storage.getTest(test.uid);
    if (testItem === null) {
      this.onTestStart(test);
    }
    this.testFinished(test, STATUS.SKIPPED, new Issue("NOT_ISSUE"));
  }

  public testFinished(test: any, status: STATUS, issue ?: Issue) {
    const testItem = this.storage.getTest(test.uid);
    if (testItem === null) {
      return;
    }

    const finishTestObj = new EndTestItem(status, issue);
    if (status === STATUS.FAILED) {
      const message = `${test.error.stack} `;
      finishTestObj.description = `${test.file}\n\`\`\`error\n${message}\n\`\`\``;
      ReportPortalReporter.client.sendLog(testItem.id, {
        level: LEVEL.ERROR,
        message,
      });
    }

    const { promise } = ReportPortalReporter.client.finishTestItem(testItem.id, finishTestObj);
    promiseErrorHandler(promise);

    this.storage.removeTest(test.uid);
  }

  public onRunnerStart(event: any, client: ReportPortalClient) {
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

  public async onRunnerEnd() {
    const finishPromise = ReportPortalReporter.client.getPromiseFinishAllItems(this.tempLaunchId);
    await finishPromise;
    this.isSynchronised = true;
  }

  public onBeforeCommand(command: any) {

  }

  public onAfterCommand(command: any) {

  }

  // TODO support hook reporting
  // public onHookStart(hook: any) {
  // skip global hooks
  // if (!hook.title) {
  //   return;
  // }
  // skip global hooks if no started suite
  // const suiteItem = this.storage.getCurrentSuite();
  // if (suiteItem === null) {
  //   return;
  // }
  // const parent = this.storage.getCurrentSuite();
  // const type = hook.title.includes("before") ? TYPE.BEFORE_METHOD : TYPE.AFTER_METHOD;
  // const hookStartObj = new StartTestItem(hook.title, type);
  //
  // const { tempId, promise } = ReportPortalReporter.client.startTestItem(
  //   hookStartObj,
  //   this.tempLaunchId,
  //   parent.id,
  // );
  // promiseErrorHandler(promise);
  //
  // this.storage.addTest(hook.uid, new StorageEntity(hookStartObj.type, tempId, promise, hook));
  // return promise;
  // }

  // TODO support hook reporting
  // public onHookEnd(hook: any) {
  // const testItem = this.storage.getTest(hook.uid);
  // if (testItem === null) {
  //   return;
  // }
  // const finishTestObj = new EndTestItem(STATUS.PASSED);
  // if (hook.error) {
  //   const message = `${hook.error.stack} `;
  //   finishTestObj.status = STATUS.FAILED;
  //   finishTestObj.description = `${hook.file}\n\`\`\`error\n${message}\n\`\`\``;
  //   ReportPortalReporter.client.sendLog(testItem.id, {
  //     level: LEVEL.ERROR,
  //     message,
  //   });
  // }
  //
  // const { promise } = ReportPortalReporter.client.finishTestItem(testItem.id, finishTestObj);
  // promiseErrorHandler(promise);
  //
  // this.storage.removeTest(hook.uid);
  // }

}

declare var module: any;
(module).exports = ReportPortalReporter;
