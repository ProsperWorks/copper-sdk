# Examples
## Basic Example
The simple example code is in examples/basic_iframe. It is a simple javascript web application.
Backend server is not required for the basic example. Webpacker server is used for
development.
#### Quick Start
##### Start webpacker dev server
```bash
yarn start
# or
npm start
```
After start the webpacker, use your browser to point to https://localhost:8080 and trust the
ssl certificate.

In your prosperworks web admin page, click the "Integration" in "Customize Prosperworks"
section. Choose "Embedded Integration" tab and click "Add Integration" button. Give a name
to the basic app and use "https://localhost:8080" as URL. In "Add to" section, choose
at least one entity. Navigate to the entity page such as "Lead" and go to the detail view
page, you should see the embedded app in right side panel.

#### Development
The basic example source code includes index.html and app.js in src folder. You can change
these files and add more files.

##### Steps to use the sdk
###### Initialize the sdk
```javascript
import PWSDK from 'pw-app-sdk'
const sdk = PWSDK.init()
```

###### Use the sdk
Get context api example:
```javascript
const context = await sdk.getContext()
```

## Secure Example
The secure example code is in examples/secure_iframe. For secure embeddded application,
prosperworks web application will send a POST request with JWT first to the iframe url. The
embedded app should first get the public key from prosperworks and use the public key
to verify the json web token.

#### Quick Start
The secure example use express based server side and webpacker client side.
##### Start server and client
```bash
yarn dev
```
You can also start server and client seperately.
###### start server
```bash
yarn server
```
###### Start client webpacker dev server
```bas
yarn client
```

In your prosperworks web admin page, click the "Integration" in "Customize Prosperworks"
section. Choose "Embedded Integration" tab and click "Add Integration" button. Give a name
to the basic app and use "https://localhost:8080" as URL. In "Add to" section, choose
at least one entity. Navigate to the entity page such as "Lead". In the
"Config Section", add {"verifyServer": true}.
Go to the entity detail view page, you should see the embedded app in right side panel.

#### Development
When the embedded app is configured as secure, it will receive a post request first with the
json web token(JWT). The JWT is encrypted with prosperworks private key. To verfiy the JWT,
you need to fetch the prosperworks public key first.
###### Fetch prosperworks public key
```javascript
  const pwAccessToken = 'xxx';
  const pwUserEmail = 'xxxxx';
  const { data } = await axios({
    method: 'get',
    url: 'https://api.prosperworks.com/developer_api/v1/embedded_apps/public_key',
    Accept: 'application/json',
    headers: {
      'X-PW-AccessToken': pwAccessToken,
      'X-PW-Application': 'developer_api',
      'X-PW-UserEmail': pwUserEmail,
    },
  });
```
Next, verify the JWT with the public key in the POST handler.
```javascript
app.post('/*', async function(req, res) {
  const token = req.body.jwt;
  jwt.verify(token, publickKey, { algorithm: ['RS256'] }, function(err, payload) {
    if (err) {
      //Invalid JWT, don't allow further access
      res.send('error');
    } else {
      //Valid JWT, continue to origanlUrl.
      res.redirect(req.originalUrl);
    }
  });
});

```
Your server side should only allow access if the JWT token is valid.
