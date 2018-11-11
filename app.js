// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
const request = require('request');
const crypto = require('crypto');

const app = express();

// [START hello_world]

var abfragen = [
	{
		url: 'https://www.apple.com/pl-smb/shop/help/returns_refund',
		sums: [
			'77fa7ac98d8b2868547034d92821ef1b',
			'988cdbc8b70e3eb69bf3bcf06d7bff32',
			'82cb052ab91b2382aff53000163df624'
		]
	}
];

function abfrage() {
	abfragen.forEach((item, index) => {
		request(item.url, {  }, (err, res, body) => { // json: true
		  if (err) { return console.log(err); }
		  
		  const newsum = crypto.createHash('md5').update(body).digest("hex");
		  // console.log(newsum);
		  var found = false;
		  item.sums.forEach((sum) => {
		  	if (sum === newsum) {
		  		found = true;
		  	}
		  });
		  if (!found) {
		  	console.log('URL ', item.url, ' has changed: ', newsum);
		  }
		  // console.log(body.explanation);
		});		
	});
}

// Say hello!
app.get('/', (req, res) => {
  abfrage();
  res.status(200).send('Hello, world!');
  
});
// [END hello_world]

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
