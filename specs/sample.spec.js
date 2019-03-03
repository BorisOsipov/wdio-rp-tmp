const {expect} = require('chai');

describe('describe 1', function() {
  it('it 1', function () {
    browser.url('https://github.com/borisosipov');
    expect($('.p-name').getText()).to.equals('Boris Osipov')
  });

  it.skip('my test', () => { console.log(); });

  it('skip it 1', function () {
    this.skip();
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

    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((el) => {
      it(`with failing test${el}`, function () {
        this.retries(1);
        browser.url('https://github.com/');
        browser.getTitle();
        expect(true).to.be.equal(true);
      });
    });
  });

  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((el) => {
    it(`with failing test${el}`, function () {
      this.retries(1);
      browser.url('https://github.com/');
      browser.getTitle();
      expect(true).to.be.equal(false);
    });
  });
});
