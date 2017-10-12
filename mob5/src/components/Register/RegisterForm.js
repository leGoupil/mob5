import React, {Component} from 'react';
import { ActivityIndicator, StyleSheet, View, TextInput, Text, TouchableOpacity, StatusBar } from 'react-native';
import { onSignIn } from '../../auth';

export default class RegisterForm extends Component {
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
  if(!this.state.password || !this.state.confirmPassword || !this.state.username){
    return null;
  }
  if(this.state.password !== this.state.confirmPassword){
    return null;
  }
  this.setState({
    isLoading: true,
  });

  let accessToken = null
  , client = null
  , expiry = null
  , uid = null
  , errors = null;

  return fetch('http://another-calendar.herokuapp.com/api/v1/auth', {
    method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.username,
        password: this.state.password,
        password_confirmation: this.state.confirmPassword
      })
    })
    .then((response) => {
      const responseHeaders = response.headers.map;
      const responseBody = JSON.parse(response._bodyText);
      console.log('responseBody', responseBody);
      if(responseBody.errors){
        return this.setState({
          isLoading: false,
        }, function () {
          errors = responseBody.errors;
        });
      }
      client = responseHeaders.client[0];
      expiry = responseHeaders.expiry[0];
      uid = responseBody.data.uid;
      access_token = responseHeaders['access-token'][0];
      console.log('uid', uid);
      console.log('client', client);
      console.log('access_token', access_token);
      return fetch('http://another-calendar.herokuapp.com/api/v1/auth/validate_token', {
        method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            uid,
            client,
            access_token
          },
        })
    })
    .then((resp) => {
      console.log('resp', resp);
      if(!resp){
        return this.setState({
          isLoading: false,
        }, function () {
          alert(JSON.stringify(errors));
        });
      }
      const responseHeaders = resp.headers.map;
      const responseBody = JSON.parse(resp._bodyText);
      if(responseBody.errors || errors){
        return this.setState({
          isLoading: false,
        }, function () {
          alert(JSON.stringify(responseBody.errors || errors));
        });
      }
      this.setState({
        isLoading: false,
      }, function () {
        const { navigate } = this.props.navigate;
        onSignIn({uid, client, access_token, expiry}).then(() => navigate("SignedIn"));
      });
    })
    .catch((error) => {
      alert(JSON.stringify(error));
      console.error(error);
    });
};

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="username or email"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          value={this.state.username}
          disabled={this.state.isLoading}
          onChangeText={(username) => this.setState({username})}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          />
        <TextInput
          placeholder="password"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="next"
          disabled={this.state.isLoading}
          onSubmitEditing={() => this.confirmPasswordInput.focus()}
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          ref={(input) => this.passwordInput = input}
          />
        <TextInput
          disabled={this.state.isLoading}
          placeholder="confirm password"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="done"
          value={this.state.confirmPassword}
          onChangeText={(confirmPassword) => this.setState({confirmPassword})}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          ref={(input) => this.confirmPasswordInput = input}
          />
        <TouchableOpacity style={styles.buttonContainer}
          disabled={this.state.isLoading}
          onPress={this._onPressButton}>
          <Text style={styles.buttonText}> REGISTER </Text>
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


// <StatusBar
//   barStyle="light-content"
//   />
