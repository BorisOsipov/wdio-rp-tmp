const {expect} = require('chai');

describe('describe 1', function() {
  it('it 1', function () {
    browser.url('https://github.com/borisosipov');
    expect($('.p-name').getText()).to.equals('Boris Osipov')
  });

  it('it 1', function () {
    browser.url('https://github.com/borisosipov');
    expect($('.p-name').getText()).to.equals('Boris Osipov')
  });

  describe('describe 1.1', function() {
    it('it  1.1', function () {
      browser.url('https://github.com/borisosipov');
      expect($('.p-name').getText()).to.equals('Boris Osipov')
    });

    it('it  1.1', function () {
      browser.url('https://github.com/borisosipov');
      expect($('.p-name').getText()).to.equals('Boris Osipov')
    });
  });

  describe('describe 1.2', function() {
    it('it  1.2', function () {
      browser.url('https://github.com/borisosipov');
      expect($('.p-name').getText()).to.equals('Boris Osipov')
    });

    it('it  1.2', function () {
      browser.url('https://github.com/borisosipov');
      expect($('.p-name').getText()).to.equals('Boris Osipov')
    });
  });
});
