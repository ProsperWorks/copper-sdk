Copper App SDK
====================

[![Travis branch](https://img.shields.io/travis/Copper/copper-sdk/master.svg?style=flat-square)](https://travis-ci.org/Copper/copper-sdk)
[![npm](https://img.shields.io/npm/v/copper-sdk.svg?style=flat-square)](https://www.npmjs.com/package/copper-sdk)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d8ef6bf3d4669616c465/test_coverage)](https://codeclimate.com/github/ProsperWorks/copper-sdk/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/d8ef6bf3d4669616c465/maintainability)](https://codeclimate.com/github/ProsperWorks/copper-sdk/maintainability)

The javascript SDK provides client-side functionalities for adding embedded app to the copper web client.

Embedded app is an iframe embedded in the copper web page. The display location of the iframe is configured in the embedded app setting page.

## Usage
### Use with your webpack/rollup/browserify etc.
```bash
yarn add copper-sdk
# or
npm install copper-sdk --save
```

Then you could just do
```javascript
import Copper from 'copper-sdk';
const sdk = Copper.init();

sdk.getContext()
  .then(({ context }) => {
    // do something with the context
  });
```

### Use with CDN
`copper-sdk` is served with https://www.jsdelivr.com/package/npm/copper-sdk

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/copper-sdk@latest/dist/copper-sdk.min.js"></script>
<script type="text/javascript">
var sdk = window.Copper.init();
sdk.getContext()
  .then(function (data) {
    var type = data.type; // person,lead,...
    var context = data.context;
    // do something with the context
  });
</script>
```

### SDK Docs

https://prosperworks.github.io/copper-sdk

## Development
### Prerequisites
Before development, make sure you installed all packages. We are using yarn for this project.

```bash
yarn
```

### Developing SDK
```bash
## watch changes
yarn dev:es
# or
yarn dev:commonjs

## build
yarn build

## test
yarn test
# or watch changes
yarn test:dev

## lint
yarn lint
```

## FAQ
### How do I use my local SDK instead of the npm one?
You could do `yarn link` in this repo, and go to your other repo and do
`yarn link copper-sdk`.

Alternatively, you could also do `npm link path/to/pw-app/sdk` in your repo.
