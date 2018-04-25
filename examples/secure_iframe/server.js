if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.SERVER_PORT || 8088;
const pwServer = process.env.PW_API_SERVER || 'https://api.prosperworks.com';
const pwAccessToken = process.env.PW_ACCESS_TOKEN;
const pwUserEmail = process.env.PW_USER_EMAIL;
const pwPublicKeyUrl = `${pwServer}/developer_api/v1/embedded_apps/public_key`;
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

app.post('/*', async function(req, res) {
  const token = req.body.jwt;
  const { data } = await axios({
    method: 'get',
    url: pwPublicKeyUrl,
    Accept: 'application/json',
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      'X-PW-AccessToken': pwAccessToken,
      'X-PW-Application': 'developer_api',
      'X-PW-UserEmail': pwUserEmail,
    },
  });
  jwt.verify(token, data, { algorithm: ['RS256'] }, function(err, payload) {
    if (err) {
      res.send('error');
    } else {
      res.redirect(req.originalUrl);
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`Server is listening at: http://localhost:${port}`);
});
