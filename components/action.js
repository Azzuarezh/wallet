import {AsyncStorage, Alert} from 'react-native';


export function logout() {
  return {
    type: 'RESET_STATE'
  };
}


export function storePublicKey(key) {
  try {
    AsyncStorage.setItem("@Wallet:public_key", JSON.stringify(key)).then(() => {
      console.log('Key stored');
    })
  }
  catch (err) {
    console.error(err);
    Alert.alert("Unexpected", "Could not store key");
  }
}

export function storeSession(session) {
  try {
    AsyncStorage.setItem("@Wallet:session", JSON.stringify(session)).then(() => {
      console.log('Session stored');
    })
  }
  catch (err) {
    console.error(err);
    Alert.alert("Unexpected", "Could not store token");
  }
}
