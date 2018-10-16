import React from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,  
  TouchableOpacity,
  View,
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
  Text} from 'native-base';

import {  Font } from 'expo';
import PropTypes from 'prop-types';
import { MonoText } from '../components/StyledText';
import QRCode from 'react-native-qrcode';
import TabBarIcon from '../components/TabBarIcon';
import { store } from '../App';



const robot = require('../assets/images/robot-prod.png');              
export class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  
  async componentDidMount() {
    console.log('state :',store.getState());
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
              <Icon name='ios-exit' />
            </Button>
          </Right>
        </Header>
        <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/stellar.png')}
              style={styles.welcomeImage}
            />
            <QRCode
              value={this.props.session.stellar_public_key}
              size={200}
              bgColor='purple'
              fgColor='white'/>
          </View>
          <View style={styles.getStartedContainer}>            
            <Text style={styles.getStartedText}>Hello, {this.props.session.account_name}</Text>                        
          </View>
           <View style = {{height:10}} />
           <View style={styles.getStartedContainer} accessible={true}>            
            <Text style={styles.publicKeyText}> {this.props.session.stellar_public_key}</Text>                        
          </View>
          <View  style={{height:10}}/>
          <Content>
          <List
            dataArray={this.props.session.stellar_acct_properties.balances}
            renderRow={data =>
              <ListItem avatar>
                <Left>
                  <Thumbnail small source={require('../assets/images/stellar.png')} />
                </Left>
                <Body>
                  <Text>
                    {data.asset_type}
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
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
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
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  publicKeyText:{
    fontSize: 10,
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