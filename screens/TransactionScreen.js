import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  View,
} from 'react-native';
import {
  Container, 
  Header, 
  Title, 
  Content, 
  Footer, 
  FooterTab, 
  Button,
  Input, 
  Left, 
  Right, 
  Body,
  Thumbnail, 
  Icon,
  ListItem,
  List,
  Item,
  Text} from 'native-base';
import { WebBrowser } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import { MonoText } from '../components/StyledText';
import { Permissions, BarCodeScanner,Camera,Constants} from 'expo';
import MainTabNavigator from '../navigation/MainTabNavigator';
import { store } from '../App';

class TransactionScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {        
    super(props);    
    this.state = {
      delay: 300,
      public_key:'',
      amount:null,
      hasCameraPermission : null,
      type : Camera.Constants.Type.back,
    };    
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    console.log('previous props :', prevProps);
    if (this.props.public_key !== prevProps.public_key) {
      this.fetchData(this.props.public_key);
    }
  }

  async componentDidMount() {
      console.log('store state : ', store.getState());
      var storageItemJson = await AsyncStorage.getItem('@Wallet:public_key')
      var storageItem = await JSON.parse(storageItemJson)
      console.log('is storage item not null ? ', storageItem != null)
      if(storageItem != null){        
        this.setState({public_key: storageItem})
      }      
      try {        
        var sessionJson = await AsyncStorage.getItem("@Wallet:session")
        var session = await JSON.parse(sessionJson)        
        if (session !== null){        
          this.props.dispatch({type:'SET_SESSION', session})
        }
      }
      catch(err) {
        this.props.dispatch({type:'RESET_STATE'})
        console.log('Session not found');
        console.error(err);
      }              
    }

   _onPublicKeyChanged = (event) => {    
    this.setState({public_key : event.nativeEvent.text})
   }

   setPublicKey = publicKey => {    
    this.setState({public_key})
  }

   _onAmountChanged = (event) => {
    this.setState({amount : event.nativeEvent.text})
   }

   _handleSendButton = () =>{
    console.log('public key :', this.state.public_key)
    console.log('amount :', this.state.amount)
   }
    
  render() {    
    return (
      <Container>
        <Header>          
          <Body>
            <Title>Transaction</Title>
          </Body>          
        </Header>
        <Content>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View  style={{height:10}}/>
            <Item>
              <Icon name='home' />
              <Input placeholder = 'Input Receiver Public key'
                onChange={this._onPublicKeyChanged} value={this.state.public_key}/>
              <Button transparent onPress={()=> this.props.navigation.navigate('ScanBarcode')}>
              <Icon name={Platform.OS =='ios'? 'ios-qr-scanner':'md-qr-scanner'} />
              </Button>
            </Item>
            <Item>
              <Icon name={Platform.OS =='ios'? 'ios-card':'md-card'} />
              <Input placeholder='amount' 
              keyboardType='numeric' 
              value={this.state.amount} 
              onChange={this._onAmountChanged}/>              
            </Item>
            <View  style={{height:10}}/>
            <Button style={styles.btnSend} primary onPress={this._handleSendButton}><Text> Send </Text></Button>
          </ScrollView>            
        </Content>                
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    session: state.session    
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',    
  },
  btnSend : {
    flex:1,
    alignItems :'center'
  },  
  contentContainer: {
    paddingTop: 30,
    alignItems: 'center'
  },  
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
export default connect(mapStateToProps)(TransactionScreen);