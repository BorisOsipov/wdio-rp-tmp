WDIO Report Portal Reporter
====================
> A WebdriverIO reporter plugin to report results to Report Portal(http://reportportal.io/).


## Installation
The easiest way is to keep `wdio-reportportal-reporter` and `wdio-reportportal-service` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "wdio-reportportal-reporter": "https://github.com/BorisOsipov/wdio-rp-tmp.git#master",
    "wdio-reportportal-service": "https://github.com/BorisOsipov/wdio-reportportal-service.git#master"
  }
}
```
Instructions on how to install `WebdriverIO` can be found [here](http://webdriver.io/guide/getstarted/install.html).
## Configuration
Configure the output directory in your wdio.conf.js file:
```js
const reportportal = require('wdio-reportportal-reporter');
const RpService = require("wdio-reportportal-service");

const conf = {
  reportPortalClientConfig: {
    token: '00000000-0000-0000-0000-00000000000',
    endpoint: 'https://reportportal-url/api/v1',
    launch: 'launch_name',
    project: 'project_name',
    mode: 'DEFAULT',
    debug: false,
    description: "Launch description text",
    tags: ["tags", "for", "launch"],
  },
  reportSeleniumCommands: false,
  autoAttachScreenshots: false,
  seleniumCommandsLogLevel: 'debug',
  screenshotsLogLevel: 'info',
  parseTagsFromTestTitle: false,
}

exports.config = {
  // ...
  services: [[RpService, {}]],
  reporters: [[reportportal, conf]],
  // ...
}
```
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
