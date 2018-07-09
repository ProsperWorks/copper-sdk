# Quick Start

## Use with your webpack/rollup/browserify etc.
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

## Use with CDN
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
