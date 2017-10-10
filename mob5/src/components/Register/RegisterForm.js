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
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status === 'error'){
        return this.setState({
          isLoading: false,
        }, function () {
          alert(JSON.stringify(responseJson.errors));
        });
      }

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
    return (
      <View style={styles.container}>
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
          returnKeyType="next"
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
