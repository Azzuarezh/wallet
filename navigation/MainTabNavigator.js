import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SettingsScreen from '../screens/SettingsScreen';
import AccountScreen from '../screens/AccountScreen';
import TransactionScreen from '../screens/TransactionScreen';
import ReqAssetScreen from '../screens/ReqAssetScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ScanBarcodeScreen from '../screens/ScanBarcodeScreen';


const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};


const AccountStack = createStackNavigator({
  Account: AccountScreen,
});

AccountStack.navigationOptions = {
  tabBarLabel: 'Akun',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={  Platform.OS === 'ios' ? `ios-contact${focused ? '' : '-outline'}` : 'md-contact'}
    />
  ),
};


const TransactionStack = createStackNavigator({
  Transaction: {screen : TransactionScreen},
  ScanBarcode :{screen : ScanBarcodeScreen}
});

TransactionStack.navigationOptions = {
  tabBarLabel: 'Transaksi',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={  Platform.OS === 'ios' ? `ios-cart${focused ? '' : '-outline'}` : 'md-cart'}
    />
  ),
};

const ReqAssetStack = createStackNavigator({
  ReqAsset: ReqAssetScreen,
});

ReqAssetStack.navigationOptions = {
  tabBarLabel: 'Req Asset',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={  Platform.OS === 'ios' ? `ios-download${focused ? '' : '-outline'}` : 'md-download'}
    />
  ),
};

const HistoryStack = createStackNavigator({
  History: HistoryScreen,
});

HistoryStack.navigationOptions = {
  tabBarLabel: 'History Tx',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={  Platform.OS === 'ios' ? `ios-clock${focused ? '' : '-outline'}` : 'md-clock'}
    />
  ),
};

const ScanBarcodeStack = createStackNavigator({
  ScanBarcode : ScanBarcodeScreen
})

export default createBottomTabNavigator({  
  AccountStack,
  TransactionStack,  
  HistoryStack,
  SettingsStack  
});
