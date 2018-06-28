# Quick Start

## Use with your webpack/rollup/browserify etc.
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

## Use with CDN
`pw-app-sdk` is served with https://www.jsdelivr.com/package/npm/pw-app-sdk

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pw-app-sdk@latest/dist/pwsdk.min.js"></script>
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
