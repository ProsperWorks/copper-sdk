# Examples
## Basic Example
The javascript web application code for this example can be found in examples/basic_iframe.
The backend server is not required for this particular example. The webpacker server is used for development.

#### Quick Start
##### Starting the webpacker dev server
```bash
yarn start
# or
npm start
```
After the webpacker has started, use your browser to point to https://localhost:8080 and trust the ssl certificate.

##### Adding an embedded app (Copper web app)
From Copper's web admin page, navigate to "Settings" > "Integrations", scroll to the bottom of the page, where the user will see a "Create an embedded app" card. Select the "Create an embedded app" card and fill in the card with the following information, then click "save". 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name: insert the name of this particular embedded app

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;URL: "https://localhost:8080"

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Add to: select Leads

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Locations: select Sidebar 

In order to view the embedded app created above, navigate to a lead record's related tab. 

#### Development
The source code for this basic example consists of index.html and app.js in the src folder, where users can change and add more files to the project. 

##### Steps on using the sdk
###### Initializing the sdk
```javascript
import Copper from 'copper-sdk'
const sdk = Copper.init()
```

###### Using the sdk
Example of getContext() API:
```javascript
const context = await sdk.getContext()
```

## Secure Example
This example touches more upon security. The code can be found in examples/secure_iframe. This embedded app will send a POST request with json web token(JWT) first to the iframe url. The embedded app should first get the public key from Copper and use the public key to verify the json web token.

#### Quick Start
The secure example uses an express based server side and webpacker client side.
##### Starting the server and client
```bash
yarn dev
```
Optionally, the server and client can be started separately:
###### Starting the server
```bash
yarn server
```
###### Starting the client webpacker dev server
```bas
yarn client
```

##### Adding an embedded app (Copper web app)
From Copper's web admin page, navigate to "Settings" > "Integrations", scroll to the bottom of the page, where the user will see a "Create an embedded app" card. Select the "Create an embedded app" card and fill in the card with the following information, then click "save". 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name: insert the name of this particular embedded app

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;URL: "https://localhost:8080"

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Add to: select Leads

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Locations: select Sidebar 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Optional Advanced Configuration: {"verifyServer": true}

In order to view the embedded app created above, navigate to a lead record's related tab. 


#### Development
When the embedded app is configured as secure, it will receive a post request first with the JWT. The JWT is encrypted with Copper's private key. Copper's public key has to be fetched first in order to verfiy the JWT. 
###### Fetching Copper's public key
```javascript
  const { data } = await axios({
    method: 'get',
    url: 'https://api.copper.com/developer_api/v1/embedded_apps/public_key',
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
      //Valid JWT, render page
    }
  });
});

```
Your server side should only allow access if the JWT token is valid.
