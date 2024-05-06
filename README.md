Copper App SDK
====================

[![npm](https://img.shields.io/npm/v/copper-sdk.svg?style=flat-square)](https://www.npmjs.com/package/copper-sdk)


The javascript SDK provides client-side functionalities for adding embedded app to the Copper web client.

The Embedded app is an iframe embedded in the Copper web page. The display location of the iframe is configured in the embedded app's settings page.

## Usage
Execute the following with your webpack/rollup/browserify etc.
```bash
yarn add copper-sdk
# or
npm install copper-sdk --save
```

Followed by:
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

https://docs.copper.com/copper-sdk

## Development
### Prerequisites

We recommend Node 18 or newer.

Confirm all packages have been installed before development. Yarn will be used for this particular project.

```bash
yarn
```

### Developing SDK
```bash
## watch changes
yarn dev

## or run separately
yarn dev:es
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
Execute `yarn link` inside this repository, then navigate over to the other repository and execute `yarn link copper-sdk`.

An alternative way would be to execute `npm link path/to/copper-sdk` in the repository.
