/*
   Install the packages:
   puppeteer
   puppeteer-extra
   puppeteer-extra-plugin-stealth
   request
   fs
*/

// initiate
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const request = require('request');
const randomUseragent = require('random-useragent')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

// use all options to ensure to avoi captcha
puppeteer.use(StealthPlugin())

// URL for data
const URL = "https://www.aerlingus.com/html/planPage/planPage.html"

// start of the program
//const scrapeData = async () => {
async function getFlightData(){
   // C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe
   const userAgent = randomUseragent.getRandom();
   const browser = await puppeteer.launch({
                                             headless: false,
                                             executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
                                          });
   const page = await browser.newPage(); 
   await page.setViewport({ width: 1280, height: 800 })
   // Go to website
   
   console.log()
   await page.setUserAgent(userAgent)
   await page.goto(URL, {waitUntil: 'networkidle2'});
   await page.waitForTimeout(500)
   // Accept cookies click
   page.click('[id="onetrust-accept-btn-handler"]')
   await page.waitForTimeout(500)

   // Click verification
   // page.click('[class="geetest_radar_tip"]')
   // Manually require to solve the captcha
   // await page.waitForTimeout(15000)
   // Use time to solve verification

   // input origin from where you you will fly out
   page.click('#origin')
   await page.waitForTimeout(500)
   await page.type('#origin', 'dublin')
   await page.keyboard.press('Enter');
   await page.waitForTimeout(500)
   
   // input destination to fly to
   page.click('#dest')
   await page.waitForTimeout(500)
   await page.type('#dest', 'BCN')
   await page.waitForTimeout(500)
   // enact enter keyboard press
   await page.keyboard.press('Enter');
   await page.waitForTimeout(1500)

   // click to set date
   await page.waitForTimeout(00000)
   await page.click('#homepage_cal_dept > div > div')
   await page.waitForTimeout(1500)
   // click on first date
   await page.click('#day_test_outboundDate-1')
   // type date 04092021
   await page.waitForTimeout(750)
   await page.type('#day_test_outboundDate-1', '04')
   await page.waitForTimeout(750)
   await page.type('#month_test_outboundDate-1', '09')
   await page.waitForTimeout(750)
   await page.type('#year_test_outboundDate-1', '2021')
   await page.waitForTimeout(750)
                                          
   // click on 2nd date and the DD area
   await page.click('#homepage_cal_return > div.relative.h-100 > div > div:nth-child(3)')
   await page.click('#day_test_inboundDate-2')

   // type date 05092021
   await page.waitForTimeout(750)
   await page.type('#day_test_inboundDate-2', '05')
   await page.waitForTimeout(750)
   await page.type('#month_test_inboundDate-2', '09')
   await page.waitForTimeout(750)
   await page.type('#year_test_inboundDate-2', '2021')
   await page.waitForTimeout(750)

   // click search flights:
   await Promise.all([
      page.waitForNavigation(),
      page.click('[class="row pl-0 pr-0 mt-1 col-md-3 pl-md-h mt-md-0"]')
   ]);
   await page.waitForTimeout(1500)

   console.log("start scraping aer lingus")
   var flightData = await page.evaluate(() => {

      // create class for flights
      class Flight{
         constructor(from, to, date, departureTime, arrivalTime, duration, planeCode, flightClass, price) {
            this.from =  from;
            this.to = to;
            this.date = date;
            this.departureTime = departureTime;
            this.arrivalTime = arrivalTime;
            this.duration = duration;
            this.planeCode = planeCode;
            this.flightClass = flightClass;
            this.price = price;
         }
      }

      console.log("flightData collection")
      // Pull Date and price
      var div1 = document.querySelectorAll('[data-test-id="test_barchart_column_date_selected"]');
      
      // Pull flight details for flights
      var div2 = document.querySelectorAll('[class="gray-0 flight-details-info ng-scope"]');

      // Used to get the flight class
      var div3 = document.querySelectorAll('[class="uil-fs-sm fare-name"]');

      // Create an empty object array
      var flights = [div1.length]

      console.log('before for loop')
      // Store all posible Date and Price
      for (let index = 0; index < div1.length; index++) {

         // Date and price
         var date = div1[index].innerText
         var price = div1[index].nextElementSibling.innerText

         flightDetails = div2[index].innerText.replace(/\r?\n|\r/g, " ")
         flightDetails = flightDetails.split(" ")
         // ["06:50", "DUB", "2h", "40m", "10:30", "BCN", "Flight", "Details", "EI", "562", ""]
         flightClass = div3[index].innerText
         flightClass = flightClass.split(" ")[0]
         // Flight Duration
         var duration = flightDetails[2] + flightDetails[3]
         
         // plane code
         var code = flightDetails[8] + flightDetails[9]

         // flight class
         var flightClass = div3[index].innerText
         flightClass = flightClass.split(" ")[0]

         // Create new object with flight details
         flights[index]  = new Flight(flightDetails[1], flightDetails[5], date, flightDetails[0], flightDetails[4],
                                    duration, code, flightClass, price);
      }

      //flights2 = JSON.stringify(flights)
      return flights
   });
   //display in console
   console.log(JSON.stringify(flightData))
   // write to file
   fs.writeFileSync('./Take_home_test/flight_details.json', JSON.stringify(flightData));
   
   browser.close();

   // Send data to api.capture.data.ie endpoint
   var flightDataJSON = JSON.stringify(flightData)
   var URL = 'https://api.capturedata.ie/apiName/endpointName/'

   request.post({
      url: URL, 
      body: flightDataJSON,
      headers: {
         'Content-Type': 'application/json'
       }
   }, function(error, response, body) {
         // 200 - Success
         // 400 - Error something wrong
         console.log(response)
      }  
   )
};

// call function
getFlightData();

// Run the following code below in console by copying and paste
/*
class Flight {
   constructor(from, to, date, departureTime, arrivalTime, duration, planeCode, flightClass, price) {
      this.from =  from;
      this.to = to;
      this.date = date;
      this.departureTime = departureTime;
      this.arrivalTime = arrivalTime;
      this.duration = duration;
      this.planeCode = planeCode;
      this.flightClass = flightClass;
      this.price = price;
   }
 };

console.log("flightData collection")
// Pull Date and price
var div1 = document.querySelectorAll('[data-test-id="test_barchart_column_date_selected"]');

// Pull flight details for flights
var div2 = document.querySelectorAll('[class="gray-0 flight-details-info ng-scope"]');

// Used to get the flight class
var div3 = document.querySelectorAll('[class="uil-fs-sm fare-name"]');

// Create an empty object array
var flights = [div1.length]

// Store all posible Date and Price
for (let index = 0; index < div1.length; index++) {

   // Date and price
   var date = div1[index].innerText
   var price = div1[index].nextElementSibling.innerText

   flightDetails = div2[index].innerText.replace(/\r?\n|\r/g, " ")
   flightDetails = flightDetails.split(" ")
   // ["06:50", "DUB", "2h", "40m", "10:30", "BCN", "Flight", "Details", "EI", "562", ""]
   flightClass = div3[index].innerText
   flightClass = flightClass.split(" ")[0]
   // Flight Duration
   var duration = flightDetails[2] + flightDetails[3]
   
   // plane code
   var code = flightDetails[8] + flightDetails[9]

   // flight class
   var flightClass = div3[index].innerText
   flightClass = flightClass.split(" ")[0]

   flights[index]  = new Flight(flightDetails[1], flightDetails[5], date, flightDetails[0], flightDetails[4],
                              duration, code, flightClass, price);
}
console.log(JSON.stringify(flights));
*/