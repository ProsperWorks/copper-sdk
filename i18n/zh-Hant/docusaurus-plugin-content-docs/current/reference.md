# 函式

## 初始化
`Copper.init()` 方法用於初始化和設置 SDK。所有其他 SDK 方法必須在此之後調用。
```javascript
Copper.init()
```

## getContext()
`getContext()` 方法返回當前 Copper 頁面的上下文。
```javascript
getContext()
```

#### 返回
| 類型   | 描述                      |
| ------ | ------------------------ |
| 物件   | 當前上下文物件            |

## saveContext()
`save()` 方法會將值儲存到伺服器並更新 Copper UI。

#### 範例
```javascript
const context = await sdk.getContext();
context.name = "Joe"
context.save()
```

## showModal()
`showModal()` 方法將在 Copper 的網頁中打開模態窗口。模態窗口的 URL 設為嵌入式應用的 URL 加上 `?location=modal`。例如，如果嵌入式應用的 URL 為 `https://www.example.com`，則模態窗口的 URL 為 `https://www.example.com?location=modal`。

#### 參數
| 名稱 | 類型   | 必填   | 描述                                      |
| ---- | ------ | ------ | ---------------------------------------- |
| Data | 物件   | 否     | 將作為參數傳遞給模態窗口的數據           |

#### 特殊參數
`showModal({ width: 300, height: 400, displayHeader: true })`

| 名稱          | 類型    | 必填   | 描述                                |
| ------------- | ------- | ------ | ----------------------------------- |
| width         | 整數    | 否     | 模態窗口的寬度                      |
| height        | 整數    | 否     | 模態窗口的高度                      |
| displayHeader | 布林值  | 否     | 是否顯示標題                       |

#### 範例
```javascript
sdk.showModal({ foo: 'bar'})
```

## closeModal()
`closeModal()` 方法將關閉當前活躍的模態窗口。

#### 範例
```javascript
sdk.closeModal()
```

## setAppUI()
`setAppUI()` 方法將更改父 Copper 網頁的 UI。

#### 參數
| 名稱              | 類型   | 必填   | 描述                                                                                                   |
| ----------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------ |
| Data              | 物件   | 是     | 數據使用 JSON 格式。目前支持 JSON 中的六個鍵：<br/> "count", "height", "width", "disableAddButton", "showActionBar", "isActionBarActive". |

#### 範例
```javascript
sdk.setAppUI({
  count: 5,   // 更改應用標頭中的計數器值
  width: 500,  // 更改 iframe 寬度（目前支持於模態窗口/操作欄）
  height: 500,  // 更改 iframe 高度
  disableAddButton: true,  // 禁用 iframe 上方父框架中的添加按鈕
  showActionBar: true,  // 顯示嵌入式應用 iframe 的操作欄
  isActionBarActive: true,  // 高亮顯示操作欄圖標
  allowModals: false, // 為 true 時，允許 iframe 中的模態窗口
})
```

## publishMessage()
`publishMessage(type, target, data)` 方法將消息發布到同一嵌入式應用的其他位置。

#### 參數
| 名稱   | 類型   | 必填   | 描述                                                                                                 |
| ------ | ------ | ------ | ---------------------------------------------------------------------------------------------------- |
| Type   | 字串   | 是     | 消息的類型，可以是任何字串                                                                          |
| Target | 字串   | 是     | 消息接收者的位置。目前支持的地點包括：<br/> "sidebar", "activity_panel", "action_bar", "profile", "modal".<br/> "*" 代表所有位置，除了發送者。 |
| Data   | JSON   | 是     | 要發送的消息內容                                                                                     |

#### 範例
```javascript
sdk.publishMessage('myMessageType', 'sidebar', {foo: 'bar'})
```

## on()
`on(type, cb)` 方法訂閱消息類型並使用回調函數 `cb` 處理。

#### 參數
| 名稱 | 類型     | 必填   | 描述                             |
| ---- | -------- | ------ | -------------------------------- |
| Type | 字串     | 是     | 要訂閱的消息類型                 |
| cb   | 函數     | 是     | 用於處理消息的回調函數           |

#### 事件
| 事件名稱           | 觸發時機                               |
| ------------------ | ------------------------------------- |
| addButtonClicked   | 當應用在側邊欄中並且 + 按鈕被點擊時    |
| phoneNumberClicked | 當 VOIP 配置開啟且點擊電話號碼時      |
| contextUpdated     | 當 Copper 應用的路由發生變更時        |
| recordSelected     | 當列表視圖中選擇任何項目時            |

#### 範例
```javascript
sdk.on('myMessageType', (msg) => {
  console.log(msg)
})
```

## api()
`api(url, options)` 方法將代理來自 Copper API 伺服器 `api.copper.com` 的 API 呼叫。

#### 參數
| 名稱    | 類型   | 必填   | 描述                                                                                                                                         |
| ------- | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| url     | 字串   | 是     | API 的 URL。例如：'/v1/people/1'                                                                                                           |
| Options | 物件   | 是     | API 呼叫的選項。支持兩個鍵 'method' 和 'body'，其中 'method' 的值可以是 <br/> 'GET', 'POST', 'PUT', 'PATCH' 和 'DELETE'。'body' 的值是發送到 API 端點的數據。 |

#### 範例
```javascript
sdk.api('/v1/leads/', {
  method: 'POST',
  body: JSON.stringify({
    name: 'lead name'
  })
})
```
所有開發者 API URL 都受支持。每個 API 端點的請求方法和數據格式可以在 Copper 的 API 文檔中找到。

