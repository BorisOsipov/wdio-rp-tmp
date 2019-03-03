const {expect} = require('chai');
const reporter = require('../build/reporter');
const fs = require('fs');

describe('describe_2', function() {
  beforeEach(function () {
    expect(true).to.equals('Boris Osipov 2')
  });
  it('it_2.1 @test @smoke', function () {
    browser.url('https://github.com/borisosipov');
    reporter.sendLog('debug', `******* TEST PASSED ******* `);
    reporter.sendFile('debug', `name`,fs.readFileSync('./screenshot.png'));
    expect($('.p-name').getText()).to.equals('Boris Osipov 2')
  });

  it('it_2.2', function () {
    browser.url('https://github.com/borisosipov');
    expect($('.p-name').getText()).to.equals('Boris Osipov 3')
  });
});
