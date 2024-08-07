---
slug: /
---

# 快速入門

## 使用 webpack/rollup/browserify 等等

執行以下程式：

```bash
yarn add copper-sdk
# or
npm install copper-sdk --save
```

接著：

```javascript
import Copper from 'copper-sdk';
const sdk = Copper.init();

sdk.getContext()
  .then(({ context }) => {
    // do something with the context
  });
```

## 使用 CDN
`copper-sdk` 部屬於 https://www.jsdelivr.com/package/npm/copper-sdk

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/copper-sdk@latest/dist/copper-sdk.min.js"></script>
<script type="text/javascript">
var sdk = window.Copper.init();
sdk.getContext()
  .then(function (data) {
    var type = data.type; // person,lead,...
    var context = data.context;
    // 隊內容進行其他處理
  });
</script>
```
