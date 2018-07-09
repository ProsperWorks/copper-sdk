# References
#### Initialization
The method Copper.init() is used to initialize and setup the SDK. All other SDK methods
must be called after this one.
```javascript
Copper.init()
```

#### getContext
The method getContext() return the context of the current copper page.
```javascript
getContext()
```

###### Returns
| Type   | Description            |
| ------ | ---------------------- |
| Object | current context object |

#### saveContext
The method save() will save the value to the server and update the copper UI.

###### Example
```javascript
const context = sdk.getContext();
context.name = "Joe"
context.save()
```

#### showModal
The method showModal will open modal in copper web page. The url for the modal is
set as the url of the embedded app appended with "?location=modal". For example,
if the url of the embdded app is "https://www.example.com", the modal url is "https://www.example.com?location=modal".

###### Parameter
| Name | Type   | Required | Description                                    |
| ---- | ------ | -------- | ---------------------------------------------- |
| data | Object | no       | data will be passed to the modal as parameters |

###### Example
```javascript
sdk.showModal({ foo: 'bar'})
```

#### closeModal
The method closeModal will close current active modal.
###### Example
```javascript
sdk.closeModal()
```

#### setAppUI
The method setAppUI will change the UI of the parent copper web page.
###### Parameter
| Name | Type   | Required | Description                                                                                                                                                 |
| ---- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data | object | yes      | data use json format. Currently three key in the json is supported:<br> "counter", "height", "width", "disableAddButton", "showActionBar", "isActionBarActive". |

###### Example
```javascript
sdk.setAppUI({
  counter: 5,   //change the counter in parent frame above the iframe
  width: 500,  //change the iframe width (currently only app in action bar allow this)
  height: 500,  //change the iframe height
  disableAddButton: true,  //disable the add button in parent frame above the iframe
  showActionBar: true,  //show embeddded app iframe for action bar
  isActionBarActive: true,  //highlight the action bar icon
})
```

#### publishMessage
The method publishMessage(type,target, data) publishes message to other locations of the same embedded app.
###### Parameter
| Name   | Type   | Required | Description                                                                                                                                            |
| ------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type   | String | yes      | Type of message. Can be any string                                                                                                                     |
| target | String | yes      | Locations of the message receiver. Currently supported locations includes:<br> "sidebar", "activity_panel", "action_bar", "profile", "modal".<br> "*" means all locations except the sender. |
| data   | json   | yes      | message content to be sent                                                                                                                             |

###### Example
```javascript
sdk.publishMessage('myMessageType', 'sidebar', {foo: 'bar'})
```

#### on
The method on(type, cb) subscribe to the message type with call back cb.
###### Parameter
| Name | Type     | Required | Description                             |
| ---- | -------- | -------- | --------------------------------------- |
| type | String   | yes      | Message type to subscribe               |
| cb   | function | yes      | Callback function to handle the message |

###### Events
| Event Name         | When is it triggered                                |
| ------------------ | --------------------------------------------------- |
| addButtonClicked   | When app is in sidebar and + button is clicked      |
| phoneNumberClicked | When voip configuration is on, and phone is clicked |
| contextUpdated     | When copper app routing changed               |

###### Example
```javascript
sdk.on('myMessageType', (msg) => {
  console.log(msg)
})
```

#### api
The method api(url, options) will proxy the api call copper api server api.copper.com.

###### Parameter
| Name    | Type   | Required | Description                                                                                                                                                                                         |
| ------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url     | String | yes      | url of the api. E.g. '/v1/people/1'                                                                                                                                                                 |
| options | object | yes      | options for the api call. Two keys are supported 'method' and 'body', where value of method can be <br> 'GET', 'POST', 'PUT', 'PATCH' and 'DELETE'. Value of body is the data sent to the api end point. |

###### Example
```javascript
sdk.api('/v1/leads/', {
  method: 'POST',
  body: {
    name: 'lead name'
  }
})
```
All the developer api url are supported. The method and data format of each api end point can be find in the prosperwork api documentation.

#### refreshUI
The method refreshUI(target) will refresh the target UI section. It is primarily used after the above api(url, options) call to update the UI to reflect the data changed in server.

##### Parameter
| Name   | Type   | Required | Description                                                                                                                                                                                                        |
| ------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| target | Object | yes      | The format of the parameter is { name: targetName, data: data}, where targetName can be 'ActivityLog',  and 'Related'. For 'ActivityLog' data is not required. For 'Related', data format is { type: entityType }. |

###### Example
```javascript
sdk.refreshUI({ name: 'ActivityLog'})
sdk.refreshUI({ name: 'Related', data: { type: 'lead'}})
```

#### logActivity
The method logActivity(type, details) creates activity log in the copper.
###### Parameter
| Name    | Type   | Required | Description               |
| ------- | ------ | -------- | ------------------------- |
| type    | String | yes      | activity log type.        |
| details | Object | yes      | Activity log detail data. |

Please check the copper developer api documentation for activity type and details.

###### Example
```javascript
const activityType = 0;  // Activity Type 'note'
const details = 'This is a note';
sdk.logActivity(activityType, details);
```

#### createEntity
The method createEntity(entityType, entityData) creates entity in the copper.
###### Parameter

| Name       | Type   | Required | Description                                                                                  |
| ---------- | ------ | -------- | -------------------------------------------------------------------------------------------- |
| entityType | String | yes      | Entity type. Supported values: 'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entitData  | Object | yes      | Entity data.                                                                                 |

Please check the copper developer api documentation for entity details.

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

#### relateEntity
The method relateEntity(entityType, entityId, target) relates two entities in the copper.
###### Parameter
| Name       | Type    | Required | Description                                                                                  |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------- |
| entityType | String  | yes      | Entity type. Supported values: 'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entityId   | Integer | yes      | Id of the source entity to related.                                                          |
| target     | Object  | yes      | Target entity to be related to. Format of target is {id: id, type: entityType}               |

Please check the copper developer api documentation for entity details.

###### Example
```javascript
const entityType = 'lead';
const entityId = 1;
const target = {
  id: 10,
  type: 'opportuntiy'
};
sdk.relatedEntity(entityType, entityId, target); //relate opportunity 10 to lead 1
```

#### navigateToEntityDetail
Allow embedded app to navigate to a specific entity page
###### Parameter
| Name       | Type    | Required | Description                                                                                  |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------- |
| entityType | String  | yes      | Entity type. Supported values: 'lead', 'person', 'company', 'opportunity', 'project', 'task' |
| entityId   | Integer | yes      | Id of the source entity to related.                                                          |

Please check the copper developer api documentation for entity details.

###### Example
```javascript
const entityType = 'lead';
const entityId = 1;
sdk.navigateToEntityDetail(entityType, entityId); //navigate to lead with id 1
```







