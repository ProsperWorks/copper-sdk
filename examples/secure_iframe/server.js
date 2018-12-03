require('dotenv').config();

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const privateKey  = fs.readFileSync(path.resolve(__dirname, 'ssl/server.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, 'ssl/server.crt'), 'utf8');

const credentials = {key: privateKey, cert: certificate};

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.SERVER_PORT || 8088;
const copperServer = process.env.COPPER_API_SERVER || 'https://api.copper.com';
const copperPublicKeyUrl = `${copperServer}/developer_api/v1/embedded_apps/public_key`;

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.post('/*', async function(req, res) {
  const token = req.body.jwt;
  const { data } = await axios({
    method: 'get',
    url: copperPublicKeyUrl,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });
  jwt.verify(token, data, { algorithm: ['RS256'] }, function(err, payload) {
    if (err) {
      res.send('error');
    } else {
      res.redirect(req.originalUrl);
    }
  });
});

function serverCallback(err) {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`Server is listening at: https://localhost:${port}`);
}

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, serverCallback);