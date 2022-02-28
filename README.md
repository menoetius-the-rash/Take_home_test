# Small project

This is a JS script example that captures detailed flight info ​the​ ​itinerary/summary​ ​page​ ​(selected​
​flight time,​ ​number,​ ​etc.)
This is then used to  create​ ​your​ ​own​ ​flight​ ​data​ ​model which is used to send ​to​ ​api.capturedata.ie​ ​(not​ ​a​ ​real​ ​website)
This uses puppeteer and puppeteer-stealth in order to bypass captcha/verification processes

The next part is to read in data from an example CSV file and parse each line and which sends to a REST endpoint with a JSON payload.
This input data contains passenger details from flight bookings
The output is a single repeating call to the same endpoint mentioned above.
For testing purposes output data to a json file