## refreshUI()
`refreshUI(target)` 方法將刷新目標的 UI 部分。主要在上述 `api(url, options)` 呼叫後使用，以更新 UI 以反映伺服器中數據的變更。

#### 參數
| 名稱   | 類型   | 必填   | 描述                                                                                                                                                          |
| ------ | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Target | 物件   | 是     | 參數的格式為 `{ name: targetName, data: data }`，其中 targetName 可以是 'ActivityLog' 或 'Related'。'ActivityLog' 的數據不是必需的。對於 'Related'，數據格式為 `{ type: entityType }`。 |

#### 範例
```javascript
sdk.refreshUI({ name: 'ActivityLog'})
sdk.refreshUI({ name: 'Related', data: { type: 'lead'}})
```

## logActivity()
`logActivity(type, details)` 方法在 Copper 網頁應用中創建活動日誌。

#### 參數
| 名稱    | 類型   | 必填   | 描述                         |
| ------- | ------ | ------ | ---------------------------- |
| Type    | 字串   | 是     | 活動日誌的類型               |
| Details | 物件   | 是     | 活動日誌的詳細數據           |

請參閱 Copper 的開發者 API 文檔，以獲取活動類型和詳細信息。

#### 範例
```javascript
const activityType = 0;  // 活動類型 'note'
const details = '這是一條備註';
sdk.logActivity(activityType, details);
```

## createEntity()
`createEntity(entityType, entityData)` 方法在 Copper 網頁應用中創建一個實體。

#### 參數

| 名稱       | 類型   | 必填   | 描述                                                                                  |
| ---------- | ------ | ------ | ------------------------------------------------------------------------------------ |
| EntityType | 字串   | 是     | 實體類型。支持的值有：'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entityData  | 物件   | 是     | 實體數據。                                                                             |

請參閱 Copper 的開發者 API 文檔以獲取實體詳細信息。

#### 範例
```javascript
const entityType = 'lead';
const entityData = {
  name: '我的潛在客戶',
  email: {
    email: 'mylead@noemail.com',
    category: 'work'
  },
  phone_numbers: [
    {
      number: '1234567',
      category: 'mobile'
    }
  ]
};
sdk.createEntity(entityType, entityData);
```

## relateEntity()
`relateEntity(entityType, entityId, target)` 方法將兩個實體在 Copper 網頁應用中關聯起來。

#### 參數
| 名稱       | 類型    | 必填   | 描述                                                                                  |
| ---------- | ------- | ------ | ------------------------------------------------------------------------------------ |
| entityType | 字串    | 是     | 實體類型。支持的值有：'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entityId   | 整數    | 是     | 實體記錄的 ID                                                                       |
| Target     | 物件    | 是     | 目標實體。格式為 `{ id: id, type: entityType }`                                     |

請參閱 Copper 的開發者 API 文檔以獲取實體詳細信息。

#### 範例
```javascript
const entityType = 'task';
const entityId = 1;
const target = {
  id: 10,
  type: 'opportunity'
};
sdk.relateEntity(entityType, entityId, target); // 將機會 10 關聯到任務 1
```

## navigateToEntityDetail()
此方法允許嵌入式應用導航到特定實體記錄的頁面。

#### 參數
| 名稱       | 類型    | 必填   | 描述                                                                                  |
| ---------- | ------- | ------ | ------------------------------------------------------------------------------------ |
| entityType | 字串    | 是     | 實體類型。支持的值有：'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entityId   | 整數    | 是     | 實體記錄的 ID                                                                       |

請參閱 Copper 的開發者 API 文檔以獲取實體詳細信息。

#### 範例
```javascript
const entityType = 'task';
const entityId = 1;
sdk.navigateToEntityDetail(entityType, entityId); // 導航到 ID 為 1 的任務
```

## getSelectedRecords()
通過 `pageNumber` 和 `pageSize` 獲取選中的記錄。

#### 參數
| 名稱       | 類型    | 必填   | 描述                                                                                  |
| ---------- | ------- | ------ | ------------------------------------------------------------------------------------ |
| pageNumber | 整數    | 否     | 頁碼                                                                                  |
| pageSize   | 整數    | 否     | 頁面大小                                                                              |

#### 範例
```javascript
await sdk.getSelectedRecords({ pageNumber: 0, pageSize: 100 });
// 返回
[
  {
    "id": 165837,
    "first_name": "Jason",
    "last_name": "Mraz",
    "middle_name": null,
    ...
  }
]
```

## getUserInfo()
獲取當前用戶信息。

返回的響應將包含用戶所擁有的角色列表。Copper 目前支持三種角色：

* `user`: 用戶可以正常使用系統。
* `admin`: 用戶可以執行管理操作。
* `account_owner`: 用戶是帳戶擁有者。

#### 範例
```javascript
await sdk.getUserInfo();
// 返回
{
  "account": {
    "id": 1,
    "name": "Google"
  },
  "user": {
    "email": "larry@google.com",
    "id": 1,
    "name": "Larry Page",
    "roles": ["user", "admin"]
  }
}
```

## getConfig()
獲取當前應用和安裝配置。

#### 範例
```javascript
await sdk.getConfig();
// 返回
{
  "appConfig": {
    "height": 600
  },
  "config": { // 這是安裝配置
    "token": "my_token"
  }
}
```