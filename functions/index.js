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
  const languages = [req.query.outLang || 'en'];
  const options = {...defaultOptions};
  options.qs['to'] = languages;
  options.body[0] = {text: req.body}

  request(options, (err, res, bodyRes)=>{
    if (err) {
      console.err("Error: ", err)
    }

    let resText;
    if(bodyRes && bodyRes[0]){
      resText = bodyRes[0].translations[0].text;
    }
    response.set('Access-Control-Allow-Origin', '*');
    response.send(resText || err);
  })
})
