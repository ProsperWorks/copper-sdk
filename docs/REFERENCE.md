# References
#### Initialization
The method Copper.init() is used to initialize and setup the SDK. All other SDK methods must be called after this.
```javascript
Copper.init()
```

#### getContext()
The method getContext() returns the context of the current Copper page.
```javascript
getContext()
```

###### Returns
| Type   | Description            |
| ------ | ---------------------- |
| Object | Current context object |

#### saveContext()
The method save() will save the value to the server and update the Copper UI.

###### Example
```javascript
const context = await sdk.getContext();
context.name = "Joe"
context.save()
```

#### showModal()
The method showModal() will open the modal in Copper's web page. The url for the modal is set as the url of the embedded app appended with "?location=modal". For example, if the url of the embdded app is "https://www.example.com", the modal url is "https://www.example.com?location=modal".

###### Parameter
| Name | Type   | Required | Description                                    |
| ---- | ------ | -------- | ---------------------------------------------- |
| Data | Object | No       | Data will be passed to the modal as parameters |

###### Special Parameter
`showModal({ width: 300, height: 400, displayHeader: true })`

| Name          | Type    | Required | Description                                    |
| ------------- | ------- | -------- | ------------------------ |
| width         | Integer | No       | Width of the modal       |
| height        | Integer | No       | Height of the modal      |
| displayHeader | Bool    | No       | If display header or not |

###### Example
```javascript
sdk.showModal({ foo: 'bar'})
```

#### closeModal()
The method closeModal() will close the current active modal.
###### Example
```javascript
sdk.closeModal()
```

#### setAppUI()
The method setAppUI() will change the UI of the parent Copper's web page.
###### Parameter
| Name | Type   | Required | Description                                                                                                                                                 |
| ---- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data | Object | Yes      | Data uses json format. Currently six keys in the json are supported:<br> "count", "height", "width", "disableAddButton", "showActionBar", "isActionBarActive". |

###### Example
```javascript
sdk.setAppUI({
  count: 5,   //change the value of counter in app header
  width: 500,  //change the iframe width (currently supported by modals/action bar)
  height: 500,  //change the iframe height
  disableAddButton: true,  //disable the add button in the parent frame above the iframe
  showActionBar: true,  //show embeddded app iframe for the action bar
  isActionBarActive: true,  //highlight the action bar icon
  allowModals: false, // when true, will set allow-modals in the iframe
})
```

#### publishMessage()
The method publishMessage(type, target, data) publishes messages to other locations of the same embedded app.
###### Parameter
| Name   | Type   | Required | Description                                                                                                                                            |
| ------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Type   | String | Yes      | Type of message. Can be any string                                                                                                                     |
| Target | String | Yes      | Locations of the message receiver. Currently supported locations include:<br> "sidebar", "activity_panel", "action_bar", "profile", "modal".<br> "*" means all locations except the sender. |
| Data   | json   | Yes      | Content of message to be sent                                                                                                                             |

###### Example
```javascript
sdk.publishMessage('myMessageType', 'sidebar', {foo: 'bar'})
```

#### on()
The method on(type, cb) subscribes to the message type with call back cb.
###### Parameter
| Name | Type     | Required | Description                             |
| ---- | -------- | -------- | --------------------------------------- |
| Type | String   | Yes      | Message type to subscribe               |
| cb   | Function | Yes      | Callback function to handle the message |

###### Events
| Event Name         | When it is triggered                                |
| ------------------ | --------------------------------------------------- |
| addButtonClicked   | When app is in the sidebar and + button is clicked      |
| phoneNumberClicked | When voip configuration is on, and phone is clicked |
| contextUpdated     | When the Copper app routing has changed               |
| recordSelected     | When any item is selected in list view               |

###### Example
```javascript
sdk.on('myMessageType', (msg) => {
  console.log(msg)
})
```

#### api()
The method api(url, options) will proxy the api call from the Copper api server api.copper.com.

###### Parameter
| Name    | Type   | Required | Description                                                                                                                                                                                         |
| ------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url     | String | Yes      | url of the api. E.g. '/v1/people/1'                                                                                                                                                                 |
| Options | Object | Yes      | Options for the api call. Two keys are supported 'method' and 'body', where the method's value can be <br> 'GET', 'POST', 'PUT', 'PATCH' and 'DELETE'. Value of 'body' is the data sent to the api end point. |

