const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.post('/checkNumber', async (resquest, response) => {

  let number = resquest.headers.number;

  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto('https://watools.io/check-numbers');
  await page.select('[ng-model="countryDialCode"]','string:+55');
  await page.type('[ng-model="phone"]', `${number}`);
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
  response.json(results);
  await browser.close();
});

app.listen(4000);