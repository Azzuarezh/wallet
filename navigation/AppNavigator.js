import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BasicToastScreen from '../screens/BasicToast';
import ScanBarcodeScreen from '../screens/ScanBarcodeScreen';
import TransactionScreen from '../screens/TransactionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AccountScreen from '../screens/AccountScreen';
import ReqAssetScreen from '../screens/ReqAssetScreen';
import HistoryScreen from '../screens/HistoryScreen';

const AppStack = createStackNavigator({
	 Account: AccountScreen, 
	 Transaction: TransactionScreen,
	 ReqAsset : ReqAssetScreen,
	 History : HistoryScreen,
	 ScanBarcode : ScanBarcodeScreen
});
const AuthStack = createStackNavigator({ SignIn: SignInScreen , SignUp : SignUpScreen});
export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
	  AuthLoading: AuthLoadingScreen,  
	  Main: MainTabNavigator,
	  Auth : AuthStack,
	  App : AppStack
	},
	{
	    initialRouteName: 'AuthLoading',
	}
);	