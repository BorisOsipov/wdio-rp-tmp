const reporter = require('./build/reporter');
const RpService = require('wdio-reportportal-service');
const fs = require('fs');

const conf = {
  reportPortalClientConfig: {
    endpoint: "https://rp.epam.com/api/v1",
    project: "boris_osipov_personal",
    token: "da135aa3-1c6f-4d7f-a25e-d74ccbc64af9",
    launch: 'launch_name',
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
