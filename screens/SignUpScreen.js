import React from 'react';
import { connect } from 'react-redux';
import { Container, 
  Header, 
  Title, 
  Content, 
  Button, 
  Left, 
  Body, 
  Text, 
  Form, 
  Item, 
  Label, 
  Input, 
  Right,
  Toast, 
  Spinner} from 'native-base';
import { View, Alert } from 'react-native';
import { storeSession } from '../components/action';
import LocalEndpoint  from '../api/local/Endpoint';
import {  Font } from 'expo';

class SignUpScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showToast: false,
	  	usernameTextBox : '',
	  	passwordTextBox : ''
	  }
  }

  save = async(data) => {
    console.log('data :',data)          
    if(this.state.usernameTextBox === '' || this.state.passwordTextbox ===''){
      Toast.show({
          text:'Please fill the empty fields',
          type:'danger',
          buttonText:'Ok'          
        })
    }else{
      fetch(LocalEndpoint.createAccountURL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'            
          },
          body: JSON.stringify(data)
        })
        .then((response) => response.json())
          .then(responseJson => {
            console.log('response json : ', responseJson)
            Toast.show({
              text:'Saved',
              type:'success',
              buttonText:'Ok'              
            })
            var session = responseJson;
            storeSession(session)           
            this.props.dispatch({type:'SET_SESSION', session});
            this.props.navigation.navigate('Main');                     
          })
          .catch(error => {
            Toast.show({
              text:'an error occured!',
              type:'danger',
              buttonText:'Ok',              
            })
            console.log('error',error)
          }
          );    
    }    
    
  }

  async componentWillMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
  }
  
  handleSignupPressed = () => {          
      let data = {
        'account_name':this.state.usernameTextBox,
        'password': this.state.passwordTextBox
      }
      this.save(data)      
  }

  handleUsernameChange = (usernameTextBox) => {
  	this.setState({
  		...this.state,
  		usernameTextBox: usernameTextBox
  	})
  }

  handlePasswordChange = (passwordTextBox) => {
  	this.setState({
  		...this.state,
  		passwordTextBox: passwordTextBox
  	})
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
    } else {
      return(
        <Container>
          <Header>
            <Left />
            <Body>
              <Title>Sign Up</Title>
            </Body>
            <Right />
          </Header>
          <Content padder contentContainerStyle={{justifyContent:'center', margin: 20}}>
            <Form>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input value={this.state.usernameTextBox} onChangeText={this.handleUsernameChange}/>
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input value={this.state.passwordTextbox} onChangeText={this.handlePasswordChange} secureTextEntry/>
              </Item>
            </Form>
            <View style = {{height:10}} />
            <Button block onPress={this.handleSignupPressed} >              
              <Text> Sign up </Text>
            </Button>                        
          </Content>
        </Container>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    session: state.session,
  };
}

export default connect(mapStateToProps)(SignUpScreen);
