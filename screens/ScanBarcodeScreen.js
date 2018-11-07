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
  Left, 
  Right, 
  Body,
  Thumbnail, 
  Icon,
  ListItem,
  List,
  Text} from 'native-base';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { Permissions, BarCodeScanner,Camera,Constants} from 'expo';
import { storePublicKey } from '../components/action';
import { store } from '../App';

export class ScanBarcodeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      delay: 300,
      public_key : '',
      hasCameraPermission : null,
      type : Camera.Constants.Type.back,
    };      
  }
  
  async componentDidMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);      
      this.setState({ hasCameraPermission: status === 'granted' });      
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
    

    _handleBarCodeRead = ({ type, data }) => {
      var pk = {data}.data      
      this.props.navigation.navigate('Transaction',{
          public_key : pk
      })            
    }


    renderCameraComponent = (permission)  =>{
      if(permission === null){
        return <Text style={styles.getStartedText}>No Access to camera. Please Allow acces for this aplication to scan barcode</Text>;
      }else if(permission === false){
        return <Text style={styles.getStartedText}>No Access to camera. Please Allow acces for this aplication to scan barcode</Text>;
      }else{
        return(
        <View style={{ flex: 1 , height: 300}}>
          <Text>Scan</Text>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
        </View>
        )
      }
    }  
  
  render() {
    return (
      <Container>
        <Header>
        <Left>
            <Button transparent onPress={() => {this.props.navigation.goBack()}}>
              <Icon name="arrow-back" />
            </Button>
          </Left>          
          <Body>
            <Title>Scan</Title>
          </Body>
          <Right />          
        </Header>
        <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View  style={{height:10}}/>
            <Content>              
              {this.renderCameraComponent(this.state.hasCameraPermission)}
            </Content>
        </ScrollView>
      </View>            
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    session: state.session,
    public_key : state.public_key    
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
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
export default connect(mapStateToProps)(ScanBarcodeScreen);