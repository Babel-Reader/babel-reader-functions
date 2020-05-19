const {v4 : uuidv4} = require('uuid')

const functions = require('firebase-functions');
const request = require('request')

const subscriptionKey = functions.config().translator.key;
const endpoint = functions.config().translator.endpoint;
const region = functions.config().translator.region;

const defaultOptions = {
  method: 'POST',
  baseUrl: endpoint,
  url: 'translate',
  qs: {
    'api-version': '3.0',
  },
  headers: {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Ocp-Apim-Subscription-Region': region,
    'Content-type': 'application/json',
    'X-ClientTraceId': uuidv4().toString()
  },
  body: [{
  }],
  json: true,
};


exports.translate = functions.https.onRequest((req, response) => {
  console.log("Translate request: ", req);
  console.log("body: ", req.body);
  const languages = [req.query.outLang || 'en'];
  const options = {...defaultOptions};
  options.qs['to'] = languages;
  options.body[0] = {text: req.body}
  console.log("Translating to language: ", languages)

  request(options, (err, res, bodyRes)=>{
    console.log("Response from Translate API: ", res || err);
    console.log("response body: ", bodyRes)
    let resText;
    if(bodyRes && bodyRes[0]){
      resText = bodyRes[0].translations[0].text;
    }
    response.send(resText || err);
  })
})
