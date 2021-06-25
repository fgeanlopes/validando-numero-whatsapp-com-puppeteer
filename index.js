const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')

const app = express();
app.use(cors());

var jsonParser = bodyParser.json()

app.post('/check', jsonParser, async (resquest, response) => {

  const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"]});

  const page = await browser.newPage();

  await page.goto('https://watools.io/check-numbers');
  await page.select('[ng-model="countryDialCode"]','string:+55');
  await page.type('[ng-model="phone"]', `${resquest.query.number}`);
  await page.click('[ng-click="checkNumber()"]');

  results = {};

  const getData = async() => {
    return await page.evaluate(async () => {
        return await new Promise(resolve => {
          setTimeout(()=>{
            resolve([
              {validacao:document.querySelector('.number-exists').textContent},
              {erro:document.querySelector('[ng-show="error"]').textContent}
            ]);
          },4000)
      })
    })
  }
  results = await getData();
  response.json(results);
  
  await browser.close();
});

app.listen(process.env.PORT || 5000);