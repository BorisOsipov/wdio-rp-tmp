const reporter = require('./build/reporter');
const RpService = require('wdio-reportportal-service');

const conf = {
  reportPortalClientConfig: {
    token: '00000000-0000-0000-0000-00000000000',
    endpoint: 'https://reportportal-url/api/v1',
    launch: 'launch_name',
    project: 'project_name',
    mode: 'DEBUG',
    debug: false,
  },
  enableSeleniumCommandReporting: false,
  seleniumCommandsLogLevel: 'trace',
  enableScreenshotsReporting: false,
  screenshotsLogLevel: 'info',
  enableRetriesWorkaround: true,
  parseTagsFromTestTitle: false,
};

exports.config = {
  specs: [
    './specs/**/*.js'
  ],
  maxInstances: 2,
  capabilities: [
    {
      maxInstances: 2,
      browserName: 'chrome',
      'goog:chromeOptions': {
      }
    },

  ],
  logLevel: 'error',
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
};
