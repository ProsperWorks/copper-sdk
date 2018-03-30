ProsperWorks App SDK
====================

[![Travis branch](https://img.shields.io/travis/ProsperWorks/pw-app-sdk/master.svg?style=flat-square)](https://travis-ci.org/ProsperWorks/pw-app-sdk)
[![npm](https://img.shields.io/npm/v/pw-app-sdk.svg?style=flat-square)](https://www.npmjs.com/package/pw-app-sdk)
[![Test Coverage](https://api.codeclimate.com/v1/badges/da14ccff1ebc4d8121f4/test_coverage)](https://codeclimate.com/github/ProsperWorks/pw-app-sdk/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/da14ccff1ebc4d8121f4/maintainability)](https://codeclimate.com/github/ProsperWorks/pw-app-sdk/maintainability)

## Usage
### Use with your webpack/rollup/browserify etc.
```bash
yarn add pw-app-sdk
# or
npm install pw-app-sdk --save
```

Then you could just do
```javascript
import PWSDK from 'pw-app-sdk';
const sdk = PWSDK.init();

sdk.getContext()
  .then(({ context }) => {
    // do something with the context
  });
```

### Use with CDN
`pw-app-sdk` is served with https://www.jsdelivr.com/package/npm/pw-app-sdk

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pw-app-sdk@0.2.5/dist/pwsdk.min.js"></script>
<script type="text/javascript">
var sdk = window.PWSDK.init();
sdk.getContext()
  .then(function (data) {
    var type = data.type; // person,lead,...
    var context = data.context;
    // do something with the context
  });
</script>
```

### SDK Docs

https://prosperworks.github.io/pw-app-sdk

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
`yarn link pw-app-sdk`.

Alternatively, you could also do `npm link path/to/pw-app/sdk` in your repo.