###### Example
```javascript
sdk.api('/v1/leads/', {
  method: 'POST',
  body: {
    name: 'lead name'
  }
})
```
All of the developer api url is supported. The method and data format for each api end point can be found in the Copper's api documentation.

#### refreshUI()
The method refreshUI(target) will refresh the target's UI section. It is primarily used after the above api(url, options) call to update the UI to reflect the data changed in the server.

##### Parameter
| Name   | Type   | Required | Description                                                                                                                                                                                                        |
| ------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Target | Object | Yes      | The format of the parameter is { name: targetName, data: data}, where targetName can be 'ActivityLog' or 'Related'. 'ActivityLog' data is not required. For 'Related', data format is { type: entityType }. |

###### Example
```javascript
sdk.refreshUI({ name: 'ActivityLog'})
sdk.refreshUI({ name: 'Related', data: { type: 'lead'}})
```

#### logActivity()
The method logActivity(type, details) creates activity logs in the Copper web app.
###### Parameter
| Name    | Type   | Required | Description               |
| ------- | ------ | -------- | ------------------------- |
| Type    | String | Yes      | Activity log type.        |
| Details | Object | Yes      | Activity log detail data. |

Please check Copper's developer api documentation for activity types and details.

###### Example
```javascript
const activityType = 0;  // Activity Type 'note'
const details = 'This is a note';
sdk.logActivity(activityType, details);
```

#### createEntity()
The method createEntity(entityType, entityData) creates an entity in the Copper web app.
###### Parameter

| Name       | Type   | Required | Description                                                                                  |
| ---------- | ------ | -------- | -------------------------------------------------------------------------------------------- |
| EntityType | String | Yes      | Entity type. Supported values: 'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entityData  | Object | Yes      | Entity data.                                                                                 |

Please check Copper's developer api documentation for entity details.

###### Example
```javascript
const entityType = 'lead';
const entityData = {
  name: 'My Lead',
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

#### relateEntity()
The method relateEntity(entityType, entityId, target) relates two entities in the Copper web app.
###### Parameter
| Name       | Type    | Required | Description                                                                                  |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------- |
| entityType | String  | Yes      | Entity type. Supported values: 'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entityId   | Integer | Yes      | Id of the entity type's record                                                      |
| Target     | Object  | Yes      | Target entity to be related to. Format is {id: id, type: entityType}               |

Please check Copper's developer api documentation for entity details.

###### Example
```javascript
const entityType = 'task';
const entityId = 1;
const target = {
  id: 10,
  type: 'opportuntiy'
};
sdk.relatedEntity(entityType, entityId, target); //relate opportunity 10 to task 1
```

#### navigateToEntityDetail()
This method allows embedded apps to navigate to a specific entity record's page.
###### Parameter
| Name       | Type    | Required | Description                                                                                  |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------- |
| entityType | String  | Yes      | Entity type. Supported values: 'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entityId   | Integer | Yes      | Id of the entity type's record                                                          |

Please check Copper's developer api documentation for entity details.

###### Example
```javascript
const entityType = 'task';
const entityId = 1;
sdk.navigateToEntityDetail(entityType, entityId); //navigate to task with id 1
```

#### getSelectedRecords()
Get selected records by pageNumber and pageSzie
###### Parameter
| Name       | Type    | Required | Description                                                                                  |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------- |
| pageNumber | Integer | No       | page number                                                                                  |
| pageSize   | Integer | No       | page size                                                                                    |

###### Example
```javascript
await sdk.getSelectedRecords({ pageNumber: 0, pageSize: 100});
// returns
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

#### getUserInfo()
Get current current user info

###### Example
```javascript
await sdk.getUserInfo();
// returns
{
  "account": {
    "id": 1,
    "name": "Google"
  },
  "user": {
    "email": "larry@google.com"
    "id": 1,
    "name": "Larry Page"
  }
}
```

#### getConfig()
Get current app and installation config

###### Example
```javascript
await sdk.getConfig();
// returns
{
  "appConfig": {
    "height": 600
  },
  "config": { // this is installation config
    "token": "my_token"
  }
}
```
