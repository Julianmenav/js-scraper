const puppeteer = require('puppeteer');

//Queremos una función que nos devuelva la cantidad de puntos de diferencia. y la cantidad de promos.
const lpScraper = async (summonerNameEncoded, nOfGames) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const VIEWPORT = { width: 1920, height: 4000}
  await page.setViewport(VIEWPORT);
  console.log("Accediendo a la página...")
  await page.goto(`https://app.mobalytics.gg/lol/profile/euw/${summonerNameEncoded}/overview`, {waitUntil: 'domcontentloaded'});
  await page.waitForTimeout(1000);
  
  const lastGames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("div.m-15s0h17, div.m-122nwo5, div.m-laq7sq, div.m-2x65k2"))
      .map(el => el.innerText)
  })
  
  const lpDifference = lastGames.slice(0, nOfGames).reduce((agg, el) => {
    if(el == "Promo"){
      agg.promo += 1;
      return agg
    } else {
      agg.lp += parseInt(el.slice(0, el.length - 2))
      return agg
    }
  },{"lp": 0, "promo": 0})
  
  console.log(lpDifference)
  console.log(lastGames.slice(0, nOfGames))
  await browser.close();
}

module.exports = {
  lpScraper
}

