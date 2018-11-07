import React from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,  
  TouchableOpacity,
  View,
  Alert,
  Clipboard
} from 'react-native';
import { connect } from 'react-redux';
import {
  Container, 
  Header, 
  Title, 
  Content, 
  Footer, 
  FooterTab, 
  Button, 
  Left, 
  Right, 
  Body,
  Thumbnail, 
  Icon,
  ListItem,
  List,
  Toast,
  Text} from 'native-base';

import {  Font } from 'expo';
import PropTypes from 'prop-types';
import { MonoText } from '../components/StyledText';
import QRCode from 'react-native-qrcode';
import TabBarIcon from '../components/TabBarIcon';
import LocalEndpoint  from '../api/local/Endpoint';
import { store } from '../App';
import MainTabNavigator from '../navigation/MainTabNavigator';


const robot = require('../assets/images/robot-prod.png');              
export class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  
  constructor(props) {        
    super(props);    
    this.state = {
      balances: []
    };    
  }

  async getBalances(public_key){                
    return fetch(LocalEndpoint.balanceURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'public_key': public_key            
          }
        })
        .then((response) => response.json())
          .then(responseJson => {                      
            if(responseJson.status =='OK'){              
              this.setState({balances:responseJson.data})   
            }else{
              Toast.show({
              text:'an error occured during loading balances!',
              type:'danger',
              buttonText:'Ok',              
            })
            }            
          })
          .catch(error => {
            Toast.show({
              text:'could not connect to server!',
              type:'danger',
              buttonText:'Ok',              
            })            
          });
  }

  async componentDidMount() {    
    try {
      var sessionJson = await AsyncStorage.getItem("@Wallet:session")
      var session = await JSON.parse(sessionJson)      
      this.getBalances(session.stellar_public_key)
      if (session !== null){        
        this.props.dispatch({type:'SET_SESSION', session})        
        const didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.getBalances(session.stellar_public_key)          
      });
      }    
    }
    catch(err) {
      this.props.dispatch({type:'RESET_STATE'})
      console.log('Session not found');
      console.error(err);
    }
  }

  render() {    
    return (
      <Container>
        <Header>
          <Left/>          
          <Body>
            <Title>Account</Title>
          </Body>          
          <Right>
            <Button transparent onPress={this._signOutAsync}>
              <Icon name={Platform.OS =='ios'? 'ios-power':'md-scanner'} />
            </Button>
          </Right>
        </Header>
        <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.getStartedText}>Hello, {this.props.session.account_name}</Text>
            <View  style={{height:10}}/>
            <QRCode
              value={this.props.session.stellar_public_key}
              size={200}
              bgColor='red'
              fgColor='white'/>
          </View>          
           <View style = {{height:10}} />
           <View style={styles.getStartedContainer} >            
            <Text style={styles.publicKeyText}>Your Public Key is: </Text>
            <Text style={styles.publicKeyText} 
            numberOfLines={2} 
            selectable={true}>{this.props.session.stellar_public_key}</Text>                        
          </View>
          <View  style={{height:10}}/>
          <Content>
          <List
            dataArray={this.state.balances}
            renderRow={data =>
              <ListItem avatar>
                <Left>
                  <Thumbnail small source={require('../assets/images/stellar.png')} />
                </Left>
                <Body>
                  <Text>
                    {(data.asset_type ==='native')?'Lumens': data.asset_type}
                  </Text>
                  <Text numberOfLines={1} note>
                    {data.balance}
                  </Text>
                </Body>
                <Right>
                  <Text note>
                    {data.time}
                  </Text>
                </Right>
              </ListItem>}
          />
        </Content>
        </ScrollView>    
      </View>            
      </Container>
      );
  }

  _signOutAsync = async () => {
    Alert.alert('Sign Out',
      'Are you sure want to sign out?',
      [{
        text:'Yes', onPress :async()=>{
          await AsyncStorage.clear();
          this.props.navigation.navigate('Auth');
          Toast.show({
                text:'Signed out,Thank you!',
                type:'success',
                buttonText:'Ok',              
          })
        }
      },
      {
        text:'No',style:'cancel'
      }])    
  };
  

}

AccountScreen.propTypes = {
  session: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
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
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 20,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  publicKeyText:{
    fontSize: 15,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
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
export default connect(mapStateToProps)(AccountScreen);