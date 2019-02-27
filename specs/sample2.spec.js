const {expect} = require('chai');

describe('describe 2', function() {
  it('it 2', function () {
    browser.url('https://github.com/borisosipov');
    expect($('.p-name').getText()).to.equals('Boris Osipov 2')
  });

  it('it 2', function () {
    browser.url('https://github.com/borisosipov');
    expect($('.p-name').getText()).to.equals('Boris Osipov 3')
  });
});
