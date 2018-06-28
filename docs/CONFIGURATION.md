# Configuration

We allow user to specify where to show their embedded app.
This includes:
1. Entity Type
2. Location
3. Advanced Config

![Embedded App Setting](./images/embedded-app-setting.png)

## Entity Type
We support 5 entity types:
1. Lead
2. Person
3. Company
4. Opportunity
5. Project

## Location
We support 4 locations for now:
1. Sidebar
2. Activity Panel
3. Action Bar
4. Profile

## Config
#### html5Mode
Normally when we load an embedded app the url would be like:
```
https://your-url.com/?location=sidebar&origin=...&instanceId=...
```

If you specified `html5Mode: true`, it will become
```
https://your-url.com/sidebar?origin=...&instanceId=...
```

#### refreshOnContextUpdate
By default, when switching to a new route in prosperworks app, we will send a event to your app. So you can do
```javascript
sdk.on('contextUpdated', function () {
  // here's your code to handle it
})
```

However, if you do not want to handle the event, you want to refresh your app instead. You can specify this
config `refreshOnContextUpdate: true`, so we will refresh for you every time when the app changes route/context.

#### voip
By turning `voip: true`, all the phone number in prosperworks becomes clickable. When user click it, you will be able to subscribe a event called `phoneNumberClicked`.
e.g.
```javascript
sdk.on('phoneNumberClicked', function ({ number }) {
  // do something with number
})
```

#### allowHttp
By default we do not allow http url to be used in embedded app. If you do need it, e.g. for you local development, you could turn `allowHttp: true`, so we will support it.
However, the browser might still block you from seeing it.
You probably need to click the small icon in right most of your browser's address bar and click allow run unsafe script.

#### verifyServer
This is allowing you to verify your parent frame is actually prosperworks. Please see more deatils in
[Secure Example](./EXAMPLES.html#secure-example)
