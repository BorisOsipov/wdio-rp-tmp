const {expect} = require('chai');
const reporter = require('../build/reporter');
const fs = require('fs');

describe('describe_2', function() {
  it('it_2.1 @test @smoke', function () {
    browser.url('https://github.com/borisosipov');
    reporter.sendLog('info', `******* TEST PASSED ******* `);
    reporter.sendFile('debug', `name`, fs.readFileSync('./LICENCE'));
    expect($('.p-name').getText()).to.equals('Boris Osipov 2')
  });

  it('it_2.2', function () {
    browser.url('https://github.com/borisosipov');
    expect($('.p-name').getText()).to.equals('Boris Osipov 3')
  });
});
