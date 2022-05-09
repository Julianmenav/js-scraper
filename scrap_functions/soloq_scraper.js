const puppeteer = require('puppeteer');
const fs = require('fs/promises');

//Buscamos una lista completa en formato objeto de js con el nombre de twitter de los jugadores y su nombre en el juego.
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const VIEWPORT = { width: 1920, height: 1080}
  await page.setViewport(VIEWPORT);
  console.log("Accediendo a la página...")
  await page.goto('https://soloqchallenge.gg/', {waitUntil: 'domcontentloaded'});
  await page.waitForTimeout(2500);
  // console.log("Tomando screenshot")
  // await page.screenshot({ path: './foto.png', fullPage: true});
  
  const twitterNames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("#tablaclasificacion > tbody > tr > td:nth-child(5) > a"))
      .map((element) => element.href)
      .map((link) => link.split("/").pop())
  })
  
  const lolNames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("#tablaclasificacion > tbody > tr > td:nth-child(7)"))
      .map((element) => element.innerText.trim().replace(/\d+$/, "").trim())
  })

  const accounts = {}
  twitterNames.forEach((twitterName, i) => {
    accounts[twitterName] = [
      {
        "name": lolNames[i],
        "puuid": ""
      }
    ]
  })
  
  console.log(JSON.stringify(accounts))
  await fs.writeFile("names.txt", JSON.stringify(accounts))
  
  await browser.close();
})();


