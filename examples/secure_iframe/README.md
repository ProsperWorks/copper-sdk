# Copper sample secure app.
The sample secure app include both backend server and
client. When the app is configured as secure. Copper will send a post request to the app with json web token. Backend server will verify the token.
## Development
Start development with watching changes:
```bash
yarn dev
```

Start server:
```bash
yarn start
```

In copper admin page, create embedded app with url: https://localhost:8088 and set `verifyServer:true` in configure.
