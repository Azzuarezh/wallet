# Wallet
Mobile application building wallet with stellar.


#### This Prototype describe basic processes on stellar blockchain
The processes covers many function such as: get account information in stellar, send lumens/other currencies to another account and 
see history of transaction

#### This Prototype using React-Native
that can run under IOS and Android Platform, Due Apple Policy, to run on IOS device, you must install third party apps
called [Expo](https://expo.io) and make sure development server (expo server) running  and in same network between server and device


# Prerequisites
- [Node and NPM](https://nodejs.org/)
- [React-Native](https://facebook.github.io/react-native/)
- Expo client on the device for development ([IOS](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8)/[Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en))

# Dependencies
- [React-Native Camera](https://github.com/react-native-community/react-native-camera)
- [React-Native QR-Code](https://www.npmjs.com/package/react-native-qrcode)
- [React-Native QR-Code Scanner](https://www.npmjs.com/package/react-native-qrcode-scanner)
- [Native Base](https://nativebase.io/)

# Folder Structures

```
wallet
├── README.md
├── node_modules
├── package.json
├── app.js
├── app.json
├── .gitignore
├── api
│   ├── local
|   |     └── Endpoint.js
│   └── stellar
│         └── endpoint.js
├── assets
│   ├── fonts
│   |     └── SpaceMono-Regular.ttf
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
    ├── AccountScreen.js
    ├── AuthLoadingScreen.js
    ├── DetailTransactionScreen.js
    ├── HistoryScreen.js
    ├── HomeScreen.js
    ├── Index.js
    ├── ScanBarcodeScreen.js
    ├── SettingsScreen.js
    ├── SignInScreen.js
    ├── SignUpScreen.js
    ├── style.js
    └── TransactionScreen.js

```
# Getting Started

First step is make sure you have installed prerequisites. Then download the project and install its dependencies, you can clone this project via git or directly download. 
After clone or download successfully, install the dependencies. In the project directory, type  the following command :

```sh
# you can choose either npm install or yarn install. I prefer npm instead
$ npm install
```

## Run Application
In order to run the app with development mode, you need to run the development server (Expo Server) 
When dependencies installation done, execute the expo command to run the develoment server :
```sh
$ expo start
```
wait until the console show the QR code, you can scan the qr directly (IOS) or with Expo client app (Android).
you will be directed to the expo application. Allow expo to access the device in order to activate the function in the app.
Make sure you are in the same network because the script injected from expo server to expo client.


## Build the App (Android)
For detail how to build Standalone mobile apps, you can refer to this [link](https://docs.expo.io/versions/latest/guides/building-standalone-apps.html).
but if you want to know how to build the app, you can use the following code snippet:
```sh
# make sure you run the development server and open another terminal
$ expo build:android
```
