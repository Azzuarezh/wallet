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
  Alert,
  TouchableWithoutFeedback,
  Keyboard
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
  Toast,
  Text, 
  Textarea,
  Spinner
} from 'native-base';
import { WebBrowser } from 'expo';

import { MaterialIcons } from '@expo/vector-icons';
import { MonoText } from '../components/StyledText';
import MainTabNavigator from '../navigation/MainTabNavigator';
import LocalEndpoint  from '../api/local/Endpoint';
import { store } from '../App';

class TransactionScreen extends React.Component {


  static navigationOptions = {
    header: null,
  };
  constructor(props) {        
    super(props);    
    this.state = {
      delay: 300,      
      amount:null,
      public_key:'',
      memo:'',
      loading:false          
    };    
  }
    

  async componentDidMount() {      
      this.setState({public_key : store.getState().public_key})
      var storageItemJson = await AsyncStorage.getItem('@Wallet:public_key')
      var storageItem = await JSON.parse(storageItemJson)      
      if(storageItem != null){        
        this.setState({public_key: storageItem})
      }      
      try {        
        var sessionJson = await AsyncStorage.getItem("@Wallet:session")
        var session = await JSON.parse(sessionJson)        
        if (session !== null){        
          this.props.dispatch({type:'SET_SESSION', session})
        }

        
        const didFocusSubscription = this.props.navigation.addListener(
          'didFocus',
          payload => {                        
            const scannedPublicKey = (!payload.state.params) ? '':payload.state.params.public_key;
            this.setState({public_key:scannedPublicKey})
          }
        );
      }
      catch(err) {
        this.props.dispatch({type:'RESET_STATE'})
        console.log('Session not found');
        console.error(err);
      }              
    }
    

   _onPublicKeyChanged = (event) => {      
    console.log('native event :', event.nativeEvent)
    this.setState({public_key : event.nativeEvent.text})    
   }
   
   _onAmountChanged = (event) => {
    this.setState({amount : event.nativeEvent.text})
   }

   _onMemoChanged = (event) => {
    this.setState({memo : event.nativeEvent.text})
   }

   sendPayment = async(payment)=>{
      console.log('payment object : ', payment)
      console.log('endpoint : ', LocalEndpoint.paymentURL)
      return fetch(LocalEndpoint.paymentURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'          
          },
          body : JSON.stringify(payment)
        })
        .then((response) => response.json())
          .then(responseJson => {            
            if(responseJson.status =='OK'){                            
              Toast.show({
                text:'Transaction Success',
                type:'success',
                buttonText:'Ok',              
              })
              this.setState({loading:false})
              this.props.navigation.navigate('Account')   
            }else{
              Toast.show({
                text:'an error occured during transaction!',
                type:'danger',
                buttonText:'Ok',              
              })
              this.setState({loading:false})
            }            
          })
          .catch(error => {
            Toast.show({
              text:'could not connect to server!',
              type:'danger',
              buttonText:'Ok',              
            })
            console.log('error occured:', error)            
            this.setState({loading:false})
          });
   }
  
   _handleSendButton = async() =>{          
        Keyboard.dismiss()
        var sender ={};
        var receiver = {'public_key': this.state.public_key}
        var amount = this.state.amount;
        var memo = this.state.memo
        var sessionJson = await AsyncStorage.getItem("@Wallet:session")
        var session = await JSON.parse(sessionJson)        
        if (session !== null){          
          sender['public_key'] = session.stellar_public_key;
          sender['secret'] = session.secret;
        }
        console.log('receiver : ', receiver)
        console.log('amount : ', amount)

        if(receiver.public_key ==='' ){
          Toast.show({
                text:'Please fill Receiver Public Key',
                type:'danger',
                buttonText:'Ok',              
              })          
        }else if(amount ==='' || amount === 0 || amount=== null){
          Toast.show({
                text:'Please fill amount ',
                type:'danger',
                buttonText:'Ok',              
              })
          
        }else{
          this.setState({loading:true})
          var paymentObject = {'sender': sender,'receiver':receiver,'tx_amount':amount, 'memo':memo} 
          transactionResult = await this.sendPayment(paymentObject)  
        }
        
   }
   
  render() {      
    if (this.state.loading === true){
      return (
        <Container>
          <Header />
          <Content>
            <Spinner />
          </Content>
        </Container>
      );
    }else{
      return (
        <Container>
          <Header>          
            <Body>
              <Title>Transaction</Title>
            </Body>          
          </Header>
          <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
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
              <Item>
                <Icon name={Platform.OS =='ios'? 'ios-paper':'md-paper'} />              
                <Content padder>
                  <Textarea rowSpan={3} bordered placeholder="Memo" onChange={this._onMemoChanged}/>
                </Content>
              </Item>
              <View style={{height:10}}/>
              <Button style={styles.btnSend} primary onPress={this._handleSendButton}><Text> Send </Text></Button>            
            </ScrollView>            
          </Content>
          </TouchableWithoutFeedback>            
        </Container>
      );
    }    
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
    flex:2,
    alignItems :'center',
    marginHorizontal:50
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