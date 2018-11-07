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
  Text,
  Spinner,
  Segment
} from 'native-base';
import { connect } from 'react-redux';
import { WebBrowser } from 'expo';
import {  Font } from 'expo';
import PropTypes from 'prop-types';
import { MonoText } from '../components/StyledText';
import QRCode from 'react-native-qrcode';
import TabBarIcon from '../components/TabBarIcon';
import LocalEndpoint  from '../api/local/Endpoint';
import StellarEndpoint  from '../api/local/Endpoint';
import { store } from '../App';
import MainTabNavigator from '../navigation/MainTabNavigator';
import moment from 'moment';

class HistoryScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {        
    super(props);    
    this.state = {
      historyTx: [],
      isLoaded :false,
      segment:'income',
      public_key:''
    };    
  }

  _goToDetailTx = (url) => {    
    //WebBrowser.openBrowserAsync(url +'/operations');
    this.props.navigation.navigate('DetailTransaction',url)
  }

  async getHistory(public_key){                
    return fetch(LocalEndpoint.historyURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'public_key': public_key            
          }
        })
        .then((response) => response.json())
          .then(responseJson => {                      
            if(responseJson.status =='OK'){              
              this.setState({historyTx:responseJson.data})
              this.setState({isLoaded:true})   
            }else{
              Toast.show({
                text:'an error occured during loading history!',
                type:'danger',
                buttonText:'Ok',              
              })
              this.setState({isLoaded:true})   
            }            
          })
          .catch(error => {
            Toast.show({
              text:'could not connect to server!',
              type:'danger',
              buttonText:'Ok',              
            })
            this.setState({isLoaded:true})               
          });
  }

  formatDate (dtString) {    
    formattedDate = moment(dtString).fromNow()    
    return formattedDate
  }

   async componentDidMount() {    
    try {
      var sessionJson = await AsyncStorage.getItem("@Wallet:session")
      var session = await JSON.parse(sessionJson)      
      this.getHistory(session.stellar_public_key)
      if (session !== null){        
        this.props.dispatch({type:'SET_SESSION', session})        
        this.setState({ public_key: session.stellar_public_key})
        const didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {          
          this.getHistory(session.stellar_public_key)          
      });
      }    
    }
    catch(err) {
      this.props.dispatch({type:'RESET_STATE'})      
      console.error(err);
    }
  }

  getTxLength(tx){
    return tx.filter(tx.display)
  }

  rendertransactionHistory(segment){        
    var historyTx = this.state.historyTx
    var incomeTx =[];
    var outgoTx =[];    
    var pk = this.state.public_key    
    for(var i = historyTx.length -1; i >= 0 ; i--){
        if(segment =='income'){          
          if(historyTx[i].to === pk){            
            incomeTx.push(historyTx[i])
          }  
        }else{          
          if(historyTx[i].from === pk){            
            outgoTx.push(historyTx[i])
          }
        }        
    }    
    if(this.state.isLoaded){
      segmentTx = (segment === 'income') ? incomeTx : outgoTx;
      if(segmentTx.length ===0){
        return <Text style={styles.getStartedText}>No Transaction</Text>
      }else{
        return(
        <List
            dataArray={segmentTx}
            renderRow={data =>
              <ListItem avatar onPress={() => {                
                this._goToDetailTx(data._links.transaction.href) 
              }}>
                <Left>
                  <Thumbnail small source={require('../assets/images/stellar.png')} />
                </Left>
                <Body>                  
                  <Text style={styles.linkText}>                  
                    {data.amount} 
                  </Text>
                  <Text>                  
                    {(data.asset_type==='native')?'Lumens':data.asset_type} - {data.type}
                  </Text>
                  <Text>{(segment === 'income') ? 'From : ' : 'To :'} </Text>
                  <Text numberOfLines={4} note>                                        
                    {(segment === 'income') ? data.from : data.to}
                  </Text>
                </Body>
                <Right>                  
                  <Text note>                   
                  {this.formatDate(data.created_at)}
                  </Text>
                </Right>
              </ListItem>
            }
          />)  
      }      
    }else{
      return(<Spinner color='red' /> )
    }
  }

  render() {
    return (
      <Container>
        <Header hasSegment>          
          <Body>
            <Title>History</Title>
          </Body>                    
        </Header>
        <Segment>
          <Button active={this.state.segment === 'income' ? true : false} 
          first 
          onPress={() => this.setState({ segment: 'income' })}>
            <Text>Incoming</Text>
          </Button>
          <Button active={this.state.segment === 'outgo' ? true : false}
          last
          onPress={() => this.setState({ segment: 'outgo' })}>
            <Text>Outgoing</Text>
          </Button>          
        </Segment>
        <View style={styles.container}>        
          <View  style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/stellar.png')}
              style={styles.welcomeImage}
            />
          </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>          
          <Content>          
            {this.rendertransactionHistory(this.state.segment)}
          </Content>
        </ScrollView>    
      </View>            
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
  linkText: {    
    color: '#2e78b7',
  },
});

export default connect(mapStateToProps)(HistoryScreen);
