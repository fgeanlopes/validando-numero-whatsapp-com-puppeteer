const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')

const app = express();
app.use(cors());

var jsonParser = bodyParser.json()

app.post('/', jsonParser, async (resquest, response) => {

  console.log('entrada post -->', resquest.body);

  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto('https://watools.io/check-numbers');
  await page.select('[ng-model="countryDialCode"]','string:+55');
  await page.type('[ng-model="phone"]', `${resquest.body.number}`);
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