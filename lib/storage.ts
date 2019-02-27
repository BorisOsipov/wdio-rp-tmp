import {StorageEntity} from "./entities";

export class Storage {
  private testItems = new Map<string, StorageEntity[]>();
  private allTestItems = new Array<StorageEntity>();
  private suites = new Array<StorageEntity>();

  public getCurrentSuite() {
    const currentSuite = this.suites[this.suites.length - 1];
    return currentSuite ? currentSuite : null;
  }

  public addSuite(value: StorageEntity) {
    this.suites.push(value);
  }

  public removeSuite() {
    this.suites.pop();
  }

  public getTest(uid): StorageEntity | null {
    const suite = this.testItems[uid];
    if (!suite) {
      return null;
    }
    return suite;
  }

  public addTest(uid, value: StorageEntity) {
    this.testItems[uid] = value;
    this.allTestItems.push(value);
  }

  public removeTest(uid) {
    delete this.testItems[uid];
  }

  public getStartedTests(): StorageEntity[] {
    const tests = this.allTestItems || [];
    return tests.slice();
  }
}
