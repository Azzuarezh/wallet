import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

//stack account
import AccountScreen from '../screens/AccountScreen';

//stack transaction
import TransactionScreen from '../screens/TransactionScreen';
import ScanBarcodeScreen from '../screens/ScanBarcodeScreen';

//stack history
import HistoryScreen from '../screens/HistoryScreen';
import DetailTransactionScreen from '../screens/DetailTransactionScreen';





const AccountStack = createStackNavigator({
  Account: AccountScreen,
});

AccountStack.navigationOptions = {
  tabBarLabel: 'Account',
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
  tabBarLabel: 'Transaction',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={  Platform.OS === 'ios' ? `ios-cart${focused ? '' : '-outline'}` : 'md-cart'}
    />
  ),
};



const HistoryStack = createStackNavigator({
  History: {screen: HistoryScreen},
  DetailTransaction: {screen: DetailTransactionScreen},
});

HistoryStack.navigationOptions = {
  tabBarLabel: 'History',
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
  HistoryStack  
});
