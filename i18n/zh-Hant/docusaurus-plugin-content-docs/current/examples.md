# 範例
## 基本範例
這個範例的 JavaScript 網頁應用程式代碼可以在 `examples/basic_iframe` 找到。這個範例不需要後端伺服器，開發時使用的是 webpacker 伺服器。

### 快速開始
#### 啟動 webpack 開發伺服器
```bash
yarn start
# 或
npm start
```
伺服器啟動後，使用瀏覽器訪問 https://localhost:8080 並信任 SSL 憑證。

#### 添加嵌入式應用（Copper 網頁應用）
從 Copper 的網頁管理頁面，導航到 `設定 > 整合`，向下滾動到頁面底部，使用者將會看到一個「建立嵌入式應用」的卡片。選擇「建立嵌入式應用」卡片並填入以下信息，然後點擊「儲存」。

* 名稱：插入這個嵌入式應用的名稱
* URL：`https://localhost:8080`
* 添加至：選擇潛在客戶
* 位置：選擇側邊欄

要查看上面創建的嵌入式應用，導航到潛在客戶記錄的相關標籤。

### 開發
這個基本範例的源代碼包含在 src 文件夾中的 index.html 和 app.js，使用者可以在項目中更改和添加更多文件。

#### 初始化 SDK
```javascript
import Copper from 'copper-sdk'
const sdk = Copper.init()
```

#### 使用 SDK
getContext() API 範例：
```javascript
const context = await sdk.getContext()
```

## 安全範例
這個範例更注重安全性。代碼可以在 `examples/secure_iframe` 找到。這個嵌入式應用會首先向 iframe URL 發送一個包含 JSON Web Token (JWT) 的 POST 請求。嵌入式應用應首先從 Copper 獲取公鑰，並使用該公鑰來驗證 JSON Web Token。

### 快速開始
安全範例使用基於 express 的伺服器端和 webpacker 客戶端。
#### 啟動伺服器和客戶端
```bash
yarn dev
```
可選地，伺服器和客戶端可以分開啟動：
#### 啟動伺服器
```bash
yarn server
```
#### 啟動客戶端 webpack 開發伺服器
```bash
yarn client
```

#### 添加嵌入式應用（Copper 網頁應用）
從 Copper 的網頁管理頁面，導航到 `設定 > 整合`，向下滾動到頁面底部，使用者將會看到一個「建立嵌入式應用」的卡片。選擇「建立嵌入式應用」卡片並填入以下信息，然後點擊「儲存」。

* 名稱：插入這個嵌入式應用的名稱
* URL：`https://localhost:8080`
* 添加至：選擇潛在客戶
* 位置：選擇側邊欄
* 可選的進階配置：`{"verifyServer": true}`

要查看上面創建的嵌入式應用，導航到潛在客戶記錄的相關標籤。

### 開發
當嵌入式應用配置為安全模式時，它將首先接收帶有 JWT 的 POST 請求。JWT 使用 Copper 的私鑰進行加密。必須首先獲取 Copper 的公鑰以驗證 JWT。
#### 獲取 Copper 的公鑰
```javascript
  const { data } = await axios({
    method: 'get',
    url: 'https://api.copper.com/developer_api/v1/embedded_apps/public_key',
  });
```
接下來，使用公鑰在 POST 處理程序中驗證 JWT。
```javascript
app.post('/*', async function(req, res) {
  const token = req.body.jwt;
  jwt.verify(token, publicKey, { algorithm: ['RS256'] }, function(err, payload) {
    if (err) {
      // JWT 無效，不允許進一步訪問
      res.send('error');
    } else {
      // JWT 有效，渲染頁面
    }
  });
});
```
你的伺服器端應該僅在 JWT 令牌有效時允許訪問。