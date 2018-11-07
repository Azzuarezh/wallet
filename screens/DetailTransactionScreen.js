import React, { Component } from 'react';
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
  Card,
  CardItem, 
  Item
} from 'native-base';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  View,
} from 'react-native';
import { connect } from 'react-redux';
class DetailTransactionScreen extends Component {
  static navigationOptions = {
    header: null,
  };

    constructor(props) {        
    super(props);    
    this.state = {      
      isLoaded :false,
      txDetail :[],
      memo :''      
    };    
  }

  async openLink(url){
    console.log('url:', url)
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('response : ', responseJson)
        return responseJson        
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  async componentDidMount() {    
     const { params} = this.props.navigation.state;
     console.log('params : ', params)
     let stellarMemo = await this.openLink(params);
     let stellarTxDetail =  await this.openLink(params + '/operations')
     console.log('memo : ', stellarMemo.Memo)
     this.setState({
        memo:stellarMemo.memo,
        txDetail:stellarTxDetail._embedded.records,
        isLoaded:true
      })
    
  }

  renderDetailTx(){    
    if(this.state.isLoaded){
      return(<List
            dataArray={this.state.txDetail}
            renderRow={data =>
              <ListItem>                
                <Body>                  
                  <Card>
                    <CardItem header>
                      <Text>Transaction ID : {data.id}</Text>
                    </CardItem>
                    <CardItem>
                      <Body>
                        <Item>                
                          <Text>
                            Date : {data.created_at}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            From : {data.from}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            To : {data.to}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            Amount : {data.amount}
                          </Text>
                        </Item>
                        <Item>
                          <Text>
                            Type : {(data.asset_type =='native')?'Lumens' : data.asset_type}
                          </Text>
                        </Item>                        
                        <Item>
                          <Text>
                            Memo : {this.state.memo}
                          </Text>
                        </Item>                        
                      </Body>
                    </CardItem>
                    <CardItem footer>
                      <Text>Stellar</Text>
                    </CardItem>
                 </Card>
                </Body>                
              </ListItem>}
          />)
    }else{
      return(<Spinner color='red' /> )
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
            <Title>Detail</Title>
          </Body>
          <Right />          
        </Header>
        <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View  style={{height:10}}/>
            <Content>              
              {this.renderDetailTx()}
            </Content>
        </ScrollView>
      </View>            
      </Container>
    );
  }
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

function mapStateToProps(state) {
  return {
    session: state.session    
  };
}

export default connect(mapStateToProps)(DetailTransactionScreen);