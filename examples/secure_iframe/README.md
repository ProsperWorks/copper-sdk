# ProsperWorks sample secure app.
The sample secure app include both backend server and
client. When the app is configured as secure. Prosperworks will send a post request to the app with json web token. Backend server will verify the token.
## Development
Start server and client at same time:
```bash
yarn dev
```
You can also start server and client separately:

Start server:
```bash
yarn server
```

Start client
```bash
cd client
yarn start
```

In prosperworks admin page, create embedded app with url: http://localhost:8080 and set verifyServer:true in configure.
