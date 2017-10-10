import React, {Component} from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, StatusBar } from 'react-native';
import { onSignIn } from '../../auth';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      password: null,
      confirmPassword: null,
      username: null
    }
  }

  _onPressButton = () => {
  if(!this.state.password || !this.state.username){
    return null;
  }
  this.setState({
    isLoading: true,
  });
  return fetch('http://another-calendar.herokuapp.com/api/v1/auth/sign_in', {
    method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => {
      const responseHeaders = response.headers.map;
      const responseBody = JSON.parse(response._bodyText).data;
      if(responseBody.status === 'error'){
        return this.setState({
          isLoading: false,
        }, function () {
          alert(JSON.stringify(responseBody.errors));
        });
      }
      console.log('responseBody.email', responseBody.email);
      console.log('responseHeaders.client[0]', responseHeaders.client[0]);
      console.log('responseHeaders[access-token][0]', responseHeaders['access-token'][0]);
      return fetch('http://another-calendar.herokuapp.com/api/v1/auth/validate_token', {
        method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            email: responseBody.email,
            client: responseHeaders.client[0],
            access_token: responseHeaders['access-token'][0]
          },
          // body: JSON.stringify({
          //   email: responseBody.email,
          //   client: responseHeaders.client[0],
          //   access_token: responseHeaders['access-token'][0]
          // })
        })
    })
    // .then((response) => response.json())
    .then((response) => {
      console.log('znfpojzpfhj', response);
      if(responseJson.status === 'error'){
        return this.setState({
          isLoading: false,
        }, function () {
          alert(JSON.stringify(responseJson.errors));
        });
      }
      console.log('zijizj', responseJson.data);
      this.setState({
        isLoading: false,
      }, function () {
        const { navigate } = this.props.navigate;
        onSignIn(responseJson.data).then(() => navigate("SignedIn"));
      });
    })
    .catch((error) => {
      alert(JSON.stringify(error));
      console.error(error);
    });
};

  render() {
    const { navigate } = this.props.navigate;
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <TextInput
        placeholder="username or email"
        placeholderTextColor="rgba(255,255,255,0.7)"
        returnKeyType="next"
        onSubmitEditing={() => this.passwordInput.focus()}
        value={this.state.username}
        onChangeText={(username) => this.setState({username})}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        />
        <TextInput
        placeholder="password"
        placeholderTextColor="rgba(255,255,255,0.7)"
        returnKeyType="go"
        value={this.state.password}
        onChangeText={(password) => this.setState({password})}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        ref={(input) => this.passwordInput = input}
        />
        <TouchableOpacity style={styles.buttonContainer}
          onPress={this._onPressButton}>
          <Text style={styles.buttonText}> LOGIN </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
    color: '#FFF',
    paddingHorizontal: 10
  },
  buttonContainer: {
    backgroundColor: '#2980b9',
    paddingVertical: 15
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700'
  }
});
