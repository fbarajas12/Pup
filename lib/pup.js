const puppeteer = require("puppeteer");
const PupPage = require("./pup_page.js");
const PupElement = require("./pup_element.js");

class Pup {
  page;

  constructor() {
    this.browser = null;
    this.page = null;
  }

  async newPage(url) {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ]
      });

      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1200, height: 800 });
    }
    else if (this.page) {
      await this.page.setRequestInterception(false);
      await this.page.close();
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1200, height: 800 });
    }

    await this.page.goto(url);
    return (new PupPage(this));
  }

  async waitForTitle() {
    await this.page.waitForSelector('title');
  }

  async findElementWithText(text) {
    let xpath = `//*[contains(text(), "${text}")]`;
    await this.page.waitForXPath(xpath);
    let elements = await this.page.$x(xpath);
    return new PupElement(this, elements[0]);
  }

  async close() {
    return this.browser.close();
  }
}

module.exports = Pup;