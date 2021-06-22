const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto('https://watools.io/check-numbers');
  await page.select('[ng-model="countryDialCode"]','string:+55');
  await page.type('[ng-model="phone"]', '19984569788');
  await page.click('[ng-click="checkNumber()"]');

  results = {};

  const getData = async() => {
    return await page.evaluate(async () => {
        return await new Promise(resolve => {
          setTimeout(() => {
                resolve([
                  {validacao:document.querySelector('.number-exists').textContent},
                  {erro:document.querySelector('[ng-show="error"]').textContent}
                ]);
          }, 3000)
      })
    })
  }  
  
  results = await getData();
  console.log('0',results[0])
  console.log('1',results[1])
  
  await browser.close();

  return results;
})();