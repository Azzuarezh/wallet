# Wallet
Mobile application building wallet with stellar.


#### This Prototype describe basic processes on stellar blockchain
The processes covers many function such as: get account in stellar, send lumens/other currencies to another account and 
see history of transaction

#### This Prototype using React-Native
that can run under IOS and Android Platform, Due Apple Policy, to run on IOS device, you must install third party apps
called [Expo](https://expo.io) and make sure development server running (expo server) and in same network between server and device


# Prerequisites
- Node and NPM
- React-Native
- Expo (for development)

# Dependencies
- React-Native Camera
- React-Native QR-Code
- React_native QR-Code Scanner
- Native Base

# Folder Structures

```
wallet
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── api
│   ├── local
|   |     └── Endpoint.js
│   └── stellar
│         └── endpoint.js
├── assets
│   ├── fonts
│         └── SpaceMono-Regular.ttf
│   └── images
│         ├── animation.gif
│         ├── icon.png
│         ├── robot-dev.png
│         ├── robot-prod.png
│         ├── splash.png
│         ├── splashscreen.png
│         └── stellar.png
├── components
│   ├── action.js
│   ├── reducer.js
│   ├── StyledText.js
│   └── TabBarIcon.js
├── constants
│   ├── StyledText.js
│   └── TabBarIcon.js
├── navigation
│   ├── AppNavigator.js
│   └── MainTabNavigator.js
└── screens
│   ├── AccountScreen.js
│   ├── AuthLoadingScreen.js
│   ├── DetailTransactionScreen.js
│   ├── HistoryScreen.js
│   ├── HomeScreen.js
│   ├── Index.js
│   ├── ScanBarcodeScreen.js
│   ├── SettingsScreen.js
│   ├── SignInScreen.js
│   ├── SignUpScreen.js
│   ├── style.js
│   └── TransactionScreen.js

```

## Build App the app (Android)
For detail how to build Standalone mobile apps, you can refer to this [link](https://docs.expo.io/versions/latest/guides/building-standalone-apps.html).
but if you want to know how to build the app, you can use the following code snippet:
```sh
# make sure you run the development server and open another terminal
$ expo build:android
```
