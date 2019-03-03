const reporter = require('./build/reporter');
const RpService = require('wdio-reportportal-service');
const fs = require('fs');

const conf = {
  reportPortalClientConfig: {
    token: '00000000-0000-0000-0000-00000000000',
    endpoint: 'https://reportportal-url/api/v1',
    launch: 'launch_name',
    project: 'project_name',
    mode: 'DEBUG',
    debug: false,
  },
  reportSeleniumCommands: true,
  seleniumCommandsLogLevel: 'trace',
  autoAttachScreenshots: true,
  screenshotsLogLevel: 'info',
  parseTagsFromTestTitle: true,
};

exports.config = {
  outputDir: __dirname,
  specs: [
    './specs/**/*.js'
  ],
  maxInstances: 4,
  capabilities: [
    {
      maxInstances: 4,
      browserName: 'chrome',
      'goog:chromeOptions': {
      }
    },

  ],
  logLevel: 'trace',
  logLevels: {
    webdriver: 'error',
    webdriverio: 'error',
  },

  deprecationWarnings: true,
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: [[RpService, {}]],
  framework: 'mocha',
  reporters: ['spec', [reporter, conf]
  ],
  afterTest: async function (test) {
    //logging Pass or Fail for test
    (test.passed) ? reporter.sendLogToTest(test, 'debug', `******* TEST '${test.title}' PASSED ******* `)
      : reporter.sendLogToTest(test, 'debug', `******* TEST '${test.title}' FAILED ******* `);
    reporter.sendFileToTest(test, 'info', 'failed.png', fs.readFileSync('./tslint.json'));
  },
};
